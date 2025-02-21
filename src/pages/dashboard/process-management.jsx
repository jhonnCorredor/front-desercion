"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react"
import ProcessDetails from "@/widgets/pages/process-details"

const processes = [
  {
    id: "1234",
    title: "Invoice Approval #1234",
    department: "Finance",
    date: "10 min",
    avatar: "F",
  },
  {
    id: "5678",
    title: "Purchase Order #5678",
    department: "Procurement",
    date: "Sun, May 14",
    avatar: "P",
  },
  {
    id: "9012",
    title: "Contract Review #9012",
    department: "Legal",
    date: "Fri, May 12",
    avatar: "L",
  },
  {
    id: "3456",
    title: "Budget Request #3456",
    department: "Finance",
    date: "Thu, Apr 27",
    avatar: "F",
  },
  {
    id: "7890",
    title: "Vendor Onboarding #7890",
    department: "Procurement",
    date: "Wed, Apr 26",
    avatar: "P",
  },
]

export default function ProcessManagement() {
  const [selectedProcess, setSelectedProcess] = useState(processes[0])

  return (
    <div className="flex h-screen p-6 gap-6 mt-6 bg-gradient-to-br from-blue-gray-50 rounded-xl min-h-screen via-white to-white">
      {/* Sidebar - Add rounded corners and shadow */}
      <div className="w-80 bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-green-500 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-medium text-white">Recent Processes</h2>
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
              key={process.id}
              onClick={() => setSelectedProcess(process)}
              className={`w-full p-4 text-left flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                selectedProcess.id === process.id ? "bg-gray-50" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 text-sm">
                {process.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm truncate">{process.title}</h3>
                <p className="text-sm text-gray-500">{process.department}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{process.date}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Add rounded corners and shadow */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-green-500 flex items-center justify-between">
          <div className="flex items-center     -4">
            <h1 className="text-xl font-medium text-white">{selectedProcess.title}</h1>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4 text-white" />
          </Button>
        </div>
        <div className="p-6">
          <ProcessDetails />
        </div>
      </div>
    </div>
  )
}

