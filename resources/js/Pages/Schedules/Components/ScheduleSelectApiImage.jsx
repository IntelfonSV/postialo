import Modal from "@/Components/Modal";
import { FaImage } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import CloseModalButton from "@/Components/CloseModalButton";

function ScheduleSelectApiImage({ images, setData, data, setPreview }) {
    const [show, setShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState(data?.image || null);

    const close = () => setShow(false);

    const handleRadioChange = (image) => {
        setSelectedImage(image);
    };

    const handleSave = () => {
        setData({ ...data, image: selectedImage, image_source: "api" });
        setPreview(selectedImage);
        close();
    };

    const handleCancel = () => {
        setSelectedImage(null);
        close();
    };

    return (
        <div>
            <button
                type="button"
                onClick={() => setShow(true)}
                className="text-blue-600 hover:text-blue-800 bg-gray-100 rounded-md p-2 hover:bg-gray-200 flex items-center gap-2 text-sm font-semibold w-fit"
            >
                <FaImage /> Seleccionar Imagen
            </button>

            <Modal show={show} onClose={close}>
                <CloseModalButton
                    close={close}
                    className="absolute top-2 right-2"
                />

                <div className="p-6 w-full">

                    <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
                        Seleccionar Imagen
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2">

                        {images.map((image, index) => (
                            <label
                                key={index}
                                htmlFor={`image-${index}`}
                                className={`relative border rounded-lg p-2 cursor-pointer 
                                hover:bg-gray-100 shadow-sm transition
                                ${selectedImage === image ? "ring-2 ring-blue-500" : ""}`}
                            >
                                <img
                                    src={image}
                                    alt=""
                                    className="w-full h-48 object-contain bg-white rounded"
                                />

                                {/* Radio */}
                                <input
                                    id={`image-${index}`}
                                    type="radio"
                                    name="image-select"
                                    value={image}
                                    checked={selectedImage === image}
                                    onChange={() => handleRadioChange(image)}
                                    className="absolute top-2 left-2 w-5 h-5"
                                />
                            </label>
                        ))}

                    </div>

                    {/* BOTONES */}
                    <div className="flex justify-end gap-3 mt-6">

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default ScheduleSelectApiImage;
