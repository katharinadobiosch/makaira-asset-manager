import { useEffect, useState } from 'react'

import { withMakaira } from '@/makaira/withMakaira'

type Asset = {
  title: string
  alt: string
  imageKey: string
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

  return (
    <main>
      <h1>Asset Manager</h1>

      <p>
        Bilder für den Bettwaren-Shop hochladen, verwalten und als URL für HTML
        oder Richtext verwenden.
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Titel</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="alt">Alt-Text</label>
          <input
            id="alt"
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="file">Bild</label>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null)
            }}
            required
          />
        </div>

        <button type="submit">Bild hochladen</button>
      </form>

      {isLoading && <p>Lade Assets...</p>}

      {!isLoading && assets.length === 0 && <p>Noch keine Assets vorhanden.</p>}

      {!isLoading && assets.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Titel</th>
              <th>Alt-Text</th>
              <th>URL</th>
              <th>Upload</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((asset) => (
              <tr key={asset.imageKey}>
                <td>{asset.title}</td>
                <td>{asset.alt}</td>
                <td>
                  <a href={asset.url} target="_blank" rel="noreferrer">
                    öffnen
                  </a>
                </td>
                <td>{asset.uploadedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

export const getServerSideProps = withMakaira()
