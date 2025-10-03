import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";

export default function Guide() {
    const { data, setData, post, errors } = useForm({
        facebook_page_id: "",
        instagram_account_id: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("demos.store"));
    };

    const handleActivateDemo = () => {
        post(route("demos.activate"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen font-inter bg-gray-100">
                <div className="w-full bg-white">
                    {/* Header */}
                    <div className="p-8 bg-white border-b border-gray-200 text-center">
                        <img
                            src="https://i.ibb.co/Kx1qwd86/Logo-Post-IAlo-OFICIAL.jpg"
                            alt="Logo PostIAlo"
                            className="w-24 h-24 mx-auto mb-6 rounded-2xl shadow-lg object-cover"
                        />
                        <h1 className="text-4xl font-extrabold text-[#002073]">
                            Bienvenido a su Demo de PostIAlo 🚀
                        </h1>
                        <p className="mt-3 text-gray-600 max-w-3xl mx-auto text-base">
                            ¡Hola! 👋 Gracias por activar su demo. Para que
                            podamos comenzar a publicar contenido en sus páginas
                            y mostrarle todo el potencial de la plataforma,
                            necesitamos que nos ayude con dos pasos muy
                            sencillos:
                        </p>
                    </div>

                    {/* Steps Section */}
                    <div className="p-8 lg:p-12">
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
                                    Esto nos permitirá publicar contenido
                                    durante la demo. Siga estos pasos:
                                </p>
                                <ol className="list-decimal list-inside space-y-3 text-gray-700 font-medium ml-12">
                                    <li>
                                        Ingrese a{" "}
                                        <a
                                            href="https://www.facebook.com/settings"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold underline text-[#002073] transition-colors duration-200 hover:text-[#F94B53]"
                                        >
                                            facebook.com/settings
                                        </a>
                                    </li>
                                    <li>
                                        En el menú lateral, haga clic en{" "}
                                        <strong>
                                            Configuración y privacidad
                                        </strong>
                                        .
                                    </li>
                                    <li>
                                        Seleccione{" "}
                                        <strong>Configuración de página</strong>
                                        .
                                    </li>
                                    <li>
                                        Entre a la opción{" "}
                                        <strong>Acceso a la página</strong>.
                                    </li>
                                    <li>
                                        En{" "}
                                        <strong>
                                            Personas con acceso a tareas
                                        </strong>
                                        , seleccione <strong>Agregar</strong>.
                                    </li>
                                    <li>
                                        Escriba nuestro contacto:{" "}
                                        <strong>Marcos Salvador</strong>.
                                    </li>
                                    <li>
                                        Otorgue acceso con permisos de{" "}
                                        <strong>Contenido</strong>.
                                    </li>
                                    <li>
                                        Ingrese su contraseña de Facebook y
                                        confirme.
                                    </li>
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
                                    Estos identificadores son necesarios para
                                    conectar su demo con PostIAlo.
                                </p>
                                <ol className="list-decimal list-inside space-y-3 text-gray-700 font-medium ml-12">
                                    <li>
                                        Ingrese a{" "}
                                        <a
                                            href="https://business.facebook.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold underline text-[#002073] transition-colors duration-200 hover:text-[#F94B53]"
                                        >
                                            business.facebook.com
                                        </a>
                                    </li>
                                    <li>
                                        En el menú lateral, seleccione{" "}
                                        <strong>Configuraciones</strong>.
                                    </li>
                                    <li>
                                        Dentro de configuraciones, haga clic en{" "}
                                        <strong>Perfiles</strong>.
                                    </li>
                                    <li>
                                        Diríjase a la sección de{" "}
                                        <strong>Páginas</strong>:
                                        <ul className="list-disc list-outside ml-10 mt-2 space-y-2">
                                            <li>
                                                <strong>Para Facebook:</strong>{" "}
                                                seleccione la página y copie el
                                                número que aparece como{" "}
                                                <strong>Identificador</strong>.
                                            </li>
                                            <li>
                                                <strong>Para Instagram:</strong>{" "}
                                                entre a{" "}
                                                <strong>
                                                    Cuentas de Instagram
                                                </strong>
                                                , seleccione su cuenta y copie
                                                el número que aparece como{" "}
                                                <strong>Identificador</strong>.
                                            </li>
                                        </ul>
                                    </li>
                                </ol>
                            </div>
                        </div>

                        {/* Important Note */}
                        <div
                            className="mt-12 border-l-4 p-4 rounded-r-lg max-w-4xl mx-auto transition-all duration-300 hover:shadow-lg"
                            style={{
                                backgroundColor: "#eef2f9",
                                borderLeftColor: "#F94B53",
                            }}
                        >
                            <h3 className="text-lg font-bold text-[#002073]">
                                Importante ⚠️
                            </h3>
                            <p className="mt-2 text-gray-700 font-medium">
                                👉 Este proceso solo debe realizarse durante la
                                demo. Si decide continuar con un plan pagado de
                                PostIAlo, la información quedará almacenada y ya
                                no será necesario repetirlo.
                            </p>
                        </div>

                        {/* Input Section */}
                        <div className="mt-12 max-w-4xl mx-auto text-center">
                            <h3 className="text-2xl font-bold text-[#002073] mb-6">
                                Ingresa tus Identificadores
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Facebook Input */}
                                <div>
                                    <div>
                                        <label
                                            htmlFor="facebook_id"
                                            className="block text-left font-semibold text-gray-700 mb-2"
                                        >
                                            ID de Página de Facebook
                                        </label>
                                        <div className="p-0.5 rounded-lg bg-blue-500 h-full">
                                            <input
                                                type="text"
                                                id="facebook_page_id"
                                                name="facebook_page_id"
                                                value={data.facebook_page_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "facebook_page_id",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Pega tu ID de Facebook aquí"
                                                className="w-full h-16 px-4 py-3 rounded-md border-0 focus:outline-none focus:ring-0"
                                            />
                                        </div>
                                    </div>
                                    {errors.facebook_page_id && (
                                        <p className="text-red-500 mt-2">
                                            {errors.facebook_page_id}
                                        </p>
                                    )}
                                </div>
                                {/* Instagram Input */}
                                <div>
                                    <div>
                                        <label
                                            htmlFor="instagram_id"
                                            className="block text-left font-semibold text-gray-700 mb-2"
                                        >
                                            ID de Perfil de Instagram
                                        </label>
                                        <div className="p-0.5 rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 h-16">
                                            <input
                                                type="text"
                                                id="instagram_account_id"
                                                name="instagram_account_id"
                                                value={data.instagram_account_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "instagram_account_id",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Pega tu ID de Instagram aquí"
                                                className="w-full h-full px-4 py-3 rounded-md border-0 focus:outline-none focus:ring-0"
                                            />
                                        </div>
                                    </div>
                                    {errors.instagram_account_id && (
                                        <p className="text-red-500 mt-2">
                                            {errors.instagram_account_id}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                className="mt-12 bg-[#002073] text-white font-bold py-3 px-10 rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                                onClick={handleActivateDemo}
                            >
                                Continuar
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 text-center bg-gray-100 text-gray-500">
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
