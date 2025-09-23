import { Head } from "@inertiajs/react";
import PricingCard from "./Components/PricingCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Banner from "./Components/Banner";
import DemoCard from "@/Components/DemoCard";

export default function Billing({ subscription, products = [], demos = [] }) {
    return (
        <AuthenticatedLayout>
            <Head title="Facturación" />
            <div className="-m-5">
                <Banner />
            </div>
            <div className="flex flex-wrap justify-center gap-6">
                <div className="w-full mt-10">
                <DemoCard />
                </div>
                {products.map((p) => (
                    <PricingCard key={p.id} product={p} />
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
