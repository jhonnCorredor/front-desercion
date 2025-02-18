import React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"

const CustomPagination = ({ currentPage, rowsPerPage, rowCount, onChangePage }) => {
  const totalPages = Math.ceil(rowCount / rowsPerPage)
  const maxButtons = 5
  const pageNumbers = []

  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
  let endPage = Math.min(totalPages, startPage + maxButtons - 1)

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onChangePage(page)
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      {/* Botón Anterior */}
      <button
        className={`px-3 py-3 rounded-md flex items-center justify-center ${
          currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {/* Botones de página */}
      {startPage > 1 && <span className="px-3 py-2">...</span>}
      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`px-4 py-2 rounded-md border ${
            currentPage === page ? "border-green-500 text-green-700 font-bold" : "border-gray-400 text-gray-700"
          } hover:bg-gray-100`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}
      {endPage < totalPages && <span className="px-3 py-2">...</span>}

      {/* Botón Siguiente */}
      <button
        className={`px-3 py-3 rounded-md flex items-center justify-center ${
          currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  )
}

export default CustomPagination
