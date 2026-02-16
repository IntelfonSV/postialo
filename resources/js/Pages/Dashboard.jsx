import GrayContainer from "@/Components/GrayContainer";
import SmallCard from "@/Components/SmallCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { FaCalendarCheck, FaCheck } from "react-icons/fa";
import { MdOutlinePending } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { TbSum } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import { HiTemplate } from "react-icons/hi";
import { MdCancel } from "react-icons/md";
import TokenUsageChart from "@/Components/TokenUsageChart";

export default function Dashboard({
    users_count,
    schedules_count,
    schedules_pending,
    schedules_in_progress,
    schedules_generated,
    schedules_approved,
    schedules_published,
    templates_count,
    schedules_cancelled,
    activeDemo = null,
    tokenUsageByMonth = [],
}) {
    const user = usePage().props.auth.user;
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {
                activeDemo && 
                <div className="bg-red-500 text-white p-4 rounded-lg justify-center items-center flex w-full"> 
                    <p className="text-lg">Tu demo expira el {new Date(activeDemo.valid_until).toLocaleDateString()}</p>
                </div>
            }
            <GrayContainer>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {user.roles.includes("admin") && (
                        <SmallCard
                            title="Usuarios registrados"
                            value={users_count}
                            icon={
                                <FaUsers className="h-10 w-10 text-white"></FaUsers>
                            }
                        ></SmallCard>
                    )}
                    <SmallCard
                        title="Total de publicaciones"
                        bg="bg-gray-600"
                        value={schedules_count}
                        icon={<TbSum className="h-10 w-10 text-white"></TbSum>}
                    ></SmallCard>
                    <SmallCard
                        bg="bg-cyan-600"
                        title="Plantillas"
                        value={templates_count}
                        icon={<HiTemplate className="h-10 w-10 text-white"></HiTemplate>}
                    ></SmallCard>   
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
                    <SmallCard
                        title="Publicaciones canceladas"
                        bg="bg-red-500"
                        value={schedules_cancelled}
                        icon={
                            <MdCancel className="h-10 w-10 text-white" />
                        }
                    ></SmallCard>
                </div>
            </GrayContainer>
            
            {/* Gráfica de uso de tokens */}
            <div className="mt-6">
                <TokenUsageChart tokenUsageByMonth={tokenUsageByMonth} />
            </div>
        </AuthenticatedLayout>
    );
}
