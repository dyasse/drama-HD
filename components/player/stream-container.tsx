'use client';

type StreamContainerProps = {
  iframeKey: string;
  src: string;
  title: string;
  onLoad: () => void;
  onError: () => void;
  overlayVisible: boolean;
  onDismissOverlay: () => void;
};

export function StreamContainer({ iframeKey, src, title, onLoad, onError, overlayVisible, onDismissOverlay }: StreamContainerProps) {
  return (
    <div className="relative h-full w-full">
      <iframe
        key={iframeKey}
        src={src}
        title={title}
        className="h-full w-full"
        allow="autoplay; fullscreen; encrypted-media"
        allowFullScreen
        referrerPolicy="no-referrer"
        onLoad={onLoad}
        onError={onError}
      />
      {overlayVisible && (
        <button
          type="button"
          aria-label="Activate player"
          onClick={onDismissOverlay}
          className="absolute inset-0 z-30 cursor-pointer bg-transparent"
        />
      )}
    </div>
  );
}
