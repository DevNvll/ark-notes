export type Role = 'USER' | 'AI'

export interface Message {
  id: string
  text: string
  role: Role
  error?: boolean
}

export interface UploadedFile {
  title: string
  fileId: string
  date: number
}
