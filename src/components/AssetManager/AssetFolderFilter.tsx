import styles from '@/pages/index.module.scss'
import { Badge, Text } from '@/components'

type AssetFolderFilterProps = {
  folders: string[]
  selectedFolder: string
  onFolderChange: (folder: string) => void
}

export function AssetFolderFilter({
  folders,
  selectedFolder,
  onFolderChange,
}: AssetFolderFilterProps) {
  if (folders.length === 0) return null

  function renderFolderBadge(folder: string, label: string) {
    const isActive = selectedFolder === folder

    return (
      <button
        key={folder || 'all'}
        type="button"
        className={`${styles.folderBadgeButton} ${
          isActive
            ? styles.folderBadgeButtonActive
            : styles.folderBadgeButtonInactive
        }`}
        onClick={() => onFolderChange(folder)}
      >
        <Badge type={isActive ? 'primary' : 'secondary'} text={label} />
      </button>
    )
  }

  return (
    <div className={styles.folderFilter}>
      <Text>Ordner filtern:</Text>
      <div className={styles.folderBadges}>
        {renderFolderBadge('', 'Alle')}
        {folders.map((folder) => renderFolderBadge(folder, folder))}
      </div>
    </div>
  )
}
