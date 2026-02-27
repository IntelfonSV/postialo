import { Head } from "@inertiajs/react";
import PricingCard from "./Components/PricingCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Banner from "./Components/Banner";
import DemoCard from "@/Components/DemoCard";
import PartnerCard from "@/Components/PartnerCard";
import BillingPlans from "./Components/Billing";
import { usePage } from "@inertiajs/react";

export default function Billing({ subscription, products = [], demos, partners = [] }) {
    const user = usePage().props.auth.user;
    console.log(user);
    
    return (
        <AuthenticatedLayout>
            <Head title="Facturación" />
            {/* <div className="-m-5">
                <Banner />
                </div> */}

{
    !(demos.length > 0 )  && (
        <div className="flex flex-wrap justify-center gap-6 mb-12">
            <DemoCard />
        </div>
    )
}
            <BillingPlans />

            {/* <div className="flex flex-wrap justify-center gap-6">
                <div className="w-full mt-10 flex flex-wrap justify-center gap-6">
                    <PartnerCard />
                </div>
                {products.map((p) => (
                    <PricingCard key={p.id} product={p} />
                ))}
            </div> */}
        </AuthenticatedLayout>
    );
}
