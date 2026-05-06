import { useDocument } from './hooks/useDocument.js'
import { Layout } from './components/Layout.jsx'

export default function App() {
  const { content, setContent } = useDocument()
  return <Layout content={content} onContentChange={setContent} />
}
