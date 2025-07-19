// Computes how deep the current page is nested and returns asset path prefix like "../"
export function getAssetPrefix(pathname: string): string {
  const depth = pathname.split('/').filter(Boolean).length
  return '../'.repeat(depth)
}


// Enforces that required props are present in Astro components at runtime
export function assertRequiredProps(
  props: Record<string, unknown>,
  keys: string[]
): void {
  for (const key of keys) {
    if (!(key in props)) {
      throw new Error(`❌ Missing required prop: '${key}' in component. Did you forget to pass it?`)
    }
  }
}
