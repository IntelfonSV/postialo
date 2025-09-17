import { Head, useForm } from "@inertiajs/react";
import PricingCard from "./Components/PricingCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Billing({ subscription }) {
    const { post } = useForm();

    const handlePayment = () => {
        post(route("billing.pay"));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Facturación" />
            <PricingCard />
        </AuthenticatedLayout>
    );
}
