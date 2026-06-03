import { withMakaira } from '@/makaira/withMakaira'
import { PageWrapper, Text } from '@/components'
import {
  AssetSearch,
  AssetTable,
  AssetUploadForm,
  DeleteAssetModal,
  EditAssetModal,
  useAssets,
} from '@/components/AssetManager'

export default function Home() {
  const {
    assets,
    filteredAssets,
    isLoading,
    isUploading,
    title,
    alt,
    setTitle,
    setAlt,
    setFile,
    copiedAssetKey,
    handleCopyUrl,
    editingAsset,
    editTitle,
    editAlt,
    setEditTitle,
    setEditAlt,
    startEditing,
    cancelEditing,
    handleUpdateAsset,
    assetToDelete,
    setAssetToDelete,
    handleDeleteAsset,
    search,
    setSearch,
    handleSubmit,
    formatDate,
    errorMessage,
    file,
    uploadFormKey,
  } = useAssets()

  return (
    <PageWrapper title="Asset Manager">
      <Text>
        Bilder für den Bettwaren-Shop hochladen, verwalten und als URL für HTML
        oder Richtext verwenden.
      </Text>

      <AssetUploadForm
        key={uploadFormKey}
        title={title}
        alt={alt}
        isUploading={isUploading}
        onTitleChange={setTitle}
        onAltChange={setAlt}
        onFileChange={setFile}
        onSubmit={handleSubmit}
        isSubmitDisabled={!title || !alt || !file || isUploading}
        errorMessage={errorMessage ?? undefined}
      />

      <EditAssetModal
        asset={editingAsset}
        title={editTitle}
        alt={editAlt}
        onTitleChange={setEditTitle}
        onAltChange={setEditAlt}
        onCancel={cancelEditing}
        onSave={handleUpdateAsset}
      />

      <DeleteAssetModal
        asset={assetToDelete}
        onCancel={() => setAssetToDelete(null)}
        onConfirm={async () => {
          if (!assetToDelete) return

          await handleDeleteAsset(assetToDelete)
          setAssetToDelete(null)
        }}
      />

      {isLoading && <Text>Lade Assets...</Text>}

      {!isLoading && <AssetSearch search={search} onSearchChange={setSearch} />}

      {!isLoading && assets.length === 0 && (
        <Text>Noch keine Assets vorhanden.</Text>
      )}

      {!isLoading && assets.length > 0 && filteredAssets.length === 0 && (
        <Text>Keine Assets gefunden.</Text>
      )}

      {!isLoading && filteredAssets.length > 0 && (
        <AssetTable
          assets={filteredAssets}
          copiedAssetKey={copiedAssetKey}
          onCopyUrl={handleCopyUrl}
          onEdit={startEditing}
          onDelete={setAssetToDelete}
          formatDate={formatDate}
        />
      )}
    </PageWrapper>
  )
}

export const getServerSideProps = withMakaira()
