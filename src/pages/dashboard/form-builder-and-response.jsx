"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Copy, Trash2, MoveUp, MoveDown, Plus } from "lucide-react"
import { Service } from "@/data/api"
import Cookies from "js-cookie"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import Swal from "sweetalert2"

export function Formulario() {
  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState([])
  const [description, setDescription] = useState("")

  const handleSubmit = async () => {
    try {
      const cuestionario = await Service.post("/cuestionario/", {
        nombre: title,
        description: description,
        usuario: Cookies.get("user"),
      })

      if (cuestionario) {
        const preguntasData = questions.map((q) => ({
          cuestionario: cuestionario.id,
          texto: q.question,
          tipo: q.type,
          opciones: ["seleccion multiple", "casillas", "verdadero falso"].includes(q.type) ? q.options : {},
        }));
  
        await Service.post("/pregunta/", preguntasData );
        
        Swal.fire({
                    title: "Formulario guardado",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                })
      }
    } catch (error) {
      console.error("Error al guardar el formulario:", error)
    }
  }

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      type: "seleccion multiple",
      question: "",
      options: [""],
      required: false,
      points: 0,
      multipleAnswers: false,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id, field, value) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          if (field === "type") {
            // Reset options for new question types
            if (value === "verdadero falso") {
              return { ...q, [field]: value, options: ["Verdadero", "Falso"] }
            } else if (value === "respuesta corta" || value === "respuesta larga") {
              return { ...q, [field]: value, options: [] }
            }
          }
          return { ...q, [field]: value }
        }
        return q
      }),
    )
  }

  const addOption = (questionId) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, options: [...(q.options || []), ""] } : q)))
  }

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const copyQuestion = (question) => {
    const newQuestion = {
      ...question,
      id: Date.now().toString(),
    }
    setQuestions([...questions, newQuestion])
  }

  const moveQuestion = (index, direction) => {
    const newQuestions = [...questions]
    const [removed] = newQuestions.splice(index, 1)
    newQuestions.splice(index + direction, 0, removed)
    setQuestions(newQuestions)
  }

  const renderQuestionInput = (question) => {
    switch (question.type) {
      case "respuesta corta":
        return <Input disabled placeholder="Texto de respuesta corta" className="mt-2 bg-gray-100" />
      case "respuesta larga":
        return <Textarea disabled placeholder="Texto de respuesta larga" className="mt-2 bg-gray-100" />
      case "seleccion multiple":
        return (
          <RadioGroup className="space-y-2 mt-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={`option-${index}`} id={`option-${question.id}-${index}`} />
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...question.options]
                    newOptions[index] = e.target.value
                    updateQuestion(question.id, "options", newOptions)
                  }}
                  className="flex-1"
                  placeholder={`Opción ${index + 1}`}
                />
              </div>
            ))}
          </RadioGroup>
        )
      case "casillas":
        return (
          <div className="space-y-2 mt-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`checkbox-${question.id}-${index}`} />
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...question.options]
                    newOptions[index] = e.target.value
                    updateQuestion(question.id, "options", newOptions)
                  }}
                  className="flex-1"
                  placeholder={`Opción ${index + 1}`}
                />
              </div>
            ))}
          </div>
        )
      case "verdadero falso":
        return (
          <RadioGroup className="space-y-2 mt-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${question.id}-${index}`} />
                <Label htmlFor={`option-${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-gray-50 via-white to-white mt-6 rounded-xl p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Cuestionario sin título"
            className="text-3xl font-bold border-none bg-transparent focus:ring-0 px-0 text-gray-800 mb-2 w-full"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción del formulario"
            className="text-base font-normal border-none bg-transparent focus:ring-0 px-0 text-gray-600 w-full"
          />
        </div>

        {questions.map((question, index) => (
          <div
            key={question.id}
            className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 transition-colors"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-gray-500">{index + 1}.</span>
                <div className="flex-1">
                  <Input
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                    placeholder="Pregunta"
                    className="text-lg border-b rounded-lg px-0 focus:ring-0 bg-transparent"
                  />
                </div>
                <Select value={question.type} onValueChange={(value) => updateQuestion(question.id, "type", value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo de pregunta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="respuesta corta">Respuesta corta</SelectItem>
                    <SelectItem value="respuesta larga">Respuesta larga</SelectItem>
                    <SelectItem value="seleccion multiple">Selección múltiple</SelectItem>
                    <SelectItem value="casillas">Casillas</SelectItem>
                    <SelectItem value="verdadero falso">Verdadero/Falso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="ml-8 space-y-2">
                {renderQuestionInput(question)}
                {["seleccion multiple", "casillas"].includes(question.type) && (
                  <Button onClick={() => addOption(question.id)} variant="ghost" className="text-gray-600 pl-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar opción
                  </Button>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`required-${question.id}`}
                        checked={question.required}
                        onCheckedChange={(checked) => updateQuestion(question.id, "required", checked)}
                      />
                      <Label htmlFor={`required-${question.id}`} className="text-sm text-gray-600">
                        Obligatoria
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-purple-600"
                    onClick={() => copyQuestion(question)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-purple-600"
                    onClick={() => index > 0 && moveQuestion(index, -1)}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-purple-600"
                    onClick={() => index < questions.length - 1 && moveQuestion(index, 1)}
                    disabled={index === questions.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteQuestion(question.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          onClick={addQuestion}
          className="w-full py-6 bg-white border border-gray-200 hover:border-green-200 text-green-600 hover:bg-green-50 rounded-lg shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Agregar pregunta
        </Button>

        <Button
          onClick={handleSubmit}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white rounded-lg py-6"
        >
          Guardar cuestionario
        </Button>
      </div>
    </div>
  )
}

export default Formulario