import { useState, useEffect } from "react"
import DataTable from "react-data-table-component"

function DataTableComponent({ columns, data, title }) {
  const [searchText, setSearchText] = useState("")
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase()
    setSearchText(value)

    const filtered = data.filter((row) =>
      Object.values(row).some((field) => String(field).toLowerCase().includes(value)),
    )

    setFilteredData(filtered)
  }

  const customStyles = {
    table: {
        style: {
          backgroundColor: "#ffffff",
          borderRadius: "0.5rem",
          overflow: "hidden",
          border: "1px solid #e5e7eb", // Borde gris claro
        },
      },
      headRow: {
        style: {
          backgroundColor: "#f3f4f6", // bg-gray-100
          color: "#111827", // text-gray-900
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#f3f4f6", // bg-gray-100
          },
        },
      },
      rows: {
        style: {
          backgroundColor: "#ffffff", // Todas las filas blancas
          "&:hover": {
            backgroundColor: "#f9fafb", // Hover gris muy claro
          },
        },
      },
    pagination: {
      style: {
        backgroundColor: "#ffffff", // bg-white
        color: "#374151", // text-gray-700
      },
      pageButtonsStyle: {
        backgroundColor: "#f3f4f6", // bg-gray-100
        color: "#374151", // text-gray-700
        "&:hover:not(:disabled)": {
          backgroundColor: "#e5e7eb", // bg-gray-200
        },
      },
    },
  }

  return (
    <div className="w-full  mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-6">
        <div className="mb-4 relative">
          {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
          <input
            type="text"
            placeholder="Buscar..."
            value={searchText}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          customStyles={customStyles}
          noDataComponent={<div className="p-4 text-center text-gray-500">No se encontraron resultados</div>}
        />
      </div>
    </div>
  )
}

export default DataTableComponent

