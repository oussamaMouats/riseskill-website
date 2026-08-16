"use client";

import { useRef, type ChangeEvent } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUploadImage } from "@/hooks/use-upload-image";

export function ImageUpload({
  value,
  onChange,
  label,
}: {
  value?: string | null;
  onChange: (url: string | undefined) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadImage = useUploadImage();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    uploadImage.mutate(file, {
      onSuccess: ({ url }) => onChange(url),
      onError: () => toast.error("Échec de l'envoi de l'image."),
    });
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}
      <div className="flex items-center gap-3">
        {value && <img src={value} alt="" className="h-16 w-16 rounded-md border object-cover" />}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploadImage.isPending}
          >
            {uploadImage.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadImage.isPending ? "Envoi..." : value ? "Remplacer" : "Choisir une image"}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(undefined)}>
              <X className="h-4 w-4" />
              Supprimer
            </Button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
