import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";
import GuideHeader from "./Partials/GuideHeader";
import GuideSteps from "./Partials/GuideSteps";
import GuideSocialInputs from "./Partials/GuideSocialInputs";
import GuideFooter from "./Partials/GuideFooter";
import GuideNote from "./Partials/GuideNote";

export default function Guide() {
    const { data, setData, post, errors } = useForm({
        facebook_page_id: "",
        instagram_account_id: "",
    });

    const handleActivateDemo = () =>
        post(route("demos.activate"), { preserveScroll: true });

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-gray-100">
                <div className="bg-white">
                    <GuideHeader />
                    <div className="p-8 lg:p-12">
                        <GuideSteps />
                        <GuideNote />
                        <GuideSocialInputs
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                        <button
                            className="mt-12 bg-[#002073] text-white font-bold py-3 px-10 rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                            onClick={handleActivateDemo}
                        >
                            Continuar
                        </button>
                    </div>
                    <GuideFooter />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
