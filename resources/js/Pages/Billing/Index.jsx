import { Head } from "@inertiajs/react";
import PricingCard from "./Components/PricingCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Billing({ subscription, products = [] }) {
  return (
    <AuthenticatedLayout>
      <Head title="Facturación" />
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-4 py-6">
        {products.map((p) => (
          <PricingCard key={p.id} product={p} />
        ))}
      </div>
    </AuthenticatedLayout>
  );
}
