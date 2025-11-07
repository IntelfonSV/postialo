import BlueButton from "@/Components/BlueButton";
import DangerButton from "@/Components/DangerButton";
import { router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import StatusHelper from "@/Helpers/StatusHelper";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";

function Schedule({
    schedule = null,
    templates,
    setNewSchedule = () => {},
    selectedMonth = "",
    number = null,
    user = null,
}) {
    const { TranslateStatus, badge } = StatusHelper();
    const { auth } = usePage().props;

    console.log(usePage().props);

    const SOCIAL_NETWORKS = ["facebook", "instagram"];
    const { data, setData, post, put, reset, errors, processing } = useForm({
        id: schedule?.id || null,
        month: schedule?.month || selectedMonth.split("-")[1],
        year: schedule?.year || selectedMonth.split("-")[0],
        idea: schedule?.idea || "",
        objective: schedule?.objective || "",
        prompt_image: schedule?.prompt_image || "",
        networks: schedule?.networks || ['facebook', 'instagram'],
        user_id: user?.id || auth.user.id,
        template_id: schedule?.template_id || "",
        status: schedule?.status || "pending",
        scheduled_date: schedule?.scheduled_date
            ? schedule.scheduled_date.slice(0, 16)
            : "",
    });

    const [edit, setEdit] = useState(false);
    const [disabled, setDisabled] = useState(schedule?.id ? true : false);

    useEffect(() => {
        schedule?.id ? setDisabled(!edit) : setEdit(true);
    }, [edit]);

     const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");

    useEffect(() => {
        if (!selectedMonth) return;

        const [year, month] = selectedMonth.split("-").map(Number);
        setData("month", month);
        setData("year", year);

        // Día inicial del mes
        const firstDay = new Date(year, month - 1, 1);

        // Día final del mes
        const lastDay = new Date(year, month, 0);

        // Formateo correcto: YYYY-MM-DDTHH:mm
        const formatDateTime = (d, endOfDay = false) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            const hh = endOfDay ? "23" : "00";
            const mi = endOfDay ? "59" : "00";
            return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
        };

        setMinDate(formatDateTime(firstDay));
        setMaxDate(formatDateTime(lastDay, true));
    }, [selectedMonth]);


    const handleSave = () => {
        //valida que ningun campo este vacion individualmente
        let isValid = true;
        Object.keys(data).forEach((key) => {
            if (key !== "template_id") {
                if (data[key] === "") {
                    isValid = false;
                }
            }

            if (data[key] === 'networks' && data[key].length === 0) {
                isValid = false;
            }
        });
        if (!isValid) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Todos los campos con * son obligatorios",
            });
            return;
        }

        if (data.id) {
            put(route("schedules.update", data.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setEdit(false);
                    reset();
                },
            });
        } else {
            post(route("schedules.store"), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setNewSchedule(false);
                    reset();
                },
                onError: () => {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No se pudo guardar la publicación",
                    });
                },
            });
        }
    };

    const toggleNetwork = (network) => {
        setData((prev) => {
            const networks = prev.networks.includes(network)
                ? prev.networks.filter((n) => n !== network)
                : [...prev.networks, network];
            return { ...prev, networks };
        });
    };

    const handleEdit = () => {
        setEdit(true);
    };

    const handleCancel = () => {
        setEdit(false);
        reset();
        setNewSchedule(false);
    };

    const handleDelete = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, bórralo",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("schedules.destroy", schedule.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setNewSchedule(false);
                        reset();
                    },
                });
            }
        });
    };


    const handleCancelSchedule = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Al cancelar la publicación, se eliminará de la lista de publicaciones pendientes y no se publicará!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(route("schedules.cancel", schedule.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setNewSchedule(false);
                        reset();
                    },
                });
            }
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg shadow-gray-800/50 p-2 md:p-4 space-y-2 border-gray-200 border">
            {/* -- Cabecera de la tarjeta -- */}
            <div className="flex flex-wrap gap-2 justify-between items-start bg-gray-200 p-5 rounded-xl">
                <div>
                    <p className="font-bold text-lg text-gray-800">
                        Publicación #{" "}
                        <span className="font-normal text-gray-800">
                            {number}
                        </span>
                    </p>
                    {user ? (
                        <p className="font-bold text-lg text-gray-800 my-2 flex items-center gap-2">
                            Usuario:
                            <span className={badge("in_progress")}>
                                {user.name}
                            </span>
                        </p>
                    ) : (
                        <p className="font-bold text-lg text-gray-800 my-2 flex items-center gap-2">
                            Usuario:
                            <span className={badge("in_progress")}>
                                {auth.user.name}
                            </span>
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg flex-wrap">
                    <div>
                        <label className="block text-xs font-medium text-gray-500">
                            Fecha{" "}
                            {edit && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="datetime-local"
                            value={data.scheduled_date}
                            min={minDate}
                            max={maxDate}
                            onChange={(e) =>
                                setData("scheduled_date", e.target.value)
                            }
                            className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={disabled}
                        />
                        <div className="text-xs text-red-500">
                            {errors.scheduled_date}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">
                            Estado
                        </label>
                        <span className={badge(data.status)}>
                            {TranslateStatus(data.status)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="md:grid md:grid-cols-3 gap-2">
                {/* -- Contenido principal (Idea, Objetivo, Prompt) -- */}
                <div className="grid md:grid-cols-3 gap-2 md:col-span-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Idea{" "}
                            {edit && <span className="text-red-500">*</span>}
                        </label>
                        <textarea
                            value={data.idea}
                            onChange={(e) => setData("idea", e.target.value)}
                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            rows="5"
                            disabled={disabled}
                        />
                        <div className="text-xs text-red-500">
                            {errors.idea}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Objetivo{" "}
                            {edit && <span className="text-red-500">*</span>}
                        </label>
                        <textarea
                            value={data.objective}
                            onChange={(e) =>
                                setData("objective", e.target.value)
                            }
                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            rows="5"
                            disabled={disabled}
                        />
                        <div className="text-xs text-red-500">
                            {errors.objective}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prompt Imagen{" "}
                            {edit && <span className="text-red-500">*</span>}
                        </label>
                        <textarea
                            value={data.prompt_image}
                            onChange={(e) =>
                                setData("prompt_image", e.target.value)
                            }
                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            rows="5"
                            disabled={disabled}
                        />
                        <div className="text-xs text-red-500">
                            {errors.prompt_image}
                        </div>
                    </div>
                </div>

                {/* -- Redes y Plantilla -- */}
                <div className="grid md:grid-cols-3 gap-2 border-t pt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Redes Sociales
                        </label>
                        <div className="flex flex-col space-y-2">
                            {SOCIAL_NETWORKS.map((net) => (
                                <label
                                    key={net}
                                    className="flex items-center text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.networks.includes(net)}
                                        onChange={() => toggleNetwork(net)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        disabled={disabled}
                                    />
                                    <span className="ml-2 text-gray-700">
                                        {net === 'facebook' ? <FaFacebookSquare className="text-blue-600 text-3xl" /> : <FaInstagram className="text-pink-600 text-3xl" />}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <div className="text-xs text-red-500">
                            {errors.networks}
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Plantilla
                        </label>
                        <select
                            value={data.template_id}
                            onChange={(e) =>
                                setData("template_id", e.target.value)
                            }
                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={disabled}
                        >
                            <option value="">Sin plantilla</option>
                            {templates.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                        <div className="text-xs text-red-500">
                            {errors.template_id}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between w-full">
                <div className="flex gap-2">
                    {edit && schedule?.id ? (
                        <BlueButton
                            onClick={() => handleSave()}
                            disabled={processing}
                        >
                            {processing ? "Guardando..." : "Guardar Cambios"}
                        </BlueButton>
                    ) : !edit && schedule?.id ? (
                        <div>
                            { schedule.status === "pending" &&
                                 <BlueButton
                                    onClick={() => handleEdit()}
                                    disabled={processing}
                                >
                                    Editar
                                </BlueButton>
                            }
                        </div>
                    ) : (
                        <BlueButton
                            onClick={() => handleSave()}
                            disabled={processing}
                        >
                            {processing ? "Guardando..." : "Crear"}
                        </BlueButton>
                    )}

                    {(edit || !schedule?.id) && (
                        <DangerButton
                            onClick={() => handleCancel()}
                            disabled={processing}
                        >
                            Cancelar
                        </DangerButton>
                    )}
                </div>

                {schedule?.id && (
                    <div>
                        {schedule.status === "pending" ? (
                            <DangerButton
                                onClick={() => handleDelete()}
                                disabled={processing}
                            >
                                Eliminar
                            </DangerButton>
                        ) : schedule.status != "cancelled" ? (
                            <DangerButton
                                onClick={() => handleCancelSchedule()}
                                disabled={processing}
                            >
                                Cancelar publicación
                            </DangerButton>
                        ) : ''
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

export default Schedule;
