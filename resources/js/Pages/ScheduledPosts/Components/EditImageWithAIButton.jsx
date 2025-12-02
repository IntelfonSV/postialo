import Modal from "@/Components/Modal";
import { router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { FaImage, FaTrash } from "react-icons/fa";
import { RiImageAddFill, RiImageAiFill } from "react-icons/ri";

function EditImageWithAIButton({ schedule, setLoading }) {
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, errors } = useForm({
        prompt: "",
        images: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setShowModal(false);
        post(route("schedules.edit-image", schedule.id), {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
                setData({
                    prompt: "",
                    images: [],
                });
            },
        });
    };
    return (
        <div>
            <button
                className="rounded-full flex gap-2 items-center p-1 text-blue-500 hover:bg-blue-100 mt-1 lg:px-2"
                title="Editar con IA"
                onClick={() => setShowModal(true)}
            >
                <RiImageAiFill className="w-6 h-6 text-blue-500" />
                <span className="hidden lg:block">Editar con IA</span>
            </button>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="flex items-center justify-center">
                    <form
                        onSubmit={handleSubmit}
                        action=""
                        className="w-full p-6 space-y-6"
                    >
                        <div>
                            <p>
                                <span className="text-xl font-bold text-gray-700">¿Quieres combinar imagenes?</span> <br />
                                Puedes agregar una o mas imagenes.
                            </p>
                            <p className="text-red-500">Maximo 3 imágenes</p>
                            <br />
                            <input
                                hidden
                                type="file"
                                name="images"
                                id="images"
                                onChange={(e) => e.target.files[0] &&
                                    setData({
                                        images: [
                                            ...data.images,
                                            e.target.files[0],
                                        ],
                                    })
                                }
                            />
                            <div className="flex flex-wrap gap-2 w-full">
                                <img className="h-32" src={schedule.image_source === 'api' ? schedule.selected_image.image_path : ("storage/"   +schedule.selected_image.image_path)} alt="" />
                                {Array.from(data.images).map((image, index) => (
                                    <div key={index} className="relative">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData({
                                                    images: data.images.filter(
                                                        (_, i) => i !== index,
                                                    ),
                                                })
                                            }
                                            className="absolute top-1 right-1 text-red-500 hover:text-red-800 cursor-pointer"
                                        >
                                            <FaTrash />
                                        </button>
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`image-${index}`}
                                            className="h-32 rounded-md"
                                        />
                                    </div>
                                ))}
                                <label
                                    htmlFor="images"
                                    className="w-32 h-32 flex justify-center items-center border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 text-blue-500 hover:text-blue-800"
                                >
                                    <RiImageAddFill className="w-12 h-12" />
                                </label>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="prompt"
                                className="text-sm font-medium text-gray-700"
                            >
                                <h3 className="text-xl font-bold">
                                    Prompt
                                    <span className="text-red-500">*</span>
                                </h3>
                                <br />
                                ¿Qué deseas cambiar en la imagen?
                            </label>
                            <textarea
                                name="prompt"
                                id="prompt"
                                rows={4}
                                value={data.prompt}
                                onChange={(e) =>
                                    setData({ ...data, prompt: e.target.value })
                                }
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

export default EditImageWithAIButton;
