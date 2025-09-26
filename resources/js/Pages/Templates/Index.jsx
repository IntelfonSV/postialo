import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
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
import ImagePreview from "../ScheduledPosts/Partials/ImagePreview";
function Index({ templates = [], auth, users }) {
    const [items, setItems] = useState(templates);
    const [preview, setPreview] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const params = new URLSearchParams(window.location.search);
    const urlUser = params.get("user");
    useEffect(() => {
        if(users?.length > 0 && selectedUser){
            //cambiar la url
            const params = new URLSearchParams(window.location.search);
            params.set("user", selectedUser.id);
            const newUrl = window.location.pathname + "?" + params.toString();
            window.history.pushState(null, "", newUrl);
        }
    }, [selectedUser]);

    //variable desde la url user
    useEffect(() => {
        if(urlUser){
            setSelectedUser(users.find((user) => user.id == urlUser));
        }else{
            setSelectedUser(auth.user);
        }
    }, []);

    useEffect(() => {
        if(selectedUser){
            //setItems(templates.filter((tpl) => tpl.user_id == selectedUser.id));
        }
    }, [templates, users, selectedUser]);


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
                i === index ? { ...tpl, [field]: value } : tpl,
            ),
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
                },
            );
        } else {
            router.post(
                route("templates.store"),
                {
                    user_id: selectedUser.id,
                    name: tpl.name,
                    html_code: tpl.html_code,
                },
                {
                    preserveScroll: true,
                    onSuccess: (templates) => {
                        setEditingId(null);
                    },
                },
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
                                items.filter((tpl) => tpl.id !== plantilla.id),
                            );
                        },
                    });
                } else {
                    setItems(
                        items.filter((tpl) => tpl.uuid !== plantilla.uuid),
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
                    {auth.user.roles.includes("admin") && (
                        <BlueButton
                            onClick={handleNew}
                            className="flex items-center gap-2 hover:bg-gray-200 px-2 h-8 rounded w-fit"
                        >
                            <FaPlus /> Nueva plantilla
                        </BlueButton>
                    )}
                </div>
            </GrayContainer>
            {auth.user.roles.includes("admin") && (
                <GrayContainer>
                    <div className="grid grid-cols-1 md:grid-cols-3 items-center w-full">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Usuario
                            </label>
                            <select
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={selectedUser?.id}
                                onChange={(e) =>
                                    setSelectedUser(
                                        users.find(
                                            (user) => user.id == e.target.value,
                                        ),
                                    )
                                }
                            >
                                {users?.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </GrayContainer>
            )}

            <DefaultContainer className="p-2 rounded-xl">
                <div className="w-full">
                    {items.length === 0 && auth.user.roles.includes("admin") ? (
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
                    ) : items.length === 0 ? (
                        <Card>
                            <div className="text-center py-8">
                                <h4 className="text-xl font-bold text-gray-700 mb-2">
                                    Sin plantillas
                                </h4>
                                <p className="text-gray-500">
                                    No tienes plantillas creadas.
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <div
                            className={
                                auth.user.roles.includes("admin")
                                    ? "flex flex-col gap-6"
                                    : "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                            }
                        >
                            {items.map((tpl, index) => (
                                <Card key={tpl.id}>
                                    <div className="template-header flex justify-between items-center">
                                        <div className="w-full">
                                            <div className="flex justify-between">
                                                {tpl.id === editingId &&
                                                auth.user.roles.includes(
                                                    "admin",
                                                ) ? (
                                                    <input
                                                        className="w-full h-8 rounded border border-gray-300"
                                                        type="text"
                                                        value={tpl.name}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                index,
                                                                e.target.value,
                                                                "name",
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <h4 className="font-bold text-lg">
                                                        {tpl.name}
                                                    </h4>
                                                )}
                                                {tpl.id &&
                                                    auth.user.roles.includes(
                                                        "admin",
                                                    ) &&
                                                    tpl.id !== editingId && (
                                                        <button
                                                            className="flex items-center gap-2 hover:bg-gray-200 px-2 h-8 rounded"
                                                            onClick={() =>
                                                                setEditingId(
                                                                    tpl.id,
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
                                    <div className="flex justify-center">
                                        <ImagePreview
                                            imageUrl={
                                                "/images/template_image.jpg"
                                            }
                                            templateHtml={tpl.html_code}
                                            className="w-80 h-80 sm:w-96 sm:h-96 object-cover rounded-xl"
                                        />
                                    </div>

                                    {auth.user.roles.includes("admin") && (
                                        <div>
                                            <textarea
                                                className={
                                                    "w-full border p-3 rounded-lg mt-4 " +
                                                    (tpl.id &&
                                                    tpl.id !== editingId
                                                        ? "bg-gray-200"
                                                        : "bg-gray-100")
                                                }
                                                rows="6"
                                                value={tpl.html_code}
                                                onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        e.target.value,
                                                        "html_code",
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
                                                        tpl.id ===
                                                            editingId) && (
                                                        <GreenButton
                                                            onClick={() =>
                                                                handleSave(tpl)
                                                            }
                                                        >
                                                            Guardar
                                                        </GreenButton>
                                                    )}

                                                    {tpl.id &&
                                                        editingId ===
                                                            tpl.id && (
                                                            <DangerButton
                                                                onClick={() =>
                                                                    setEditingId(
                                                                        null,
                                                                    )
                                                                }
                                                            >
                                                                Cancelar
                                                            </DangerButton>
                                                        )}
                                                </div>

                                                <DangerButton
                                                    className="btn btn--outline btn--sm flex items-center gap-2"
                                                    onClick={() =>
                                                        handleDelete(tpl)
                                                    }
                                                >
                                                    <FaTrash />
                                                    {tpl.id
                                                        ? "Eliminar"
                                                        : "Cancelar"}
                                                </DangerButton>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DefaultContainer>
            {preview && (
                <Modal
                    className="w-full"
                    closeable
                    show
                    onClose={handleClosePreview}
                >
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h4 className="text-xl font-bold text-gray-800">
                            Vista Previa
                        </h4>
                        <CloseModalButton close={handleClosePreview} />
                    </div>
                    <div className="flex justify-center items-center h-[480px] md:h-[700px]">
                        <ImagePreview
                            imageUrl={"images/template_image.jpg"}
                            templateHtml={preview.html_code}
                            className="w-[480px] h-[480px] sm:w-[700px] sm:h-[700px] object-cover rounded-xl"
                        />
                    </div>
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}
export default Index;
