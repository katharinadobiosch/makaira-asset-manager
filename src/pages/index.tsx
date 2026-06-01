import { useEffect, useState } from 'react'
import Image from 'next/image'

import { withMakaira } from '@/makaira/withMakaira'
import {
  Button,
  Column,
  PageWrapper,
  Table,
  Text,
  TextInput,
  Modal,
} from '@/components'

type Asset = {
  title: string
  alt: string
  imageKey: string
  metadataKey?: string
  url: string
  uploadedAt: string
  updatedAt?: string
}

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [alt, setAlt] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const [copiedAssetKey, setCopiedAssetKey] = useState<string | null>(null)

  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editAlt, setEditAlt] = useState('')

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

  async function handleUpdateAsset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

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

  return (
    <PageWrapper title="Asset Manager">
      <Text>
        Bilder für den Bettwaren-Shop hochladen, verwalten und als URL für HTML
        oder Richtext verwenden.
      </Text>

      <form onSubmit={handleSubmit}>
        <TextInput
          name="title"
          label="Titel"
          defaultValue={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <TextInput
          name="alt"
          label="Alt-Text"
          defaultValue={alt}
          onChange={(event) => setAlt(event.target.value)}
        />

        <div>
          <label htmlFor="file">Bild</label>
          <input
            id="file"
            name="file"
            type="file"
            accept="image/*"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null)
            }}
          />
        </div>

        <Button type="submit">Bild hochladen</Button>
      </form>

      <Modal
        visible={!!editingAsset}
        onClose={cancelEditing}
        mask={true}
        header={<Text>Asset bearbeiten</Text>}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={cancelEditing}>
              Abbrechen
            </Button>

            <Button type="submit" form="edit-asset-form">
              Speichern
            </Button>
          </div>
        }
      >
        <form id="edit-asset-form" onSubmit={handleUpdateAsset}>
          <TextInput
            name="editTitle"
            label="Titel"
            defaultValue={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
          />

          <TextInput
            name="editAlt"
            label="Alt-Text"
            defaultValue={editAlt}
            onChange={(event) => setEditAlt(event.target.value)}
          />
        </form>
      </Modal>

      {isLoading && <Text>Lade Assets...</Text>}

      {!isLoading && assets.length === 0 && (
        <Text>Noch keine Assets vorhanden.</Text>
      )}

      {!isLoading && assets.length > 0 && (
        <Table data={assets}>
          <Column
            title="Bild"
            render={(asset: Asset) => (
              <Image
                src={asset.url}
                alt={asset.alt}
                width={80}
                height={80}
                style={{
                  objectFit: 'cover',
                }}
              />
            )}
          />

          <Column title="Titel" dataIndex="title" />
          <Column title="Alt-Text" dataIndex="alt" />

          <Column
            title="URL"
            render={(asset: Asset) => (
              <a href={asset.url} target="_blank" rel="noreferrer">
                öffnen
              </a>
            )}
          />

          <Column
            title="Upload"
            render={(asset: Asset) => formatDate(asset.uploadedAt)}
          />

          <Column
            title="Aktion"
            render={(asset: Asset) => (
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 130 }}>
                  <Button
                    variant="secondary"
                    onClick={() => handleCopyUrl(asset)}
                  >
                    {copiedAssetKey === asset.imageKey
                      ? 'Kopiert!'
                      : 'URL kopieren'}
                  </Button>
                </div>

                <Button variant="secondary" onClick={() => startEditing(asset)}>
                  Bearbeiten
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => handleDeleteAsset(asset)}
                >
                  Löschen
                </Button>
              </div>
            )}
          />
        </Table>
      )}
    </PageWrapper>
  )
}

export const getServerSideProps = withMakaira()
