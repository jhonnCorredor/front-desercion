"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { Service } from "@/data/api";
import Cookies from "js-cookie";

export default function QuestionnaireForm() {
    const userId = Cookies.get("user");

    const [questionnaire, setQuestionnaire] = useState({
        id: null,
        nombre: "",
        descripcion: "",
        preguntas: []
    });    
    const [answers, setAnswers] = useState([]);

    // Ejemplo de uso en fetchData
    const fetchData = async () => {
    try {
        const response = await Service.get("/cuestionario/cuestionariosid/?cuestionario_id=4");

        // Mapear la response en el formato requerido
        const questionnaire = {
            id: response[0]?.cuestionario_id || null,
            nombre: response[0]?.cuestionario_nombre || "",
            descripcion: response[0]?.cuestionario_descripcion || "",
            preguntas: response.map(p => ({
                id: p.pregunta_id,
                text: p.pregunta_texto,
                tipo: p.pregunta_tipo,
                opciones: JSON.parse(p.pregunta_opciones), // Convertir string a array
                cuestionario: p.cuestionario_id
            }))
        };
        setQuestionnaire(questionnaire);
    } catch (error) {
        console.error("Error al obtener el cuestionario:", error);
        setQuestionnaire({});
    }
};

    useEffect(() => {
        fetchData();
    }, []); // Solo se ejecuta al montar el componente

//   const questionnaire = {
//     id: 1,
//     nombre: "Deserción",
//     descripcion: "Formulario para deserción de aprendices",
//     preguntas: [
//       {
//         id: 1,
//         text: "¿Quiere desertar?",
//         tipo: "abierta",
//         opciones: [],
//         cuestionario: 1,
//       },
//       {
//         id: 2,
//         text: "Motivo para desertar",
//         tipo: "seleccion multiple",
//         opciones: ["Porque si", "No le interesa"],
//         cuestionario: 1,
//       },
//     ],
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const data = answers.map(a => ({ pregunta: a.questionId, respuesta: a.value, usuario: parseInt(userId) , aprendiz: 1 }));
        // const response = await Service.post("/cuestionario/respuestas/", {
        //     cuestionario: questionnaire.id,
        //     respuestas: answers
        // });
        console.log("Respuestas enviadas:", data);
        // Mostrar notificación
    } catch (error) {
        console.error("Error al enviar respuestas:", error);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex((a) => a.questionId === questionId);
      if (existingAnswerIndex > -1) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { questionId, value };
        return newAnswers;
      } else {
        return [...prev, { questionId, value }];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-xl mt-6">
      <div className="mx-auto container p-4">
        <div className="mb-6 flex items-center gap-3">
          <img src="/public/img/logoSena.jpg" alt="Logo SENA" className="h-12 w-12 rounded-full" />
          <h1 className="text-2xl font-semibold text-[#4CAF50]">AutoGestion CIES - {questionnaire.nombre}</h1>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-[#4CAF50] text-white rounded-t-xl">
            <CardTitle className="text-2xl">{questionnaire.nombre}</CardTitle>
            <p className="mt-2 text-gray-100">{questionnaire.descripcion}</p>
          </CardHeader>
          <CardContent className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {questionnaire.preguntas.map((question) => (
                <Card key={question.id} className="border shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start gap-3">
                      <Mail className="mt-1 h-5 w-5 text-[#4CAF50]" />
                      <Label className="text-lg font-medium">{question.text}</Label>
                    </div>

                    {question.tipo === "abierta" ? (
                      <Textarea
                        placeholder="Escribe tu respuesta aquí"
                        value={answers.find((a) => a.questionId === question.id)?.value || ""}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="min-h-[100px] w-full resize-none border-gray-200 focus:border-[#4CAF50] focus:ring-[#4CAF50]"
                      />
                    ) : (
                      <RadioGroup
                        value={answers.find((a) => a.questionId === question.id)?.value || ""}
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                        className="space-y-2"
                      >
                        {question.opciones.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
                              answers.find((a) => a.questionId === question.id)?.value === option ? "border-[#4CAF50] bg-green-50" : ""
                            }`}
                          >
                            <RadioGroupItem
                              value={option}
                              id={`q${question.id}-opt${optionIndex}`}
                              className="border-gray-300 text-[#4CAF50] focus:ring-[#4CAF50]"
                            />
                            <Label htmlFor={`q${question.id}-opt${optionIndex}`} className="flex-1 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#45a049]">
                Enviar respuestas
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
