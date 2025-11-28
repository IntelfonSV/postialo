import StatusHelper from "@/Helpers/StatusHelper";
import { useEffect, useState } from "react";
import { FaCheck, FaCheckCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import ImageSection from "./ImageSection";
import TextSection from "./TextSection";
import ImagePreview from "./ImagePreview";
import { GiCancel } from "react-icons/gi";
import { router, useForm } from "@inertiajs/react";

function PostCard({
    obj,
    networks,
    handleCancel,
    handlePublishNow,
    setLoading,
    templates,
    brandIdentity,
}) {
    const { TranslateStatus, badge } = StatusHelper();
    const [preview, setPreview] = useState(null);
    const {data, setData, reset, post, processing} = useForm({
        image: null,
    });
    const handleFileChange = (e, schedule) => {
        console.log(e);
        const file = e.target.files?.[0];
        if (!file) {
            console.log("No file selected");
            setData({
                image: null,
            });
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

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setData({
            image: file,
        });
        console.log(objectUrl);
    };

    useEffect(() => {
        console.log(preview);
    }, [preview]);

    const handleAccept = () => {
        setLoading(true);
        post(route("schedules.upload-image", {schedule: obj.id}), {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
                setPreview(null);
                reset();
            },
            onError: (error) => {
                console.log(error);
                setLoading(false);
            },
        });
    };

    const handleReject = () => {
        setPreview(null);
        reset();      
        
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-black/50 w-full border-gray-200 border relative">
            <div
                className={
                    "flex items-center justify-between w-full mb-5 " +
                    badge(obj.status) +
                    " rounded-xl"
                }
            >
                <h3 className="text-lg font-semibold w-full text-blue-900">
                    {new Date(obj.scheduled_date.slice(0, 16)).toLocaleString()}
                </h3>

                <div className="flex items-center gap-2">
                    <span className={badge(obj.status)}>
                        {TranslateStatus(obj.status)}
                    </span>
                    {obj.status == "approved" && (
                        <button
                            className={
                                "ml-2 flex md:w-40 items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-xl"
                            }
                            onClick={() => handlePublishNow(obj)}
                        >
                            <FaCheckCircle className="w-5 h-5" />
                            <span className="hidden sm:block">
                                Publicar
                            </span>{" "}
                            <span className="hidden md:block">ahora</span>
                        </button>
                    )}
                    {obj.status != "cancelled" &&
                        obj.status != "rejected" &&
                        obj.status != "published" && (
                            <button
                                className={
                                    "ml-2 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-xl hover:scale-105 transition-all duration-300"
                                }
                                onClick={() => handleCancel(obj)}
                            >
                                <IoCloseSharp className="w-5 h-5" />
                                <span className="hidden sm:block">
                                    Cancelar
                                </span>{" "}
                                <span className="hidden md:block">
                                    publicación
                                </span>
                            </button>
                        )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:flex gap-4">
                {preview ? (
                    <div>
                        {obj.template ? (
                            <ImagePreview
                                templateHtml={obj.template.html_code}
                                imageUrl={preview}
                                whatsapp={brandIdentity?.whatsapp_number}
                                website={brandIdentity?.website}
                                logo={
                                    brandIdentity?.logos[0]?.image
                                        ? `storage/${brandIdentity?.logos[0]?.image}`
                                        : null
                                }
                            />
                        ) : (
                            <div className="flex-col w-full">
                                <img
                                    className="h-64 rounded-xl"
                                    src={preview}
                                    alt=""
                                />
                                <div className="flex mt-5 gap-4 justify-center w-full">
                                    <button className="text-green-500 hover:text-green-800 hover:scale-105 transition-all duration-300 grid justify-items-center items-center justify-center" title="Aceptar" onClick={handleAccept}>
                                        <FaCheck className="h-10 w-10 " /> <span className="hidden lg:block">Aceptar</span>
                                    </button>
                                    <button className="text-red-500 hover:text-red-800 hover:scale-105 transition-all duration-300 grid justify-items-center items-center justify-center" title="Cancelar" onClick={handleReject}>
                                        <GiCancel className="h-10 w-10 " /> <span className="hidden lg:block">Cancelar</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <ImageSection
                        key={obj.id + "-" + obj.template_id}
                        schedule={obj}
                        setLoading={setLoading}
                        templates={templates}
                        brandIdentity={brandIdentity}
                        handleFileChange={handleFileChange}
                        preview={preview}
                    />
                )}
                <TextSection
                    schedule={obj}
                    networks={networks}
                    setLoading={setLoading}
                />
            </div>
        </div>
    );
}

export default PostCard;
