import { IoReloadCircleSharp } from "react-icons/io5";
import ImagePreview from "../Partials/ImagePreview";
import { HiTemplate } from "react-icons/hi";
import { BsImages } from "react-icons/bs";
import { BsCheck } from "react-icons/bs";
import RegenerateImageModal from "../Partials/RegenerateImageModal";
import { useState } from "react";
import ChangeTemplateModal from "../Partials/ChangeTemplateModal";
import SelectImageModal from "../Partials/SelectImageModal";
import GreenButton from "@/Components/GreenButton";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";

function ImageSection({ schedule, setLoading, templates, brandIdentity }) {
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


    console.log(brandIdentity);
    const handleShowChangeTemplateModal = (row) => {
        setChangeTemplateElement(row);
        setShowChangeTemplateModal(true);
    };

    const handleShowSelectImageModal = (row) => {
        setSelectImageElement(row);
        setShowSelectImageModal(true);
    };

    const handleApproveImage = (row) => {
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
                router.put(route("schedules.approve-image", {schedule: schedule.id}),{}, {
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
                });

            }
        });
    };

    return (
        <div className="w-full lg:w-fit flex justify-center items-center flex-col   mt-5">
            {schedule.selected_image.is_approved ? (
                <div className="w-80 h-80 sm:w-96 sm:h-96">
                <img
                    className="w-full h-full rounded-xl"
                    src={'storage/' + schedule.selected_image.generated_image_path}
                    alt=""
                />
                </div>
            ):
             schedule.template ?

                <ImagePreview
                className="w-80 h-80 sm:w-96 sm:h-96 object-cover rounded-xl"
                templateHtml={schedule.template.html_code}
                imageUrl={`storage/${schedule.selected_image.image_path}`}
                whatsapp={brandIdentity?.whatsapp_number }
                website={brandIdentity?.website}
                logo={brandIdentity?.logos[0]?.image ? `storage/${brandIdentity?.logos[0]?.image}` : null}
            />: <div className="w-80 h-80 sm:w-96 sm:h-96">
            <img
                className="w-full h-full rounded-xl"
                src={`storage/${schedule.selected_image.image_path}`}
                alt=""
            />
            </div>
            }
            <div className="flex items-center gap-2 mt-2">
                { schedule.status != "cancelled" && !schedule.selected_image.is_approved && schedule.status != "published" &&
                    schedule.images.length < 3 && (
                        <button
                            className="rounded-full p-1 hover:bg-purple-100 mt-1 lg:px-2 flex items-center gap-2 text-purple-500"
                            onClick={() => handleRegenerateImage(schedule)}
                            title="Volver a generar imagen"
                        >
                            <IoReloadCircleSharp className="w-7 h-7  text-purple-500" />
                            <span className="hidden lg:block">Regenerar</span>
                        </button>

                    )}  
                    {schedule.status != "cancelled" && !schedule.selected_image.is_approved && schedule.status != "published" && (
                <button
                    className="rounded-full flex items-center p-1 text-pink-500 hover:bg-pink-100 mt-1 lg:px-2"
                    title="Cambiar plantilla"
                    onClick={() => handleShowChangeTemplateModal(schedule)}
                >
                    <HiTemplate className="w-7 h-7 text-pink-500" />
                    <span className="hidden lg:block">Plantillas</span>
                </button>
                )}
                {schedule.images.length > 1 && schedule.status != "cancelled" && !schedule.selected_image.is_approved && (
                    <button
                        className="rounded-full flex gap-2 items-center p-1 text-blue-500 hover:bg-blue-100 mt-1 lg:px-2"
                        title="Cambiar imagen de la publicación"
                        onClick={() => handleShowSelectImageModal(schedule)}
                    >
                        <BsImages className="w-6 h-6 text-blue-500" />
                        <span className="hidden lg:block">Imagenes</span>
                    </button>
                )}
            </div>
            <br />
            {!schedule.selected_image.is_approved && schedule.status != "cancelled" && (
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
            />
            <SelectImageModal
                show={showSelectImageModal}
                close={() => setShowSelectImageModal(false)}
                element={selectImageElement}
            />
        </div>
    );
}

export default ImageSection;
