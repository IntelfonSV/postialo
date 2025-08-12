import CloseModalButton from "@/Components/CloseModalButton";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

function RegenerateImageModal({ schedule, show = true, handleCloseModal = () => { }, setLoading = () => { } }) {
    const { data, setData, post, processing, errors } = useForm({});

    useEffect(() => {
        setData({
            prompt_image: schedule?.prompt_image,
            image: schedule?.image,
        });
    }, [schedule]);

    console.log(schedule);

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        handleCloseModal();
        post(route("schedules.regenerateImage", {schedule: schedule.id}), {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    }

    return (
        <Modal show={show} onClose={handleCloseModal}>
            <form className="p-6" onSubmit={onSubmit}>
                <CloseModalButton close ={handleCloseModal} className="absolute top-2 right-2" />
                <h2 className="text-lg font-medium text-gray-900 mb-4">Regenerar Imagen</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Prompt actual</label>
                    <p className="mt-1 text-sm text-gray-600 bg-gray-100 p-2 rounded-md">{schedule?.prompt_image}</p>
                </div>

                <div className="mb-4">
                    <label htmlFor="prompt_image" className="block text-sm font-medium text-gray-700">Prompt nuevo</label>
                    <textarea
                        id="prompt_image"
                        name="prompt_image"
                        value={data.prompt_image}
                        onChange={(e) => setData('prompt_image', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows={4}
                    />
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        disabled={processing}
                    >
                        Regenerar
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default RegenerateImageModal;