import React from "react";

export default function PartnerValidatedCard({ partner }) {
    if (!partner) return null;

    return (
        <div className="p-8 lg:p-12 animate-fadeIn">
            {/* ✅ Banner de validación */}
            <div className="bg-green-50 border-l-4 border-green-600 text-green-800 p-4 mb-8 rounded-md shadow-sm">
                <div className="flex items-start">
                    <svg
                        className="h-6 w-6 text-green-600 mr-3 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-lg">Validado exitosamente</p>
                        <p className="text-sm">
                            El código de socio fue verificado correctamente. A continuación se muestra la información asociada.
                        </p>
                    </div>
                </div>
            </div>

            {/* 🧩 Tarjeta de información */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                {/* Encabezado con imagen o color */}
                <div className="bg-gradient-to-r from-[#002073] to-[#0049b7] p-6 text-white flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold">{partner.name}</h3>
                        <p className="text-sm opacity-90">{partner.code}</p>
                    </div>
                    {partner.logo_url && (
                        <img
                            src={partner.logo_url}
                            alt={partner.name}
                            className="h-14 w-14 rounded-lg bg-white object-contain shadow-md"
                        />
                    )}
                </div>

                {/* Cuerpo de información */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500">Descripción</p>
                        <p className="text-base font-medium text-gray-800 mt-1 leading-relaxed">
                            {partner.description || "Sin descripción disponible"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Válido hasta</p>
                        <p className="text-base font-medium text-gray-800 mt-1">
                            {partner.valid_until
                                ? new Date(partner.valid_until).toLocaleDateString()
                                : "Sin fecha"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <span
                            className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full ${
                                partner.active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {partner.active ? "Activo" : "Inactivo"}
                        </span>
                    </div>

                    {partner.contact_email && (
                        <div>
                            <p className="text-sm text-gray-500">Contacto</p>
                            <p className="text-base font-medium text-gray-800 mt-1">
                                {partner.contact_email}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pie con marca */}
                <div className="bg-gray-50 px-6 py-4 text-right text-sm text-gray-500 border-t">
                    <p>
                        Información proporcionada por{" "}
                        <span className="font-semibold text-[#002073]">
                            {partner.name}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
