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
}) {
    const user = usePage().props.auth.user;
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <GrayContainer>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {user.roles.includes("admin") && (
                        <SmallCard
                            title="Usuarios registrados"
                            value={users_count}
                            icon={
                                <FaUsers className="h-10 w-10 text-white"></FaUsers>
                            }
                            onClick={() => router.get(route("users.index"))}
                        ></SmallCard>
                    )}
                    <SmallCard
                        title="Total de publicaciones"
                        bg="bg-gray-600"
                        value={schedules_count}
                        icon={<TbSum className="h-10 w-10 text-white"></TbSum>}
                        onClick={() => router.get(route("schedules.index"))}
                    ></SmallCard>
                    <SmallCard
                        bg="bg-cyan-600"
                        title="Plantillas"
                        value={templates_count}
                        icon={<HiTemplate className="h-10 w-10 text-white"></HiTemplate>}
                        onClick={() => router.get(route("templates.index"))}
                    ></SmallCard>   
                    <SmallCard
                        title="Publicaciones pendientes"
                        bg="bg-orange-600"
                        value={schedules_pending}
                        icon={
                            <MdOutlinePending className="h-10 w-10 text-white"></MdOutlinePending>
                        }
                        onClick={() => router.get(route("schedules.index"))}
                    ></SmallCard>
                    <SmallCard
                        title="Publicaciones en progreso"
                        bg="bg-yellow-600"
                        value={schedules_in_progress}
                        icon={
                            <AiOutlineLoading3Quarters className="h-10 w-10 text-white"></AiOutlineLoading3Quarters>
                        }
                        onClick={() => router.get(route("schedules.index"))}
                    ></SmallCard>
                    <SmallCard
                        title="Publicaciones generadas"
                        bg="bg-pink-600"
                        value={schedules_generated}
                        icon={
                            <RiAiGenerate2 className="h-10 w-10 text-white"></RiAiGenerate2>
                        }
                        onClick={() => router.get(route("scheduled-posts.index"))}
                    ></SmallCard>
                    <SmallCard
                        title="Publicaciones aprobadas"
                        bg="bg-blue-600"
                        value={schedules_approved}
                        icon={
                            <FaCheck className="h-10 w-10 text-white"></FaCheck>
                        }
                        onClick={() => router.get(route("scheduled-posts.index"))}
                    ></SmallCard>
                    <SmallCard
                        title="Publicaciones publicadas"
                        bg="bg-green-600"
                        value={schedules_published}
                        icon={
                            <FaCalendarCheck className="h-10 w-10 text-white" />
                        }
                        onClick={() => router.get(route("scheduled-posts.index"))}
                    ></SmallCard>
                    <SmallCard
                        title="Publicaciones canceladas"
                        bg="bg-red-500"
                        value={schedules_cancelled}
                        icon={
                            <MdCancel className="h-10 w-10 text-white" />
                        }
                        onClick={() => router.get(route("scheduled-posts.index"))}
                    ></SmallCard>
                </div>
            </GrayContainer>
        </AuthenticatedLayout>
    );
}
