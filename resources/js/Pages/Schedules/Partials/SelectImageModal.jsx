import CloseModalButton from "@/Components/CloseModalButton";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

function SelectImageModal({ element, show, close }) {
    const { data, setData, put, reset, processing } = useForm({
        image_id: null,
    });

    useEffect(() => {
        if (element?.selected_image?.id) {
            setData({ image_id: element?.selected_image?.id });
        }
    }, [element]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.image_id) {
            put(route("schedules.update-image", {schedule: element.id}), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    close();
                },
                onError: () => {
                    reset();
                },
                onFinish: () => {
                    reset();
                },
            });
        }
    };

    const handleRadioChange = (id) => {
        setData({ image_id: id });
    };

    return (
        <Modal show={show} onClose={close} className="">
            <CloseModalButton
                close={close}
                className="absolute top-2 right-2"
            />
            <div className="p-6 w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Seleccionar imagen
                    </h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 relative">
                        <div>
                            <div className="flex justify-center flex-wrap gap-4 overflow-y-auto h-[calc(100vh-300px)]">
                                {element?.images?.map((image) => (
                                    <div
                                        key={image.id}
                                        className="mb-4 w-48 h-48 sm:w-64 sm:h-64 md:w-64 md:h-64 relative"
                                    >
                                        <label htmlFor={`image-${image.id}`}>
                                            <img
                                                src={`/storage/${image.image_path}`}
                                                alt={image.name}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <input
                                                type="radio"
                                                name="image-select"
                                                className="w-5 h-5 cursor-pointer absolute top-2 right-2"
                                                id={`image-${image.id}`}
                                                checked={
                                                    data.image_id === image.id
                                                }
                                                onChange={(e) =>
                                                    handleRadioChange(image.id)
                                                }
                                            />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={close}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Seleccionar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default SelectImageModal;
