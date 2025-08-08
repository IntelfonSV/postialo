import BlueButton from "@/Components/BlueButton";
import CloseModalButton from "@/Components/CloseModalButton";
import GreenButton from "@/Components/GreenButton";
import Modal from "@/Components/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { MdOutlineRefresh } from "react-icons/md";
import Swal from "sweetalert2";

function Index({ scheduledPosts, months }) {
    const badge = (status) => {
        switch (status) {
            case "draft":
                return "bg-yellow-100 text-yellow-800 rounded-full px-2 py-2";
            case "approved":
                return "bg-green-100 text-green-800 rounded-full px-2 py-2";
            case "published":
                return "bg-blue-100 text-blue-800 rounded-full px-2 py-2";
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

    const [selectedMonth, setselectedMonth] = useState(months.length > 0 ? months[0].month + "-" + months[0].year : "");
    useEffect(() => {
        const posts_filtered = scheduledPosts.filter(
            (obj) =>
                obj.schedule.month == selectedMonth.split("-")[0] &&
                obj.schedule.year == selectedMonth.split("-")[1] && 
                (
                (obj.network == "facebook" && networks.facebook) ||
                (obj.network == "instagram" && networks.instagram) ||
                (obj.network == "x" && networks.x)
            )
        );
        setPosts(posts_filtered);
    }, [selectedMonth, networks]);

    const columns = [
        {
            name: "#",
            width: "80px",
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: "Fecha",
            width: "100px",
            wrap: true,
            selector: (row) =>
                new Date(row.schedule.scheduled_date).toLocaleDateString(),
            sortable: true,
        },
        {
            name: "Red Social",
            width: "100px",
            wrap: true,
            selector: (row) => row.network,
            sortable: true,
        },
        {
            name: "Estado",
            width: "100px",
            wrap: true,
            selector: (row) => (
                <span className={badge(row.status)}>{row.status}</span>
            ),
            sortable: true,
        },
        {
            name: "Contenido",
            wrap: true,
            selector: (row) => row.content,
            sortable: true,
        },
        {
            name: "Imagen",
            wrap: true,
            selector: (row) => <img src={`storage/${row.schedule.image}`} alt="" />,
            sortable: true,
        },
        {
            name: "Acciones",
            selector: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleApprove(row)}
                        title="Aprobar"
                        className="rounded-full p-1 hover:bg-green-100"
                    >
                        <FaCheck className="w-5 h-5 text-green-500" />
                    </button>
                    <button
                        className="rounded-full p-1 hover:bg-yellow-100"
                        onClick={() => handleGenerate(row)}
                        title="Volver a generar"
                    >
                        <MdOutlineRefresh className="w-5 h-5 text-yellow-500" />
                    </button>
                </div>
            ),
            sortable: true,
        },
    ];

    const [regenerateElement, setRegenerateElement] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleApprove = (row) => {
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
                Swal.fire(
                    "Aprobado!",
                    "La publicación ha sido aprobada.",
                    "success"
                );
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

    return (
        <AuthenticatedLayout>
            <div className="flex flex-wrap gap-2 justify-between items-end w-full space-x-4 bg-white p-4 shadow sm:rounded-lg sm:p-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Mes/Año
                    </label>
                    <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                        <label className="block text-sm font-medium text-gray-700 hover:cursor-pointer" htmlFor="facebook">
                            Facebook
                        </label>
                        <input
                            type="checkbox"
                            id="facebook"
                            name="facebook"
                            checked={networks.facebook}
                            onChange={(e) => setNetworks({ ...networks, facebook: e.target.checked })}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 hover:cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                        <label className="block text-sm font-medium text-gray-700 hover:cursor-pointer" htmlFor="instagram">
                            Instagram
                        </label>
                        <input
                            type="checkbox"
                            id="instagram"
                            name="instagram"
                            checked={networks.instagram}
                            onChange={(e) => setNetworks({ ...networks, instagram: e.target.checked })}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 hover:cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                        <label className="block text-sm font-medium text-gray-700 hover:cursor-pointer" htmlFor="x">
                            X
                        </label>
                        <input
                            type="checkbox"
                            id="x"
                            name="x"
                            checked={networks.x}
                            onChange={(e) => setNetworks({ ...networks, x: e.target.checked })}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 hover:cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            <br />

            <div className="rounded-xl">
                <DataTable
                    columns={columns}
                    data={posts}
                    noDataComponent={
                        <div className="text-center justify-center items-center flex flex-col h-64 ">
                            <FaTimes className="w-10 h-10 text-red-400" />
                            <p>No hay publicaciones</p>
                        </div>
                    }
                />
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
        </AuthenticatedLayout>
    );
}

export default Index;
