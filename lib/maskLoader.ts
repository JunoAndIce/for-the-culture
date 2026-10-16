import {
  DataTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  Loader,
  NoColorSpace,
  RedFormat,
  TextureLoader,
  UnsignedByteType,
  type Texture,
} from "three";
import { decodeGreyPng, UnsupportedPngError } from "@/lib/greyPng";

/**
 * Loads a greyscale mask as one byte per pixel: a quarter of the GPU memory of
 * the RGBA a browser decodes an image to, and no blocking decode on upload.
 * Falls back to the plain image path where it can't, which samples the same.
 */
export class MaskLoader extends Loader<Texture> {
  load(
    url: string,
    onLoad: (texture: Texture) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (error: unknown) => void,
  ) {
    if (typeof DecompressionStream === "undefined") {
      this.loadImage(url, onLoad, onProgress, onError);
      return;
    }

    const resolved = this.manager.resolveURL(this.path + url);
    this.manager.itemStart(resolved);
    fetch(resolved)
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.arrayBuffer();
      })
      // Bottom row first: an image texture's flipY, done here for free.
      .then((png) => decodeGreyPng(png, { flipY: true }))
      .then(({ width, height, data }) => {
        const texture = new DataTexture(data, width, height, RedFormat, UnsignedByteType);
        // An image texture's defaults; a DataTexture's are nearest and no mips.
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = LinearFilter;
        texture.generateMipmaps = true;
        texture.colorSpace = NoColorSpace;
        texture.needsUpdate = true;
        onLoad(texture);
        this.manager.itemEnd(resolved);
      })
      .catch((error) => {
        if (error instanceof UnsupportedPngError) {
          // Started before this item ends, so the manager never sees everything done early.
          this.loadImage(url, onLoad, onProgress, onError);
        } else {
          onError?.(error);
          this.manager.itemError(resolved);
        }
        this.manager.itemEnd(resolved);
      });
  }

  private loadImage(
    url: string,
    onLoad: (texture: Texture) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (error: unknown) => void,
  ) {
    new TextureLoader(this.manager).setPath(this.path).load(
      url,
      (texture) => {
        texture.colorSpace = NoColorSpace;
        onLoad(texture);
      },
      onProgress,
      onError,
    );
  }
}
