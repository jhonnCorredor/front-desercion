"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import ProcessDetails from "@/widgets/pages/process-details";
import { Service } from "@/data/api";

export default function ProcessManagement() {
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const approvedStatus = "instructor"; // Estado quemado, ajustar según se requiera

  useEffect(() => {
    async function fetchProcesses() {
      try {
        // Construimos la URL con el estado de aprobación
        const url = `proceso/data/?approved_status=${approvedStatus}`;
        // Suponiendo que Service.get retorna la data en formato JSON
        const data = await Service.get(url);
        setProcesses(data);
        if (data && data.length > 0) {
          setSelectedProcess(data[0]);
        }
      } catch (error) {
        console.error("Error al cargar los procesos:", error);
      }
    }
    fetchProcesses();
  }, [approvedStatus]);

  return (
    <div className="flex h-screen p-6 gap-6 mt-6 bg-gradient-to-br from-blue-gray-50 via-white to-white rounded-xl min-h-screen">
      {/* Sidebar: Lista de procesos */}
      <div className="w-80 bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-green-500 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-medium text-white">Procesos Recientes</h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-green-600">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-green-600">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {processes.map((process) => (
            <button
              key={process.proceso_id}
              onClick={() => setSelectedProcess(process)}
              className={`w-full p-4 text-left flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                selectedProcess && selectedProcess.proceso_id === process.proceso_id ? "bg-gray-50" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 text-sm">
                {process.nombres_usuario ? process.nombres_usuario[0] : "P"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm truncate">
                  {process.nombres_usuario} {process.apellidos_usuario}
                </h3>
                <p className="text-sm text-gray-500">{process.correo_usuario}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{process.proceso_id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Detalles del proceso seleccionado */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-green-500 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-medium text-white">
              {selectedProcess ? (selectedProcess.cuestionario_nombre || "Sin nombre de proceso") : "Selecciona un proceso"}
            </h1>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4 text-white" />
          </Button>
        </div>
        <ProcessDetails process={selectedProcess} />
      </div>
    </div>
  );
}