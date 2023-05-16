import React, { useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface Props {
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
  onUploadFiles: () => void
  isUploading: boolean
}

export default function UploadFile({
  files,
  setFiles,
  onUploadFiles,
  isUploading
}: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: files.length > 0,
    multiple: true,
    accept: {
      'text/markdown': ['.md', '.markdown'],
      'text/plain': ['.txt']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles((f: File[]) => [...f, ...acceptedFiles])
    }
  })

  const dropzoneClasses = useMemo(
    () =>
      `w-full border rounded-md h-72 relative overflow-hidden ${
        isDragActive
          ? 'border-secondary bg-white bg-opacity-10'
          : 'border-gray-800'
      }`,
    [isDragActive]
  )

  return (
    <>
      <ScrollArea {...getRootProps({ className: dropzoneClasses })}>
        <input {...getInputProps()} />

        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">
            Upload Documents
          </h4>
          {files.map((file, idx) => (
            <>
              <div
                className="flex flex-row items-center w-full p-3 hover:bg-white hover:bg-opacity-5"
                key={file.name}
              >
                <button
                  onClick={(e) =>
                    e.stopPropagation &&
                    setFiles((f) => f.filter((_, i) => i !== idx))
                  }
                >
                  <XIcon />
                </button>
                <span className="text-sm">{file.name}</span>
              </div>
              <Separator className="my-2" />
            </>
          ))}
        </div>
        {isDragActive || !files.length ? (
          <div className="absolute top-0 left-0 z-50 flex items-center justify-center w-full h-full text-center opacity-50">
            Drag and drop some files here, or click to select files
          </div>
        ) : null}
      </ScrollArea>
      <Button
        variant="secondary"
        onClick={onUploadFiles}
        disabled={files.length === 0 || isUploading}
        className="w-full mt-4"
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>
    </>
  )
}
