import React, { useState, ChangeEvent, ForwardedRef, useEffect } from "react";
import Loader from "./Loader";
import { CloudUpload } from "lucide-react";

interface ImageUploadProps {
  label?: string;
  name?: string;
  className?: string;
  error?: string;
  onChange?: (file: File | null) => void; // Callback when file changes
  initialImageUrl?: string; // URL of the image for editing
  setInitialImageUrl?: React.Dispatch<React.SetStateAction<string>>;
  isDisabled?: boolean;
  delay?: number;
  title?:string
}

const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  (
    {
      label,
      name,
      className = "",
      error,
      onChange,
      initialImageUrl,
      setInitialImageUrl,
      isDisabled = false,
      delay = 500,
      title
    }: ImageUploadProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [preview, setPreview] = useState<string | null>(
      initialImageUrl || null
    ); // Show the initial image if provided
    const [loading, setLoading] = useState(false);
    // Handle file change (for new uploads)
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;

      // Preview image if valid
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = async () => {
          setLoading(true);
          setTimeout(() => {
            setPreview(reader.result as string);
            if (setInitialImageUrl) {
              setInitialImageUrl(reader.result as string);
            }
            setLoading(false);
          }, delay);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null); // Clear preview if not a valid image
      }

      // Call the callback with the new file
      if (onChange) onChange(file);
    };
    // Optionally reset the preview if initial image URL changes
    useEffect(() => {
      const hanleUpload = async () => {
        if (initialImageUrl) {
          setLoading(true);
          setTimeout(() => {
            setPreview(initialImageUrl);
            setLoading(false);
          }, delay);
        } else {
          setPreview(null);
        }
      };
      hanleUpload();
    }, [initialImageUrl]);
    return (
      <div className={`relative`}>
        {label && (
          <label
            htmlFor={name}
            className="mb-3 block text-black dark:text-white"
          >
            {label}
          </label>
        )}
        <div
          className={`${
            isDisabled ? "opacity-70  " : ""
          } flex flex-col items-center justify-center min-h-56 relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5 ${className}`}
        >
          {loading ? (
            <Loader type="inside" />
          ) : (
            <>
              {" "}
              <input
                accept="image/*"
                disabled={isDisabled}
                ref={ref}
                type="file"
                id={name}
                name={name}
                className={`absolute inset-0 z-50 m-0 h-full w-full p-0 opacity-0 outline-none ${
                  isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                {preview ? (
                  <img
                    src={preview}
                    alt={title || "Image"}
                    className="max-h-48 w-auto rounded-md border"
                  />
                ) : (
                  <>
                    <div className="h-10 w-10 ">
                      <CloudUpload className="w-full h-full text-zinc-500" />
                    </div>

                    <p>Kéo và thả hoặc click để thay thế</p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

ImageUpload.displayName = "ImageUpload";

export default ImageUpload;
