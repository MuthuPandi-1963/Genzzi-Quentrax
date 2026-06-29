// web/components/ui/dropzone.tsx
import React, { useCallback } from 'react';
import { useDropzone as useReactDropzone, DropzoneOptions } from 'react-dropzone';
import { Upload } from 'lucide-react';

export interface DropzoneProps extends DropzoneOptions {
  children?: React.ReactNode;
  className?: string;
}

export function Dropzone({ children, className, ...props }: DropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (props.onDrop) {
      props.onDrop(acceptedFiles);
    }
  }, [props.onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useReactDropzone({
    ...props,
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        ${className || ''}
      `}
    >
      <input {...getInputProps()} />
      {children || (
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-10 h-10 text-gray-400" />
          <p className="text-gray-600">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
          </p>
        </div>
      )}
    </div>
  );
}

// Also export the hook if needed
export const useDropzone = useReactDropzone;