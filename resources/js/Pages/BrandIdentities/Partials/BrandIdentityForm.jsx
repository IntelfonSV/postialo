import DangerButton from "@/Components/DangerButton";
import DefaultContainer from "@/Components/DefaultContainer";
import GreenButton from "@/Components/GreenButton";
import { useForm } from "@inertiajs/react";

export default function BrandIdentityForm({ edit, setEdit, brandIdentity }) {
    let guidelines = {};
    if (!(brandIdentity?.guidelines_json?.facebook || brandIdentity?.guidelines_json?.instagram || brandIdentity?.guidelines_json?.x)) {
        guidelines = brandIdentity?.guidelines_json         
        ? JSON.parse(brandIdentity?.guidelines_json) 
        : {};
    }else{
        guidelines = brandIdentity?.guidelines_json   
    }

    const {data, setData, post, put, processing, errors} = useForm({
        id: brandIdentity?.id || "",
        company_identity: brandIdentity?.company_identity || "",
        mission_vision: brandIdentity?.mission_vision || "",
        products_services: brandIdentity?.products_services || "",
        company_history: brandIdentity?.company_history || "",
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
            put(route('brand-identities.update', data.id), {
                onSuccess: () => {
                    setEdit(false);
                },
            });
        } else {
            post(route('brand-identities.store'), {
                onSuccess: () => {
                    setEdit(false);
                },
            });
        }
    };

    const textAreaClasses =
        "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" +
        (edit ? "" : " bg-gray-50");

    return (
        <div className="w-full max-w-6xl mx-auto p-4 mb-20">
            <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Información General */}
                    <DefaultContainer className="p-6 rounded-2xl shadow-lg shadow-gray-800/50">
                        <h4 className="text-xl font-bold mb-6 text-[#002073]">
                            Información General
                        </h4>
                        <div className="flex flex-col gap-6">
                            <textarea
                                name="company_identity"
                                rows="3"
                                className={textAreaClasses}
                                placeholder="Identidad de la Empresa"
                                value={data.company_identity}
                                onChange={handleChange}
                                disabled={!edit}
                            />
                            <textarea
                                name="mission_vision"
                                rows="3"
                                className={textAreaClasses}
                                placeholder="Misión & Visión"
                                value={data.mission_vision}
                                onChange={handleChange}
                                disabled={!edit}
                            />
                            <textarea
                                name="products_services"
                                rows="3"
                                className={textAreaClasses}
                                placeholder="Productos/Servicios"
                                value={data.products_services}
                                onChange={handleChange}
                                disabled={!edit}
                            />
                            <textarea
                                name="company_history"
                                rows="3"
                                className={textAreaClasses}
                                placeholder="Historia de la Compañía"
                                value={data.company_history}
                                onChange={handleChange}
                                disabled={!edit}
                            />
                        </div>
                    </DefaultContainer>

                    {/* Lineamientos por Red Social */}
                    <DefaultContainer className="p-6 rounded-2xl shadow-lg shadow-gray-800/50">
                        <h4 className="text-xl font-bold mb-6 text-[#002073]">
                            Lineamientos por Red Social
                        </h4>
                        <div>
                            {["facebook", "instagram", "x"].map((network) => (
                                <div key={network} className="">
                                    <h5 className="text-lg font-semibold capitalize mb-3 text-[#002073]">
                                        {network === "x"
                                            ? "X (Twitter)"
                                            : network}
                                    </h5>
                                    <div className="flex flex-col gap-3">
                                        <textarea
                                            rows="2"
                                            className={textAreaClasses}
                                            placeholder="Tono de comunicación"
                                            value={data[network].tone}
                                            onChange={(e) =>
                                                handleChange(e, network, "tone")
                                            }
                                            disabled={!edit}
                                        />
                                        <textarea
                                            rows="2"
                                            className={textAreaClasses}
                                            placeholder="Guías de estilo y contenido"
                                            value={data[network].guidelines}
                                            onChange={(e) =>
                                                handleChange(
                                                    e,
                                                    network,
                                                    "guidelines"
                                                )
                                            }
                                            disabled={!edit}
                                        />
                                        <textarea
                                            rows="2"
                                            className={textAreaClasses}
                                            placeholder="Público objetivo"
                                            value={data[network].audience}
                                            onChange={(e) =>
                                                handleChange(
                                                    e,
                                                    network,
                                                    "audience"
                                                )
                                            }
                                            disabled={!edit}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DefaultContainer>
                </div>

                <div className="mt-8 flex justify-end">
                    {edit && (
                        <div className="flex gap-2">
                            {" "}
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
        </div>
    );
}
