import { useDropzone } from 'react-dropzone';
import { useCallback, useEffect, useState } from 'react';

export default function DropzoneInput({ onDrop, onRemove, label, files }) {
  const [previews, setPreviews] = useState([]);

  const handleDrop = useCallback((acceptedFiles) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop });

  useEffect(() => {
    const newPreviews = files.map((file) => {
      
      if (typeof file === 'string') {
        // existing image URL
        return { name: file.split('/').pop(), url: file };
      } else {
        // new file
        return {
          name: file?.name || 'property image',
          url: file?.type.startsWith('image/') ? URL.createObjectURL(file) : (file?.url ?? null),
        };
      }
    });

    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((file) => {
        if (file.url && typeof file.url !== 'string') URL.revokeObjectURL(file.url);
      });
    };
  }, [files]);

  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-700">{label}</label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer ${
          isDragActive ? 'border-blue-500' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500 text-sm text-center">
          {isDragActive ? 'Drop the files here...' : 'Drag & drop files here, or click to select files'}
        </p>
      </div>

      {/* Thumbnails */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {previews.map((file, index) => (
          <div key={index} className="relative group border rounded-md overflow-hidden shadow-sm">
            {file.url ? (
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            ) : (
              <div className="p-2 text-xs text-gray-600">{file.name}</div>
            )}

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center bg-white text-red-600 hover:text-red-800 border border-gray-300 rounded-full w-6 h-6 text-sm"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
