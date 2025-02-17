import { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react";
import DataTableComponent from "@/widgets/datatable/data-table";
import { Service } from "@/data/api";
import { CheckIcon } from "@heroicons/react/24/solid";

export function AccesUser() {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRole, setSelectedRole] = useState(""); 

  const fetchData = async () => {
    try {
      const response = await Service.get("/usuario/usuario_sin_rol/");
      setData(response || []);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      setData([]);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await Service.get("/rol/");
      setRoles(response || []);
    } catch (error) {
      console.error("Error al obtener los roles: ", error);
      setRoles([]);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchData();
  }, []);

  const handleAction = (row) => {
    setSelectedRow(row);
    setShowModal(true);
  };
  
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value); 
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const accesUser = async () => {
    try {
        const DataAcces = {
            estado: true,
            usuario_id: selectedRow.id,
            rol_id: selectedRole,
        }

        const response = await Service.post("/usuariorol/", DataAcces)
        alert("Usuario autorizado.")
        setSelectedRow(null)
        setSelectedRole("")
        await fetchData()
        handleCloseModal()
    } catch (error) {
        console.error("Error al autorizar el usuario: ", error)
    }
  }

  const columns = [
    {
      name: "id",
      selector: (row) => row.id,
      sortable: true,
      omit: true,
    },
    {
      name: "nombres",
      selector: (row) => row.nombres + " " + row.apellidos,
      sortable: true,
    },
    {
      name: "correo",
      selector: (row) => row.correo,
      sortable: true,
    },
    {
      name: "documento",
      selector: (row) => row.documento,
      sortable: true,
    },
    {
      name: "Acciones",
      selector: (row) => (
        <button
          onClick={() => handleAction(row)}
          style={{
            padding: "5px 10px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <CheckIcon className="w-5 h-5" />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <DataTableComponent columns={columns} data={data} title={"Acceso de usuarios"} />
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Autorizar usuario</h2>

            <div>
              <p>Asignar rol:</p>
              <select
                value={selectedRole}
                onChange={handleRoleChange}
                className="border p-2 rounded w-full"
              >
                <option value="" disabled>Seleccione un rol</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={accesUser}
                className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2"
              >
                Autorizar
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccesUser;
