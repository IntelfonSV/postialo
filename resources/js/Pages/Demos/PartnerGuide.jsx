import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuideHeader from "./Partials/GuideHeader";
import GuideSteps from "./Partials/GuideSteps";
import GuideNote from "./Partials/GuideNote";
import GuideSocialInputs from "./Partials/GuideSocialInputs";
import PartnerCodeForm from "./Partials/PartnerCodeForm";
import GuideFooter from "./Partials/GuideFooter";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import PartnerValidatedCard from "./Partials/PartnerValidatedCard";

export default function PartnerGuide() {
    const { data, setData, post, errors, processing } = useForm({
        partner_id: "",
        partner_code: "",
        facebook_page_id: "",
        instagram_account_id: "",
    });

    const [partner, setPartner] = useState(null);
    const handleActivateDemo = () =>
        post(route("demos.activate"), { preserveScroll: true });

    const handlePartnerCodeSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                route("partner.validate-partner-code"),
                data,
            );
            setPartner(response.data.partner);
            setData({ ...data, partner_id: response.data.partner.id });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-gray-100">
                <div className="bg-white">
                    <GuideHeader />
                    {!partner && (
                        <PartnerCodeForm
                            data={data}
                            setData={setData}
                            processing={processing}
                            errors={errors}
                            onSubmit={handlePartnerCodeSubmit}
                        />
                    )}

                    <PartnerValidatedCard partner={partner} />

                    {partner && (
                        <div className="p-8 lg:p-12">
                            <GuideSteps />
                            <GuideNote />
                            <GuideSocialInputs
                                data={data}
                                setData={setData}
                                errors={errors}
                            />

                            <div className="flex justify-center">
                                <button
                                    className="mt-12 bg-[#002073] text-white font-bold py-3 px-10 rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                                    onClick={handleActivateDemo}
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    )}
                    <GuideFooter />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
