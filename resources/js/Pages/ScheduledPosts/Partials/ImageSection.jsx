import { IoReloadCircleSharp } from "react-icons/io5";
import ImagePreview from "../Partials/ImagePreview";
import { HiTemplate } from "react-icons/hi";
import { BsImages } from "react-icons/bs";
import { BsCheck } from "react-icons/bs";
import RegenerateImageModal from "../Partials/RegenerateImageModal";
import { useId, useState } from "react";
import ChangeTemplateModal from "../Partials/ChangeTemplateModal";
import SelectImageModal from "../Partials/SelectImageModal";
import GreenButton from "@/Components/GreenButton";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";
import { FaFileUpload, FaUpload } from "react-icons/fa";
import EditImageWithAIButton from "../Components/EditImageWithAIButton";

function ImageSection({
    schedule,
    setLoading,
    templates,
    brandIdentity,
    handleFileChange,
    preview,
}) {
    const [regenerateImageModal, setRegenerateImageModal] = useState(false);
    const [regenerateImageElement, setRegenerateImageElement] = useState(null);
    const [showChangeTemplateModal, setShowChangeTemplateModal] =
        useState(false);
    const [changeTemplateElement, setChangeTemplateElement] = useState(null);
    const [showSelectImageModal, setShowSelectImageModal] = useState(false);
    const [selectImageElement, setSelectImageElement] = useState(null);
    const handleRegenerateImage = (row) => {
        setRegenerateImageElement(row);
        setRegenerateImageModal(true);
    };

    const handleShowChangeTemplateModal = (row) => {
        setChangeTemplateElement(row);
        setShowChangeTemplateModal(true);
    };

    const handleShowSelectImageModal = (row) => {
        setSelectImageElement(row);
        setShowSelectImageModal(true);
    };

    const id = useId();

    const handleApproveImage = (row) => {
        // Verificar si la fecha de publicación es menor que la fecha actual
        const scheduledTime = new Date(schedule.scheduled_date);
        const currentTime = new Date();
        
        if (scheduledTime <= currentTime) {
            Swal.fire({
                title: "Fecha inválida",
                text: "No se puede aprobar una publicación cuya fecha de programación es menor o igual a la fecha actual.",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "Entendido",
            });
            return;
        }
        
        Swal.fire({
            title: "Aprobar imagen",
            text: "¿Estás seguro de aprobar la imagen de esta publicación?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, aprobar",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                router.put(
                    route("schedules.approve-image", { schedule: schedule.id }),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setLoading(false);
                        },
                        onError: () => {
                            setLoading(false);
                        },
                        onFinish: () => {
                            setLoading(false);
                        },
                    },
                );
            }
        });
    };

    return (
        <div className="w-full lg:w-fit flex justify-center items-center flex-col   mt-5">
            {schedule.selected_image.is_approved ? (
                <div className="w-80 h-80 sm:w-96 sm:h-96">
                    {preview ? (
                        <img
                            className="w-full h-full rounded-xl"
                            src={preview}
                            alt=""
                        />
                    ) : (
                        <img
                            className="w-full h-full rounded-xl"
                            src={
                                "storage/" +
                                schedule.selected_image.generated_image_path
                            }
                            alt=""
                        />
                    )}
                </div>
            ) : schedule.template ? (
                <ImagePreview
                    className="w-80 h-80 sm:w-96 sm:h-96 object-cover rounded-xl"
                    templateHtml={schedule.template.html_code}
                    imageUrl={
                        preview
                            ? preview
                            : `storage/${schedule.selected_image.image_path}`
                    }
                    whatsapp={brandIdentity?.whatsapp_number}
                    website={brandIdentity?.website}
                    logo={
                        brandIdentity?.logos[0]?.image
                            ? `storage/${brandIdentity?.logos[0]?.image}`
                            : null
                    }
                />
            ) : (
                <div className="w-80 h-80 sm:w-96 sm:h-96">
                    <img
                        className="w-full h-full rounded-xl"
                        src={`storage/${schedule.selected_image.image_path}`}
                        alt=""
                    />
                </div>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
                {schedule.status != "cancelled" &&
                    !schedule.selected_image.is_approved &&
                    schedule.status != "published" &&
                    schedule.images.length < 3 && (
                        <button
                            className="rounded-full p-1 hover:bg-purple-100 mt-1 lg:px-2 flex items-center gap-2 text-purple-500 hover:scale-105 transition-all duration-300"
                            onClick={() => handleRegenerateImage(schedule)}
                            title="Volver a generar imagen"
                        >
                            <IoReloadCircleSharp className="w-7 h-7  text-purple-500" />
                            <span className="hidden lg:block">Regenerar</span>
                        </button>
                    )}
                {schedule.status != "cancelled" &&
                    !schedule.selected_image.is_approved &&
                    schedule.status != "published" && (
                        <button
                            className="rounded-full flex items-center p-1 text-pink-500 hover:bg-pink-100 mt-1 lg:px-2 hover:scale-105 transition-all duration-300"
                            title="Cambiar plantilla"
                            onClick={() =>
                                handleShowChangeTemplateModal(schedule)
                            }
                        >
                            <HiTemplate className="w-7 h-7 text-pink-500" />
                            <span className="hidden lg:block">Plantillas</span>
                        </button>
                    )}

                {schedule.status != "cancelled" &&
                    !schedule.selected_image.is_approved &&
                    schedule.status != "published" && (
                        <label
                            htmlFor={id}
                            className="rounded-full flex items-center p-1 text-green-500 hover:bg-green-100 mt-1 lg:px-2 hover:scale-105 transition-all duration-300"
                        >
                            <FaUpload
                                title="Cargar imagen"
                                className="w-7 h-7"
                            />
                            <span className="hidden lg:block">
                                Cargar imagen
                            </span>
                        </label>
                    )}

                {schedule.images.length > 1 &&
                    schedule.status != "cancelled" &&
                    !schedule.selected_image.is_approved && (
                        <button
                            className="rounded-full flex gap-2 items-center p-1 text-blue-500 hover:bg-blue-100 mt-1 lg:px-2 hover:scale-105 transition-all duration-300"
                            title="Cambiar imagen de la publicación"
                            onClick={() => handleShowSelectImageModal(schedule)}
                        >
                            <BsImages className="w-6 h-6 text-blue-500" />
                            <span className="hidden lg:block">Imagenes</span>
                        </button>
                    )}

                {schedule.status != "cancelled" &&
                    !schedule.selected_image.is_approved && (
                        <EditImageWithAIButton
                            schedule={schedule}
                            setLoading={setLoading}
                        />
                    )}
            </div>
            <br />
            {!schedule.selected_image.is_approved &&
                schedule.status != "cancelled" && (
                    <GreenButton
                        title="Aprobar Imagen"
                        onClick={() => handleApproveImage(schedule)}
                        className="gap-4"
                    >
                        <BsCheck className="w-5 h-5" />
                        <span className="">Aprobar Imagen</span>
                    </GreenButton>
                )}
            <br />
            <RegenerateImageModal
                schedule={regenerateImageElement}
                show={regenerateImageModal}
                handleCloseModal={() => setRegenerateImageModal(false)}
                setLoading={setLoading}
            />

            <ChangeTemplateModal
                templates={templates}
                show={showChangeTemplateModal}
                close={() => setShowChangeTemplateModal(false)}
                setLoading={setLoading}
                element={changeTemplateElement}
                alt=""
            />
            <SelectImageModal
                show={showSelectImageModal}
                close={() => setShowSelectImageModal(false)}
                element={selectImageElement}
            />
            <input
                type="file"
                id={id}
                onChange={(e) => handleFileChange(e, schedule)}
                className="hidden"
            />
        </div>
    );
}

export default ImageSection;
