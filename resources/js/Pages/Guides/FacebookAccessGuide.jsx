import React, { useMemo, useState } from "react";

import {
    PcIcon,
    MobileIcon,
    ShieldIcon,
    PlusSquareIcon,
} from "./Partials/Icons";
import PanelPC from "./Partials/PanelPC";
import PanelMobile from "./Partials/PanelMovile";
import PanelPractices from "./Partials/PanelPractices";
import PanelRoles from "./Partials/PanelRoles";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";

export default function FacebookAccessGuide() {
    const user = usePage().props.auth.user;
    const tabs = useMemo(
        () => [
            { id: "pc", label: "Desde Computadora", icon: PcIcon },
            { id: "mobile", label: "Desde Celular", icon: MobileIcon },
            { id: "practices", label: "Buenas Prácticas", icon: ShieldIcon },
            { id: "roles", label: "Roles de Página", icon: PlusSquareIcon },
        ],
        [],
    );

    const [active, setActive] = useState("pc");

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen -mt-6 mx-0 w-full flex flex-col items-center justify-center pt-5 bg-gray-100">
                <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden my-10 p-6 text-center">
                    {/* bienvenida */}
                    <h1 className="text-4xl font-extrabold text-[#002073]">
                        {" "}
                        Bienvenido a PostIAlo {user.name}
                    </h1>
                    <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-base">
                        En PostIAlo trabajamos para mantener activa tu presencia
                        digital.
                    </p>
                </div>
                <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="p-8 bg-white border-b border-gray-200 text-center">
                        <img
                            src="https://i.ibb.co/Kx1qwd86/Logo-Post-IAlo-OFICIAL.jpg"
                            alt="Logo PostIAlo"
                            className="w-24 h-24 mx-auto mb-6 rounded-2xl shadow-lg object-cover"
                        />
                        <h1 className="text-4xl font-extrabold text-[#002073]">
                            Guía para darnos acceso a tu página de Facebook
                        </h1>
                        <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-base">
                            Sigue estos pasos para darnos acceso como
                            colaboradores, sin compartir tu contraseña.
                        </p>
                    </div>

                    {/* Antes de iniciar */}
                    <div className="p-8">
                        <div className="border-l-4 p-4 rounded-r-lg bg-[#eef2f9] border-l-[#002073]">
                            <h3 className="text-lg font-bold text-[#002073]">
                                ✅ Lo que debes saber antes
                            </h3>
                            <ul className="mt-2 list-disc list-inside text-gray-700 space-y-1 font-medium">
                                <li>
                                    Tú siempre tendrás el control total y la
                                    propiedad de tu página.
                                </li>
                                <li>
                                    PostIAlo únicamente recibirá los permisos
                                    del rol que nos asignes.
                                </li>
                                <li>
                                    En cualquier momento puedes cambiar o
                                    retirar nuestro acceso.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="px-8 border-b border-gray-200">
                        <nav
                            className="flex space-x-4 sm:space-x-8"
                            aria-label="Tabs"
                        >
                            {tabs.map(({ id, label, icon: Icon }) => {
                                const isActive = id === active;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => setActive(id)}
                                        className={`flex items-center space-x-2 py-4 px-1 text-base font-medium border-b-2 transition ${
                                            isActive
                                                ? "text-[#002073] border-b-[#002073] font-extrabold"
                                                : "text-gray-500 border-b-transparent"
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Panels */}
                    <div className="p-8">
                        {active === "pc" && <PanelPC />}
                        {active === "mobile" && <PanelMobile />}
                        {active === "practices" && <PanelPractices />}
                        {active === "roles" && <PanelRoles />}
                    </div>

                    {/* Footer */}
                    <div className="p-6 text-center text-sm bg-[#f8f9fa] text-gray-500">
                        <p>
                            Con este procedimiento, PostIAlo tendrá el acceso
                            necesario mientras tú conservas el control total.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
