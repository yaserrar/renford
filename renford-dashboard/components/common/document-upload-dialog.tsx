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
import { useUploadFile } from "@/hooks/uploads";
import { FileSchema, fileSchema } from "@/validations/uploads";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setFileValue: (value: string) => void;
  path: string;
  name?: string;
  accept?: string;
  maxSizeMB?: number;
};

const DocumentUploadDialog = ({
  open,
  setOpen,
  setFileValue,
  path,
  name,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSizeMB = 10,
}: Props) => {
  const { mutate, isPending, isSuccess, data } = useUploadFile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<FileSchema>({
    resolver: zodResolver(fileSchema),
    defaultValues: { file: undefined, path, name },
  });

  const onSubmit: SubmitHandler<FileSchema> = (data) => mutate(data);

  useEffect(() => {
    if (isSuccess && data) {
      reset();
      setSelectedFile(null);
      setFileValue(data.path);
      setOpen(false);
    }
  }, [isSuccess, data, reset, setFileValue, setOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Le fichier ne doit pas dépasser ${maxSizeMB} Mo`);
      return;
    }

    setSelectedFile(file);
    setValue("file", file, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const handleRemoveFile = () => {
    reset();
    setSelectedFile(null);
  };

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Télécharger un document</DialogTitle>
            <DialogDescription>
              Sélectionnez un document à télécharger. Formats acceptés : PDF,
              Word, images.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {!selectedFile ? (
              <div>
                <label htmlFor="document">
                  <div className="bg-gray-50 border border-input border-dashed px-6 py-10 rounded-2xl cursor-pointer flex flex-col items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors">
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <p className="text-sm font-medium">
                      Cliquez pour télécharger
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ou glissez-déposez votre fichier ici
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Max {maxSizeMB} Mo
                    </p>
                  </div>
                  <input
                    type="file"
                    id="document"
                    accept={accept}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <ErrorMessage>{errors.file?.message}</ErrorMessage>
              </div>
            ) : (
              <div className="bg-gray-50 border border-input rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="text-primary" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                  >
                    <X size={18} />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
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

export default DocumentUploadDialog;
