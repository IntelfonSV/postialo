import GrayContainer from "@/Components/GrayContainer";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Loading from "@/Components/Loading";
import ImageSection from "./Partials/ImageSection";
import TextSection from "./Partials/TextSection";
import StatusHelper from "@/Helpers/StatusHelper";
import { FaTimes } from "react-icons/fa";

function Index({ scheduledPosts, months, templates, users, auth }) {
    const { TranslateStatus, badge } = StatusHelper();
    const [posts, setPosts] = useState([]);
    const [networks, setNetworks] = useState({
        facebook: true,
        instagram: true,
        x: true,
    });

    const [selectedUser, setSelectedUser] = useState(auth.user);
    const [selectedMonth, setselectedMonth] = useState(
        months.length > 0 ? months[0].month + "-" + months[0].year : ""
    );
    useEffect(() => {
        const posts_filtered = scheduledPosts.filter(
            (obj) =>
                obj.month == selectedMonth.split("-")[0] &&
                obj.year == selectedMonth.split("-")[1] && 
                obj.user_id == selectedUser.id
        );
        console.log(posts_filtered);
        setPosts(posts_filtered);
    }, [scheduledPosts, selectedMonth, selectedUser]);

    const handleMonthChange = (event) => {
        setselectedMonth(event.target.value);
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
            {users?.length > 0 && auth.user.roles.includes("admin") && (
            <GrayContainer>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center w-full">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Usuario
                        </label>
                        <select
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            onChange={(e) => setSelectedUser(users.find((user) => user.id == e.target.value))}
                        >
                            {users.map((user) => (
                                <option
                                    key={user.id}
                                    value={user.id}
                                >
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </GrayContainer>
            )}
            <div className="flex flex-col gap-2 pb-10">
                {posts.length > 0 ? (
                    posts.map((obj) => (
                        <div
                            key={obj.id + "-" + obj.status}
                            className="py-12 px-3 md:p-6 bg-white rounded-2xl shadow-lg shadow-black/50 w-full border-gray-200 border relative"
                        >
                            <h3 className="text-lg font-semibold w-full text-blue-900">
                                {new Date(
                                    obj.scheduled_date
                                ).toLocaleDateString()}
                            </h3>

                            <div className="absolute top-3 right-2">
                                <span className={badge(obj.status)}>
                                    {TranslateStatus(obj.status)}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 lg:flex gap-4">
                                <ImageSection
                                    key={obj.id + "-" + obj.template_id}
                                    schedule={obj}
                                    setLoading={setLoading}
                                    templates={templates}
                                />
                                <TextSection
                                    schedule={obj}
                                    networks={networks}
                                    setLoading={setLoading}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center justify-center items-center flex flex-col h-64 ">
                        <FaTimes className="w-10 h-10 text-red-400" />
                        <p>No hay publicaciones</p>
                    </div>
                )}
            </div>

            {scheduledPosts.map((obj) => obj.status === "approved").length >
                0 && (
                <div className="flex justify-center w-full">
                    <button
                        onClick={() => {
                            router.post(route("schedules.send"));
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                        Enviar publicaciones
                    </button>
                </div>
            )}
<br /> <br />
            {loading && (
                <Loading
                    title="Generando contenido..."
                    message="Esto puede tomar unos minutos, por favor espera."
                />
            )}
        </AuthenticatedLayout>
    );
}

export default Index;
