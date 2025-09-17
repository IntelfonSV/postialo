import React from "react";

export default function PanelRoles() {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                📊 Roles más comunes en Facebook
            </h2>
            <p className="text-gray-600 font-medium mb-6">
                Cada rol tiene permisos diferentes. El rol de{" "}
                <strong className="font-bold text-[#002073]">Editor</strong> es
                ideal para nosotros, ya que nos permite gestionar el contenido
                sin afectar la configuración general de tu página.
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="whitespace-nowrap px-6 py-4 text-left font-bold text-gray-900">
                                Rol
                            </th>
                            <th className="whitespace-nowrap px-6 py-4 text-left font-bold text-gray-900">
                                Qué permite hacer
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-medium">
                        <tr>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-900">
                                Administrador
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                                Control total (incluye configuración, roles,
                                anuncios y publicaciones).
                            </td>
                        </tr>
                        <tr className="bg-[#eef2f9]">
                            <td className="whitespace-nowrap px-6 py-4 font-semibold text-[#002073]">
                                Editor (Recomendado)
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-[#002073]">
                                Publicar, responder comentarios/mensajes y ver
                                estadísticas.
                            </td>
                        </tr>
                        <tr>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-900">
                                Moderador
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                                Responder mensajes/comentarios y ver
                                estadísticas, sin publicar contenido.
                            </td>
                        </tr>
                        <tr>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-900">
                                Anunciante
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                                Crear anuncios y ver métricas.
                            </td>
                        </tr>
                        <tr>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-900">
                                Analista
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                                Solo ver estadísticas de la página.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
