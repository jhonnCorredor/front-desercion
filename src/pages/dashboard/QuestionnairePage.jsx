"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Service } from "@/data/api"
import { Users, ArrowLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import QuestionnaireForm from "../../widgets/pages/questionarie-form"
import { Button } from "@/components/ui/button"
import Cookies from "js-cookie"
import Swal from "sweetalert2"

export default function QuestionnairePage() {
  const [questionnaires, setQuestionnaires] = useState([])
  const [activeTab, setActiveTab] = useState("gallery")
  const [selectedId, setSelectedId] = useState(null)

  const userId = Cookies.get("user");
  const aprendizId = Cookies.get("aprendiz")

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

  const handleCardClick = async (id) => {
    const result = await Swal.fire({
      title: "¿Realizar proceso?",
      text: "Está seguro de realizar este proceso.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33"
    });
  
    if (result.isConfirmed) {
      try {
        const dataProcess = {
          estado_aprobacion: "instructor",
          usuario_id: parseInt(userId),
          cuestionario_id: id,
          aprendiz: aprendizId
        };
  
        const process = await Service.post("/proceso/", dataProcess);
        
        setSelectedId(id);
        setActiveTab("form");
      } catch (error) {
        console.error("Error al realizar el proceso:", error);
        Swal.fire("Error", "Hubo un problema al realizar el proceso. \n"+ error.response.data.error );
      }
    }
  };
  

  const handleBack = () => {
    setActiveTab("gallery")
    setSelectedId(null)
  }

  const cancelProcess = () => {
    Cookies.remove("aprendiz")
    setTimeout(() => {
      window.location.href = "/dashboard/consultar"
    }, 100)
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full bg-gradient-to-br from-blue-gray-50 mt-6 rounded-xl min-h-screen via-white to-white">
      <TabsList className="hidden">
        <TabsTrigger value="gallery">Galería</TabsTrigger>
        <TabsTrigger value="form">Formulario</TabsTrigger>
      </TabsList>

      <TabsContent value="gallery" className="m-0 p-6">
        <div className="max-w-6xl mx-auto">
            <Button variant="ghost" className="mb-6 hover:bg-gray-100 h-12" onClick={cancelProcess}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancelar proceso
              </Button>
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
          <div className="bg-gradient-to-br from-blue-gray-50 mt-6 rounded-xl min-h-screen via-white to-white min-h-screen rounded-xl ">
            <div className="max-w-7xl mx-auto px-4">
              <Button variant="ghost" className="mt-6 hover:bg-gray-100 h-12" onClick={handleBack}>
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

