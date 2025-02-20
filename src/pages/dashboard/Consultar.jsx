"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"
import { Search, UserX, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Service } from "@/data/api"

export default function SearchForm() {
  const [aprendiz, setAprendiz] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      documento: "",
    },
  })

  const validateDocument = (value) => {
    if (!value) {
      return "El documento es requerido"
    }
    if (value.length > 10) {
      return "Máximo 10 caracteres"
    }
    return true
  }

  async function onSubmit(values) {
    setIsLoading(true)
    Swal.fire({
      title: "Buscando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const response = await Service.get(`aprendiz/documento/?documento=${values.documento}`)

      if (!response) {
        throw new Error("Aprendiz no encontrado")
      }

      setAprendiz(response)
      Swal.close()
    } catch (error) {
      console.error("Error al buscar aprendiz:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el aprendiz o hubo un problema en la búsqueda",
      })
      setAprendiz(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    form.reset()
    setAprendiz(null)
  }

  return (
    <div className="min-h mt-6 rounded-xl bg-gray-50 p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Búsqueda de Aprendices</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="documento"
                rules={{ validate: validateDocument }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ingrese número de cédula"
                          {...field}
                          disabled={isLoading}
                          className="flex-grow"
                        />
                        <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white">
                          <Search className="h-4 w-4 mr-2" />
                          Buscar
                        </Button>
                        <Button
                          type="button"
                          onClick={handleClear}
                          disabled={isLoading}
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Limpiar
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {aprendiz && (
            <div className="mt-8 space-y-6 animate-fadeIn">
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={aprendiz.avatarUrl || "/placeholder.svg"} alt={aprendiz.nombres} />
                  <AvatarFallback>
                    {aprendiz.nombres[0]}
                    {aprendiz.apellidos[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{`${aprendiz.nombres} ${aprendiz.apellidos}`}</h2>
                  <p className="text-gray-600">Documento: {aprendiz.documento}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Tipo de Documento:</h3>
                  <p>{aprendiz.tipoDocumento_nombre}</p>
                </div>
              
                {/* Add more fields as needed */}
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105">
                <UserX className="h-5 w-5 mr-2" />
                Desercionar Aprendiz
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

