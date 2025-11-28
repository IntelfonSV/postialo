function ScheduleTemplatesSelect({ value, onChange, templates, disabled }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Plantilla
            </label>
            <select
                value={value}
                onChange={onChange}
                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                disabled={disabled}
            >
                <option value="">Sin plantilla</option>
                {templates?.map((t) => (
                    <option key={t.id} value={t.id}>
                        {t.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ScheduleTemplatesSelect;
