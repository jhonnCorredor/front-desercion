"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Play, X, ChevronUp, ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const ProcessDetails = ({ process }) => {
  const [comment, setComment] = useState("");
  const [openQuestions, setOpenQuestions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Comentario enviado:", comment);
    setComment("");
  };

  const toggleQuestion = (id) => {
    if (openQuestions.includes(id)) {
      setOpenQuestions(openQuestions.filter((qid) => qid !== id));
    } else {
      setOpenQuestions([...openQuestions, id]);
    }
  };

  // Si no hay proceso seleccionado, mostramos un mensaje
  if (!process) {
    return (
      <div className="w-full max-w-3xl mx-auto rounded-xl bg-white p-6">
        <p>No hay proceso seleccionado.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl bg-white p-6">
      {/* Encabezado con título y botones de acción */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {process.cuestionario_nombre || "Detalles del Proceso"}
        </h2>
        <div className="space-x-2">
          <Button variant="outline" className="gap-2 text-gray-700">
            <X className="w-4 h-4" />
            Rechazar
          </Button>
          <Button variant="default" className="gap-2 bg-green-500 hover:bg-green-600">
            <Check className="w-4 h-4" />
            Aprobar
          </Button>
        </div>
      </div>

      {/* Información básica del proceso */}
      <div className="mb-6">
        <p>
          <strong>Nombre Usuario:</strong> {process.nombres_usuario} {process.apellidos_usuario}
        </p>
        <p>
          <strong>Email:</strong> {process.correo_usuario}
        </p>
        <p>
          <strong>Estado de Aprobación:</strong> {process.estado_aprobacion}
        </p>
      </div>

      {/* Sección de documentos (PDF, DOC) */}
      <div className="flex space-x-4 mb-6">
        <Button variant="ghost" className="h-14 w-14 bg-gray-50 hover:bg-gray-100 rounded-lg font-normal">
          PDF
        </Button>
        <Button variant="ghost" className="h-14 w-14 bg-gray-50 hover:bg-gray-100 rounded-lg font-normal">
          DOC
        </Button>
      </div>

      {/* Botón para una acción adicional (por ejemplo, reproducir algo) */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-center">
        <Button variant="ghost" className="rounded-full w-8 h-8 p-0 text-green-500">
          <Play className="w-4 h-4" />
        </Button>
      </div>

      {/* Accordion de Preguntas */}
      {process.preguntas && process.preguntas.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Preguntas</h3>
          <div className="space-y-2">
            {process.preguntas.map((pregunta) => (
              <div key={pregunta.pregunta_id} className="border border-gray-200 rounded">
                <button
                  onClick={() => toggleQuestion(pregunta.pregunta_id)}
                  className="w-full p-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                >
                  <span>{pregunta.texto_pregunta}</span>
                  {openQuestions.includes(pregunta.pregunta_id) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openQuestions.includes(pregunta.pregunta_id) && (
                  <div className="p-3 bg-white">
                    {pregunta.respuestas && pregunta.respuestas.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {pregunta.respuestas.map((respuesta) => (
                          <li key={respuesta.respuesta_id}>{respuesta.respuesta_texto}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No hay respuestas.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulario para agregar un comentario */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Agregar Comentario</h3>
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Escribe tu comentario..."
            className="min-h-[120px] mb-4 bg-white"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button type="submit" className="bg-green-500 hover:bg-green-600">
            Enviar Comentario
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProcessDetails;