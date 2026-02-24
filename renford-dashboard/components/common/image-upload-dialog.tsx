import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ErrorMessage from "@/components/ui/error-message";
import { useUploadImage } from "@/hooks/uploads";
import { getCroppedImgFromFile } from "@/lib/canvas-utils";
import { ImageSchema, imageSchema } from "@/validations/uploads";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  setImageValue: (value: string) => void;
  path: string;
  name?: string;
  aspect?: number;
};

const ImageUploadDialog = ({
  open,
  setOpen,
  setImageValue,
  path,
  name,
  aspect = 20 / 9,
}: Props) => {
  const { mutate, isPending, isSuccess, data } = useUploadImage();
  const [uncroppedImage, setUncroppedImage] = useState<File | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ImageSchema>({
    resolver: zodResolver(imageSchema),
    defaultValues: { file: undefined, path, name },
  });

  const onSubmit: SubmitHandler<ImageSchema> = (data) => mutate(data);

  useEffect(() => {
    if (isSuccess && data) {
      reset();
      setUncroppedImage(null);
      setImageValue(data.path);
      setOpen(false);
    }
  }, [isSuccess, data, reset]);

  const imageUrl = useMemo(
    () => (uncroppedImage ? URL.createObjectURL(uncroppedImage) : undefined),
    [uncroppedImage]
  );

  const onCropComplete = useCallback(
    async (_: Area, croppedAreaPixels: Area) => {
      if (!uncroppedImage) return;
      try {
        const blob = await getCroppedImgFromFile(
          uncroppedImage,
          croppedAreaPixels
        );
        const croppedFile = new File([blob], "cropped.jpeg", {
          type: "image/jpeg",
        });

        setValue("file", croppedFile, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        });
      } catch (err) {
        console.error(err);
      }
    },
    [uncroppedImage, setValue]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Télécharger une image</DialogTitle>
            <DialogDescription>
              Sélectionnez une image à télécharger et recadrez-la si nécessaire.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {!uncroppedImage ? (
              <div>
                <label htmlFor="image">
                  <div className="bg-gray-50 border border-input px-6 py-10 rounded-2xl cursor-pointer flex flex-col items-center justify-center text-gray-800">
                    <Upload size={22} />
                    <p className="text-sm">Cliquez pour télécharger</p>
                  </div>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const image = e.target.files?.[0];
                      if (!image) return;
                      setUncroppedImage(image);
                    }}
                  />
                </label>
                <ErrorMessage>{errors.file?.message}</ErrorMessage>
              </div>
            ) : (
              <div className="relative rounded-2xl cursor-pointer flex flex-col items-center justify-center h-[400px] w-full border">
                <Cropper
                  classes={{
                    containerClassName: "rounded-2xl border",
                  }}
                  image={imageUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    reset();
                    setUncroppedImage(null);
                  }}
                >
                  <X size={22} />
                </Button>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button disabled={isPending || !isDirty}>
              {isPending && <Loader2 className="animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
