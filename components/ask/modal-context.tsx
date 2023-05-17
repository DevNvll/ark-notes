import { useState, createContext, useContext } from 'react'

const ModalContext = createContext({ open: false, setOpen: null })

export function ModalProvider({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useChatModal = () => {
  const { open, setOpen } = useContext(ModalContext)
  return { open, setOpen }
}
