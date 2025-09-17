import React from "react";

export default function PanelMobile() {
    const steps = [
        "Abre la app de Facebook en tu teléfono e ingresa a tu página.",
        <>
            Toca el menú de tres puntos{" "}
            <strong className="font-bold text-gray-900">(⋯)</strong>.
        </>,
        <>
            Selecciona{" "}
            <strong className="font-bold text-gray-900">
                Configuración &gt; Acceso a la página
            </strong>
            .
        </>,
        <>
            Toca en{" "}
            <strong className="font-bold text-gray-900">
                Agregar personas con acceso
            </strong>
            .
        </>,
        "Busca el perfil o escribe el correo oficial que te proporcionamos.",
        <>
            Selecciona el rol de{" "}
            <strong className="font-bold text-gray-900">Editor</strong>.
        </>,
        "Confirma tu elección con tu contraseña de Facebook por seguridad.",
        "¡Perfecto! Con esto habremos recibido la invitación.",
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                🔹 Opción 2: Desde Celular (App de Facebook)
            </h2>
            <ol className="space-y-4">
                {steps.map((text, idx) => (
                    <li
                        key={idx}
                        className="relative pl-14 min-h-[2.5rem] flex items-center font-medium text-gray-700"
                    >
                        <span className="absolute left-0 top-0 flex items-center justify-content-center w-10 h-10 rounded-full shadow bg-[#F94B53]">
                            <span className="text-white font-bold text-lg flex items-center justify-center w-10 h-10">
                                {idx + 1}
                            </span>
                        </span>
                        <span>{text}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}
