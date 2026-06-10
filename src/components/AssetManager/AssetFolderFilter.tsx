import styles from '@/pages/index.module.scss'

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
  if (folders.length === 0) {
    return null
  }

  return (
    <div className={styles.folderFilter}>
      <label htmlFor="folder-filter">Ordner filtern</label>

      <select
        id="folder-filter"
        value={selectedFolder}
        onChange={(event) => onFolderChange(event.target.value)}
      >
        <option value="">Alle Ordner</option>

        {folders.map((folder) => (
          <option key={folder} value={folder}>
            {folder}
          </option>
        ))}
      </select>
    </div>
  )
}
