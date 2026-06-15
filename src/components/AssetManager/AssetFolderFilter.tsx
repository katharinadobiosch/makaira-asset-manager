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

  return (
    <div className={styles.folderFilter}>
      <Text>Ordner filtern:</Text>
      <div className={styles.folderBadges}>
        <button
          type="button"
          className={styles.folderBadgeButton}
          onClick={() => onFolderChange('')}
        >
          <Badge
            type={selectedFolder === '' ? 'primary' : 'secondary'}
            text="Alle"
          />
        </button>
        {folders.map((folder) => (
          <button
            key={folder}
            type="button"
            className={styles.folderBadgeButton}
            onClick={() => onFolderChange(folder)}
          >
            <Badge
              type={selectedFolder === folder ? 'primary' : 'secondary'}
              text={folder}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
