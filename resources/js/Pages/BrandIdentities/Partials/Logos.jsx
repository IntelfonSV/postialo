import BlueButton from "@/Components/BlueButton";
import { router, useForm } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

function Logos({ logos }) {
    const { data, setData, post, processing, progress, errors, reset } =
        useForm({
            logo: null, // será un File
        });

    const [preview, setPreview] = useState(null);
    const fileRef = useRef(null);

    // Genera y limpia el ObjectURL del preview
    useEffect(() => {
        if (!data.logo) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(data.logo);
        setPreview(objectUrl);
        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [data.logo]);

    // Manejo del file input (en vez de handleChange genérico)
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setData("logo", null);
            return;
        }
        // Validación simple de tipo/tamaño (opcional)
        if (!file.type.startsWith("image/")) {
            alert("El archivo debe ser una imagen.");
            e.target.value = "";
            setData("logo", null);
            return;
        }
        // ej. límite de 2MB (ajusta a tu necesidad)
        const maxBytes = 2 * 1024 * 1024;
        if (file.size > maxBytes) {
            alert("El logo no debe superar 2MB.");
            e.target.value = "";
            setData("logo", null);
            return;
        }

        setData("logo", file); // Inertia enviará form-data
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("logos.store"));
        setData("logo", null);
        clearFile();
    };

    const clearFile = () => {
        setData("logo", null);
        if (fileRef.current) fileRef.current.value = "";
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, bórralo",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("logos.destroy", id));
                clearFile();
            }
        });
    };

    return (
        <div className="flex flex-col gap-4 border border-gray-300 p-4 rounded-lg bg-white mb-10">
            <div>
                {logos?.length > 0 ? (
                    <div className="flex flex-wrap gap-3 justify-center">
                        {logos.map((logo) => (
                            <div key={logo.id} className="relative">
                                <img
                                    src={"/storage/" + logo.image}
                                    alt="Logo"
                                    className="h-32 w-auto object-contain border rounded-md bg-gray-50 p-1"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDelete(logo.id)}
                                    className="absolute top-2 right-2 cursor-pointer text-red-600 hover:text-red-800"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No hay logos</p>
                )}
            </div>

            {logos?.length === 0 && (
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 w-full p-3 bg-white border border-gray-300 rounded-md"
                >
                    <label htmlFor="logo" className="font-medium">
                        Cargar logo
                    </label>

                    {/* Preview */}
                    {preview && (
                        <div className="flex items-center gap-3 justify-center">
                            <img
                                src={preview}
                                alt="Preview logo"
                                className="h-40 w-auto object-contain border rounded-md bg-gray-50 p-2"
                            />
                            <button
                                type="button"
                                onClick={clearFile}
                                className="text-sm text-red-600 hover:underline"
                            >
                                Quitar
                            </button>
                        </div>
                    )}

                    <input
                        id="logo"
                        ref={fileRef}
                        type="file"
                        name="logo"
                        accept="image/*"
                        className={
                            "rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100 disabled:text-gray-500 bg-gray-50"
                        }
                        placeholder="Logo"
                        // ❌ No usar value en file inputs
                        onChange={handleFileChange}
                    />

                    {/* Errores de servidor (si los hubiera) */}
                    {errors?.logo && (
                        <span className="text-sm text-red-600">
                            {errors.logo}
                        </span>
                    )}

                    {data.logo && (
                        <div className="flex justify-end">
                            <BlueButton type="submit" disabled={processing}>
                                {processing ? "Guardando..." : "Guardar"}
                            </BlueButton>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
}

export default Logos;
