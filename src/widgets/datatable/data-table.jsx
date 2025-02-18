import { useState, useEffect } from "react"
import DataTable from "react-data-table-component"
import CustomPagination from "./custom-pagination"

function DataTableComponent({ columns, data, title }) {
  const [searchText, setSearchText] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

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
    setCurrentPage(1) 
  }

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [filteredData, totalPages])

  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const customStyles = {
    table: {
      style: {
        backgroundColor: "#ffffff",
        borderRadius: "0.5rem",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f3f4f6",
        color: "#111827",
        fontWeight: "bold",
      },
    },
    rows: {
      style: {
        backgroundColor: "#ffffff",
        "&:hover": {
          backgroundColor: "#f9fafb",
        },
      },
    },
    pagination: {
      style: {
        backgroundColor: "#ffffff",
        color: "#374151",
      },
      pageButtonsStyle: {
        backgroundColor: "#f3f4f6",
        color: "#374151",
        "&:hover:not(:disabled)": {
          backgroundColor: "#e5e7eb",
        },
      },
    },
  }

  return (
    <div className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-6">
        <div className="mb-4 relative">
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
          data={paginatedData} 
          pagination
          paginationServer 
          paginationTotalRows={filteredData.length}
          customStyles={customStyles}
          highlightOnHover
          noDataComponent={<div className="p-4 text-center text-gray-500">No se encontraron resultados</div>}
          paginationComponent={() => (
            <CustomPagination
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              rowCount={filteredData.length}
              onChangePage={setCurrentPage}
            />
          )}
        />
      </div>
    </div>
  )
}

export default DataTableComponent
