export const folderNameRegex = /^[a-zA-Z0-9_-]+$/

export function validateFolderName(folderName: string) {
  const trimmedFolderName = folderName.trim()

  if (!trimmedFolderName) {
    return 'Bitte gib einen Ordnernamen ein.'
  }

  if (!folderNameRegex.test(trimmedFolderName)) {
    return 'Der Ordnername darf nur Buchstaben, Zahlen, Bindestriche und Unterstriche enthalten.'
  }

  return null
}

export function folderExists(folderName: string, existingFolders: string[]) {
  return existingFolders.some((folder) => {
    return folder.toLowerCase() === folderName.trim().toLowerCase()
  })
}
