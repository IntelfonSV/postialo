import StatusHelper from "@/Helpers/StatusHelper";
import { useEffect, useState } from "react";
import { FaCheck, FaCheckCircle, FaEdit, FaSave } from "react-icons/fa";
import { IoCloseSharp, IoTrash } from "react-icons/io5";
import ImageSection from "./ImageSection";
import TextSection from "./TextSection";
import { GiCancel } from "react-icons/gi";
import { router, useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import ImagePreview from "./ImagePreview";


function PostCard({
    obj,
    networks,
    handleCancel,
    handlePublishNow,
    setLoading,
    templates,
    brandIdentity,
    publicacion
}) {
    const { TranslateStatus, badge } = StatusHelper();
    const [preview, setPreview] = useState(null);
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [newScheduledDate, setNewScheduledDate] = useState('');
    const user = usePage().props.auth.user;
    
    
    const {data, setData, reset, post, processing} = useForm({
        image: null,
    });
    const handleFileChange = (e, schedule) => {
        const file = e.target.files?.[0];
        if (!file) {
            setData({
                image: null,
            });
            setPreview(null);
            return;
        }

        if (!file.type.startsWith("image/")) {
            Swal.fire("Error", "El archivo debe ser una imagen.", "error");
            e.target.value = "";
            return;
        }

        const maxBytes = 2 * 1024 * 1024;
        if (file.size > maxBytes) {
            Swal.fire("Error", "La imagen no debe superar 2MB.", "error");
            e.target.value = "";
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setData({
            image: file,
        });
    };

    useEffect(() => {
    }, [preview]);

    const handleAccept = () => {
        setLoading(true);
        post(route("schedules.upload-image", {schedule: obj.id}), {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
                setPreview(null);
                reset();
            },
            onError: (error) => {
                setLoading(false);
            },
        });
    };

    const handleReject = () => {
        setPreview(null);
        reset();      
        
    };

    const handleDelete = (id) => {
        setLoading(true);
        router.delete(route("schedules.destroy", {schedule: id}), {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
            },
            onError: (error) => {
                setLoading(false);
            },
        });
    };

    const canEditDate = () => {
        // Parsear la fecha de forma más robusta
        let scheduledTime;
        if (obj.status == 'generated') {
            return true;
        }
        try {
            // Intentar parsear como ISO con zona horaria
            if (obj.scheduled_date.includes('T')) {
                scheduledTime = new Date(obj.scheduled_date);
            } else {
                // Si no tiene formato ISO, parsear como string normal
                scheduledTime = new Date(obj.scheduled_date);
            }
            
            // Si sigue siendo inválida, intentar con reemplazo
            if (isNaN(scheduledTime.getTime())) {
                // Reemplar espacios por T para formato ISO
                const cleanDate = obj.scheduled_date.replace(' ', 'T');
                scheduledTime = new Date(cleanDate);
            }
        } catch (e) {
            console.error('Error parsing date:', e);
            return false;
        }
        
        const currentTime = new Date();       
        if (isNaN(scheduledTime.getTime())) {
            console.error('Invalid scheduled time');
            return false;
        }
        
        const timeDiff = scheduledTime.getTime() - currentTime.getTime();
        const minutesDiff = timeDiff / (1000 * 60);
        return minutesDiff > 5 && obj.status !== 'published' && obj.status !== 'cancelled';
    };

    const handleEditDate = () => {
        setIsEditingDate(true);
        // Parsear la fecha de forma más robusta
        let date;
        try {
            date = new Date(obj.scheduled_date);
            
            // Si es inválida, intentar con reemplazo
            if (isNaN(date.getTime())) {
                const cleanDate = obj.scheduled_date.replace(' ', 'T');
                date = new Date(cleanDate);
            }
            
            // Si sigue siendo inválida, no permitir edición
            if (isNaN(date.getTime())) {
                console.error('Cannot parse date for editing');
                return;
            }
        } catch (e) {
            console.error('Error parsing date for editing:', e);
            return;
        }
        
        // Ajustar a la zona horaria local antes de formatear
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        const formattedDate = localDate.toISOString().slice(0, 16);
        setNewScheduledDate(formattedDate);
    };

    const handleSaveDate = () => {
        // Validar que la nueva fecha sea mayor que la fecha actual
        const newDate = new Date(newScheduledDate);
        const currentDate = new Date();
        
        if (newDate <= currentDate) {
            Swal.fire({
                title: "Fecha inválida",
                text: "La fecha de publicación debe ser mayor que la fecha actual.",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "Entendido",
            });
            return;
        }
        
        setLoading(true);
        router.put(route("schedules.update-date", {schedule: obj.id}), {
            scheduled_date: newScheduledDate,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
                setIsEditingDate(false);
            },
            onError: (error) => {
                setLoading(false);
            },
        });
    };

    const handleCancelEditDate = () => {
        setIsEditingDate(false);
        setNewScheduledDate('');
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-black/50 w-full border-gray-200 border relative">
            <div
                className={
                    "flex items-center justify-between w-full mb-5 " +
                    badge(obj.status) +
                    " rounded-xl"
                }
            >
                <div className="flex flex-wrap items-center gap-2">
                    {publicacion && (
                        <span className="text-sm font-medium text-gray-700">
                            Publicación # {publicacion}
                        </span>
                    )}
                    {isEditingDate ? (
                        <div className="flex flex-wrap items-center gap-2">
                            <input
                                type="datetime-local"
                                value={newScheduledDate}
                                onChange={(e) => setNewScheduledDate(e.target.value)}
                                className="px-2 py-1 border rounded text-sm"
                                min={new Date().toISOString().slice(0, 16)}
                            />
                            <button
                                className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded-xl text-sm"
                                onClick={handleSaveDate}
                                disabled={processing}
                            >
                                <FaSave className="w-4 h-4" />
                                <span className="hidden sm:block">Guardar</span>
                            </button>
                            <button
                                className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded-xl text-sm"
                                onClick={handleCancelEditDate}
                            >
                                <IoCloseSharp className="w-4 h-4" />
                                <span className="hidden sm:block">Cancelar</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-lg font-semibold w-full text-blue-900">
                                {(() => {
                                    try {
                                        const date = new Date(obj.scheduled_date);
                                        if (isNaN(date.getTime())) {
                                            return 'Fecha inválida';
                                        }
                                        return date.toLocaleString();
                                    } catch (e) {
                                        return 'Fecha inválida';
                                    }
                                })()}
                            </h3>
                            {canEditDate() && (
                                <button
                                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded-xl text-sm"
                                    onClick={handleEditDate}
                                    title="Editar fecha"
                                >
                                    <FaEdit className="w-4 h-4" />
                                    <span className="hidden sm:block">Editar</span>
                                </button>
                            )}
                        </>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className={badge(obj.status)}>
                        {TranslateStatus(obj.status)}
                    </span>
                    {obj.status == "approved" && (
                        <button
                            className={
                                "ml-2 flex md:w-40 items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-xl"
                            }
                            onClick={() => handlePublishNow(obj)}
                        >
                            <FaCheckCircle className="w-5 h-5" />
                            <span className="hidden sm:block">
                                Publicar
                            </span>{" "}
                            <span className="hidden md:block">ahora</span>
                        </button>
                    )}
                    {obj.status != "cancelled" &&
                        obj.status != "rejected" &&
                        obj.status != "published" && (
                            <button
                                className={
                                    "ml-2 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-xl hover:scale-105 transition-all duration-300"
                                }
                                onClick={() => handleCancel(obj)}
                            >
                                <IoCloseSharp className="w-5 h-5" />
                                <span className="hidden sm:block">
                                    Cancelar
                                </span>{" "}
                                <span className="hidden md:block">
                                    publicación
                                </span>
                            </button>
                        )}

                        {
                            user.roles.includes("admin") && (
                                //delete
                                <button
                                    className={
                                        "ml-2 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-xl hover:scale-105 transition-all duration-300"
                                    }
                                    onClick={() => handleDelete(obj.id)}
                                >
                                    <IoTrash className="w-5 h-5" />
                                    <span className="hidden sm:block">
                                        Eliminar
                                    </span>
                                </button>
                            )
                        }
                </div>
            </div>

            <div className="grid grid-cols-1 lg:flex gap-4">
                {preview ? (
                    <div>
                        {obj.template ? (
                            <ImagePreview
                                templateHtml={obj.template.html_code}
                                imageUrl={preview}
                                whatsapp={brandIdentity?.whatsapp_number}
                                website={brandIdentity?.website}
                                logo={
                                    brandIdentity?.logos[0]?.image
                                        ? `storage/${brandIdentity?.logos[0]?.image}`
                                        : null
                                }
                            />
                        ) : (
                            <div className="flex-col w-full">
                                <img
                                    className="h-64 rounded-xl"
                                    src={preview}
                                    alt=""
                                />
                                <div className="flex mt-5 gap-4 justify-center w-full">
                                    <button className="text-green-500 hover:text-green-800 hover:scale-105 transition-all duration-300 grid justify-items-center items-center justify-center" title="Aceptar" onClick={handleAccept}>
                                        <FaCheck className="h-10 w-10 " /> <span className="hidden lg:block">Aceptar</span>
                                    </button>
                                    <button className="text-red-500 hover:text-red-800 hover:scale-105 transition-all duration-300 grid justify-items-center items-center justify-center" title="Cancelar" onClick={handleReject}>
                                        <GiCancel className="h-10 w-10 " /> <span className="hidden lg:block">Cancelar</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <ImageSection
                        key={obj.id + "-" + obj.template_id}
                        schedule={obj}
                        setLoading={setLoading}
                        templates={templates}
                        brandIdentity={brandIdentity}
                        handleFileChange={handleFileChange}
                        preview={preview}
                    />
                )}
                <TextSection
                    schedule={obj}
                    networks={networks}
                    setLoading={setLoading}
                />
            </div>
        </div>
    );
}

export default PostCard;
