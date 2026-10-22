"use client";

import React, { SyntheticEvent } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { MinusCircle, PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

interface ImageViewerProps {
  className?: string;
  classNameImageViewer?: string;
  classNameThumbnailViewer?: string;
  imageTitle?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  placeholderUrl?: string;
  showControls?: boolean;
}

const ImageViewer_Basic = ({
  className,
  classNameImageViewer,
  classNameThumbnailViewer,
  imageTitle,
  imageUrl,
  placeholderUrl = "https://placehold.co/600x600/f8fafc/64748b?text=Sem+Foto",
  showControls = true,
  thumbnailUrl,
}: ImageViewerProps) => {
  const handleImgError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = placeholderUrl;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={cn("cursor-pointer", className)}>
          <img
            src={thumbnailUrl || imageUrl || undefined}
            alt=""
            className={cn(
              "h-auto w-full rounded-lg object-contain transition-opacity hover:opacity-90",
              classNameThumbnailViewer
            )}
            onError={handleImgError}
          />
        </div>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/80 animate-in fade-in" />
        <DialogContent className="fixed inset-0 z-50 flex flex-col items-center justify-center p-0 outline-none">
          <DialogTitle className="sr-only">{imageTitle || "Image"}</DialogTitle>
          <div className="relative flex h-screen w-screen items-center justify-center">
            <TransformWrapper
              initialScale={1}
              initialPositionX={0}
              initialPositionY={0}
            >
              {({ zoomIn, zoomOut }) => (
                <>
                  <TransformComponent wrapperClass="!w-screen !h-screen flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt=""
                      className={cn(
                        "max-h-[90vh] max-w-[90vw] object-contain",
                        classNameImageViewer
                      )}
                      onError={handleImgError}
                    />
                  </TransformComponent>
                  {showControls && (
                    <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => zoomOut()}
                        className="cursor-pointer rounded-full bg-border hover:bg-border h-12 w-12 text-white transition-colors backdrop-blur-md shadow-none"
                      >
                        <MinusCircle className="size-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => zoomIn()}
                        className="cursor-pointer rounded-full bg-border hover:bg-border h-12 w-12 text-white transition-colors backdrop-blur-md shadow-none"
                      >
                        <PlusCircle className="size-6" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TransformWrapper>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-6 right-6 z-10 cursor-pointer rounded-full bg-border hover:bg-border h-12 w-12 text-white transition-colors backdrop-blur-md shadow-none"
              >
                <X className="size-6" />
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default ImageViewer_Basic;
