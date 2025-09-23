import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import DataTable from "react-data-table-component";
import BlueButton from "@/Components/BlueButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Search from "@/Components/Search";
import { useState } from "react";
import GrayContainer from "@/Components/GrayContainer";

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
            allowOverflow: true,
            button: true,
        },
    ];

    const [results, setResults] = useState(users);
    return (
        <AuthenticatedLayout
        >
            <Head title="Usuarios" />
            <GrayContainer>
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Usuarios</h2>
                <Link href={route("users.create")}>
                    <BlueButton>Crear Usuario</BlueButton>
                </Link>
            </GrayContainer>

            <div className="bg-gray-200 rounded-xl">
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <Search
                                    placeholder="Buscar usuario"
                                    datos={users}
                                    keys={["name", "email", "roles.name"]}
                                    setResultados={setResults}
                                />
                                <DataTable
                                    columns={columns}
                                    data={results}
                                    onRowClicked={(row) => {
                                        router.get(route("users.show", row.id));
                                    }}
                                    pointerOnHover
                                    highlightOnHover
                                    pagination
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
