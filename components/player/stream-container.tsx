'use client';

type StreamContainerProps = {
  iframeKey: string;
  src: string;
  title: string;
  onLoad: () => void;
  overlayVisible: boolean;
  onDismissOverlay: () => void;
};

export function StreamContainer({ iframeKey, src, title, onLoad, overlayVisible, onDismissOverlay }: StreamContainerProps) {
  return (
    <div className="relative h-full w-full">
      <iframe
        key={iframeKey}
        src={src}
        title={title}
        className="h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; web-share"
        allowFullScreen
        referrerPolicy="no-referrer"
        // @ts-expect-error React's iframe typings miss crossOrigin, but providers require it.
        crossOrigin="anonymous"
        sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
        onLoad={onLoad}
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
