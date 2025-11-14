export default function GuideSteps() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-xl border border-gray-200 shadow-sm h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <h2 className="flex items-center text-2xl font-bold mb-4 text-[#002073]">
                    <span className="flex items-center justify-center w-8 h-8 mr-4 rounded-full text-white font-bold flex-shrink-0 bg-[#F94B53]">
                        1
                    </span>
                    Otorgar acceso a su página de Facebook
                </h2>
                <p className="font-medium text-gray-600 ml-12 mb-6">
                    Esto nos permitirá publicar contenido durante la demo. Siga
                    estos pasos:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-gray-700 font-medium ml-12">
                    <li>
                        Ingrese a{" "}
                        <a
                            href="https://www.facebook.com/settings"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline text-[#002073] hover:text-[#F94B53]"
                        >
                            facebook.com/settings
                        </a>
                    </li>
                    <li>En el menú lateral, haga clic en <strong>Configuración y privacidad</strong>.</li>
                    <li>Seleccione <strong>Configuración de página</strong>.</li>
                    <li>Entre a <strong>Acceso a la página</strong>.</li>
                    <li>Agregue a <strong>Marcos Salvador</strong> con permisos de <strong>Contenido</strong>.</li>
                </ol>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-xl border border-gray-200 shadow-sm h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <h2 className="flex items-center text-2xl font-bold mb-4 text-[#002073]">
                    <span className="flex items-center justify-center w-8 h-8 mr-4 rounded-full text-white font-bold flex-shrink-0 bg-[#F94B53]">
                        2
                    </span>
                    Obtener el ID de sus páginas
                </h2>
                <p className="font-medium text-gray-600 ml-12 mb-6">
                    Estos identificadores son necesarios para conectar su demo
                    con PostIAlo.
                </p>
                <ol className="list-decimal list-inside space-y-3 text-gray-700 font-medium ml-12">
                    <li>
                        Ingrese a{" "}
                        <a
                            href="https://business.facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline text-[#002073] hover:text-[#F94B53]"
                        >
                            business.facebook.com
                        </a> y asegúrese de estar dentro del Business Manager correspondiente a la página a la cual desea delegar acceso.
                    </li>
                    <li>Diríjase a la sección, seleccione <strong>Usuarios</strong>en el menú lateral.</li>
                    <li>Seleccione la opción <strong>Socios</strong>.</li>
                    <li>Haga clic en <strong>Agregar</strong>.</li>
                    <li>Elija la opción <strong>“Dar acceso a sus activos a un socio”</strong>.</li>
                    <li>Ingrese el <strong>ID del negocio: 1358677642433939</strong>.</li>
                    <li>Confirme y asigne los permisos necesarios según los activos que desea compartir.</li>
                </ol>
            </div>
        </div>
    );
}
