import { TextInput } from '@/components'

type AssetSearchProps = {
  search: string
  onSearchChange: (value: string) => void
}

export function AssetSearch({ search, onSearchChange }: AssetSearchProps) {
  return (
    <TextInput
      label="Asset suchen"
      name="search"
      defaultValue={search}
      onChange={(event) => onSearchChange(event.target.value)}
    />
  )
}
