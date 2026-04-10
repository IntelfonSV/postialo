import DemoCard from "@/Components/DemoCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import BillingPlans from "./Components/Billing";

export default function Billing({
    subscription,
    products = [],
    demos,
    partners = [],
}) {
    const user = usePage().props.auth.user;
    return (
        <AuthenticatedLayout>
            <Head title="Facturación" />
            {!(demos.length > 0) && (
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                    <DemoCard />
                </div>
            )}
            <BillingPlans />
        </AuthenticatedLayout>
    );
}
