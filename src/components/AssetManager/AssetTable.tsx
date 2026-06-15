import Image from 'next/image'
import {
  FaCopy,
  FaCheck,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
} from 'react-icons/fa'

import styles from '@/pages/index.module.scss'
import { Button, Column, Table, Tooltip } from '@/components'
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
          title="Ordner"
          render={(asset: Asset) => asset.folder || 'Ohne Ordner'}
        />

        <Column
          title="URL"
          render={(asset: Asset) => (
            <Button
              variant="secondary"
              icon={FaExternalLinkAlt}
              onClick={() =>
                window.open(asset.url, '_blank', 'noopener,noreferrer')
              }
            />
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
              <Tooltip placement="top" overlay={<span>URL kopieren</span>}>
                <Button
                  variant="secondary"
                  icon={copiedAssetKey === asset.imageKey ? FaCheck : FaCopy}
                  onClick={() => onCopyUrl(asset)}
                />
              </Tooltip>

              <Tooltip placement="top" overlay={<span>Bearbeiten</span>}>
                <Button
                  variant="secondary"
                  icon={FaEdit}
                  onClick={() => onEdit(asset)}
                />
              </Tooltip>

              <Tooltip placement="top" overlay={<span>Löschen</span>}>
                <Button
                  variant="secondary"
                  icon={FaTrash}
                  onClick={() => onDelete(asset)}
                />
              </Tooltip>
            </div>
          )}
        />
      </Table>
    </div>
  )
}
