import React, { useState, useEffect } from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BlueButton from "@/Components/BlueButton";
import { FaCheck, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import Schedule from "./Partials/Schedule";
import GreenButton from "@/Components/GreenButton";
import { Head, router, usePage } from "@inertiajs/react";
import GrayContainer from "@/Components/GrayContainer";
import MonthYearSelect from "@/Components/MonthYearSelect";
import Loading from "@/Components/Loading";

const Index = ({ schedules = [], templates = [], months = [], auth, users }) => {
    const [monthsData, setMonthsData] = useState({});
    const [selectedMonth, setSelectedMonth] = useState("");
    const [newSchedule, setNewSchedule] = useState(false);
    const [selectedSchedules, setSelectedSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMonthYearSelect, setShowMonthYearSelect] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const params = new URLSearchParams(window.location.search);
    const urlUser = params.get("user");
    useEffect(() => {
        if(urlUser){
            setSelectedUser(users.find((user) => user.id == urlUser));
        }else{
            setSelectedUser(auth.user);
        }
    }, []);

    useEffect(() => {
        if(users?.length > 0 && selectedUser){
            //cambiar la url
            const params = new URLSearchParams(window.location.search);
            params.set("user", selectedUser.id);
            const newUrl = window.location.pathname + "?" + params.toString();
            window.history.pushState(null, "", newUrl);
        }
    }, [selectedUser]);
    
    useEffect(() => {
        if (months.length) {
            if (
                selectedMonth == "" ||
                !months.find(
                    (month) =>
                        month.month == selectedMonth.split("-")[1] &&
                        month.year == selectedMonth.split("-")[0]
                )
            ) {
                setSelectedMonth(months[0].year + "-" + months[0].month);
            }
        }
    }, [months]);

    useEffect(() => {
        if (selectedUser) {
            setSchedules(schedules.filter((schedule) => schedule.user_id == selectedUser.id));
        } else {
            setSchedules(schedules);
        }
    }, [schedules, selectedMonth, selectedUser]);

    const setSchedules = (schedules) => {
        setSelectedSchedules([]);
        const data = schedules.filter(
            (schedule) =>
                schedule.month == selectedMonth.split("-")[1] &&
                schedule.year == selectedMonth.split("-")[0]
        );
        setSelectedSchedules(data);
        setNewSchedule(false);
    };

    const populateMonthSelect = () => {
        const sortedMonths = months.map(
            (month) => month.year + "-" + month.month
        );
        return sortedMonths.map((month) => (
            <option key={month} value={month}>
                {formatMonth(month)}
            </option>
        ));
    };

    const handleNewMonth = async () => {
        setShowMonthYearSelect(true);
    };

    const handleMonthYearSelectClose = () => {
        setShowMonthYearSelect(false);
    };

    const handleAddPost = () => {
        if (!selectedMonth) return;
        const posts = monthsData[selectedMonth]?.posts || [];
        if (posts.length >= 14) return alert("Máximo 14 publicaciones");
        setNewSchedule(true);
    };

    const handleGeneratePosts = () => {
        Swal.fire({
            title: "Generar publicaciones",
            text: "¿Estás seguro de generar las publicaciones?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, generar",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);

                router.post(
                    route("schedules.generatePosts"),
                    {
                        month: selectedMonth.split("-")[1],
                        year: selectedMonth.split("-")[0],
                        schedules: auth.user.roles.includes("admin") ? selectedSchedules.map((schedule) => schedule.id) : null,
                    },
                    {
                        preserveScroll: true,
                        onSuccess: (page) => {
                            setLoading(false);
                            setSchedules(page.props.schedules);
                        },
                        onError: () => {
                            setLoading(false);
                        },
                    }
                );
            }
        });
    };

    useEffect(() => {
        console.log(selectedSchedules);
        console.log(selectedMonth);
    }, [selectedSchedules]);

    return (
        <AuthenticatedLayout>
            <Head title="Programación de publicaciones" />
            <GrayContainer>
                <div className="grid-cols-1 grid md:grid-cols-3 gap-2 items-center w-full">
                    <div className="flex gap-2 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Mes/Año
                            </label>
                            <select
                                value={selectedMonth}
                                onChange={(e) =>
                                    setSelectedMonth(e.target.value)
                                }
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                {populateMonthSelect()}
                            </select>
                        </div>
                        <BlueButton className="h-10" onClick={handleNewMonth}>
                            Nuevo Mes
                        </BlueButton>
                    </div>

                    <h3 className="text-xl font-semibold text-blue-900 text-center w-full">
                        Programación de publicaciones
                    </h3>

                    <div className="flex gap-2">
                        {selectedSchedules?.length < 14 && !newSchedule && (
                            <BlueButton
                                className="flex gap-2"
                                onClick={handleAddPost}
                            >
                                <FaPlus />{" "}
                                <p>
                                    Agregar{" "}
                                    <span className="hidden lg:inline">
                                        Publicación
                                    </span>
                                </p>
                            </BlueButton>
                        )}
                        {selectedSchedules?.length >= 1 &&
                            selectedSchedules.filter(
                                (schedule) => schedule.status != "generated"
                            ).length >= 1 && (
                                <GreenButton
                                    className="flex gap-2"
                                    onClick={handleGeneratePosts}
                                >
                                    <FaCheck />{" "}
                                    <p>
                                        Generar{" "}
                                        <span className="hidden lg:inline">
                                            Publicaciones
                                        </span>
                                    </p>
                                </GreenButton>
                            )}
                    </div>
                </div>
            </GrayContainer>
            {users && (
                <GrayContainer>
                    <div className="grid-cols-1 grid md:grid-cols-3 gap-2 items-center w-full">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Usuario
                            </label>
                            <select
                                value={selectedUser?.id}
                                onChange={(e) =>
                                    e.target.value == "" ? setSelectedUser(null) : setSelectedUser(users.find((user) => user.id == e.target.value))
                                }
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">Todos los usuarios</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </GrayContainer>
            )}
            <div className="mt-4 space-y-4 pb-10">
                {selectedSchedules &&
                    selectedSchedules?.map((schedule, index) => (
                        <Schedule
                            key={`schedule-${schedule.id}-${schedule.status}`}
                            schedule={schedule}
                            templates={templates}
                            number={index + 1}
                            user={schedule.user}
                        />
                    ))}
                {newSchedule && (
                    <Schedule
                        setNewSchedule={setNewSchedule}
                        schedule={null}
                        templates={templates}
                        selectedMonth={selectedMonth}
                        number={selectedSchedules?.length + 1}
                        user={selectedUser}
                    />
                )}

                <div className="mt-4 w-full bg-gray-200 gap-4 p-4 rounded-xl ">
                    <div className="flex justify-center items-center gap-4">
                        {selectedSchedules?.length < 14 && !newSchedule && (
                            <BlueButton onClick={handleAddPost}>
                                Agregar Publicación
                            </BlueButton>
                        )}

                        {selectedSchedules?.length >= 1 &&
                            selectedSchedules.filter(
                                (schedule) => schedule.status != "generated" && schedule.status != "cancelled"
                            ).length >= 1 && (
                                <GreenButton
                                    className="flex gap-2"
                                    onClick={handleGeneratePosts}
                                >
                                    <FaCheck />{" "}
                                    <p>
                                        Generar{" "}
                                        <span className="hidden lg:inline">
                                            Publicaciones
                                        </span>
                                    </p>
                                </GreenButton>
                            )}
                    </div >

                    {selectedSchedules?.length >= 14 && !newSchedule && (
                    <div className="flex justify-center items-center gap-4 mt-5">
                        <span className="text-gray-700">
                            No se pueden agregar más publicaciones
                        </span>
                    </div>
                    )}
                </div>
            </div>
            {loading && (
                <Loading
                    title="Generando contenido..."
                    message="Esto puede tomar unos minutos, por favor espera."
                />
            )}

            <MonthYearSelect
                show={showMonthYearSelect}
                close={handleMonthYearSelectClose}
                setSelected={setSelectedMonth}
                months={months}
            />
        </AuthenticatedLayout>
    );
};

const formatMonth = (monthStr) => {
    if (!monthStr) return "";
    const [year, month] = monthStr.split("-");
    // Usamos el día 2 para evitar problemas de zona horaria en el cambio de mes
    const date = new Date(year, parseInt(month, 10) - 1, 2);
    return (
        date
            .toLocaleString("es-ES", { month: "long", year: "numeric" })
            .charAt(0)
            .toUpperCase() +
        date
            .toLocaleString("es-ES", { month: "long", year: "numeric" })
            .slice(1)
    );
};

export default Index;
