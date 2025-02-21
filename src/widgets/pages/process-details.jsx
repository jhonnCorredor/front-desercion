"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Play, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const ProcessDetails = () => {
  const [comment, setComment] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Comment submitted:", comment)
    setComment("") 
  }

  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Process Details</h2>
        <div className="space-x-2">
          <Button variant="outline" className="gap-2 text-gray-700">
            <X className="w-4 h-4" />
            Reject
          </Button>
          <Button variant="default" className="gap-2 bg-green-500 hover:bg-green-600">
            <Check className="w-4 h-4" />
            Approve
          </Button>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button variant="ghost" className="h-14 w-14 bg-gray-50 hover:bg-gray-100 rounded-lg font-normal">
          PDF
        </Button>
        <Button variant="ghost" className="h-14 w-14 bg-gray-50 hover:bg-gray-100 rounded-lg font-normal">
          DOC
        </Button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-center">
        <Button variant="ghost" className="rounded-full w-8 h-8 p-0 text-green-500">
          <Play className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Add Comment</h3>
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Type your comment here..."
            className="min-h-[120px] mb-4 bg-white"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button type="submit" className="bg-green-500 hover:bg-green-600">
            Submit Comment
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ProcessDetails

