import styles from '@/pages/index.module.scss'
import { AutoComplete } from '@/components'

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

  const options = [
    {
      value: '',
      label: 'Alle Ordner',
    },
    ...folders.map((folder) => ({
      value: folder,
      label: folder,
    })),
  ]

  return (
    <div className={styles.folderFilter}>
      <AutoComplete
        title="Ordner filtern"
        placeholder="Alle Ordner"
        allowClear
        value={selectedFolder || undefined}
        options={options}
        onChange={(value) => {
          onFolderChange(String(value ?? ''))
        }}
      />
    </div>
  )
}
