import { useEffect, useState } from 'react'
import { Asset } from '../types'
import {
  fetchAssets,
  uploadAsset,
  updateAsset,
  deleteAsset,
} from '../services/assetService'
import { validateFolderName } from '../utils/folderValidation'

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  const [title, setTitle] = useState('')
  const [alt, setAlt] = useState('')
  const [folder, setFolder] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const [copiedAssetKey, setCopiedAssetKey] = useState<string | null>(null)

  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editAlt, setEditAlt] = useState('')

  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null)
  const [search, setSearch] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('')

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [uploadFormKey, setUploadFormKey] = useState(0)

  async function loadAssets() {
    const assets = await fetchAssets()

    setAssets(assets)
    setIsLoading(false)
  }

  const existingFolders = Array.from(
    new Set(
      assets
        .map((asset) => asset.folder)
        .filter((folder): folder is string => Boolean(folder))
    )
  ).sort((a, b) => a.localeCompare(b))

  useEffect(() => {
    loadAssets()
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title || !alt || !file || !folder) {
      setErrorMessage('Bitte Titel, Alt-Text, Bild und Ordner ausfüllen.')
      return
    }

        const normalizedFolder = folder.trim()


    const folderValidationError = validateFolderName(normalizedFolder)


    if (folderValidationError) {
      setErrorMessage(folderValidationError)
      return
    }

    setIsUploading(true)
    setErrorMessage(null)

    try {
      await uploadAsset(title, alt, folder, file)

      setTitle('')
      setAlt('')
      setFile(null)
      setFolder('')
      setUploadFormKey((currentKey) => currentKey + 1)

      await loadAssets()
    } catch {
      setErrorMessage('Bild konnte nicht hochgeladen werden.')
    } finally {
      setIsUploading(false)
    }
  }

  function handleFolderChange(value: string) {
    setFolder(value)

    if (errorMessage) {
      setErrorMessage(null)
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
    setErrorMessage(null)

    try {
      await deleteAsset(asset.imageKey)
      await loadAssets()
    } catch {
      setErrorMessage('Asset konnte nicht gelöscht werden.')
    }
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

    setErrorMessage(null)

    try {
      await updateAsset(editingAsset.metadataKey, editTitle, editAlt)

      cancelEditing()
      await loadAssets()
    } catch {
      setErrorMessage('Asset konnte nicht gespeichert werden.')
    }
  }

  function formatDate(value: string) {
    return new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  }

  const filteredAssets = assets
    .filter((asset) => {
      if (!selectedFolder) {
        return true
      }

      return asset.folder === selectedFolder
    })
    .filter((asset) => {
      const query = search.toLowerCase()

      return (
        asset.title.toLowerCase().includes(query) ||
        asset.alt.toLowerCase().includes(query) ||
        asset.folder?.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    })

  return {
    assets,
    filteredAssets,
    existingFolders,
    isLoading,
    isUploading,

    title,
    alt,
    file,
    folder,
    setTitle,
    setAlt,
    setFile,
    setFolder,
    handleFolderChange,

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
    selectedFolder,
    setSelectedFolder,

    handleSubmit,
    formatDate,

    errorMessage,
    setErrorMessage,

    uploadFormKey,
  }
}
