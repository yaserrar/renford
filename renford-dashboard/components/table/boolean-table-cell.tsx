import { Check, X } from "lucide-react";

export const BooleanCell = ({ value }: { value: boolean }) => {
  return value ? (
    <Check size={20} className="text-green-500 hover:text-green-600" />
  ) : (
    <X size={20} className="text-red-500 hover:text-red-600" />
  );
};

export const booleanMeta = {
  dataType: {
    type: "select" as const,
    options: [
      {
        label: "Oui",
        value: true,
      },
      {
        label: "Non",
        value: false,
      },
    ],
  },
};
