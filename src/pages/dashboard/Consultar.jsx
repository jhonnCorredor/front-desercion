"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Service } from "@/data/api";
import AprendizModal from "./AprendizModal";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";

export default function SearchForm() {
  const [aprendiz, setAprendiz] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentoBuscado, setDocumentoBuscado] = useState("");

  const form = useForm({
    defaultValues: {
      documento: "",
    },
  });

  const validateDocument = (value) => {
    if (!value) return "El documento es requerido";
    if (value.length > 10) return "Máximo 10 caracteres";
    return true;
  };

  async function onSubmit(values) {
    setIsLoading(true);
    setDocumentoBuscado(values.documento);

    Swal.fire({
      title: "Buscando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await Service.get(`aprendiz/documento/?documento=${values.documento}`);

      if (!response) throw new Error("Aprendiz no encontrado");

      setAprendiz(response);
      Swal.close();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Aprendiz no encontrado",
        text: "¿Deseas crearlo?",
        showCancelButton: true,
        confirmButtonText: "Crear",
        cancelButtonText: "Cancelar",
         confirmButtonColor: "#3085d6", // Color para el botón de "Crear"
  cancelButtonColor: "#d33"
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("Abriendo modal...");
          setIsModalOpen(true);
        }
      });
      setAprendiz(null);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClear = () => {
    form.reset();
    setAprendiz(null);
  };

  const handleProcess = (e) => {
    e.preventDefault()
    try {
      Cookies.set("aprendiz", JSON.stringify(aprendiz.id) , {expires: 1})
      setTimeout(() => {
        window.location.href = "/dashboard/formulario"
      }, 100)
    } catch (error) {
      console.error("Error al redirigir: ", error)
    }
  }

  // Al crearse el aprendiz, se vuelve a consultar para obtener la información completa
  const handleAprendizCreado = async (nuevoAprendiz) => {
    try {
      const response = await Service.get(`aprendiz/documento/?documento=${documentoBuscado}`);
      setAprendiz(response);
    } catch (error) {
      console.error("Error al consultar el aprendiz creado:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = (open) => {
    if (!open) setIsModalOpen(false);
  };

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
         <div className="mt-8 animate-fadeIn">
         <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center">
           {/* Avatar */}
           <div className="flex-shrink-0">
             <Avatar className="w-24 h-24">
               <AvatarImage src={aprendiz.avatarUrl} alt={aprendiz.nombres} />
               <AvatarFallback>
                 {aprendiz.nombres[0]}{aprendiz.apellidos[0]}
               </AvatarFallback>
             </Avatar>
           </div>
       
           {/* Datos del Aprendiz */}
           <div className="mt-4 md:mt-0 md:ml-6 flex-grow">
             <h2 className="text-2xl font-bold">{`${aprendiz.nombres} ${aprendiz.apellidos}`}</h2>
             <ul className="mt-2 space-y-1">
               <li className="text-gray-600">
                 <span className="font-semibold">Documento:</span> {aprendiz.documento}
               </li>
               <li className="text-gray-600">
                 <span className="font-semibold">Tipo Documento:</span> {aprendiz.tipoDocumento_nombre}
               </li>
               <li className="text-gray-600">
                 <span className="font-semibold">Correo:</span> {aprendiz.correo}
               </li>
               
             </ul>
           </div>
       
           {/* Botón de Acción */}
           <div className="mt-4 md:mt-0">
             <NavLink  to="/dashboard/formulario" onClick={handleProcess} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded">
               Realizar procesos
             </NavLink>
           </div>
         </div>
       </div>
       
          )}
        </CardContent>
      </Card>

      {/* Modal de creación */}
      <AprendizModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAprendizCreado={handleAprendizCreado}
        initialData={{ documento: documentoBuscado }}
      />
    </div>
  );
}
