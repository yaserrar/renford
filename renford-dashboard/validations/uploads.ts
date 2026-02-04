import {
  ACCEPTED_FILE_TYPES,
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from "@/lib/consts";
import { z } from "zod";

export const imageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((image) => !!image, {
      message: "Image is required",
    })
    .refine((image) => image && image.size <= MAX_FILE_SIZE, {
      message: "Image must be less than 20MB",
    })
    .refine((image) => image && ACCEPTED_IMAGE_TYPES.includes(image.type), {
      message: "Only JPG, JPEG, PNG, WEBP, AVIF files are allowed",
    }),
  path: z.string().min(1, { message: "Path required" }),
  name: z.string().optional(),
});

export type ImageSchema = z.infer<typeof imageSchema>;

export const fileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => !!file, {
      message: "File is required",
    })
    .refine((file) => file && file.size <= MAX_FILE_SIZE, {
      message: "File must be less than 10MB",
    })
    .refine(
      (file) =>
        file &&
        [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_FILE_TYPES].includes(file.type),
      {
        message: "File type are allowed",
      }
    ),
  path: z.string().min(1, { message: "Path required" }),
  name: z.string().optional(),
});

export type FileSchema = z.infer<typeof fileSchema>;
