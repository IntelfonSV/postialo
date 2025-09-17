import React from "react";
import StepCard from "./StepCard";

export default function PanelPC() {
    const steps = [
        {
            n: 1,
            title: "Ingresa a tu Página",
            desc: "Abre Facebook en tu navegador e ingresa a tu página de negocio.",
        },
        {
            n: 2,
            title: "Ve a Configuración",
            desc: (
                <>
                    En el menú lateral izquierdo, haz clic en{" "}
                    <strong className="font-semibold text-gray-900">
                        Configuración
                    </strong>
                    .
                </>
            ),
        },
        {
            n: 3,
            title: "Acceso a la Página",
            desc: (
                <>
                    Selecciona la opción de{" "}
                    <strong className="font-semibold text-gray-900">
                        Acceso a la página
                    </strong>
                    .
                </>
            ),
        },
        {
            n: 4,
            title: "Agrega a PostIAlo",
            desc: (
                <>
                    Haz clic en{" "}
                    <strong className="font-semibold text-gray-900">
                        Agregar personas
                    </strong>{" "}
                    y búscanos con el correo o nombre que te dimos.
                </>
            ),
        },
        {
            n: 5,
            title: "Asigna el Rol",
            desc: (
                <>
                    Selecciona el rol de{" "}
                    <strong className="font-semibold text-gray-900">
                        Editor
                    </strong>{" "}
                    (recomendado) para darnos los permisos necesarios.
                </>
            ),
        },
        {
            n: 6,
            title: "Envía la Invitación",
            desc: (
                <>
                    Haz clic en{" "}
                    <strong className="font-semibold text-gray-900">
                        Invitar
                    </strong>
                    . ¡Nosotros nos encargamos del resto!
                </>
            ),
        },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                🔹 Opción 1: Desde Computadora
            </h2>
            <p className="text-gray-600 mb-8">
                Sigue estos pasos para completar el proceso desde tu navegador
                web.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {steps.map((s) => (
                    <StepCard key={s.n} n={s.n} title={s.title} desc={s.desc} />
                ))}
            </div>
        </div>
    );
}
