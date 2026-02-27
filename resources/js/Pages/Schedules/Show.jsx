import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PostCard from "./Partials/PostCard";
import { useState } from "react";
import Loading from "@/Components/Loading";
import { router } from "@inertiajs/react";
import { FaArrowLeft, FaCalendarAlt, FaList } from "react-icons/fa";

function Show({ schedule, templates }) {
    const [networks, setNetworks] = useState({
        facebook: true,
        instagram: true,
    });
    const [loading, setLoading] = useState(false);
    return (
        <AuthenticatedLayout>
            <div className="space-y-4">
                {/* Botones de navegación */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FaArrowLeft className="w-4 h-4" />
                            <span>Volver</span>
                        </button> */}
                        
                        <div className="h-6 w-px bg-gray-300"></div>
                        
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.visit(route('schedules.calendar'))}
                                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Ver calendario"
                            >
                                <FaCalendarAlt className="w-4 h-4" />
                                <span className="hidden sm:inline">Calendario</span>
                            </button>
                            
                            <button
                                onClick={() => router.visit(route('schedules.index'))}
                                className="flex items-center gap-2 px-3 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                title="Mis publicaciones"
                            >
                                <FaList className="w-4 h-4" />
                                <span className="hidden sm:inline">Mis Publicaciones</span>
                            </button>
                        </div>
                    </div>
                </div>

                <PostCard
                    obj={schedule}
                    networks={networks}
                    handleCancel={() => {}}
                    handlePublishNow={() => {}}
                    setLoading={setLoading}
                    templates={templates}
                    brandIdentity={schedule.brandIdentity}
                />
            </div>

            {loading && (
                <Loading
                    title="Generando contenido..."
                    message="Esto puede tomar unos minutos, por favor espera."
                />
            )}
        </AuthenticatedLayout>
    );
}

export default Show;
