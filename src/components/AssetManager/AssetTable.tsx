import Image from 'next/image'

import styles from '@/pages/index.module.scss'
import { Button, Column, Table } from '@/components'
import { Asset } from './types'

type AssetTableProps = {
  assets: Asset[]
  copiedAssetKey: string | null
  onCopyUrl: (asset: Asset) => void
  onEdit: (asset: Asset) => void
  onDelete: (asset: Asset) => void
  formatDate: (value: string) => string
}

export function AssetTable({
  assets,
  copiedAssetKey,
  onCopyUrl,
  onEdit,
  onDelete,
  formatDate,
}: AssetTableProps) {
  return (
    <div className={styles.assetTable}>
      <Table data={assets}>
        <Column
          title="Bild"
          render={(asset: Asset) => (
            <Image
              className={styles.thumbnail}
              src={asset.url}
              alt={asset.alt}
              width={120}
              height={120}
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
                <Button variant="secondary" onClick={() => onCopyUrl(asset)}>
                  {copiedAssetKey === asset.imageKey
                    ? 'Kopiert!'
                    : 'URL kopieren'}
                </Button>
              </div>

              <Button variant="secondary" onClick={() => onEdit(asset)}>
                Bearbeiten
              </Button>

              <Button variant="secondary" onClick={() => onDelete(asset)}>
                Löschen
              </Button>
            </div>
          )}
        />
      </Table>
    </div>
  )
}
