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
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; web-share"
        allowFullScreen
        loading="eager"
        referrerPolicy="no-referrer"
        sandbox="allow-forms allow-same-origin allow-scripts"
        onLoad={onLoad}
        onError={onError}
      />

      {overlayVisible && (
        <div
          aria-hidden="true"
          onClick={onDismissOverlay}
          className="absolute inset-0 z-30 cursor-pointer bg-transparent"
        />
      )}
    </div>
  );
}
