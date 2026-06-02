import { useEffect, useState } from 'react'
import { Asset } from '../types'

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  const [title, setTitle] = useState('')
  const [alt, setAlt] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const [copiedAssetKey, setCopiedAssetKey] = useState<string | null>(null)

  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editAlt, setEditAlt] = useState('')

  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null)
  const [search, setSearch] = useState('')

  async function loadAssets() {
    const response = await fetch('/api/assets')
    const data = await response.json()

    setAssets(data.assets)
    setIsLoading(false)
  }

  useEffect(() => {
    loadAssets()
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('alt', alt)
      formData.append('file', file)

      await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      setTitle('')
      setAlt('')
      setFile(null)

      await loadAssets()
    } finally {
      setIsUploading(false)
    }
  }

  async function handleCopyUrl(asset: Asset) {
    await navigator.clipboard.writeText(asset.url)

    setCopiedAssetKey(asset.imageKey)

    setTimeout(() => {
      setCopiedAssetKey(null)
    }, 2000)
  }

  async function handleDeleteAsset(asset: Asset) {
    await fetch('/api/assets', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageKey: asset.imageKey,
      }),
    })

    await loadAssets()
  }

  function startEditing(asset: Asset) {
    setEditingAsset(asset)
    setEditTitle(asset.title)
    setEditAlt(asset.alt)
  }

  function cancelEditing() {
    setEditingAsset(null)
    setEditTitle('')
    setEditAlt('')
  }

  async function handleUpdateAsset() {
    if (!editingAsset?.metadataKey) return

    await fetch('/api/assets', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metadataKey: editingAsset.metadataKey,
        title: editTitle,
        alt: editAlt,
      }),
    })

    cancelEditing()
    await loadAssets()
  }

  function formatDate(value: string) {
    return new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  }

  const filteredAssets = assets
    .filter((asset) => {
      const query = search.toLowerCase()

      return (
        asset.title.toLowerCase().includes(query) ||
        asset.alt.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    })

  return {
    assets,
    filteredAssets,
    isLoading,
    isUploading,

    title,
    alt,
    setTitle,
    setAlt,
    setFile,

    copiedAssetKey,
    handleCopyUrl,

    editingAsset,
    editTitle,
    editAlt,
    setEditTitle,
    setEditAlt,
    startEditing,
    cancelEditing,
    handleUpdateAsset,

    assetToDelete,
    setAssetToDelete,
    handleDeleteAsset,

    search,
    setSearch,

    handleSubmit,
    formatDate,
  }
}
