export default function PartnerCodeForm({ data, setData, errors, processing, onSubmit }) {

    return (
        <div className="p-8 lg:p-12 bg-gray-50 border-b border-gray-200 text-center">
            <h2 className="text-2xl font-bold text-[#002073] mb-4">Código de Alianza</h2>
            <p className="text-gray-600 mb-6">
                Ingrese el código proporcionado por su socio o empresa.
            </p>
            <form onSubmit={onSubmit} className="max-w-md mx-auto space-y-5">
                <input
                    type="text"
                    id="partner_code"
                    name="partner_code"
                    value={data.partner_code}
                    onChange={(e) =>
                        setData("partner_code", e.target.value.toUpperCase())
                    }
                    placeholder="ejemplo: EX3D"
                    required
                    className={`w-full px-4 py-3 border rounded-lg text-center uppercase tracking-widest font-semibold focus:ring-2 focus:ring-[#002073] focus:outline-none ${
                        errors.partner_code
                            ? "border-red-500"
                            : "border-gray-300"
                    }`}
                />
                {errors.partner_code && (
                    <p className="text-red-500 mt-2 text-sm">
                        {errors.partner_code}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-[#002073] hover:bg-[#1c348f] text-white font-semibold px-8 py-3 rounded-lg shadow-md w-full transition-all duration-300"
                >
                    {processing ? "Validando Código..." : "Validar Código y Continuar"}
                </button>
            </form>
        </div>
    );
}
z