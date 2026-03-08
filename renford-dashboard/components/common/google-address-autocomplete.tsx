"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GOOGLE_MAPS_API_KEY } from "@/lib/env";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type AddressSelection = {
  address: string;
  ville: string;
  codePostal: string;
  pays: string;
  latitude: number | null;
  longitude: number | null;
};

type GoogleAddressAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onSelectAddress: (address: AddressSelection) => void;
  placeholder?: string;
  className?: string;
};

type Prediction = {
  description: string;
  place_id: string;
};

declare global {
  interface Window {
    google?: any;
    __renfordGoogleMapsLoadingPromise?: Promise<void>;
  }
}

const loadGoogleMapsPlaces = async () => {
  if (typeof window === "undefined") return;

  if (window.google?.maps?.places) {
    return;
  }

  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing");
  }

  if (!window.__renfordGoogleMapsLoadingPromise) {
    window.__renfordGoogleMapsLoadingPromise = new Promise<void>(
      (resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&language=fr`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Google Maps"));
        document.head.appendChild(script);
      }
    );
  }

  await window.__renfordGoogleMapsLoadingPromise;
};

const pickAddressComponent = (components: any[], types: string[]) => {
  const found = components.find((component) =>
    types.some((type) => component.types?.includes(type))
  );
  return found?.long_name ?? "";
};

export default function GoogleAddressAutocomplete({
  value,
  onChange,
  onSelectAddress,
  placeholder = "Rechercher une adresse",
  className,
}: GoogleAddressAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const placesContainerRef = useRef<HTMLDivElement | null>(null);
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadGoogleMapsPlaces()
      .then(() => {
        if (!mounted || !window.google?.maps?.places) return;
        autocompleteServiceRef.current =
          new window.google.maps.places.AutocompleteService();
        if (placesContainerRef.current) {
          placesServiceRef.current =
            new window.google.maps.places.PlacesService(
              placesContainerRef.current
            );
        }
        setIsApiReady(true);
      })
      .catch(() => {
        setIsApiReady(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  useEffect(() => {
    if (!isApiReady || !autocompleteServiceRef.current) return;
    const trimmed = value.trim();

    if (trimmed.length < 3) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);

    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: trimmed,
        componentRestrictions: {
          // country: "fr"
        },
        types: ["address"],
      },
      (results: any[] | null, status: string) => {
        setIsLoading(false);

        const isOk =
          status === window.google?.maps?.places?.PlacesServiceStatus?.OK;

        if (!isOk || !results?.length) {
          setPredictions([]);
          return;
        }

        setPredictions(
          results.slice(0, 5).map((prediction) => ({
            description: prediction.description,
            place_id: prediction.place_id,
          }))
        );
      }
    );
  }, [isApiReady, value]);

  const hasSuggestions = useMemo(
    () => open && predictions.length > 0,
    [open, predictions.length]
  );

  const handlePickPrediction = useCallback(
    (prediction: Prediction) => {
      if (!placesServiceRef.current) return;

      setIsLoading(true);

      placesServiceRef.current.getDetails(
        {
          placeId: prediction.place_id,
          fields: ["formatted_address", "geometry", "address_components"],
        },
        (place: any, status: string) => {
          setIsLoading(false);

          const isOk =
            status === window.google?.maps?.places?.PlacesServiceStatus?.OK;

          if (!isOk || !place) {
            return;
          }

          const addressComponents = place.address_components ?? [];
          const codePostal = pickAddressComponent(addressComponents, [
            "postal_code",
          ]);
          const ville = pickAddressComponent(addressComponents, [
            "locality",
            "postal_town",
            "administrative_area_level_2",
          ]);
          const pays =
            pickAddressComponent(addressComponents, ["country"]) || "France";

          const latitude = place.geometry?.location?.lat?.() ?? null;
          const longitude = place.geometry?.location?.lng?.() ?? null;
          const address = place.formatted_address || prediction.description;

          onChange(address);
          onSelectAddress({
            address,
            codePostal,
            ville,
            pays,
            latitude,
            longitude,
          });

          setOpen(false);
          setPredictions([]);
        }
      );
    },
    [onChange, onSelectAddress]
  );

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Input
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        placeholder={placeholder}
      />

      {isLoading && (
        <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      )}

      {hasSuggestions && (
        <div className="absolute z-20 mt-1 w-full rounded-md border bg-popover shadow-md">
          <ul className="max-h-64 overflow-y-auto py-1">
            {predictions.map((prediction) => (
              <li key={prediction.place_id}>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                  onClick={() => handlePickPrediction(prediction)}
                >
                  {prediction.description}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div ref={placesContainerRef} className="hidden" />
    </div>
  );
}
