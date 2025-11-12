import React, { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import CloseModalButton from "./CloseModalButton";
import BlueButton from "./BlueButton";
import DangerButton from "./DangerButton";
import Swal from "sweetalert2";

const MonthYearSelect = ({ close, show, setSelected, months }) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Enero = 0, por eso +1

  // Años disponibles (ajusta el rango a tu necesidad)
  const years = useMemo(() => {
    const out = [];
    for (let y = currentYear; y <= currentYear + 2; y++) out.push(y);
    return out;
  }, [currentYear]);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Meses disponibles dinámicos según el año elegido
  const availableMonths = useMemo(() => {
    if (selectedYear === currentYear) {
      // del mes actual hasta diciembre
      return Array.from({ length: 12 - currentMonth + 1 }, (_, i) => currentMonth + i);
    }
    // si es un año mayor (o menor), todos los meses del 1 al 12
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }, [selectedYear, currentYear, currentMonth]);

  // Garantiza que el mes seleccionado siempre sea válido al cambiar de año
  useEffect(() => {
    if (!availableMonths.includes(selectedMonth)) {
      setSelectedMonth(availableMonths[0]); // primer mes disponible del nuevo año
    }
  }, [availableMonths, selectedMonth]);

  const handleChangeYear = (e) => {
    const year = parseInt(e.target.value, 10);
    setSelectedYear(year);
    // Si es el año actual y el mes seleccionado es menor al actual, ajústalo
    if (year === currentYear && selectedMonth < currentMonth) {
      setSelectedMonth(currentMonth);
    }
  };

  const handleChangeMonth = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10));
  };

  const handleNewMonth = async () => {
    const monthKey = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;

    // Evita duplicados (según tu estructura { month, year })
    if (months.find((m) => m.month === selectedMonth && m.year === selectedYear)) {
      return Swal.fire({
        position: "center",
        icon: "warning",
        title: "Alerta",
        text: "El mes ya existe.",
      });
    }

    // Nota: estás mutando la prop months; idealmente el padre debería manejar esto.
    months.push({ month: selectedMonth, year: selectedYear });

    setSelected(monthKey);
    close();
  };

  return (
    <Modal show={show} onClose={close} closeable={true}>
      <CloseModalButton className="absolute top-2 right-2" close={close} />
      <div className="p-5">
        <h3 className="text-xl font-semibold w-full text-blue-900 text-center">
          Nuevo mes
        </h3>

        <div className="flex justify-center items-center mt-4 w-full p-4 rounded-xl gap-4">
          <div className="flex flex-col gap-2">
            <label>Año:</label>
            <select value={selectedYear} onChange={handleChangeYear}>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label>Mes:</label>
            <select value={selectedMonth} onChange={handleChangeMonth}>
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {m.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-start items-center mt-4 w-full p-4 rounded-xl gap-4">
          <BlueButton onClick={handleNewMonth}>Agregar</BlueButton>
          <DangerButton onClick={close}>Cancelar</DangerButton>
        </div>
      </div>
    </Modal>
  );
};

export default MonthYearSelect;
