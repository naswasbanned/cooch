/* eslint-disable @next/next/no-img-element -- The art set is SVG: vector, tiny, and
   intentionally not run through the raster image optimizer. */
import type { ImgHTMLAttributes } from "react";

export function ArtImage({ alt = "", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return <img alt={alt} {...props} />;
}
