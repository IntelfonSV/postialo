import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import DataTable from "react-data-table-component";
import BlueButton from "@/Components/BlueButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Search from "@/Components/Search";
import { useState } from "react";

function Index({ users }) {
    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "80px",
        },
        { name: "Nombre", selector: (row) => row.name, sortable: true },
        { name: "Email", selector: (row) => row.email, sortable: true },
        {
            name: "Roles",
            selector: (row) =>
                row.roles ? row.roles.map((role) => role.name).join(", ") : "",
            sortable: true,
        },
        {name: "Suscripción", selector: (row) => row.hasActiveSubscription ? <span className="text-green-500">Activa</span> : row.hasActiveDemo ? <span className="text-yellow-500">Demo</span> : <span className="text-red-500">Inactiva</span>, sortable: true},
        {
            name: "Acciones",
            cell: (row) => (
                <Link href={route('users.edit', row.id)}>
                    <SecondaryButton>
                        Editar
                    </SecondaryButton>
                </Link>
            ),
            ignoreRowClick: true,
        },
    ];

    const [results, setResults] = useState(users);
    return (
        <AuthenticatedLayout>
            <Head title="Usuarios" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
                                    <p className="text-blue-100 text-sm mt-1">
                                        Administra todos los usuarios del sistema
                                    </p>
                                </div>
                                <Link href={route("users.create")}>
                                    <button className="px-4 py-2 bg-white text-blue-600 border-2 border-white hover:bg-blue-50 hover:border-blue-300 rounded-lg font-medium transition-colors duration-200">
                                        Crear Usuario
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6">
                            {/* Search Bar */}
                            <div className="mb-6">
                                <Search
                                    placeholder="Buscar usuario"
                                    datos={users}
                                    keys={["name", "email", "roles.name"]}
                                    setResultados={setResults}
                                />
                            </div>

                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                                    <div className="text-sm text-blue-800">Total Usuarios</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                    <div className="text-2xl font-bold text-green-600">
                                        {users.filter(u => u.hasActiveSubscription).length}
                                    </div>
                                    <div className="text-sm text-green-800">Suscripción Activa</div>
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {users.filter(u => u.hasActiveDemo).length}
                                    </div>
                                    <div className="text-sm text-yellow-800">Demo Activa</div>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                    <div className="text-2xl font-bold text-red-600">
                                        {users.filter(u => !u.hasActiveSubscription && !u.hasActiveDemo).length}
                                    </div>
                                    <div className="text-sm text-red-800">Inactivos</div>
                                </div>
                            </div>

                            {/* DataTable */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <DataTable
                                    columns={columns}
                                    data={results}
                                    onRowClicked={(row) => {
                                        router.get(route("users.show", row.id));
                                    }}
                                    pointerOnHover
                                    highlightOnHover
                                    pagination
                                    paginationPerPage={10}
                                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                    noDataComponent="No hay usuarios para mostrar"
                                    customStyles={{
                                        headCells: {
                                            style: {
                                                backgroundColor: '#f8fafc',
                                                fontWeight: '600',
                                                color: '#374151',
                                                border: '1px solid #e5e7eb',
                                                padding: '12px 16px',
                                            },
                                        },
                                        cells: {
                                            style: {
                                                border: '1px solid #e5e7eb',
                                                padding: '12px 16px',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Index;
