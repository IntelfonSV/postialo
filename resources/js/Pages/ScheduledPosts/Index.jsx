import Card from "@/Components/Card";
import CloseModalButton from "@/Components/CloseModalButton";
import GrayContainer from "@/Components/GrayContainer";
import GreenButton from "@/Components/GreenButton";
import Modal from "@/Components/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { MdOutlineRefresh } from "react-icons/md";
import Swal from "sweetalert2";
import { IoReloadCircleSharp } from "react-icons/io5";

function Index({ scheduledPosts, months }) {
    const badge = (status) => {
        switch (status) {
            case "draft":
                return "bg-yellow-100 text-yellow-800 rounded-full px-2 py-2";
            case "approved":
                return "bg-green-100 text-green-800 rounded-full px-2 py-2";
            case "published":
                return "bg-blue-100 text-blue-800 rounded-full px-2 py-2";
            case "facebook":
                return "bg-blue-100 text-blue-800 rounded-full px-2 py-2";
            case "instagram":
                return "bg-pink-100 text-pink-800 rounded-full px-2 py-2";
            case "x":
                return "bg-cyan-100 text-cyan-800 rounded-full px-2 py-2";
            default:
                return "bg-gray-200 text-gray-800 rounded-full p-2";
        }
    };

    const [posts, setPosts] = useState([]);
    const [networks, setNetworks] = useState({
        facebook: true,
        instagram: true,
        x: true,
    });

    const customStyles = {
        rows: {
            style: {
                minHeight: "72px", // override the row height
            },
        },
        headCells: {
            style: {
                paddingLeft: "16px", // override the cell padding for head cells
                paddingRight: "16px",
            },
        },
        cells: {
            style: {
                margin: "0 0px",
                padding: "0 0px",
            },
        },
    };

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
    const [showEditModal, setShowEditModal] = useState(false);
    const handleCloseEditModal = () => setShowEditModal(false);

    const [editElement, setEditElement] = useState(null);

    const columns = [
        {
            name: "Contenido",
            wrap: true,
            selector: (row) => (
                <p className="whitespace-pre-line py-2">{row.content}</p>
            ),
            sortable: true,
        },
        {
            name: "Acciones",
            width: "150px",
            selector: (row) => (
                <div className="flex flex-col items-center w-full bg-gray-500 gap-2">
                    <span className={badge(row.network)}>{row.network}</span>
                    <span className={badge(row.status)}>{row.status}</span>
                    <div>
                        <button
                            onClick={() => handleApprove(row)}
                            title="Aprobar"
                            className="rounded-full p-1 hover:bg-green-100"
                        >
                            <FaCheck className="w-5 h-5 text-green-500" />
                        </button>
                        <button
                            onClick={() => handleEdit(row)}
                            title="Editar"
                            className="rounded-full p-1 hover:bg-blue-100"
                        >
                            <FaEdit className="w-5 h-5 text-blue-500" />
                        </button>
                        <button
                            className="rounded-full hover:bg-yellow-100"
                            onClick={() => handleGenerate(row)}
                            title="Volver a generar"
                        >
                            <IoReloadCircleSharp className="w-6 h-6 text-purple-500" />
                        </button>
                    </div>
                </div>
            ),
            sortable: true,
        },
    ];

    const [regenerateElement, setRegenerateElement] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
        setShowModal(true);
    };
    const handleCloseModal = () => setShowModal(false);

    const handleEditPost = (e) => {
        e.preventDefault();

        router.put(
            route("scheduled-posts.update", editElement.id),
            editElement,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowEditModal(false);
                },
                onError: () => {},
            }
        );
    };

    const handleEdit = (row) => {
        setEditElement(row);
        setShowEditModal(true);
    };

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

                            <div className="grid grid-cols-1 md:flex gap-4">
                                <div className="w-full justify-center md:w-fit flex justify-center items-center flex-col">
                                    <img
                                        className="w-64 h-64 object-cover rounded-xl"
                                        src={
                                            obj.image
                                                ? `storage/${obj.image}`
                                                : "storage/no_image.jpg"
                                        }
                                        alt=""
                                    />
                                    <button
                                        className="rounded-full p-1 hover:bg-blue-100 mt-1"
                                        onClick={() => handleGenerate(obj)}
                                        title="Volver a generar imagen"
                                    >
                                        <IoReloadCircleSharp className="w-7 h-7  text-blue-500" />
                                    </button>
                                </div>
                                <div className="flex flex-col items-center w-full bg-gray-500 gap-2">
                                    {obj.posts
                                        .filter((post) => {
                                            return networks[post.network];
                                        })
                                        .map((row) => (
                                            <div className="flex flex-col items-center w-full bg-gray-500 gap-2">
                                                <p className="whitespace-pre-line py-2">
                                                    {row.content}
                                                </p>
                                                <span
                                                    className={badge(
                                                        row.network
                                                    )}
                                                >
                                                    {row.network}
                                                </span>
                                                <span
                                                    className={badge(
                                                        row.status
                                                    )}
                                                >
                                                    {row.status}
                                                </span>
                                                <div>
                                                    <button
                                                        onClick={() =>
                                                            handleApprove(row)
                                                        }
                                                        title="Aprobar"
                                                        className="rounded-full p-1 hover:bg-green-100"
                                                    >
                                                        <FaCheck className="w-5 h-5 text-green-500" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(row)
                                                        }
                                                        title="Editar"
                                                        className="rounded-full p-1 hover:bg-blue-100"
                                                    >
                                                        <FaEdit className="w-5 h-5 text-blue-500" />
                                                    </button>
                                                    <button
                                                        className="rounded-full hover:bg-yellow-100"
                                                        onClick={() =>
                                                            handleGenerate(row)
                                                        }
                                                        title="Volver a generar"
                                                    >
                                                        <IoReloadCircleSharp className="w-6 h-6 text-purple-500" />
                                                    </button>
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

            <Modal show={showModal} closeable onClose={handleCloseModal}>
                <div className="p-6 relative">
                    <CloseModalButton
                        className="absolute top-2 right-2"
                        close={handleCloseModal}
                    />
                    <h2 className="text-lg font-medium text-gray-900">
                        Generar publicación
                    </h2>
                    <form className="mt-6 space-y-6">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Contenido actual de la publicación
                            </label>
                            <p className="mt-1 text-sm text-gray-600">
                                {regenerateElement?.content}
                            </p>
                        </div>
                        <div>
                            <label
                                htmlFor="content"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Describe los cambios
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                rows="4"
                                value={regenerateElement?.newContent}
                                onChange={(e) =>
                                    setRegenerateElement({
                                        ...regenerateElement,
                                        newContent: e.target.value,
                                    })
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <GreenButton>Generar</GreenButton>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal
                show={showEditModal}
                closeable
                onClose={handleCloseEditModal}
            >
                <div className="p-6 relative">
                    <CloseModalButton
                        className="absolute top-2 right-2"
                        close={handleCloseEditModal}
                    />
                    <h2 className="text-lg font-medium text-gray-900">
                        Editar publicación programada para{" "}
                        {editElement?.network}
                    </h2>
                    <form className="mt-6 space-y-6" onSubmit={handleEditPost}>
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
                                value={editElement?.content}
                                onChange={(e) =>
                                    setEditElement({
                                        ...editElement,
                                        content: e.target.value,
                                    })
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <GreenButton type="submit">Guardar</GreenButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}

export default Index;
