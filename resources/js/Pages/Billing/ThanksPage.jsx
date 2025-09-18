// resources/js/Pages/Billing/ThanksPage.jsx
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ThanksPage({ token = "", ern = "" }) {
    return (
        <AuthenticatedLayout>
            <Head title="Facturación" />
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl text-center">
                    {/* Icono de éxito */}
                    <svg
                        className="w-16 h-16 mx-auto mb-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>

                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        ¡Transacción Completada!
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Tu pago ha sido procesado con éxito. Tu suscripción se
                        activará en breve.
                    </p>

                    <div className="grid gap-4 text-left">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <p className="text-sm font-semibold text-green-800/80">
                                Número de Comprobante (ERN)
                            </p>
                            <p className="text-2xl font-extrabold text-green-900 mt-1 break-all">
                                {ern || "—"}
                            </p>
                        </div>

                        {token && (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                <p className="text-sm font-semibold text-gray-700">
                                    Token
                                </p>
                                <p className="text-base font-mono text-gray-800 mt-1 break-all">
                                    {token}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
