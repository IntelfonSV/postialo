import Modal from "@/Components/Modal";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { RiImageAiFill } from "react-icons/ri";

function EditImageWithAIButton({ schedule, setLoading }) {
    const [showModal, setShowModal] = useState(false);
    const [prompt, setPrompt] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setShowModal(false);
        router.put(
            route("schedules.edit-image", { schedule: schedule.id }),
            { prompt: prompt },
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
                    setPrompt("");
                },
            },
        );
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
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
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
