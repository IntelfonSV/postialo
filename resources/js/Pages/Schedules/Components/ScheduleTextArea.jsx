function ScheduleTextArea({value, onChange, edit, disabled, error, label, rows}) {
    return  (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label} {edit && <span className="text-red-500">*</span>}
            </label>
            <textarea
                value={value}
                onChange={onChange}
                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                rows={rows}
                disabled={disabled}
            />
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
}

export default ScheduleTextArea;
