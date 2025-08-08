import React, { useEffect, useState } from 'react';

const MonthYearSelect = ({setSelectedMonth}) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Enero = 0, por eso +1

  // Generar años desde currentYear hasta currentYear + 2
  const years = [];
  for (let y = currentYear; y <= currentYear + 2; y++) {
    years.push(y);
  }

  // Generar meses desde currentMonth hasta 12
  const months = [];
  for (let m = currentMonth; m <= 12; m++) {
    months.push(m);
  }

  // Estado seleccionado
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  useEffect(() => {
    setSelectedMonth(`${selectedYear}-${selectedMonth}`);
  }, [selectedMonth, selectedYear]);

  // Cuando cambias año, si cambia el año y el mes seleccionado ya no es válido, ajusta meses
  const availableMonths = selectedYear === currentYear ? months : Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div>
      <label>
        Año:
        <select
          value={selectedYear}
          onChange={e => {
            const year = parseInt(e.target.value, 10);
            setSelectedYear(year);

            // Ajustar mes si cambia el año y el mes no está en el rango
            if (year === currentYear && selectedMonth < currentMonth) {
              setSelectedMonth(currentMonth);
            }
          }}
        >
          {years.map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>

      <label style={{ marginLeft: '10px' }}>
        Mes:
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(parseInt(e.target.value, 10))}
        >
          {availableMonths.map(m => (
            <option key={m} value={m}>
              {m.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default MonthYearSelect;
