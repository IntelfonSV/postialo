import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";

import { IoArrowBack } from "react-icons/io5";
import ClientForm from "./Partials/Form";

export default function Edit() {
  const { client } = usePage().props;

  return (
    <>
      <Head title={`Editar ${client.nombre_cliente}`} />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-700">Editar Cliente</h1>
          <Link
            href={route("clients.index")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <IoArrowBack className="mr-1" /> Volver
          </Link>
        </div>

        <ClientForm client={client} />
      </div>
    </>
  );
}
