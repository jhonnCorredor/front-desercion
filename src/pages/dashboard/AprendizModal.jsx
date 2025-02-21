import React, { useState, useEffect } from "react";
import { Service } from "@/data/api";
import Swal from "sweetalert2";
import { DynamicModal } from "@/widgets/Modal/DynamicModal";

export default function AprendizModal({ isOpen, onClose, onAprendizCreado, initialData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [tiposDocumento, setTiposDocumento] = useState([]);

  useEffect(() => {
    const fetchTiposDocumento = async () => {
      try {
        const response = await Service.get("/documento/");
        setTiposDocumento(
          response.map((item) => ({
            value: item.id,
            label: item.nombre,
          }))
        );
      } catch (error) {
        console.error("Error al obtener los tipos de documento:", error);
      }
    };

    fetchTiposDocumento();
  }, []);

  const handleSubmit = async (formData) => {
    // Validar dominio del correo
    const emailDomainRegex = /^[a-zA-Z0-9._%+-]+@sena\.edu$/i;
    if (!emailDomainRegex.test(formData.correo)) {
        Swal.fire({
          title: "Error",
          text: "El correo debe pertenecer al dominio @sena.edu",
          icon: "error",
          showConfirmButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#3085d6", 
          timer: 5000, 
          timerProgressBar: true
        });
        return;
      }
      

    setIsLoading(true);
    try {
      const response = await Service.post("/aprendiz/", formData);

      Swal.fire({
        title: "Aprendiz creado",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      // Notifica al padre que se creó el aprendiz
      if (onAprendizCreado) onAprendizCreado(response);
      // Cierra el modal
      onClose(false);
    } catch (error) {
      Swal.fire({
        title: "Error al guardar el aprendiz",
        text: error.message || "Hubo un error al guardar el aprendiz",
        icon: "error",
        showConfirmButton: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const modalFields = [
    { name: "documento", label: "Documento", type: "text" },
    { name: "nombres", label: "Nombres", type: "text" },
    { name: "apellidos", label: "Apellidos", type: "text" },
    { name: "telefono", label: "Teléfono", type: "text" },
    { name: "correo", label: "Correo", type: "text" },
    { name: "tipoDocumento", label: "Tipo de documento", type: "select", options: tiposDocumento },
  ];

  return (
    <DynamicModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Crear Nuevo Aprendiz"
      fields={modalFields}
      initialData={initialData}
    />
  );
}
