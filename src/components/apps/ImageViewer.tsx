interface ImageViewerProps {
  src: string;
  alt?: string;
}

export const ImageViewer = ({ src, alt = 'Image' }: ImageViewerProps) => {
  return (
    <div className="h-full bg-gray-50 flex items-center justify-center p-4">
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
      />
    </div>
  );
};
