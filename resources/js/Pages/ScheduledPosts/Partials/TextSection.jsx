import StatusHelper from "@/Helpers/StatusHelper";
import SelectTextModal from "../Partials/SelectTextModal";
import { useState } from "react";
import { FaCheck, FaEdit } from "react-icons/fa";
import { IoReloadCircleSharp } from "react-icons/io5";
import { BsChatRightTextFill } from "react-icons/bs";
import { router } from "@inertiajs/react";
import RegenerateTextModal from "../Partials/RegenerateTextModal";
import EditTextModal from "../Partials/EditTextModal";
import Swal from "sweetalert2";
import GreenButton from "@/Components/GreenButton";

function TextSection({ schedule, networks, setLoading }) {
    console.log(schedule);
    const { TranslateStatus, badge } = StatusHelper();
    const [regenerateElement, setRegenerateElement] = useState(null);
    const [showRegenerateTextModal, setShowRegenerateTextModal] =
        useState(false);
    const [selectTextElement, setSelectTextElement] = useState(null);
    const [showSelectTextModal, setShowSelectTextModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleApproveTexts = () => {
        Swal.fire({
            title: "Aprobar textos",
            text: "¿Estás seguro de aprobar los textos de esta publicación?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, aprobar",
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(
                    route("schedules.approve-texts", schedule.id),
                    { status: "approved" },
                    {
                        preserveScroll: true,
                    }
                );
            }
        });
    };

    const handleGenerate = (row) => {
        setRegenerateElement(row);
        setShowRegenerateTextModal(true);
    };

    const handleEdit = (row) => {
        setRegenerateElement(row);
        setShowEditModal(true);
    };

    const handleShowSelectTextModal = (row) => {
        setSelectTextElement(row);
        setShowSelectTextModal(true);
    };
    return (
        <div className="flex flex-col items-center w-full gap-2">
            {schedule.posts
                .filter((post) => {
                    return networks[post.network];
                })
                .map((row) => (
                    <div key={row.id} className="w-full">
                        <div className="flex items-center w-full gap-2 bg-gray-200 p-2 rounded-xl justify-between">
                            <div className="flex  items-center gap-2">
                                <span className={badge(row.network)}>
                                    {TranslateStatus(row.network)}
                                </span>
                                <span className={badge(row.status)}>
                                    {TranslateStatus(row.status)}
                                </span>
                            </div>
                            {row.status !== "approved" && (
                                <div className="flex flex-wrap justify-end  items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(row)}
                                        title="Editar"
                                        className="rounded-full p-1 bg-blue-50 hover:bg-blue-100 flex items-center gap-2 text-blue-500 lg:px-2"
                                    >
                                        <span className="hidden lg:block">
                                            Editar
                                        </span>
                                        <FaEdit className="w-6 h-6 text-blue-500" />
                                    </button>
                                    {row.texts.length < 3 && (
                                        <button
                                            className="rounded-full bg-purple-50 p-1 hover:bg-purple-100 flex items-center gap-2 text-purple-500 lg:px-2"
                                            onClick={() => handleGenerate(row)}
                                            title="Volver a generar"
                                        >
                                            <span className="hidden lg:block">
                                                Regenerar texto
                                            </span>
                                            <IoReloadCircleSharp className="w-6 h-6 text-purple-500" />
                                        </button>
                                    )}
                                    {row.texts.length > 1 && (
                                        <button
                                            onClick={() =>
                                                handleShowSelectTextModal(row)
                                            }
                                            title="Seleccionar texto"
                                            className="rounded-full bg-pink-50 p-1 hover:bg-pink-100 flex items-center gap-2 text-pink-500 lg:px-2"
                                        >
                                            <span className="hidden lg:block">
                                                Seleccionar texto
                                            </span>
                                            <BsChatRightTextFill className="w-5 h-5 text-pink-500" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="w-full">
                            <p className="whitespace-pre-line py-2 w-full">
                                {row.selected_text?.content}
                            </p>
                        </div>
                    </div>
                ))}
            {!schedule.posts.every((post) => post.status === "approved") && (
                <div>
                    <hr className="w-full mt-2 mb-2 border-gray-200 border-2" />

                    <div>
                        <GreenButton
                            onClick={() => handleApproveTexts(schedule)}
                            title="Aprobar Textos"
                            className="gap-4"
                        >
                            <FaCheck className="w-5 h-5" />
                            <span className="">Aprobar Textos</span>
                        </GreenButton>
                    </div>
                    <br />
                </div>
            )}

            <SelectTextModal
                show={showSelectTextModal}
                close={() => setShowSelectTextModal(false)}
                element={selectTextElement}
            />

            <RegenerateTextModal
                editElement={regenerateElement}
                show={showRegenerateTextModal}
                close={() => setShowRegenerateTextModal(false)}
                setLoading={setLoading}
            />

            <EditTextModal
                editElement={regenerateElement}
                show={showEditModal}
                close={() => setShowEditModal(false)}
                setLoading={setLoading}
            />
        </div>
    );
}

export default TextSection;
