import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { format } from 'date-fns'
import { ScrollArea } from '../ui/scroll-area'
import { XIcon } from 'lucide-react'

interface Props {
  files: {
    title: string
    fileId: string
    date: number
  }[]
  handleDeleteFile: (fileId: string) => void
}

export default function UploadedFilesTable({ files, handleDeleteFile }: Props) {
  return (
    <ScrollArea className="w-full mt-4 border rounded-md h-72">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">
          Your Documents
        </h4>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Delete</TableHead>
            <TableHead className="w-[100px]">Filename</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => {
            return (
              <>
                <TableRow key={file.fileId}>
                  <TableCell className="w-[100px]">
                    <button
                      onClick={() => {
                        handleDeleteFile(file.fileId)
                      }}
                    >
                      <XIcon />
                    </button>
                  </TableCell>
                  <TableCell className="font-medium w-[200px]">
                    {file.title}
                  </TableCell>
                  <TableCell>
                    {format(new Date(file.date), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                </TableRow>
              </>
            )
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}
