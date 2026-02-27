import CloseModalButton from "@/Components/CloseModalButton";
import GreenButton from "@/Components/GreenButton";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

function EditTextModal({ show, close, editElement, setLoading }) {
    const { data, setData, put, processing, errors } = useForm({
        content: ''
    });

    useEffect(() => {
        setData({
            content: editElement?.selected_text?.content,
        });
    }, [editElement]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        close();
        put(route("scheduled-post-texts.update-content", {scheduled_post_text: editElement?.selected_text?.id}), {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
    };
    return (
        <Modal show={show} closeable onClose={close}>
            <div className="p-6 relative">
                <CloseModalButton
                    className="absolute top-2 right-2"
                    close={close}
                />
                <h2 className="text-lg font-medium text-gray-900">
                    Editar publicación
                </h2>
                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor="content"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Escriba los cambios
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            rows="10"
                            value={data.content}
                            onChange={(e) =>
                                setData({
                                    content: e.target.value,
                                })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <GreenButton type="submit">Guardar cambios</GreenButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default EditTextModal;
