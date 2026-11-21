'use client';

import Image from 'next/image';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type LightboxImage = {
  url: string;
  alt: string;
  caption: string;
  width?: number | null;
  height?: number | null;
};

const LightboxContext = createContext<(index: number) => void>(() => {});

// Lets any photo on a page open a large view of it, as on nest360.org: a dark overlay with the photo on white,
// its caption underneath and an X to close. With more than one photo, arrows (and the arrow keys) step through
// them. Built on <dialog>, so Escape closes it, focus stays inside while it's open and returns afterwards.
// The page passes every photo it shows in `images`; each <LightboxTrigger index={n}> opens photo n.
export function LightboxProvider({ images, children }: { images: LightboxImage[]; children: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);

  const open = useCallback((at: number) => {
    setIndex(at);
    dialog.current?.showModal();
  }, []);
  const close = () => dialog.current?.close();
  const step = useCallback(
    (by: number) => setIndex((current) => (current + by + images.length) % images.length),
    [images.length],
  );

  // Arrow keys move between photos while the dialog is open (Escape is handled by <dialog> itself)
  useEffect(() => {
    const element = dialog.current;
    if (!element || images.length < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    element.addEventListener('keydown', onKey);
    return () => element.removeEventListener('keydown', onKey);
  }, [images.length, step]);

  const image = images[index];

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        aria-label={image ? `Photo: ${image.caption}` : 'Photo'}
        // Clicking the dark area around the photo closes it, like the X
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-black/80 open:flex open:items-center open:justify-center motion-safe:open:animate-fade-in-up"
      >
        {image && (
          <figure className="relative mx-4 flex w-full max-w-3xl flex-col">
            <div className="bg-white p-4 shadow-2xl sm:p-8">
              {/* key: a new photo replays the fade, so stepping through them is visible */}
              <Image
                key={image.url}
                src={image.url}
                alt={image.alt}
                width={image.width ?? 800}
                height={image.height ?? 800}
                sizes="(max-width: 800px) 100vw, 768px"
                className="mx-auto h-auto max-h-[70vh] w-auto object-contain motion-safe:animate-fade-in-up"
              />
            </div>
            <figcaption className="mt-3 flex items-center justify-between gap-4 font-heading text-lg font-semibold text-white">
              <span>{image.caption}</span>
              {images.length > 1 && (
                <span className="text-sm font-normal text-white/70">
                  {index + 1} / {images.length}
                </span>
              )}
            </figcaption>

            {images.length > 1 && (
              <>
                <LightboxArrow direction="previous" onClick={() => step(-1)} />
                <LightboxArrow direction="next" onClick={() => step(1)} />
              </>
            )}
          </figure>
        )}
        <button
          type="button"
          onClick={close}
          aria-label="Close photo"
          className="absolute right-4 top-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white/80 transition duration-300 hover:bg-white/10 hover:text-white motion-safe:hover:rotate-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </button>
      </dialog>
    </LightboxContext.Provider>
  );
}

function LightboxArrow({ direction, onClick }: { direction: 'previous' | 'next'; onClick: () => void }) {
  const next = direction === 'next';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={next ? 'Next photo' : 'Previous photo'}
      className={`absolute top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-nest-blue shadow-lg transition duration-300 hover:bg-white hover:shadow-xl motion-safe:hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
        next ? 'right-2 sm:-right-16' : 'left-2 sm:-left-16'
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-5 w-5 ${next ? '' : 'rotate-180'}`}>
        <path d="M7 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// Wraps a photo so clicking it opens the large view. Shows a magnifier and zooms the photo a little on hover.
export function LightboxTrigger({
  index,
  label,
  className = '',
  children,
}: {
  index: number;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const open = useContext(LightboxContext);
  return (
    <button
      type="button"
      onClick={() => open(index)}
      aria-label={`View larger photo: ${label}`}
      className={`group/photo relative block cursor-zoom-in overflow-hidden bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nest-blue ${className}`}
    >
      <span className="block transition-transform duration-500 motion-safe:group-hover/photo:scale-105">{children}</span>
      <span
        aria-hidden="true"
        className="absolute right-2 bottom-2 flex h-9 w-9 items-center justify-center rounded-full bg-nest-blue/90 text-white opacity-0 shadow-md transition duration-300 group-hover/photo:opacity-100 group-focus-visible/photo:opacity-100"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4">
          <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M12.5 12.5 17 17M8.5 6v5M6 8.5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    </button>
  );
}
