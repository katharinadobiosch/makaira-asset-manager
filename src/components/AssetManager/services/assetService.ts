import { Asset } from '../types'

export async function fetchAssets() {
  const response = await fetch('/api/assets')

  if (!response.ok) {
    throw new Error('Failed to load assets')
  }

  const data = await response.json()

  return data.assets as Asset[]
}

export async function uploadAsset(title: string, alt: string, file: File) {
  const formData = new FormData()

  formData.append('title', title)
  formData.append('alt', alt)
  formData.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Upload failed')
  }
}

export async function updateAsset(
  metadataKey: string,
  title: string,
  alt: string
) {
  const response = await fetch('/api/assets', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      metadataKey,
      title,
      alt,
    }),
  })

  if (!response.ok) {
    throw new Error('Update failed')
  }
}

export async function deleteAsset(imageKey: string) {
  const response = await fetch('/api/assets', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageKey,
    }),
  })

  if (!response.ok) {
    throw new Error('Delete failed')
  }
}
