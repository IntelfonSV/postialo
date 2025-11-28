import { useForm, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import ScheduleDateInput from "../Components/ScheduleDateInput";
import ScheduleState from "../Components/ScheduleState";
import ScheduleTextArea from "../Components/ScheduleTextArea";
import ScheduleImage from "../Components/ScheduleImage";
import ScheduleNetworksInput from "../Components/ScheduleNetworksInput";
import ScheduleTemplatesSelect from "../Components/ScheduleTemplatesSelect";
import ScheduleButtons from "../Components/ScheduleButtons";
import ScheduleUserInfo from "../Components/ScheduleUserInfo";

function Schedule({
    schedule = null,
    templates,
    setNewSchedule = () => {},
    selectedMonth = "",
    number = null,
    user = null,
}) {
    const { auth } = usePage().props;

    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const { data, setData, post, put, reset, errors, processing } = useForm({
        id: schedule?.id || null,
        month: schedule?.month || selectedMonth.split("-")[1],
        year: schedule?.year || selectedMonth.split("-")[0],
        idea: schedule?.idea || "",
        objective: schedule?.objective || "",
        prompt_image: schedule?.prompt_image || "",
        image_source: schedule?.image_source || "generated",
        image: null,
        networks: schedule?.networks || ["facebook", "instagram"],
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
    const handleSave = () => {
        const isUpdate = Boolean(data.id);
        const hasFile = data.image instanceof File;

        // Si hay imagen y es actualización, usamos post() con _method=PUT
        if (isUpdate && hasFile) {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((v, i) => formData.append(`${key}[${i}]`, v));
                } else if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            post(route("schedules.update-image", data.id), formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setNewSchedule(false);
                    setEdit(false);
                    reset();
                    setPreview(null);
                },
                onError: (errors) => {
                    console.error(errors);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No se pudo guardar la publicación",
                    });
                },
            });
            return;
        }

        // Caso normal (sin archivo)
        const action = isUpdate ? put : post;
        const routeName = isUpdate
            ? route("schedules.update", data.id)
            : route("schedules.store");

        action(routeName, {
            preserveScroll: true,
            onSuccess: () => {
                setNewSchedule(false);
                setEdit(false);
                reset();
                setPreview(null);
            },
            onError: () =>
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo guardar la publicación",
                }),
        });
    };

    const handleCancel = () => {
        setEdit(false);
        reset();
        setNewSchedule(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg shadow-gray-800/50 p-2 md:p-4 space-y-2 border-gray-200 border">
            {/* -- Cabecera de la tarjeta -- */}
            <div className="flex flex-wrap gap-2 justify-between items-start bg-gray-200 p-5 rounded-xl">
                <ScheduleUserInfo number={number} user={user} />
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg flex-wrap">
                    <ScheduleDateInput
                        data={data}
                        setData={setData}
                        errors={errors}
                        disabled={disabled}
                        edit={edit}
                        selectedMonth={selectedMonth}
                    />

                    <ScheduleState status={data.status} />
                </div>
            </div>

            <div className="md:grid md:grid-cols-3 gap-2">
                {/* -- Contenido principal (Idea, Objetivo, Prompt) -- */}
                <div className="grid md:grid-cols-3 gap-2 md:col-span-2">
                    <ScheduleTextArea
                        value={data.idea}
                        onChange={(e) => setData("idea", e.target.value)}
                        edit={edit}
                        disabled={disabled}
                        error={errors.idea}
                        label="Idea"
                        rows="5"
                    />

                    <ScheduleTextArea
                        value={data.objective}
                        onChange={(e) => setData("objective", e.target.value)}
                        edit={edit}
                        disabled={disabled}
                        error={errors.objective}
                        label="Objetivo"
                        rows="5"
                    />

                    <ScheduleImage
                        data={data}
                        edit={edit}
                        disabled={disabled}
                        errors={errors}
                        setData={setData}
                        schedule={schedule}
                        images={[]}
                        setPreview={setPreview}
                        preview={preview}
                        fileInputRef={fileInputRef}
                    />
                    {/* 
                    <ScheduleTextArea
                        value={data.prompt_image}
                        onChange={(e) =>
                            setData("prompt_image", e.target.value)
                        }
                        edit={edit}
                        disabled={disabled}
                        error={errors.prompt_image}
                        label="Prompt Imagen"
                        rows="5"
                    /> */}
                </div>

                {/* -- Redes y Plantilla -- */}
                <div className="grid md:grid-cols-3 gap-2 border-t pt-2">
                    <ScheduleNetworksInput
                        data={data}
                        setData={setData}
                        errors={errors}
                        disabled={disabled}
                    />

                    <ScheduleTemplatesSelect
                        value={data.template_id}
                        onChange={(e) => setData("template_id", e.target.value)}
                        templates={templates}
                        disabled={disabled}
                    />
                </div>
            </div>

            <ScheduleButtons
                edit={edit}
                setEdit={setEdit}
                schedule={schedule}
                handleSave={handleSave}
                handleCancel={handleCancel}
                processing={processing}
            />
        </div>
    );
}

export default Schedule;
