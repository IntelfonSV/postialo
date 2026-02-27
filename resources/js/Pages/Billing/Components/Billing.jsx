import { router } from "@inertiajs/react";
import React, { useEffect, useMemo, useRef } from "react";
import {
  FaCheckCircle,
  FaBrain,
  FaMagic,
  FaWhatsapp,
  FaFunnelDollar,
  FaChartLine,
  FaLayerGroup,
  FaUsers,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";

export default function BillingPlans() {
  const revealRefs = useRef([]);

  const styles = useMemo(
    () => ({
      postialoBlue: "#002073",
      postialoRed: "#FD2B2B",
      agencyPurple: "#8B5CF6",
    }),
    []
  );

  useEffect(() => {
    const els = revealRefs.current.filter(Boolean);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("active");
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -80px 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const addRevealRef = (el) => {
    if (!el) return;
    if (!revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-[#1a1a1a] scroll-smooth">
      {/* Estilos locales (los que eran <style> en HTML) */}
      <style>{`
        :root {
          --postialo-blue: ${styles.postialoBlue};
          --postialo-red: ${styles.postialoRed};
          --agency-purple: ${styles.agencyPurple};
        }
        .text-postialo-blue { color: var(--postialo-blue); }
        .text-postialo-red { color: var(--postialo-red); }
        .bg-postialo-blue { background-color: var(--postialo-blue); }
        .bg-postialo-red { background-color: var(--postialo-red); }
        .border-postialo-blue { border-color: var(--postialo-blue); }
        .border-postialo-red { border-color: var(--postialo-red); }
        .header-gradient { background: linear-gradient(135deg, var(--postialo-blue) 0%, #001242 100%); }
        .custom-shadow { box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); }

        @keyframes float { 0%{transform:translateY(0)} 50%{transform:translateY(-12px)} 100%{transform:translateY(0)} }
        .float-animation { animation: float 4s ease-in-out infinite; }

        .card-pricing { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-top: 6px solid transparent; }
        .card-pricing:hover { transform: translateY(-15px); box-shadow: 0 30px 60px -12px rgba(0, 32, 115, 0.15); }

        .btn-shiny { position: relative; overflow: hidden; }
        .btn-shiny::after {
          content:'';
          position:absolute;
          top:-50%;
          left:-50%;
          width:200%;
          height:200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: rotate(45deg);
          transition: 0.6s;
        }
        .btn-shiny:hover::after { left: 120%; }

        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* Hero */}
      <header className="header-gradient relative overflow-hidden px-6 pb-32 pt-20 text-center text-white">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="10" cy="10" r="30" fill="white" />
            <circle cx="90" cy="80" r="20" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">
            Post<span className="text-postialo-red">IA</span>lo: Potencia tu Presencia Digital
          </h1>
          <p className="mx-auto max-w-2xl text-xl font-light text-blue-100 md:text-2xl">
            Estructura de planes diseñada para escalar tu negocio con Inteligencia Artificial.
          </p>
        </div>
      </header>

      {/* Pricing */}
      <section className="relative z-20 mx-auto -mt-20 mb-24 max-w-7xl px-6">
        <div className="flex justify-center gap-4">
          {/* Básico */}
          <div
            ref={addRevealRef}
            className="reveal active flex flex-col rounded-[2rem] bg-white p-8 card-pricing custom-shadow max-w-sm"
            style={{ borderTopColor: "var(--postialo-blue)" }}
          >
            <div className="mb-8">
              <span className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-postialo-blue">
                Tú tienes el control
              </span>
              <h3 className="mb-2 text-2xl font-black italic text-postialo-blue">Básico</h3>

              <div className="mb-2 flex items-baseline gap-1">
                <span className="text-5xl font-black text-postialo-blue">$25.00</span>
                <span className="font-medium text-gray-400">/mes</span>
              </div>

              <p className="mb-4 text-sm font-bold italic text-postialo-red">
                ¡Puedes adaptar tu plan según tu necesidad!
              </p>

              <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-tighter text-postialo-blue">
                  Base de Crecimiento:
                </p>
                <ul className="space-y-2 text-[12px] leading-tight text-gray-700">
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-[10px] text-postialo-blue" />
                    <span>
                      Inicia con <b>14 publicaciones</b> base.
                    </span>
                  </li>
                </ul>

                <div className="mt-4 border-t border-blue-100 pt-4">
                  <p className="text-[11px] italic leading-relaxed text-gray-500">
                    <b className="not-italic text-postialo-blue">Ejemplo:</b> Si tu negocio requiere 20 publicaciones
                    mensuales, el costo se ajusta proporcionalmente y pagarás solo <b>$37 al mes</b> ($25 del plan base +
                    excedente).
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-10 flex-grow space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-postialo-blue">
                  <FaCheckCircle />
                </div>
                <p className="text-sm leading-snug text-gray-600">
                  <b>Portal SaaS:</b> Programación total de redes sociales.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-postialo-blue">
                  <FaBrain />
                </div>
                <p className="text-sm leading-snug text-gray-600">
                  <b>IA Generativa:</b> Creación de copys e imágenes desde cero.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-postialo-blue">
                  <FaMagic />
                </div>
                <p className="text-sm leading-snug text-gray-600">
                  <b>IA de Optimización:</b> Regenera y pule contenidos.
                </p>
              </div>
            </div>

            <button className="btn-shiny w-full rounded-2xl bg-postialo-blue py-4 text-sm font-bold text-white shadow-lg shadow-blue-100 transition-transform active:scale-95" onClick={()=>router.post(route("users.demo"))}>
              Comenzar ahora
            </button>
          </div>

{/*
          <div
            ref={addRevealRef}
            className="reveal active relative z-10 flex flex-col rounded-[2rem] bg-white p-8 card-pricing custom-shadow md:scale-105 max-w-sm"
            style={{ borderTopColor: "var(--postialo-red)" }}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-postialo-red px-4 py-1 text-[10px] font-bold tracking-widest text-white shadow-lg">
              MÁS ELEGIDO
            </div>

            <div className="mb-8">
              <span className="mb-4 inline-block rounded-full bg-red-50 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-postialo-red">
                Escalabilidad y Ventas
              </span>
              <h3 className="mb-2 text-2xl font-black italic text-postialo-red">Profesional</h3>

              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-5xl font-black text-postialo-blue">$125.00</span>
                <span className="font-medium text-gray-400">/mes</span>
              </div>

              <p className="text-sm font-bold italic text-gray-700">Todo lo del Plan Básico más:</p>
            </div>

            <div className="mb-10 flex-grow space-y-4">
              <div className="flex items-start gap-4">
                <div className="float-animation mt-1 text-xl text-postialo-red">
                  <FaWhatsapp />
                </div>
                <div>
                  <p className="text-sm font-bold text-postialo-blue">Asistente Virtual (Bot IA)</p>
                  <p className="text-[12px] text-gray-500">Respuestas 24/7 basadas en tus FAQs.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-postialo-red">
                  <FaFunnelDollar />
                </div>
                <p className="text-sm leading-snug text-gray-600">
                  <b>Módulo Lead Generation:</b> Captura de datos de clientes.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-postialo-red">
                  <FaChartLine />
                </div>
                <p className="text-sm leading-snug text-gray-600">
                  <b>Dashboard Analítico:</b> Métricas de interacciones.
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-red-100 bg-red-50/50 p-4">
                <p className="mb-1 text-[11px] font-black uppercase tracking-tighter text-postialo-red">
                  Especial Restaurante Pro
                </p>
                <p className="text-[11px] leading-tight text-gray-600">
                  Inclusión sin costo en el Marketplace Gastronómico.
                </p>
              </div>
            </div>

            <button className="btn-shiny w-full rounded-2xl bg-postialo-red py-4 text-sm font-bold text-white shadow-lg shadow-red-100 transition-transform active:scale-95">
              Potenciar mi negocio
            </button>
          </div>

          <div
            ref={addRevealRef}
            className="reveal active flex flex-col rounded-[2rem] bg-white p-8 card-pricing custom-shadow max-w-sm"
            style={{ borderTopColor: "var(--agency-purple)" }}
          >
            <div className="mb-8">
              <span className="mb-4 inline-block rounded-full bg-purple-50 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-600">
                Colaboración y Catálogos
              </span>
              <h3 className="mb-2 text-2xl font-black italic text-purple-600">Agencia</h3>

              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-5xl font-black text-postialo-blue">$300.00</span>
                <span className="font-medium text-gray-400">/mes</span>
              </div>

              <p className="text-sm font-bold italic text-gray-700">Todo lo del Plan Profesional más:</p>
            </div>

            <div className="mb-10 flex-grow space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-purple-600">
                  <FaLayerGroup />
                </div>
                <p className="text-sm leading-snug text-gray-600">
                  <b>Catálogo Inteligente:</b> Integración de productos directa.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-purple-600">
                  <FaMagic />
                </div>
                <p className="text-sm leading-snug text-gray-600">
                  <b>IA de Edición Avanzada:</b> Modifica imágenes del inventario.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-purple-600">
                  <FaUsers />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight text-gray-700">Estructura Multi-cuenta</p>
                  <p className="mt-1 text-[11px] text-gray-500">
                    Afilia socios por <b>$25.00/mes</b> c/u.
                  </p>
                </div>
              </div>
            </div>

            <button className="btn-shiny w-full rounded-2xl bg-purple-600 py-4 text-sm font-bold text-white shadow-lg shadow-purple-100 transition-transform active:scale-95">
              Contactar Ventas
            </button>
          </div>

          */}
        </div>
      </section>

      {/* Comparativa */}
      <section ref={addRevealRef} className="reveal mx-auto mb-24 max-w-6xl px-6 hidden">
        <div className="mb-12 text-center">
          <h2 className="text-postialo-blue text-3xl font-black uppercase italic tracking-tighter">
            Resumen Comparativo de Funciones
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-postialo-red" />
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-8 py-5 text-xs font-bold uppercase text-gray-400">Característica</th>
                  <th className="px-6 py-5 text-center text-sm font-black uppercase text-postialo-blue">Básico</th>
                  <th className="px-6 py-5 text-center text-sm font-black uppercase text-postialo-red">Profesional</th>
                  <th className="px-6 py-5 text-center text-sm font-black uppercase text-purple-600">Agencia</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-50">
                  <td className="px-8 py-5 font-bold italic text-gray-700">Precio Mensual</td>
                  <td className="px-6 py-5 text-center font-bold text-postialo-blue">$25</td>
                  <td className="px-6 py-5 text-center font-bold text-postialo-blue">$125</td>
                  <td className="px-6 py-5 text-center font-bold text-postialo-blue">$300</td>
                </tr>

                <tr className="border-b border-gray-50 bg-gray-50/20">
                  <td className="px-8 py-5 font-bold italic text-gray-700">Bot WhatsApp IA</td>
                  <td className="px-6 py-5 text-center text-gray-300">
                    <FaTimes />
                  </td>
                  <td className="px-6 py-5 text-center text-green-500">
                    <FaCheckCircle />
                  </td>
                  <td className="px-6 py-5 text-center text-green-500">
                    <FaCheckCircle />
                  </td>
                </tr>

                <tr className="border-b border-gray-50">
                  <td className="px-8 py-5 font-bold italic text-gray-700">Dashboard Métricas</td>
                  <td className="px-6 py-5 text-center text-gray-300">
                    <FaTimes />
                  </td>
                  <td className="px-6 py-5 text-center text-green-500">
                    <FaCheckCircle />
                  </td>
                  <td className="px-6 py-5 text-center text-green-500">
                    <FaCheckCircle />
                  </td>
                </tr>

                <tr className="border-b border-gray-50 bg-gray-50/20">
                  <td className="px-8 py-5 font-bold italic text-gray-700">Catálogo Propio</td>
                  <td className="px-6 py-5 text-center text-gray-300">
                    <FaTimes />
                  </td>
                  <td className="px-6 py-5 text-center text-gray-300">
                    <FaTimes />
                  </td>
                  <td className="px-6 py-5 text-center text-[10px] font-black uppercase text-purple-600">
                    Sí (Integrado)
                  </td>
                </tr>

                <tr>
                  <td className="px-8 py-5 font-bold italic text-gray-700">Cuentas Socios</td>
                  <td className="px-6 py-5 text-center text-gray-300">
                    <FaTimes />
                  </td>
                  <td className="px-6 py-5 text-center text-gray-300">
                    <FaTimes />
                  </td>
                  <td className="px-6 py-5 text-center text-[11px] font-black text-purple-600">
                    $25 p/cuenta
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-5xl px-6 pb-20 text-center">
        <div className="mb-12 rounded-[2rem] border border-blue-100 bg-blue-50/50 p-8">
          <p className="mx-auto max-w-2xl text-xs font-medium italic leading-relaxed text-blue-400">
            <FaInfoCircle className="mr-1 inline-block align-[-2px]" />
            Opción de conexión con sistemas externos (CRM, ERP, etc.) y/o para integración con bot de WhatsApp mediante
            una cotización de implementación de pago único.
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-gray-100 pt-8 md:flex-row">
          <div className="text-postialo-blue text-2xl font-black italic tracking-tighter">
            Post<span className="text-postialo-red">IA</span>lo
          </div>
          <p className="text-xs font-medium text-gray-400">
            © 2026 PostIAlo. Tecnología salvadoreña conectando al mundo.
          </p>
        </div>
      </footer>
    </div>
  );
}