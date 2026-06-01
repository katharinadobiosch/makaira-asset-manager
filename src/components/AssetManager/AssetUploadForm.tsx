import styles from '@/pages/index.module.scss'
import { Button, TextInput } from '@/components'

type AssetUploadFormProps = {
  title: string
  alt: string
  isUploading: boolean
  onTitleChange: (value: string) => void
  onAltChange: (value: string) => void
  onFileChange: (file: File | null) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function AssetUploadForm({
  title,
  alt,
  isUploading,
  onTitleChange,
  onAltChange,
  onFileChange,
  onSubmit,
}: AssetUploadFormProps) {
  return (
    <form onSubmit={onSubmit} className={styles.uploadForm}>
      <div className={styles.formGrid}>
        <TextInput
          name="title"
          label="Titel"
          defaultValue={title}
          onChange={(event) => onTitleChange(event.target.value)}
        />

        <TextInput
          name="alt"
          label="Alt-Text"
          defaultValue={alt}
          onChange={(event) => onAltChange(event.target.value)}
        />
      </div>

      <div className={styles.fileField}>
        <label htmlFor="file">Bild</label>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/*"
          onChange={(event) => {
            onFileChange(event.target.files?.[0] ?? null)
          }}
        />
      </div>

      <div className={styles.formActions}>
        <Button type="submit" loading={isUploading}>
          {isUploading ? 'Bild wird hochgeladen...' : 'Bild hochladen'}
        </Button>
      </div>
    </form>
  )
}
