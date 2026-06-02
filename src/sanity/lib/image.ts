import { createImageUrlBuilder } from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || '',
})

export const urlForImage = (source: Image) => {
    return imageBuilder?.image(source).auto('format').fit('max')
}

export function heroImageUrl(image: any): string {
  if (!image) return '';
  try {
    return urlForImage(image)
      ?.width(1920)
      .height(1080)
      .quality(82)
      .auto('format')
      .fit('crop')
      .url() ?? '';
  } catch {
    return image?.asset?.url ?? '';
  }
}

export function galleryImageUrl(image: any): string {
  if (!image) return '';
  try {
    return urlForImage(image)
      ?.width(1200)
      .quality(78)
      .auto('format')
      .fit('max')
      .url() ?? '';
  } catch {
    return image?.asset?.url ?? '';
  }
}

export function cardImageUrl(image: any): string {
  if (!image) return '';
  try {
    return urlForImage(image)
      ?.width(800)
      .quality(72)
      .auto('format')
      .fit('crop')
      .url() ?? '';
  } catch {
    return image?.asset?.url ?? '';
  }
}

export function portraitImageUrl(image: any): string {
  if (!image) return '';
  try {
    return urlForImage(image)
      ?.width(1000)
      .quality(80)
      .auto('format')
      .fit('max')
      .url() ?? '';
  } catch {
    return image?.asset?.url ?? '';
  }
}

export function thumbnailImageUrl(image: any): string {
  if (!image) return '';
  try {
    return urlForImage(image)
      ?.width(400)
      .height(400)
      .quality(70)
      .auto('format')
      .fit('crop')
      .url() ?? '';
  } catch {
    return image?.asset?.url ?? '';
  }
}

export function blurPlaceholderUrl(image: any): string {
  if (!image) return '';
  try {
    return urlForImage(image)
      ?.width(24)
      .height(24)
      .quality(20)
      .auto('format')
      .fit('max')
      .url() ?? '';
  } catch {
    return image?.asset?.url ?? '';
  }
}
