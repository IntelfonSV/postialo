import React, { useState, useEffect, useMemo, useRef } from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BlueButton from "@/Components/BlueButton";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import Schedule from "./Partials/Schedule";
import { Head, router } from "@inertiajs/react";
import GrayContainer from "@/Components/GrayContainer";
import MonthYearSelect from "@/Components/MonthYearSelect";
import Loading from "@/Components/Loading";
import GenerateButton from "./Components/GenerateButton";

const Index = ({
    schedules = [],
    templates = [],
    months = [],
    auth,
    users,
}) => {
    const [monthsData, setMonthsData] = useState({});
    const [selectedMonth, setSelectedMonth] = useState("");
    const [newSchedule, setNewSchedule] = useState(false);
    const [selectedSchedules, setSelectedSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMonthYearSelect, setShowMonthYearSelect] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const unlimitedPostsUsersId = [1, 2, 6, 8, 10];

    const params = new URLSearchParams(window.location.search);
    const urlUser = params.get("user");
    useEffect(() => {
        if (urlUser) {
            setSelectedUser(users.find((user) => user.id == urlUser));
        } else {
            setSelectedUser(auth.user);
        }
    }, []);

    const newScheduleRef = useRef(null);
    useEffect(() => {
        if (users?.length > 0 && selectedUser) {
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
                        month.year == selectedMonth.split("-")[0],
                )
            ) {
                setSelectedMonth(months[0].year + "-" + months[0].month);
            }
        }
    }, [months]);


    const filteredSchedules = useMemo(() => {
        const [year, month] = selectedMonth
            ? selectedMonth.split("-")
            : [null, null];
        return (schedules || [])
            .filter((s) => !selectedUser || s.user_id == selectedUser.id)
            .filter((s) =>
                month && year ? s.month == month && s.year == year : true,
            );
    }, [schedules, selectedMonth, selectedUser]);


    const populateMonthSelect = () => {
        const sortedMonths = months.map(
            (month) => month.year + "-" + month.month,
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
        setNewSchedule(true);
    };
    
    useEffect(() => {
        if (newSchedule && newScheduleRef.current) {
            requestAnimationFrame(() => {
                newScheduleRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            });
        }
    }, [newSchedule]);

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
                        schedules: auth.user.roles.includes("admin")
                            ? selectedSchedules.map((schedule) => schedule.id)
                            : null,
                    },
                    {
                        preserveScroll: true,
                        onSuccess: (page) => {
                            setLoading(false);

                        },
                        onError: () => {
                            setLoading(false);
                        },
                    },
                );
            }
        });
    };


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
                        {filteredSchedules?.length < 14 && !newSchedule && (
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
                        <GenerateButton schedules={filteredSchedules} onClick={handleGeneratePosts} />
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
                                    e.target.value == ""
                                        ? setSelectedUser(null)
                                        : setSelectedUser(
                                              users.find(
                                                  (user) =>
                                                      user.id == e.target.value,
                                              ),
                                          )
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
                {filteredSchedules &&
                    filteredSchedules
                        .filter(
                            (schedule) =>
                                schedule.status != "published" &&
                                schedule.status != "cancelled",
                        )
                        ?.map((schedule, index) => (
                            <Schedule
                                key={`schedule-${schedule.updated_at}`}
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

                <div
                    className="mt-4 w-full bg-gray-200 gap-4 p-4 rounded-xl"
                    ref={newScheduleRef}
                >
                    <div className="flex justify-center items-center gap-4">
                        {(unlimitedPostsUsersId.includes(auth.user.id) ||
                            filteredSchedules?.length < 14) &&
                            !newSchedule && (
                                <BlueButton onClick={handleAddPost}>
                                    Agregar Publicación
                                </BlueButton>
                            )}

                            <GenerateButton schedules={filteredSchedules} onClick={handleGeneratePosts} />
                    </div>

                    <div className="flex justify-center items-center gap-4 mt-5">
                        <span className="text-gray-700">
                            {unlimitedPostsUsersId.includes(auth.user.id)
                                ? filteredSchedules.length
                                : filteredSchedules.length + " / 14"}
                        </span>
                    </div>
                    {!unlimitedPostsUsersId.includes(auth.user.id) &&
                        filteredSchedules?.length >= 14 &&
                        !newSchedule && (
                            <div className="flex justify-center items-center gap-4 mt-2">
                                <span className="text-gray-700">
                                    No se pueden agregar más publicaciones para este mes
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
