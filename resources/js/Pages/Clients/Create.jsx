import React from "react";
import { Head, Link } from "@inertiajs/react";
import ClientForm from "./Partials/Form";
import { IoArrowBack } from "react-icons/io5";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create() {
  return (
    <AuthenticatedLayout>
      <Head title="Nuevo Cliente" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          {/* <h1 className="text-2xl font-bold text-gray-700">Informacion de facturacion</h1> */}
          <Link
            href={route("dashboard")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <IoArrowBack className="mr-1" /> Volver
          </Link>
        </div>

        <ClientForm />
      </div>
    </AuthenticatedLayout>
  );
}
