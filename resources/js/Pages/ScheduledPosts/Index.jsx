import Card from "@/Components/Card";
import CloseModalButton from "@/Components/CloseModalButton";
import GrayContainer from "@/Components/GrayContainer";
import GreenButton from "@/Components/GreenButton";
import Modal from "@/Components/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { IoReloadCircleSharp } from "react-icons/io5";
import RegenerateImageModal from "./Partials/RegenerateImageModal";
import Loading from "@/Components/Loading";
import StatusHelper from "@/Helpers/StatusHelper";
import RegenerateTextModal from "./Partials/RegenerateTextModal";
import EditTextModal from "./Partials/EditTextModal";
import ImagePreview from "./Partials/ImagePreview";

function Index({ scheduledPosts, months }) {
    const { TranslateStatus, badge } = StatusHelper();

    console.log(scheduledPosts);
    

    const [posts, setPosts] = useState([]);
    const [networks, setNetworks] = useState({
        facebook: true,
        instagram: true,
        x: true,
    });

    const [selectedMonth, setselectedMonth] = useState(
        months.length > 0 ? months[0].month + "-" + months[0].year : ""
    );
    useEffect(() => {
        const posts_filtered = scheduledPosts.filter(
            (obj) =>
                obj.month == selectedMonth.split("-")[0] &&
                obj.year == selectedMonth.split("-")[1] &&
                ((obj.network == "facebook" && networks.facebook) ||
                    (obj.network == "instagram" && networks.instagram) ||
                    (obj.network == "x" && networks.x))
        );
        setPosts(posts_filtered);
    }, [selectedMonth, networks]);
    const [showRegenerateTextModal, setShowRegenerateTextModal] =
        useState(false);

    const [regenerateElement, setRegenerateElement] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [regenerateImageModal, setRegenerateImageModal] = useState(false);
    const [regenerateImageElement, setRegenerateImageElement] = useState(null);

    const handleApprove = (row) => {
        row.status = "approved";
        Swal.fire({
            title: "Aprobar publicación",
            text: "¿Estás seguro de aprobar esta publicación?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, aprobar",
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(route("scheduled-posts.update", row.id), row, {
                    preserveScroll: true,
                });
            }
        });
    };

    const handleMonthChange = (event) => {
        setselectedMonth(event.target.value);
    };

    const handleGenerate = (row) => {
        setRegenerateElement(row);
        setShowRegenerateTextModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleEdit = (row) => {
        setRegenerateElement(row);
        setShowEditModal(true);
    };

    const handleRegenerateImage = (row) => {
        setRegenerateImageElement(row);
        setRegenerateImageModal(true);
    };

    const [loading, setLoading] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Publicaciones Programadas" />
            <GrayContainer>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center w-full">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mes/Año
                        </label>
                        <select
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md max-w-28"
                            onChange={handleMonthChange}
                        >
                            {months.map((month) => (
                                <option
                                    key={month.month + " " + month.year}
                                    value={month.month + "-" + month.year}
                                >
                                    {month.month}/{month.year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <h3 className="text-xl font-semibold w-full text-blue-900 text-center">
                        Publicaciones Programadas
                    </h3>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 bg-white hover:bg-gray-100 p-2 rounded">
                            <label
                                className="block text-sm font-medium text-gray-700 hover:cursor-pointer"
                                htmlFor="facebook"
                            >
                                Facebook
                            </label>
                            <input
                                type="checkbox"
                                id="facebook"
                                name="facebook"
                                checked={networks.facebook}
                                onChange={(e) =>
                                    setNetworks({
                                        ...networks,
                                        facebook: e.target.checked,
                                    })
                                }
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 hover:cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-white hover:bg-gray-100 p-2 rounded">
                            <label
                                className="block text-sm font-medium text-gray-700 hover:cursor-pointer"
                                htmlFor="instagram"
                            >
                                Instagram
                            </label>
                            <input
                                type="checkbox"
                                id="instagram"
                                name="instagram"
                                checked={networks.instagram}
                                onChange={(e) =>
                                    setNetworks({
                                        ...networks,
                                        instagram: e.target.checked,
                                    })
                                }
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 hover:cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-white hover:bg-gray-100 p-2 rounded">
                            <label
                                className="block text-sm font-medium text-gray-700 hover:cursor-pointer"
                                htmlFor="x"
                            >
                                X
                            </label>
                            <input
                                type="checkbox"
                                id="x"
                                false
                                name="x"
                                checked={networks.x}
                                onChange={(e) =>
                                    setNetworks({
                                        ...networks,
                                        x: e.target.checked,
                                    })
                                }
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 hover:cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </GrayContainer>

            <br />

            <div className="grid grid-cols-1 gap-2 pb-10">
                {scheduledPosts.length > 0 ? (
                    scheduledPosts.map((obj) => (
                        <Card key={obj.id} className="border-gray-200 border">
                            <h3 className="text-lg font-semibold w-full text-blue-900">
                                {new Date(
                                    obj.scheduled_date
                                ).toLocaleDateString()}
                            </h3>

                            <div className="grid grid-cols-1 lg:flex gap-4">
                                <div className="w-full justify-center md:w-fit flex justify-center items-center flex-col">
                                    {/* <img
                                        className="w-84 h-84 object-cover rounded-xl"
                                        src={
                                            obj.image
                                                ? `storage/${obj.image}`
                                                : "storage/no_image.jpg"
                                        }
                                        alt=""
                                    /> */}
                                    <ImagePreview className="w-96 h-96 object-cover rounded-xl" templateHtml={obj.template.html_code} imageUrl={obj.image} />
                                    {obj.status != "approved" && (
                                    <button
                                        className="rounded-full p-1 hover:bg-blue-100 mt-1"
                                        onClick={() =>
                                            handleRegenerateImage(obj)
                                        }
                                        title="Volver a generar imagen"
                                    >
                                        <IoReloadCircleSharp className="w-7 h-7  text-blue-500" />
                                    </button>
                                    )}
                                </div>
                                <div className="flex flex-col items-center w-full gap-2">
                                    {obj.posts
                                        .filter((post) => {
                                            return networks[post.network];
                                        })
                                        .map((row) => (
                                            <div key={row.id} className="w-full">
                                                <div className="flex items-center w-full gap-2 bg-gray-200 p-2 rounded-xl justify-between">
                                                    <div className="flex  items-center gap-2">
                                                        <span
                                                            className={badge(
                                                                row.network
                                                            )}
                                                        >
                                                            {TranslateStatus(
                                                                row.network
                                                            )}
                                                        </span>
                                                        <span
                                                            className={badge(
                                                                row.status
                                                            )}
                                                        >
                                                            {TranslateStatus(
                                                                row.status
                                                            )}
                                                        </span>
                                                    </div>
                                                        { row.status !== "approved" &&
                                                    <div>

                                                            <button
                                                            onClick={() =>
                                                                handleApprove(
                                                                    row
                                                                )
                                                            }
                                                            title="Aprobar"
                                                            className="rounded-full p-1 hover:bg-green-100"
                                                        >
                                                            <FaCheck className="w-6 h-6 text-green-500" />
                                                        </button>
                                                        <button
                                                        onClick={() =>
                                                            handleEdit(row)
                                                            }
                                                            title="Editar"
                                                            className="rounded-full p-1 hover:bg-blue-100"
                                                            >
                                                            <FaEdit className="w-6 h-6 text-blue-500" />
                                                        </button>
                                                        <button
                                                            className="rounded-full hover:bg-purple-100"
                                                            onClick={() =>
                                                                handleGenerate(
                                                                    row
                                                                )
                                                            }
                                                            title="Volver a generar"
                                                            >
                                                            <IoReloadCircleSharp className="w-6 h-6 text-purple-500" />
                                                        </button>
                                                    </div>
                                                        }
                                                </div>
                                                <div className="w-full">
                                                    <p className="whitespace-pre-line py-2 w-full">
                                                        {row.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center justify-center items-center flex flex-col h-64 ">
                        <FaTimes className="w-10 h-10 text-red-400" />
                        <p>No hay publicaciones</p>
                    </div>
                )}
            </div>

            <RegenerateTextModal
                editElement={regenerateElement}
                show={showRegenerateTextModal}
                close={() => setShowRegenerateTextModal(false)}
                setLoading={setLoading}
            />

            <EditTextModal
                editElement={regenerateElement}
                show={showEditModal}
                close={() => setShowEditModal(false)}
                setLoading={setLoading}
            />

            <RegenerateImageModal
                schedule={regenerateImageElement}
                show={regenerateImageModal}
                handleCloseModal={() => setRegenerateImageModal(false)}
                setLoading={setLoading}
            />
            {loading && <Loading />}
        </AuthenticatedLayout>
    );
}

export default Index;
