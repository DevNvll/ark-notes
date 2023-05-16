import { MarkdownTextSplitter } from 'langchain/text_splitter'

export async function splitDocument(title: string, document: string) {
  const splitter = new MarkdownTextSplitter()
  const sections = await splitter.splitText(document)
  return [title, sections] as const
}
