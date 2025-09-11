import CloseModalButton from "@/Components/CloseModalButton";
import GreenButton from "@/Components/GreenButton";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

function RegenerateTextModal({show, close, editElement, setLoading}) {

    const{data, setData, post} = useForm({
        content: '',
        network: '',
        changes: '',
    });


    useEffect(() => {
        setData({
            content: editElement?.selected_text?.content ?? "",
            network: editElement?.network ?? "",
            changes: editElement?.changes ?? "",
        });
    }, [editElement]);

    const handleSubmit = (e) => {
        setLoading(true);
        console.log(data);
        close();
        post(route("scheduled-posts.regenerate-text", {scheduled_post: editElement?.id}),{
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    return ( 
                    <Modal
                        show={show}
                        closeable
                        onClose={close}
                    >
                        <div className="p-6 relative">
                            <CloseModalButton
                                className="absolute top-2 right-2"
                                close={close}
                            />
                            <h2 className="text-lg font-medium text-gray-900">
                                Editar publicación programada para{" "}
                                {editElement?.network}
                            </h2>
                            <div className="mt-6 space-y-6">
                                
                                <div>
                                    <p>Contenido original</p>
                                    <p>{editElement?.selected_text?.content}</p>
                                </div>
                                <div>   
                                    <label
                                        htmlFor="content"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Contenido
                                    </label>
                                    <textarea
                                        id="content"
                                        name="content"
                                        rows="4"
                                        value={data?.changes}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                changes: e.target.value,
                                            })
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end">
                                    <GreenButton onClick={handleSubmit}>Regenerar</GreenButton>
                                </div>
                            </div>
                        </div>
                    </Modal>
    );
}

export default RegenerateTextModal;