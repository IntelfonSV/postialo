import { router } from "@inertiajs/react";
import React, { useState } from "react";

export default function PricingCard({ product }) {
    const [processing, setProcessing] = useState(false);

    const getCsrf = () => {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.getAttribute("content") : "";
    };

    const money = (n, c = product?.currency || "USD") =>
        new Intl.NumberFormat("es-SV", {
            style: "currency",
            currency: c,
        }).format(n ?? 0);

    const handleBuy = async () => {
        try {
            setProcessing(true);

            const payload = {
                product_id: product?.id,
                qty: 1,
                custom_params: {},
            };

            // router.post(route("billing.pay"), payload, {
            //     preserveScroll: true,
            //     onFinish: () => {
            //         setProcessing(false);
            //     },
            // });

            const res = await fetch(route("billing.pay"), {
              method: "POST",
              credentials: "same-origin",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": getCsrf(),
              },
              body: JSON.stringify(payload),
            });

              const data = await res.json().catch(() => ({}));

              if (res.ok && data?.url) {
                // Redirigir en la misma pestaña
                window.location.href = data.url;
              } else {
                alert(data?.message || "No se pudo generar el enlace de pago.");
              }
        } catch (e) {
            console.error(e);
            alert("Error conectando con el servidor.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="">
            {/* Card de precio */}
            <div className="flex justify-center px-4 py-6">
                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr,1.1fr] bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-lg animate-scaleIn">
                    <div className="h-full">
                        <img
                            src="https://i.ibb.co/2YkSQhFp/6845-0001.jpg"
                            alt="Imagen de Repuestos confiables"
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-6 text-white">
                        {product?.name && (
                            <div className="text-blue-900 text-lg font-semibold mt-1">
                                {product.name}
                            </div>
                        )}

                        <div className="text-4xl font-black text-blue-900">
                            {money(product?.price ?? 150)}{" "}
                            <span className="text-base font-bold">/mes</span>
                        </div>
                        <p className="text-blue-900 text-lg mt-2 mb-3">
                            "No tengo nada, pero quiero que mi marca esté
                            presente sin hacer esfuerzo."
                        </p>
                        <p className="text-gray-800 mb-2">
                            No tiene que preocuparse por nada. Creamos las
                            imágenes y textos desde cero según sus ideas.
                        </p>
                        <b className="text-blue-900 block mt-2 mb-4">
                            Regístrate para efectuar la compra.
                        </b>
                        <ul className="list-disc list-inside text-gray-800 space-y-1">
                            <li>Imágenes generadas con IA</li>
                            <li>Textos generados con IA</li>
                            <li>Publicación 3 veces por semana</li>
                            <li>Publicación en las plataformas del cliente</li>
                            <li>Activación inmediata</li>
                            <li>
                                Reunión de asesoría inicial para levantar
                                información de su marca
                            </li>
                            <li>
                                Acceso a hoja de indicaciones para dictar
                                contenido
                            </li>
                        </ul>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleBuy}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition"
                            >
                                Comprar ahora
                            </button>
                            <a
                                href="/contactus"
                                className="border border-gray-800 text-gray-800 hover:text-white hover:border-white transition font-semibold py-2 px-4 rounded-xl hover:bg-gray-800"
                            >
                                Contáctenos
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay de pago */}
            {processing && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 text-white z-[9999]">
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <p className="mt-4 font-bold">
                        Estamos procesando tu pago...
                    </p>
                </div>
            )}

            {/* Animación personalizada */}
            <style>{`
        @keyframes scaleIn {
          from { transform: scale(.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out both;
        }
      `}</style>
        </div>
    );
}
