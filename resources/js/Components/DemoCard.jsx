import React, { useState } from "react";
import Loading from "./Loading";
import { Link, router } from "@inertiajs/react";

export default function DemoCard() {
    const [loading, setLoading] = useState(false);
    const onActivate = () => {
        setLoading(true);
        router.post(route("users.demo"), {
            onSuccess: () => {
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
    };
    return (
        <div className="p-6 bg-white rounded-2xl shadow-md border max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Activa tu mes de prueba 🎉
            </h2>
            <p className="text-gray-600 mb-4 text-sm">
                Disfruta de acceso completo a todas las funcionalidades durante
                30 días sin costo.
            </p>

            <Link
                disabled={loading}
                href={route("demos.guide")}
                className="w-full px-4 py-2 rounded-xl text-white font-medium transition 
                   bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Activando..." : "Activar mes de prueba"}
            </Link>

            {loading && <Loading title={"Activando mes de prueba"} />}
        </div>
    );
}
