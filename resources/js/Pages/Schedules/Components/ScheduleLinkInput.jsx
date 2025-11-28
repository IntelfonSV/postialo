function ScheduleLinkInput({ value, onChange, disabled }) {
    return (
                    <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                    Link del producto
                </label>
                {disabled ?

                    <p className="text-xs text-gray-500 mb-2">{value}</p>:
                <input
                type="text"
                    value={value}
                    placeholder="https://example.com/product/123"
                    onChange={onChange}
                    className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full"
                    disabled={disabled}
                    />
                }
            </div>
    );
}

export default ScheduleLinkInput;