import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import CloseModalButton from "./CloseModalButton";
import BlueButton from "./BlueButton";
import DangerButton from "./DangerButton";
import Swal from "sweetalert2";

const MonthYearSelect = ({ close, show, setSelected, months }) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Enero = 0, por eso +1

    const [yearMonthsList, setYearMonthsList] = useState([]);

    // Generar años desde currentYear hasta currentYear + 2
    const generateYears = [];
    for (let y = currentYear; y <= currentYear + 2; y++) {
        generateYears.push(y);
    }

    // Generar meses desde currentMonth hasta 12
    const generateMonths = [];
    for (let m = currentMonth; m <= 12; m++) {
        generateMonths.push(m);
    }

    // Estado seleccionado
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);


    // Cuando cambias año, si cambia el año y el mes seleccionado ya no es válido, ajusta meses
    const availableMonths =
        selectedYear === currentYear
            ? generateMonths
            : Array.from({ length: 12 }, (_, i) => i + 1);


        const handleNewMonth = async () => {
            const month = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;

          console.log(month);
    
            if (months.find((m) => m.month == selectedMonth && m.year == selectedYear)) {
                return Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "Alerta",
                    text: "El mes ya existe.",
                });
            }
            months.push({ month: selectedMonth, year: selectedYear });
            setSelected(month);
            close();
        };
    
    
    
    

    return (
        <Modal show={show} onClose={close} closeable={true}>
            <CloseModalButton
                className="absolute top-2 right-2"
                close={close}
            />
            <div className="p-5">
                <h3 className="text-xl font-semibold w-full text-blue-900 text-center">
                    Nuevo mes
                </h3>
                <div className="flex justify-center items- center mt-4 w-full p-4 rounded-xl gap-4">
                    <div className="flex flex-col gap-2">
                        <label>Año:</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => {
                                const year = parseInt(e.target.value, 10);
                                setSelectedYear(year);

                                // Ajustar mes si cambia el año y el mes no está en el rango
                                if (
                                    year === currentYear &&
                                    selectedMonth < currentMonth
                                ) {
                                    setSelectedMonth(currentMonth);
                                }
                            }}
                        >
                            {generateYears.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Mes:</label>
                        <select
                            value={selectedMonth}
                            onChange={(e) =>
                                setSelectedMonth(parseInt(e.target.value, 10))
                            }
                        >
                            {generateMonths.map((m) => (
                                <option key={m} value={m}>
                                    {m.toString().padStart(2, "0")}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-start items-center mt-4 w-full p-4 rounded-xl gap-4">
                    <BlueButton
                        onClick={handleNewMonth}
                    >
                        Agregar
                    </BlueButton>
                    <DangerButton onClick={close}>Cancelar</DangerButton>
                </div>
            </div>
        </Modal>
    );
};

export default MonthYearSelect;
