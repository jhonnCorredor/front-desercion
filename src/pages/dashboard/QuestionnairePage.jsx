"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Service } from "@/data/api"
import { Users, ArrowLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import QuestionnaireForm from "./questionarie-form"
import { Button } from "@/components/ui/button"

export default function QuestionnairePage() {
  const [questionnaires, setQuestionnaires] = useState([])
  const [activeTab, setActiveTab] = useState("gallery")
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const response = await Service.get("/cuestionario/")
        setQuestionnaires(response)
      } catch (error) {
        console.error("Error fetching questionnaires:", error)
      }
    }

    fetchQuestionnaires()
  }, [])

  const handleCardClick = (id) => {
    setSelectedId(id)
    setActiveTab("form")
  }

  const handleBack = () => {
    setActiveTab("gallery")
    setSelectedId(null)
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-12 rounded-xl min-h-screen bg-gray-50">
      <TabsList className="hidden">
        <TabsTrigger value="gallery">Galería</TabsTrigger>
        <TabsTrigger value="form">Formulario</TabsTrigger>
      </TabsList>

      <TabsContent value="gallery" className="m-0 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Cuestionarios</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questionnaires.map((questionnaire) => (
              <Card
                key={questionnaire.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer border-0 bg-white/50 backdrop-blur-sm"
                onClick={() => handleCardClick(questionnaire.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{questionnaire.nombre}</h2>
                      <p className="text-gray-500 line-clamp-2 mb-4">{questionnaire.descripcion}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <span>Creado por SENA</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <ChevronRight className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="form" className="m-0 ">
        {selectedId && (
          <div className="bg-white min-h-screen rounded-xl">
            <div className="max-w-7xl mx-auto px-4">
              <Button variant="ghost" className="my-6 hover:bg-gray-100" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a cuestionarios
              </Button>
              <QuestionnaireForm questionnaireId={selectedId} />
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

