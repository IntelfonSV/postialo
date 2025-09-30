import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BrandIdentityForm from "./Partials/BrandIdentityForm";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import GrayContainer from "@/Components/GrayContainer";
import ElevenLabsWidget from "@/Components/ElevenLabsWidget";
import Logos from "./Partials/Logos";

function Index({ brandIdentity }) {

    const user = usePage().props.auth.user;
    console.log(brandIdentity);
    const [editBrandIdentity, seteditBrandIdentity] = useState(false);
    return (
        <AuthenticatedLayout>
            <div className="w-full">
                <GrayContainer>
                    <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4 items-center py-4">
                        <div></div>
                        <h3 className="text-xl font-semibold text-blue-900 text-center w-full">
                            Identidad de Marca
                        </h3>

                        <div>
                            {!editBrandIdentity && (
                                <button
                                    onClick={() => seteditBrandIdentity(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 rounded hover:bg-blue-100 transition"
                                >
                                    <FaEdit /> Editar
                                </button>
                            )}
                        </div>
                    </div>
                </GrayContainer>
                <Head title="Identidad de Marca" />
            </div>
            <div className="w-full">
                <div className="w-full bg-gray-500 p-5 rounded-lg">
                    <Logos logos={brandIdentity?.logos? brandIdentity?.logos : []} />
                    <BrandIdentityForm
                        edit={editBrandIdentity}
                        setEdit={seteditBrandIdentity}
                        brandIdentity={brandIdentity}
                    />
                </div>
            </div>
            <ElevenLabsWidget user={user} />
        </AuthenticatedLayout>
    );
}

export default Index;
