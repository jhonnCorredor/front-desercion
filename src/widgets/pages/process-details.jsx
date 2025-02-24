"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronUp, ChevronDown, Mail } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import Cookies from "js-cookie"
import { Service } from "@/data/api"
import Swal from "sweetalert2"

const ProcessDetails = ({ process }) => {
  const [comment, setComment] = useState("")
  const [openQuestions, setOpenQuestions] = useState([])
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false)
  const userId = Cookies.get("user")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        texto: comment,
        usuario_id: parseInt(userId),
        proceso_id: parseInt(process.proceso_id)
      }
      const response = await Service.post("/comentarios/", data)
      Swal.fire({
        icon: "success",
        title: "Proceso aprobado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error(error)
    }
    setComment("")
  }

  const toggleQuestionnaire = () => {
    setIsQuestionnaireOpen(!isQuestionnaireOpen)
  }

  const toggleQuestion = (id) => {
    if (openQuestions.includes(id)) {
      setOpenQuestions(openQuestions.filter((qid) => qid !== id))
    } else {
      setOpenQuestions([...openQuestions, id])
    }
  }

  if (!process) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>No hay proceso seleccionado.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Encabezado con título y botones de acción (fijo) */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Detalles del Proceso</h2>
        <div className="space-x-2">
          <Button variant="default" onClick={handleSubmit} className="gap-2 bg-green-500 hover:bg-green-600">
            <Check className="w-4 h-4" />
            Aprobar
          </Button>
        </div>
      </div>

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Información básica del proceso */}
          <div className="mb-8">
            <p className="mb-2">
              <strong>Nombre Usuario:</strong> {process.nombres_usuario} {process.apellidos_usuario}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {process.correo_usuario}
            </p>
            <p>
              <strong>Estado de Aprobación:</strong> {process.estado_aprobacion}
            </p>
          </div>

          {/* Acordeón principal del cuestionario */}
          {process.preguntas && process.preguntas.length > 0 && (
            <div className="mb-8">
              <div
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer"
                onClick={toggleQuestionnaire}
              >
                <div className="p-6 flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{process.cuestionario_nombre || "Cuestionario"}</h3>
                  {isQuestionnaireOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Acordeones de preguntas */}
              {isQuestionnaireOpen && (
                <div className="mt-4 space-y-4">
                  {process.preguntas.map((pregunta) => (
                    <div
                      key={pregunta.pregunta_id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <Mail className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                          <div className="flex-grow">
                            <button
                              onClick={() => toggleQuestion(pregunta.pregunta_id)}
                              className="w-full flex justify-between items-center group"
                            >
                              <span className="text-[15px] font-medium text-gray-700 text-left">
                                {pregunta.texto_pregunta}
                              </span>
                              {openQuestions.includes(pregunta.pregunta_id) ? (
                                <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                              )}
                            </button>

                            {openQuestions.includes(pregunta.pregunta_id) && (
                              <div className="mt-4 pl-0">
                                {pregunta.respuestas && pregunta.respuestas.length > 0 ? (
                                  <div className="space-y-2">
                                    {pregunta.respuestas.map((respuesta) => (
                                      <div
                                        key={respuesta.respuesta_id}
                                        className="text-gray-600 text-[15px] p-3 bg-gray-50 rounded-lg"
                                      >
                                        {respuesta.respuesta_texto}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 text-[15px] italic">No hay respuestas.</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Área de texto para el comentario */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar Comentario</h3>
            <Textarea
              placeholder="Escribe tu comentario..."
              className="min-h-[120px] bg-white"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProcessDetails
