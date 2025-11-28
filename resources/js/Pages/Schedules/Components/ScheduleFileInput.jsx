import { FaArrowRight } from "react-icons/fa";

function ScheduleFileInput({ fileInputRef, setData, setPreview, preview }) {
    // Imagen
    const handleImageUpload = () => {
        setData("image_source", "uploaded");
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setData("image", null);
            setData("image_source", "generated");
            setPreview(null);
            return;
        }

        if (!file.type.startsWith("image/")) {
            Swal.fire("Error", "El archivo debe ser una imagen.", "error");
            e.target.value = "";
            return;
        }

        const maxBytes = 2 * 1024 * 1024;
        if (file.size > maxBytes) {
            Swal.fire("Error", "La imagen no debe superar 2MB.", "error");
            e.target.value = "";
            return;
        }

        setData("image", file);
        setData("image_source", "uploaded");
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        console.log("Vista previa generada:", objectUrl);
    };

    return (
        <div>
            <button
                type="button"
                onClick={handleImageUpload}
                className="text-blue-600 hover:text-blue-800 bg-gray-100 rounded-md p-2 hover:bg-gray-200 flex items-center gap-2 text-sm font-semibold"
            >
                <FaArrowRight /> {preview ? "Cambiar" : "Subir"} Imagen
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
            />
        </div>
    );
}

export default ScheduleFileInput;
