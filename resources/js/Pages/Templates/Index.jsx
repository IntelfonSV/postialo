import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DefaultContainer from "@/Components/DefaultContainer";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import BlueButton from "@/Components/BlueButton";
import Card from "@/Components/Card";
import GreenButton from "@/Components/GreenButton";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import CloseModalButton from "@/Components/CloseModalButton";
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import GrayContainer from "@/Components/GrayContainer";
function Index({ templates = [] }) {
    const [items, setItems] = useState(templates);
    const [preview, setPreview] = useState(null);
    const user = usePage().props.auth.user;
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        setItems(templates);
    }, [templates]);

    const handleNew = async () => {
        if (items.length >= 3) {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "Alerta",
                text: "Máximo 3 plantillas permitidas",
            });
            return;
        }

        const { value: name } = await Swal.fire({
            title: "Nombre de la plantilla",
            input: "text",
            inputLabel: "Nombre de la plantilla",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "You need to write something!";
                }
            },
        });

        if (!name) return;

        const newTemplate = {
            name: name.trim(),
            html_code:
                "<!-- Ingrese su código HTML aquí -->\n<div>Ejemplo</div>",
            isNew: true,
        };

        setItems([...items, newTemplate]);
    };

    const handleChange = (index, value, field) => {
        setItems(
            items.map((tpl, i) =>
                i === index ? { ...tpl, [field]: value } : tpl
            )
        );
    };

    const handleSave = (tpl) => {
        if (tpl.id) {
            router.put(
                route("templates.update", tpl.id),
                {
                    name: tpl.name,
                    html_code: tpl.html_code,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setEditingId(null);
                    },
                }
            );
        } else {
            router.post(
                route("templates.store"),
                {
                    user_id: user.id,
                    name: tpl.name,
                    html_code: tpl.html_code,
                },
                {
                    preserveScroll: true,
                    onSuccess: (templates) => {
                        setEditingId(null);
                    },
                }
            );
        }
    };

    const handleDelete = (plantilla) => {
        Swal.fire({
            title: "Quieres eliminar la plantilla?",
            showDenyButton: true,
            confirmButtonText: "Eliminar",
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                if (plantilla.id) {
                    router.delete(route("templates.destroy", plantilla.id), {
                        onSuccess: () => {
                            setItems(
                                items.filter((tpl) => tpl.id !== plantilla.id)
                            );
                        },
                    });
                } else {
                    setItems(
                        items.filter((tpl) => tpl.uuid !== plantilla.uuid)
                    );
                }
            }
        });
    };

    const handlePreview = (tpl) => {
        setPreview(tpl);
    };

    const handleClosePreview = () => {
        setPreview(null);
    };

    return (
        <AuthenticatedLayout>
            <GrayContainer>
                <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-2 items-center">
                    <div></div>
                    <h3 className="text-xl font-semibold w-full text-blue-900 text-center">
                        Plantillas
                    </h3>
                    <BlueButton
                        onClick={handleNew}
                        className="flex items-center gap-2 hover:bg-gray-200 px-2 h-8 rounded w-fit"
                    >
                        <FaPlus /> Nueva plantilla
                    </BlueButton>
                </div>
            </GrayContainer>
            <DefaultContainer className="p-2 rounded-xl">
                <div className="w-full">
                    {items.length === 0 ? (
                        <Card>
                            <div className="text-center py-8">
                                <h4 className="text-xl font-bold text-gray-700 mb-2">
                                    No hay plantillas creadas
                                </h4>
                                <p className="text-gray-500">
                                    Cree su primera plantilla con el botón
                                    "Nueva Plantilla".
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {items.map((tpl, index) => (
                                <Card key={tpl.id}>
                                    <div className="template-header flex justify-between items-center">
                                        <div className="w-full">
                                            <div className="flex justify-between">
                                                {tpl.id === editingId ? (
                                                    <input
                                                        className="w-full h-8 rounded border border-gray-300"
                                                        type="text"
                                                        value={tpl.name}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                index,
                                                                e.target.value,
                                                                "name"
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <h4 className="font-bold text-lg">
                                                        {tpl.name}
                                                    </h4>
                                                )}
                                                {tpl.id &&
                                                    tpl.id !== editingId && (
                                                        <button
                                                            className="flex items-center gap-2 hover:bg-gray-200 px-2 h-8 rounded"
                                                            onClick={() =>
                                                                setEditingId(
                                                                    tpl.id
                                                                )
                                                            }
                                                        >
                                                            <FaEdit /> Editar
                                                        </button>
                                                    )}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {tpl.id}
                                            </div>
                                        </div>
                                    </div>
                                    <textarea
                                        className={
                                            "w-full border p-3 rounded-lg mt-4 " +
                                            (tpl.id && tpl.id !== editingId
                                                ? "bg-gray-200"
                                                : "bg-gray-100")
                                        }
                                        rows="6"
                                        value={tpl.html_code}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                e.target.value,
                                                "html_code"
                                            )
                                        }
                                        disabled={
                                            tpl.id
                                                ? !(tpl.id == editingId)
                                                : false
                                        }
                                    />
                                    <div className="flex justify-between gap-4 mt-4">
                                        <div className="flex gap-3">
                                            <BlueButton
                                                onClick={() =>
                                                    handlePreview(tpl)
                                                }
                                            >
                                                Preview
                                            </BlueButton>

                                            {(!tpl?.id ||
                                                tpl.id === editingId) && (
                                                <GreenButton
                                                    onClick={() =>
                                                        handleSave(tpl)
                                                    }
                                                >
                                                    Guardar
                                                </GreenButton>
                                            )}

                                            {tpl.id && editingId === tpl.id && (
                                                <DangerButton
                                                    onClick={() =>
                                                        setEditingId(null)
                                                    }
                                                >
                                                    Cancelar
                                                </DangerButton>
                                            )}
                                        </div>

                                        <DangerButton
                                            className="btn btn--outline btn--sm flex items-center gap-2"
                                            onClick={() => handleDelete(tpl)}
                                        >
                                            <FaTrash />
                                            {tpl.id ? "Eliminar" : "Cancelar"}
                                        </DangerButton>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DefaultContainer>
            {preview && (
                <Modal closeable show onClose={handleClosePreview}>
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h4 className="text-xl font-bold text-gray-800">
                            Vista Previa
                        </h4>
                        <CloseModalButton close={handleClosePreview} />
                    </div>
                    <iframe
                        srcDoc={preview.html_code}
                        className="w-full h-[600px]"
                    />
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}
export default Index;
