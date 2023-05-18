'use client'
import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { splitDocument } from '@/lib/markdown'
import { useVectorStore } from '@/lib/vector-db'
import { createEmbedding } from '@/lib/openai'
import UploadedFilesTable from '@/components/documents/uploaded-files-table'
import UploadFile from '@/components/documents/upload-file'
import { UploadedFile } from '@/types'

export default function Home() {
  const [files, setFiles] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(null)
  const [isUploading, setIsUploading] = useState(false)
  const db = useVectorStore()

  const getUploadedFiles = useCallback(async () => {
    const docs = await db?.getAllFiles()
    setUploadedFiles(docs as any)
  }, [db])

  useEffect(() => {
    getUploadedFiles()
  }, [getUploadedFiles])

  async function uploadFiles() {
    setIsUploading(true)
    files.forEach(async (file) => {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const fileContent = event.target.result

        const [title, sections] = await splitDocument(
          file.name,
          fileContent as string
        )
        const id = uuidv4()
        await Promise.all(
          sections.map(async (section) => {
            const embedding = await createEmbedding(section)
            await db.insert({
              fileId: id,
              title,
              embedding,
              text: section,
              date: Date.now()
            })
            getUploadedFiles()
            setFiles([])
          })
        )
        setIsUploading(false)
      }
      reader.readAsText(file)
    })
  }

  async function handleDeleteFile(id) {
    await db.deleteByFileId(id)
    getUploadedFiles()
  }

  return (
    <div className="container">
      <h1 className="mb-8 text-2xl font-bold">My Documents</h1>
      <UploadFile
        files={files}
        setFiles={setFiles}
        isUploading={isUploading}
        onUploadFiles={uploadFiles}
      />

      {uploadedFiles ? (
        <UploadedFilesTable
          files={uploadedFiles}
          handleDeleteFile={handleDeleteFile}
        />
      ) : null}
    </div>
  )
}
