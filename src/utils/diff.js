import { diffLines } from 'diff'

export function computeDiff(oldText, newText) {
  return diffLines(oldText, newText)
}
