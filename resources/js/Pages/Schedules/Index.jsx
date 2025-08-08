import React, { useState, useEffect } from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BlueButton from "@/Components/BlueButton";
import { FaCheck, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import Schedule from "./Partials/Schedule";
import GreenButton from "@/Components/GreenButton";
import { router, usePage } from "@inertiajs/react";

const Index = ({ schedules = [], templates = [] }) => {
    const [months, setMonths] = useState({});
    const [selectedMonth, setSelectedMonth] = useState("");
    const [newSchedule, setNewSchedule] = useState(false);
    const [selectedSchedules, setSelectedSchedules] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setSelectedSchedules(null);

        const months = schedules.reduce((acc, schedule) => {
            const month = schedule.month;
            const year = schedule.year;

            if (!acc[`${year}-${month}`]) {
                acc[`${year}-${month}`] = { posts: [] };
            }
            acc[`${year}-${month}`].posts.push(schedule);
            return acc;
        }, {});
        setMonths(months);
        setSelectedMonth(Object.keys(months)[0]);
    }, [schedules]);

    useEffect(() => {
        if (!selectedMonth) return;
        const year = parseInt(selectedMonth.split("-")[0]);
        const month = parseInt(selectedMonth.split("-")[1]);

        const schedulesMonth = schedules.filter(
            (schedule) => schedule.month == month && schedule.year == year
        );
        setSelectedSchedules(schedulesMonth);
    }, [months, selectedMonth]);

    const populateMonthSelect = () => {
        const sortedMonths = Object.keys(months).sort();
        return sortedMonths.map((month) => (
            <option key={month} value={month}>
                {formatMonth(month)}
            </option>
        ));
    };

    const handleNewMonth = async () => {
        const { value: month } = await Swal.fire({
            title: "Nuevo mes",
            input: "text",
            inputLabel: "Digite el mes en formato YYYY-MM",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "You need to write something!";
                }
            },
        });
        if (!month) return;

        if (!/^20\d{2}-(0[1-9]|1[0-2])$/.test(month)) {
            return Swal.fire({
                position: "center",
                icon: "warning",
                title: "Alerta",
                text: "Formato inválido. Use YYYY-MM.",
            });
        }

        if (months[month]) {
            return Swal.fire({
                position: "center",
                icon: "warning",
                title: "Alerta",
                text: "El mes ya existe.",
            });
        }

        // Actualizamos ambos estados en una sola llamada para evitar carreras de condiciones
        setMonths((prevMonths) => ({
            ...prevMonths,
            [month]: { posts: [] },
        }));
        setSelectedMonth(month);
    };

    const handleAddPost = () => {
        console.log(selectedMonth);
        if (!selectedMonth) return;
        const posts = months[selectedMonth]?.posts || [];
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

                router.post(route("schedules.generatePosts"), {
                    month: selectedMonth.split("-")[1],
                    year: selectedMonth.split("-")[0],
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        setLoading(false);
                    },
                    onError: () => {
                        setLoading(false);
                    },
                });
            }
        });
    };


    const handleGetImage = ()=>{

        fetch(route("freepik.getImage", {id: "95ad8e3e-4f23-49b6-9e09-ef0d506b94aa"}), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]'
                ).content,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    console.log("Imagen generada:", data.image);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    return (
        <AuthenticatedLayout>
            <div className="flex flex-wrap gap-2 justify-between items-end w-full space-x-4 bg-gray-200 shadow-gray-500 p-4 rounded-xl shadow-md border-gray-400 border">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Mes/Año
                    </label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {populateMonthSelect()}
                    </select>
                </div>

                <BlueButton onClick={handleNewMonth}>Nuevo Mes</BlueButton>

                <BlueButton onClick={handleGetImage}>Obtener Imagen</BlueButton>

                {selectedSchedules?.length < 14 && !newSchedule && (
                    <BlueButton className="flex gap-2" onClick={handleAddPost}>
                        <FaPlus /> Agregar Publicación
                    </BlueButton>
                )}
                {selectedSchedules?.length >= 5 && (
                    <GreenButton
                        className="flex gap-2"
                        onClick={handleGeneratePosts}
                    >
                        <FaCheck /> Generar Publicaciones
                    </GreenButton>
                )}
            </div>
            <div className="mt-4 space-y-4 pb-10">
                {selectedSchedules?.map((schedule, index) => (
                    <Schedule
                        key={index}
                        schedule={schedule}
                        templates={templates}
                        number={index + 1}
                    />
                ))}
                {newSchedule && (
                    <Schedule
                        setNewSchedule={setNewSchedule}
                        schedule={null}
                        templates={templates}
                        selectedMonth={selectedMonth}
                        number={selectedSchedules?.length + 1}
                    />
                )}

                <div className="flex justify-center items-center mt-4 w-full bg-gray-200 p-4 rounded-xl">
                    {selectedSchedules?.length < 14 && !newSchedule ? (
                        <BlueButton onClick={handleAddPost}>
                            Agregar Publicación
                        </BlueButton>
                    ) : (
                        <span className="text-gray-700">
                            No se pueden agregar más publicaciones
                        </span>
                    )}
                </div>
            </div>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

const formatMonth = (monthStr) => {
    if (!monthStr) return "";
    const [year, month] = monthStr.split("-");
    // Usamos el día 2 para evitar problemas de zona horaria en el cambio de mes
    const date = new Date(year, parseInt(month, 10) - 1, 2);
    return date.toLocaleString("es-ES", { month: "long", year: "numeric" });
};

export default Index;
