export function createSlugFromId(id: string) {
  const slugWithoutDate = id.replace(/^\d{4}-\d{2}-\d{2}-/, '')
  return slugWithoutDate.replace(/\.(md|mdx)$/, '')
}