export default function GuideSocialInputs({ data, setData, errors }) {
    return (
        <div className="mt-12 max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-[#002073] mb-6">
                Ingresa tus Identificadores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Facebook */}
                <div>
                    <label
                        htmlFor="facebook_page_id"
                        className="block text-left font-semibold text-gray-700 mb-2"
                    >
                        ID de Página de Facebook
                    </label>
                    <div className="p-0.5 rounded-lg bg-blue-500">
                        <input
                            type="text"
                            id="facebook_page_id"
                            name="facebook_page_id"
                            value={data.facebook_page_id}
                            onChange={(e) =>
                                setData("facebook_page_id", e.target.value)
                            }
                            placeholder="Pega tu ID de Facebook aquí"
                            className="w-full h-16 px-4 py-3 rounded-md border-0 focus:outline-none"
                        />
                    </div>
                    {errors.facebook_page_id && (
                        <p className="text-red-500 mt-2">
                            {errors.facebook_page_id}
                        </p>
                    )}
                </div>

                {/* Instagram */}
                <div>
                    <label
                        htmlFor="instagram_account_id"
                        className="block text-left font-semibold text-gray-700 mb-2"
                    >
                        ID de Perfil de Instagram
                    </label>
                    <div className="p-0.5 rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                        <input
                            type="text"
                            id="instagram_account_id"
                            name="instagram_account_id"
                            value={data.instagram_account_id}
                            onChange={(e) =>
                                setData("instagram_account_id", e.target.value)
                            }
                            placeholder="Pega tu ID de Instagram aquí"
                            className="w-full h-16 px-4 py-3 rounded-md border-0 focus:outline-none"
                        />
                    </div>
                    {errors.instagram_account_id && (
                        <p className="text-red-500 mt-2">
                            {errors.instagram_account_id}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
