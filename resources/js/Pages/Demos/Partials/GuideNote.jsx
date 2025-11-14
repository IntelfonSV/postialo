export default function GuideNote() {
    return (
        <div
            className="mt-12 border-l-4 p-4 rounded-r-lg max-w-4xl mx-auto transition-all duration-300 hover:shadow-lg"
            style={{
                backgroundColor: "#eef2f9",
                borderLeftColor: "#F94B53",
            }}
        >
            <h3 className="text-lg font-bold text-[#002073]">Importante ⚠️</h3>
            <p className="mt-2 text-gray-700 font-medium">
                👉 Este proceso solo debe realizarse durante la demo. Si decide
                continuar con un plan pagado de PostIAlo, la información quedará
                almacenada y ya no será necesario repetirlo.
            </p>
        </div>
    );
}
