import React from "react";
import { ShieldCheck } from "./Icons";

export default function PanelPractices() {
    const items = [
        {
            title: "Nunca compartas tus credenciales",
            desc: "Jamás compartas tu usuario o contraseña con nadie, ni siquiera con nosotros. El acceso por roles es el método más seguro.",
        },
        {
            title: "Controla el acceso en cualquier momento",
            desc: 'Si en el futuro ya no deseas que PostIAlo tenga acceso, puedes eliminar nuestro rol desde el mismo menú de "Acceso a la página".',
        },
        {
            title: "Revisa los accesos periódicamente",
            desc: "Es una buena práctica revisar de vez en cuando qué perfiles y aplicaciones tienen acceso a tu página para mantenerla siempre segura.",
        },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                🔐 Buenas Prácticas de Seguridad
            </h2>
            <ul className="space-y-6">
                {items.map((it, i) => (
                    <li key={i} className="flex items-start">
                        <ShieldCheck className="h-6 w-6 mr-4 flex-shrink-0 mt-1 text-[#002073]" />
                        <div>
                            <h4 className="font-bold text-gray-800">
                                {it.title}
                            </h4>
                            <p className="text-gray-600 font-medium">
                                {it.desc}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
