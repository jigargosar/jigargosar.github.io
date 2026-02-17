import getReadingTime from 'reading-time'
import { toString } from 'mdast-util-to-string'

export function remarkReadingTime() {
  return function (tree, { data }) {
    const text = toString(tree)
    const result = getReadingTime(text)
    data.astro.frontmatter.minutesRead = Math.max(1, Math.ceil(result.minutes))
  }
}
