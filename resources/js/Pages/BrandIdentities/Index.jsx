import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BrandIdentityForm from "./Partials/BrandIdentityForm";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import GrayContainer from "@/Components/GrayContainer";
import ElevenLabsWidget from "@/Components/ElevenLabsWidget";
import Logos from "./Partials/Logos";
import BlueButton from "@/Components/BlueButton";
import { Alert, AlertTitle } from "@mui/material";

function Index({ brandIdentity }) {
    const user = usePage().props.auth.user;
    console.log(brandIdentity);
    const [editBrandIdentity, seteditBrandIdentity] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Identidad de Marca" />

            {/* Advertencia antes publicar debes completar */}

            { (brandIdentity == null || (brandIdentity.company_identity === null || brandIdentity.company_history === null || brandIdentity.guidelines_json === null || brandIdentity.products_services === null || brandIdentity.mission_vision === null || brandIdentity.website === null || brandIdentity.whatsapp_number === null || brandIdentity.facebook_page_id === null || brandIdentity.instagram_account_id === null || brandIdentity.logos.length === 0)) &&
                <div>

                <Alert severity="warning">
                <AlertTitle>Advertencia</AlertTitle>
                <p className="text-md mt-5">Antes de publicar debes completar la identidad de marca</p>
            </Alert>
            <br />
            </div>
            }

            <div className="w-full bg-gray-200 p-5 rounded-lg">
                <div className="w-full bg-white p-5 rounded-lg shadow-md mb-5">
                    <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4 items-center py-4">
                        <div></div>
                        <h3 className="text-xl font-semibold text-blue-900 text-center w-full">
                            Identidad de Marca
                        </h3>
                    </div>
                </div>
                <Logos
                    logos={
                        brandIdentity?.logos.length > 0
                            ? brandIdentity?.logos
                            : []
                    }
                />
                <div className="w-full flex justify-end mb-5">
                    {!editBrandIdentity && (
                        <BlueButton
                            onClick={() => seteditBrandIdentity(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 rounded hover:bg-blue-100 transition"
                        >
                            <FaEdit /> Editar
                        </BlueButton>
                    )}
                </div>
                <div className="w-full">
                    <BrandIdentityForm
                        edit={editBrandIdentity}
                        setEdit={seteditBrandIdentity}
                        brandIdentity={brandIdentity}
                    />
                </div>
                <ElevenLabsWidget user={user} />
            </div>
        </AuthenticatedLayout>
    );
}

export default Index;
