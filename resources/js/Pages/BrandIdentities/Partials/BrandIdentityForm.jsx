import DangerButton from "@/Components/DangerButton";
import DefaultContainer from "@/Components/DefaultContainer";
import GreenButton from "@/Components/GreenButton";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    FaFacebookSquare,
    FaGlobe,
    FaInstagram,
    FaWhatsapp,
} from "react-icons/fa";

export default function BrandIdentityForm({ edit, setEdit, brandIdentity }) {
    let guidelines = {};
    const {partner} = usePage().props;

    const user = usePage().props.auth.user;
    if (
        !(
            brandIdentity?.guidelines_json?.facebook ||
            brandIdentity?.guidelines_json?.instagram ||
            brandIdentity?.guidelines_json?.x
        )
    ) {
        guidelines = brandIdentity?.guidelines_json
            ? JSON.parse(brandIdentity?.guidelines_json)
            : {};
    } else {
        guidelines = brandIdentity?.guidelines_json;
    }

    const networks = ["facebook", "instagram"];

    const { data, setData, post, put, processing, errors } = useForm({
        id: brandIdentity?.id || "",
        company_identity: brandIdentity?.company_identity || "",
        mission_vision: brandIdentity?.mission_vision || "",
        products_services: brandIdentity?.products_services || "",
        company_history: brandIdentity?.company_history || "",
        website: brandIdentity?.website || "",
        whatsapp_number: brandIdentity?.whatsapp_number || "",
        facebook_page_id: brandIdentity?.facebook_page_id || "",
        instagram_account_id: brandIdentity?.instagram_account_id || "",
        facebook: {
            tone: guidelines?.facebook?.tone || "",
            guidelines: guidelines?.facebook?.guidelines || "",
            audience: guidelines?.facebook?.audience || "",
        },
        instagram: {
            tone: guidelines?.instagram?.tone || "",
            guidelines: guidelines?.instagram?.guidelines || "",
            audience: guidelines?.instagram?.audience || "",
        },
        x: {
            tone: guidelines?.x?.tone || "",
            guidelines: guidelines?.x?.guidelines || "",
            audience: guidelines?.x?.audience || "",
        },
    });

    const [warning, setWarning] = useState("");
    const handleChange = (e, section, key) => {
        if (section) {
            setData({
                ...data,
                [section]: {
                    ...data[section],
                    [key]: e.target.value,
                },
            });
        } else {
            setData({ ...data, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.id) {
            put(route("brand-identities.update", data.id), {
                onSuccess: () => {
                    setEdit(false);
                },
            });
        } else {
            post(route("brand-identities.store"), {
                onSuccess: () => {
                    setEdit(false);
                },
            });
        }
    };

    const handleWebsiteChange = (e) => {
        const value = e.target.value.trim();
        setData("website", value);
        setWarning(""); // limpia alertas previas

        // si hay partner, validamos
        if (partner?.branding?.url && value.length > 0) {
            const normalizedValue = value.startsWith("http")
                ? value
                : `https://${value}`;

            if (!normalizedValue.startsWith(partner?.branding?.url)) {
                setWarning(
                    `⚠️ La URL debe comenzar con ${partner?.branding?.url}`
                );
            }
        }
    };

    const textAreaClasses =
        "w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100 disabled:text-gray-500" +
        (edit ? "" : " bg-gray-50");

    return (
        <form onSubmit={handleSubmit} className="mx-auto">
            <div className="grid grid-cols-1 gap-8">
                <DefaultContainer className="bg-white p-6 rounded-2xl shadow-lg w-full ">
                    {/* datos de red social */}
                    <h4 className="text-xl font-bold mb-6 text-[#002073]">
                        Datos de contacto y red social
                    </h4>
                    <div className="md:flex gap-6 w-full">
                        <div className="w-full mt-6">
                            <label
                                htmlFor="facebook_page_id"
                                className="flex items-center gap-2 mb-5"
                            >
                                <FaFacebookSquare className="text-blue-600 w-6 h-6" />{" "}
                                ID de Facebook{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="facebook_page_id"
                                className={textAreaClasses}
                                placeholder="ID de Facebook"
                                value={data.facebook_page_id}
                                onChange={handleChange}
                                disabled={!edit}
                            />
                        </div>
                        <div className="w-full mt-6">
                            <label
                                htmlFor="instagram_account_id"
                                className="flex items-center gap-2 mb-5"
                            >
                                <FaInstagram className="text-pink-600 w-6 h-6" />{" "}
                                ID de Instagram{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="instagram_account_id"
                                className={textAreaClasses}
                                placeholder="ID de Instagram"
                                value={data.instagram_account_id}
                                onChange={handleChange}
                                disabled={!edit}
                            />
                        </div>
                        <div className="w-full mt-6">
                            <label
                                htmlFor="website"
                                className="flex items-center gap-2 mb-5"
                            >
                                <FaGlobe className="text-blue-600 w-6 h-6" />{" "}
                                Pagina web
                            </label>
                            <input
                                type="text"
                                name="website"
                                className={textAreaClasses}
                                placeholder="Pagina web"
                                value={data.website}
                                onChange={handleWebsiteChange}
                                disabled={!edit}
                            />
                            {warning && (
                                <p className="text-red-600 text-sm mt-2 font-medium">
                                    {warning}
                                </p>
                            )}
                        </div>
                        <div className="w-full mt-6">
                            <label
                                htmlFor="whatsapp_number"
                                className="flex items-center gap-2 mb-5"
                            >
                                <FaWhatsapp className="text-green-600 w-6 h-6" />{" "}
                                Numero de Whatsapp{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="whatsapp_number"
                                className={textAreaClasses}
                                placeholder="Numero de Whatsapp 50377889988"
                                value={data.whatsapp_number}
                                onChange={handleChange}
                                disabled={user.partner_id || !edit}
                            />
                        </div>
                    </div>
                </DefaultContainer>
                {/* Información General */}
                <DefaultContainer className="bg-white p-6 rounded-2xl shadow-lg w-full">
                    <h4 className="text-xl font-bold mb-6 text-[#002073]">
                        Información General
                    </h4>
                    <div className="flex flex-col gap-6">
                        <label htmlFor="company_identity">
                            Identidad de la Empresa{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        {edit ? (
                        <textarea
                            name="company_identity"
                            rows="3"
                            className={textAreaClasses}
                            placeholder="Identidad de la Empresa"
                            value={data.company_identity}
                            onChange={handleChange}
                            disabled={!edit}
                        />
                        ) : <p className="text-gray-600 bg-gray-100 p-2 rounded-xl">{data.company_identity}</p>}
                        <label htmlFor="mission_vision">
                            Misión & Visión{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        {edit ? (
                            <textarea
                            name="mission_vision"
                            rows="3"
                            className={textAreaClasses}
                            placeholder="Misión & Visión"
                            value={data.mission_vision}
                            onChange={handleChange}
                            disabled={!edit}
                        />
                        ) : <p className="text-gray-600 bg-gray-100 p-2 rounded-xl">{data.mission_vision}</p>}
                        <label htmlFor="products_services">
                            Productos/Servicios{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        {edit ? (
                        <textarea
                            name="products_services"
                            rows="3"
                            className={textAreaClasses}
                            placeholder="Productos/Servicios"
                            value={data.products_services}
                            onChange={handleChange}
                            disabled={!edit}
                        />  ) : <p className="text-gray-600 bg-gray-100 p-2 rounded-xl">{data.products_services}</p>}

                        <label htmlFor="company_history">
                            Historia de la Compañía{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        {edit ? (
                        <textarea
                            name="company_history"
                            rows="3"
                            className={textAreaClasses}
                            placeholder="Historia de la Compañía"
                            value={data.company_history}
                            onChange={handleChange}
                            disabled={!edit}
                        />
                        ) : <p className="text-gray-600 bg-gray-100 p-2 rounded-xl">{data.company_history}</p>}
                    </div>
                </DefaultContainer>

                {/* Lineamientos por Red Social */}
                <DefaultContainer className="bg-white p-6 rounded-2xl shadow-lg w-full">
                    <h4 className="text-xl font-bold mb-6 text-[#002073]">
                        Lineamientos por Red Social
                    </h4>la otra opcion es que yo incorpore el acortador de link en postioalo 

es decir programarlo 
                    <div>
                        {networks.map((network) => (
                            <div key={network} className="">
                                <h5 className="text-lg font-semibold capitalize mb-3 text-[#002073]">
                                    <div className="flex items-center gap-2 mt-5">
                                        {network === "facebook" ? (
                                            <FaFacebookSquare className="text-blue-600 w-6 h-6" />
                                        ) : (
                                            <FaInstagram className="text-pink-600 w-6 h-6" />
                                        )}
                                        {network === "x"
                                            ? "X (Twitter)"
                                            : network}
                                    </div>
                                </h5>
                                <label htmlFor="tone">
                                    Tono de comunicación{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-col gap-3">
                                    {edit ? (
                                    <textarea
                                        rows="3"
                                        className={textAreaClasses}
                                        placeholder="Tono de comunicación"
                                        value={data[network].tone}
                                        onChange={(e) =>
                                            handleChange(e, network, "tone")
                                        }
                                        disabled={!edit}
                                    />
                                    ) : <p className="text-gray-600 bg-gray-100 p-2 rounded-xl">{data[network].tone}</p>}
                                    <label htmlFor="guidelines">
                                        Guías de estilo y contenido{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    {edit ? (
                                    <textarea
                                        rows="5"
                                        className={textAreaClasses}
                                        placeholder="Guías de estilo y contenido"
                                        value={data[network].guidelines}
                                        onChange={(e) =>
                                            handleChange(
                                                e,
                                                network,
                                                "guidelines",
                                            )
                                        }
                                        disabled={!edit}
                                    />
                                    ) : <p className="text-gray-600 bg-gray-100 p-2 rounded-xl">{data[network].guidelines}</p>}
                                    <label htmlFor="audience">
                                        Público objetivo{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    {edit ? (
                                    <textarea
                                        rows="5"
                                        className={textAreaClasses}
                                        placeholder="Público objetivo"
                                        value={data[network].audience}
                                        onChange={(e) =>
                                            handleChange(e, network, "audience")
                                        }
                                        disabled={!edit}
                                    />
                                    ) : <p className="text-gray-600 bg-gray-100 p-2 rounded-xl">{data[network].audience}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </DefaultContainer>
            </div>
            <div className="mt-8 flex justify-center mb-10">
                {edit && (
                    <div className="flex gap-2">
                        <DangerButton
                            type="button"
                            onClick={() => setEdit(false)}
                        >
                            Cancelar
                        </DangerButton>
                        <GreenButton type="submit">Guardar</GreenButton>
                    </div>
                )}
            </div>
        </form>
    );
}
