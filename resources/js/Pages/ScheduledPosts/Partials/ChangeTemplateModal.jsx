import CloseModalButton from "@/Components/CloseModalButton";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

function ChangeTemplateModal({ templates, show, close, element, setLoading }) {
    const { data, setData, post, processing, errors } = useForm({
        template_id: element?.template_id,
    });

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        close();
        post(route("schedules.update-template", {schedule: element.id}), {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    const handleChangeTemplate = (e) => {
        setData({
            template_id:  e.target.value ? e.target.value : null,
        });
    };

    const handleClose = () => {
        close();
    };
    return (
        <Modal show={show} maxWidth="2xl">
            <div className="relative p-6">
                <CloseModalButton
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 transition-colors"
                    close={handleClose}
                />
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Selecciona una plantilla
                    </h2>
                    <form className="mt-4" onSubmit={handleSave}>
                        <select
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-colors"
                            value={data.template_id}
                            onChange={handleChangeTemplate}
                        >
                            <option value="">Sin plantilla</option>
                            {templates.map((template) => (
                                <option
                                    key={template.id}
                                    value={template.id}
                                    className="py-2"
                                    selected={template.id === element?.template_id}
                                >
                                    {template.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                                    processing
                                        ? "bg-blue-500 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                {processing ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}

export default ChangeTemplateModal;
