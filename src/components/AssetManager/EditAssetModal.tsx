import { Button, Modal, Text, TextInput } from '@/components'
import { Asset } from './types'

type EditAssetModalProps = {
  asset: Asset | null
  title: string
  alt: string
  onTitleChange: (value: string) => void
  onAltChange: (value: string) => void
  onCancel: () => void
  onSave: () => void
}

export function EditAssetModal({
  asset,
  title,
  alt,
  onTitleChange,
  onAltChange,
  onCancel,
  onSave,
}: EditAssetModalProps) {
  return (
    <Modal
      visible={!!asset}
      onClose={onCancel}
      mask={true}
      header={<Text>Asset bearbeiten</Text>}
      footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Abbrechen
          </Button>

          <Button type="button" onClick={onSave}>
            Speichern
          </Button>
        </div>
      }
    >
      <form id="edit-asset-form">
        <TextInput
          name="editTitle"
          label="Titel"
          defaultValue={title}
          onChange={(event) => onTitleChange(event.target.value)}
        />

        <TextInput
          name="editAlt"
          label="Alt-Text"
          defaultValue={alt}
          onChange={(event) => onAltChange(event.target.value)}
        />
      </form>
    </Modal>
  )
}
