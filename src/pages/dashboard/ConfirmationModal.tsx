import React from "react"

import { useEffect, useRef, useState } from "react"
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Typography, Input } from "@material-tailwind/react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (code: string) => void
}

export function ConfirmationModal({ isOpen, onClose, onConfirm }: ConfirmationModalProps) {
  const [code, setCode] = useState(["", "", "", ""])
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputsRef.current[0]?.focus(), 100) // Autoenfoque en el primer input
    }
  }, [isOpen])

  const handleConfirm = () => {
    const fullCode = code.join("")
    if (fullCode.length === 4) {
      onConfirm(fullCode)
      setCode(["", "", "", ""])
    }
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return // Solo permite números

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  return (
    <Dialog open={isOpen} handler={onClose} className="transition-all duration-300">
      <DialogHeader className="text-center">Confirmar Código</DialogHeader>
      <DialogBody>
        <Typography variant="paragraph" color="blue-gray" className="mb-4 text-center">
          Ingresa el código de 4 dígitos que recibiste:
        </Typography>
        <div className="flex justify-center gap-3">
            <input
             placeholder="Confirmar código"
            />
          
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-center">
        <Button variant="text" color="red" onClick={onClose} className="mr-2">
          Cancelar
        </Button>
        <Button variant="gradient" color="green" onClick={handleConfirm} disabled={code.some((digit) => digit === "")}>
          Confirmar
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
