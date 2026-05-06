import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'

export function Editor({ content, onChange }) {
  return (
    <CodeMirror
      value={content}
      onChange={onChange}
      extensions={[markdown()]}
      height="100%"
      theme="dark"
      basicSetup={{ lineNumbers: false, foldGutter: false }}
    />
  )
}
