import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BrandIdentityForm from "./Partials/BrandIdentityForm";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import { Head } from "@inertiajs/react";
import GrayContainer from "@/Components/GrayContainer";

function Index({ brandIdentity }) {
    const [editBrandIdentity, seteditBrandIdentity] = useState(false);
    return (
        <AuthenticatedLayout>
            <div>
                <GrayContainer>
                    <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-2 items-center">
                        <div>
                        </div>
                        <h3 className="text-xl font-semibold text-blue-900 text-center w-full">
                            Identidad de Marca
                        </h3>

                        <div>
                            {!editBrandIdentity && (
                                <button
                                    onClick={() => seteditBrandIdentity(true)}
                                    className="flex items-center gap-2 hover:bg-blue-200 px-2 h-8 rounded text-blue-700"
                                >
                                    <FaEdit /> Editar
                                </button>
                            )}
                        </div>
                    </div>
                </GrayContainer>
                <Head title="Identidad de Marca" />
                <BrandIdentityForm
                    edit={editBrandIdentity}
                    setEdit={seteditBrandIdentity}
                    brandIdentity={brandIdentity}
                />
            </div>
        </AuthenticatedLayout>
    );
}

export default Index;
