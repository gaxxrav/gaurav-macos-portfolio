interface ImageViewerProps {
  src: string;
  alt?: string;
}

export const ImageViewer = ({ src, alt = 'Image' }: ImageViewerProps) => {
  return (
    <div className="flex h-full items-center justify-center p-4 bg-[var(--color-panel-bg)]">
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
      />
    </div>
  );
};
