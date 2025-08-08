import DefaultContainer from "@/Components/DefaultContainer";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BrandIdentityForm from "./Partials/BrandIdentityForm";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";

function Index({brandIdentity}) {
    const [editBrandIdentity, seteditBrandIdentity] = useState(false);
    return ( 
        <AuthenticatedLayout

         header={<div className="flex justify-between"><h3 className="mb-8 text-xl font-semibold">Identidad de Marca</h3>

            {!editBrandIdentity &&<button onClick={() => seteditBrandIdentity(true)} className="flex items-center gap-2 hover:bg-gray-200 px-2 h-8 rounded"><FaEdit /> Editar</button>}
            </div>
         }
        >
            <div>
                <BrandIdentityForm edit={editBrandIdentity} setEdit={seteditBrandIdentity} brandIdentity={brandIdentity}/>
            </div>
        </AuthenticatedLayout>
    );
}

export default Index;