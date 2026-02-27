import CloseModalButton from "@/Components/CloseModalButton";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";

function SelectTextModal({ show, close, element }) {
    const { data, setData, put, reset, processing } = useForm({
        text_id: element?.selected_text?.id || null,
    });
    const selectedRef = useRef(null);

    useEffect(() => {
        if (element?.selected_text?.id) {
            setData({ text_id: element.selected_text.id });
            // Scroll to selected text after a small delay to ensure the DOM is updated
            const timer = setTimeout(() => {
                if (selectedRef.current) {
                    selectedRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [element, show]);



    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('scheduled-posts.update-text', element.id), {
            preserveScroll: true,
            onSuccess: () => {
                close();
            },
        });
    };

    return (
        <Modal show={show} onClose={close} className="max-w-2xl">
            <div className="p-6 w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Seleccionar texto
                    </h2>
                    <CloseModalButton close={close} className="text-gray-500 hover:text-gray-700" />
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {element?.texts?.map((text) => (
                                <label 
                                    key={text.id}
                                    ref={data.text_id == text.id ? selectedRef : null}
                                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${data.text_id == text.id 
                                        ? 'border-indigo-500 bg-indigo-50' 
                                        : 'border-gray-200 hover:border-indigo-300'}`}
                                >
                                    <div className="flex items-start">
                                        <input
                                            type="radio"
                                            name="text_id"
                                            value={text.id}
                                            checked={data.text_id == text.id}
                                            onChange={(e) => setData({ text_id: e.target.value })}
                                            className="mt-1 mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-gray-700 whitespace-pre-line">{text.content}</span>
                                    </div>
                                    {text.is_approved && (
                                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                            Aprobado
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={close}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={processing}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
                                disabled={processing || !data.text_id}
                            >
                                {processing ? 'Procesando...' : 'Seleccionar texto'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default SelectTextModal;