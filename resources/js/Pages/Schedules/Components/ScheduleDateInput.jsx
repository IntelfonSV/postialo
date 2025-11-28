import { useState, useEffect } from "react";

function ScheduleDateInput({ data, setData, errors, disabled, selectedMonth, edit }) {
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");

    useEffect(() => {
        if (!selectedMonth) return;

        const [year, month] = selectedMonth.split("-").map(Number);
        setData("month", month);
        setData("year", year);

        // Día inicial del mes
        const firstDay = new Date(year, month - 1, 1);

        // Día final del mes
        const lastDay = new Date(year, month, 0);

        // Formateo correcto: YYYY-MM-DDTHH:mm
        const formatDateTime = (d, endOfDay = false) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            const hh = endOfDay ? "23" : "00";
            const mi = endOfDay ? "59" : "00";
            return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
        };

        setMinDate(formatDateTime(firstDay));
        setMaxDate(formatDateTime(lastDay, true));
    }, [selectedMonth]);

    return (
        <div>
            <label className="block text-xs font-medium text-gray-500">
                Fecha {edit && <span className="text-red-500">*</span>}
            </label>
            <input
                type="datetime-local"
                value={data.scheduled_date}
                min={minDate}
                max={maxDate}
                onChange={(e) => setData("scheduled_date", e.target.value)}
                className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                disabled={disabled}
            />
            <div className="text-xs text-red-500">{errors.scheduled_date}</div>
        </div>
    );
}

export default ScheduleDateInput;
