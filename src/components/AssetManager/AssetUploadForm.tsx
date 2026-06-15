import { useRef } from 'react'
import styles from '@/pages/index.module.scss'
import { Button, TextInput, Text, Badge, Collapse, Panel } from '@/components'
import { FaUpload, FaSpinner, FaExclamationCircle } from 'react-icons/fa'

type AssetUploadFormProps = {
  title: string
  alt: string
  file: File | null
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
  file,
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
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    onSubmit(event)
  }

  return (
    <>
      <Collapse type="arrow" className={styles.uploadCollapse}>
        <Panel type="arrow" header="Bild hochladen">
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
              <div className={styles.filePickerRow}>
                <Button
                  type="button"
                  variant="secondary"
                  level={1}
                  icon={FaUpload}
                  iconPosition="left"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Datei auswählen
                </Button>
                <Text size="bravo" element="span" className={styles.fileName}>
                  {file ? file.name : 'Keine Datei ausgewählt'}
                </Text>
              </div>
              <input
                ref={fileInputRef}
                id="file"
                name="file"
                type="file"
                accept="image/*"
                className={styles.fileInputHidden}
                onChange={(event) => {
                  onFileChange(event.target.files?.[0] ?? null)
                }}
              />
            </div>

            <div className={styles.formActions}>
              <Button
                type="submit"
                icon={isUploading ? undefined : FaUpload}
                iconPosition="left"
                loading={isUploading}
                disabled={isSubmitDisabled}
              >
                {isUploading ? 'Wird hochgeladen...' : 'Bild hochladen'}
              </Button>

              {isUploading && (
                <Badge
                  spin
                  icon={FaSpinner}
                  type="secondary"
                  text="Upload läuft..."
                />
              )}
            </div>
          </form>

          {errorMessage && (
            <div className={styles.formError}>
              <Badge
                type="primary"
                text={errorMessage}
                icon={FaExclamationCircle}
              />
            </div>
          )}
        </Panel>
      </Collapse>
    </>
  )
}
