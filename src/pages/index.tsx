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

  useEffect(() => {
    async function loadAssets() {
      const response = await fetch('/api/assets')
      const data = await response.json()

      setAssets(data.assets)
      setIsLoading(false)
    }

    loadAssets()
  }, [])

  return (
    <main>
      <h1>Asset Manager</h1>

      <p>
        Bilder für den Bettwaren-Shop hochladen, verwalten und als URL für HTML
        oder Richtext verwenden.
      </p>

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
