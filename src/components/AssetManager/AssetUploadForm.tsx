import styles from '@/pages/index.module.scss'
import { Button, TextInput, Text, Badge } from '@/components'

type AssetUploadFormProps = {
  title: string
  alt: string
  folder: string
  existingFolders: string[]
  isUploading: boolean
  onTitleChange: (value: string) => void
  onAltChange: (value: string) => void
  onFolderChange: (value: string) => void
  onFileChange: (file: File | null) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  isSubmitDisabled: boolean
  errorMessage?: string
}

export function AssetUploadForm({
  title,
  alt,
  folder,
  existingFolders,
  isUploading,
  onTitleChange,
  onAltChange,
  onFolderChange,
  onFileChange,
  onSubmit,
  isSubmitDisabled,
  errorMessage,
}: AssetUploadFormProps) {
  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    onSubmit(event)
  }

  return (
    <>
      <form onSubmit={handleFormSubmit} className={styles.uploadForm}>
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

          <div className={styles.folderField}>
            <label htmlFor="folder">Ordner</label>
            <input
              id="folder"
              name="folder"
              value={folder}
              onChange={(event) => onFolderChange(event.target.value)}
            />
          </div>
        </div>

        {existingFolders.length > 0 && (
          <div className={styles.folderHint}>
            <Text>Bestehende Ordner:</Text>

            <div className={styles.folderBadges}>
              {existingFolders.map((existingFolder) => (
                <button
                  key={existingFolder}
                  type="button"
                  className={styles.folderBadgeButton}
                  onClick={() => onFolderChange(existingFolder)}
                >
                  <Badge type="secondary" text={existingFolder} />
                </button>
              ))}
            </div>
          </div>
        )}

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
          <Button
            type="submit"
            loading={isUploading}
            disabled={isSubmitDisabled}
          >
            {isUploading ? 'Bild wird hochgeladen...' : 'Bild hochladen'}
          </Button>
        </div>
      </form>

      {errorMessage && (
        <div className={styles.formError}>
          <Text>{errorMessage}</Text>
        </div>
      )}
    </>
  )
}
