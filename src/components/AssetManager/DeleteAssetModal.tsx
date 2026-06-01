import { Button, Modal, Text } from '@/components'
import { Asset } from './types'

type DeleteAssetModalProps = {
  asset: Asset | null
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteAssetModal({
  asset,
  onCancel,
  onConfirm,
}: DeleteAssetModalProps) {
  return (
    <Modal
      visible={!!asset}
      onClose={onCancel}
      mask={true}
      header={<Text>Asset löschen</Text>}
      footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Abbrechen
          </Button>

          <Button type="button" onClick={onConfirm}>
            Löschen
          </Button>
        </div>
      }
    >
      <Text>Möchtest du dieses Asset wirklich löschen?</Text>
    </Modal>
  )
}
