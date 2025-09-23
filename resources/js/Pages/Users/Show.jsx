import GrayContainer from "@/Components/GrayContainer";
import SmallCard from "@/Components/SmallCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
    FaCalendarCheck,
    FaCalendarPlus,
    FaCheck,
    FaEdit,
    FaUsers,
} from "react-icons/fa";
import { MdOutlinePending } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";
import { TbSum } from "react-icons/tb";
import DeleteUserForm from "../Profile/Partials/DeleteUserForm";
import BackButton from "@/Components/BackButton";
import BlueButton from "@/Components/BlueButton";
import { HiTemplate } from "react-icons/hi";
import DataTable from "react-data-table-component";
import StatusHelper from "@/Helpers/StatusHelper";

function Show({
    auth,
    user,
    schedules_count,
    schedules_pending,
    schedules_in_progress,
    schedules_generated,
    schedules_approved,
    schedules_published,
    templates_count,
    payments,
    demo,
    hasActivePayment,
}) {
    console.log(payments);
    console.log(demo);
    const {TranslateStatus, badge} = StatusHelper();

    const activateDemo = () => {
        router.post(route("users.activate-demo", user.id));
    };
    return (
        <AuthenticatedLayout>
            <Head title="Detalles del Usuario" />

            <GrayContainer>
                <h2>Detalles del Usuario</h2>
                <BlueButton
                    className="flex gap-4"
                    onClick={() => router.get(route("users.edit", user.id))}
                >
                    <FaEdit className="h-5 w-5" />
                    Editar
                </BlueButton>
            </GrayContainer>
            <BackButton href={route("users.index")} />
            <div className="py-10">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex items-center space-x-6 w-full justify-center gap-4">
                                <img
                                    className="h-20 w-20 rounded-full"
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&color=7F9CF5&background=EBF4FF&size=128`}
                                    alt={`Avatar de ${user.name}`}
                                />
                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {user.name}
                                    </h3>
                                    <p className="mt-1 text-md text-gray-600 dark:text-gray-400">
                                        {user.email}
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 inline-block">
                                        {user.roles && user.roles.length > 0
                                            ? user.roles
                                                  .map((role) => role.name)
                                                  .join(", ")
                                            : "Sin roles asignados"}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                                        {new Date(
                                            user.created_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <GrayContainer className="mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                            <SmallCard
                                value={schedules_count}
                                title="Total de publicaciones"
                                icon={
                                    <TbSum className="h-10 w-10 text-white"></TbSum>
                                }
                            ></SmallCard>
                            <Link
                                href={
                                    route("templates.index") +
                                    "?user=" +
                                    user.id
                                }
                            >
                                <SmallCard
                                    title="Plantillas"
                                    bg="bg-cyan-600"
                                    value={templates_count}
                                    icon={
                                        <HiTemplate className="h-10 w-10 text-white"></HiTemplate>
                                    }
                                ></SmallCard>
                            </Link>
                            <SmallCard
                                title="Publicaciones pendientes"
                                bg="bg-orange-600"
                                value={schedules_pending}
                                icon={
                                    <MdOutlinePending className="h-10 w-10 text-white"></MdOutlinePending>
                                }
                            ></SmallCard>
                            <SmallCard
                                title="Publicaciones en progreso"
                                bg="bg-yellow-600"
                                value={schedules_in_progress}
                                icon={
                                    <AiOutlineLoading3Quarters className="h-10 w-10 text-white"></AiOutlineLoading3Quarters>
                                }
                            ></SmallCard>
                            <SmallCard
                                title="Publicaciones generadas"
                                bg="bg-pink-600"
                                value={schedules_generated}
                                icon={
                                    <RiAiGenerate2 className="h-10 w-10 text-white"></RiAiGenerate2>
                                }
                            ></SmallCard>
                            <SmallCard
                                title="Publicaciones aprobadas"
                                bg="bg-blue-600"
                                value={schedules_approved}
                                icon={
                                    <FaCheck className="h-10 w-10 text-white"></FaCheck>
                                }
                            ></SmallCard>
                            <SmallCard
                                title="Publicaciones publicadas"
                                bg="bg-green-600"
                                value={schedules_published}
                                icon={
                                    <FaCalendarCheck className="h-10 w-10 text-white" />
                                }
                            ></SmallCard>
                        </div>
                    </GrayContainer>
                    {!hasActivePayment && (
                        <GrayContainer>
                            {!demo ? (
                                <div className="flex justify-center w-full">
                                    <BlueButton
                                        className="flex gap-4"
                                        onClick={activateDemo}
                                    >
                                        <FaCalendarPlus className="h-5 w-5" />
                                        Activar mes de prueba
                                    </BlueButton>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        Demo activado
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                                        Vence el:
                                    </p>
                                    <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                                        {new Date(
                                            demo?.valid_until,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </GrayContainer>
                    )}
                    {payments.length > 0 && (
                        <GrayContainer>
                            <DataTable
                                columns={[
                                    { name: "ID", selector: row => row.id },
                                    { name: "Fecha", selector: row => new Date(row.charge_date).toLocaleDateString() },
                                    {name:'Descripción', selector: row => row.description},
                                    { name: "Monto", selector: row => row.amount },
                                    { name: "Estado", selector: row => <span className={badge(row.status.toLowerCase())}>{TranslateStatus(row.status.toLowerCase())}</span> },
                                ]}
                                data={payments}
                                fixedHeader
                                fixedHeaderScrollHeight="500px"
                            />
                        </GrayContainer>
                    )}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm user={user} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Show;