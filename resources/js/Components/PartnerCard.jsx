import React from "react";
import { router } from "@inertiajs/react";

export default function PartnerCodeCard() {
    const handleClick = () => {
        router.visit(route("demos.partner-guide"));
    };

    return (
        <div className="max-w-sm bg-white rounded-2xl shadow-md border border-gray-200 p-6 text-center hover:shadow-xl transition-all duration-300 w-full sm:w-96">
            <div className="flex flex-col items-center">
                <img
                    src="https://i.ibb.co/Kx1qwd86/Logo-Post-IAlo-OFICIAL.jpg"
                    alt="Logo PostIAlo"
                    className="w-20 h-20 rounded-2xl mb-4 shadow-md object-cover"
                />

                <h2 className="text-xl font-bold text-[#002073] mb-2">
                    Activar Demo con Código
                </h2>

                <p className="text-gray-600 text-sm mb-5">
                    ¿Tienes un código de alianza?  
                    Ingresa el código de tu partner (por ejemplo,{" "}
                    <strong>EX3D</strong>) para activar tu demo personalizada.
                </p>

                <button
                    onClick={handleClick}
                    className="bg-[#002073] hover:bg-[#1c348f] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                >
                    Ingresar Código de Alianza
                </button>
            </div>
        </div>
    );
}
