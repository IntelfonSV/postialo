// resources/js/Pages/Welcome.jsx
import React from "react";
import { usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

// React Icons
import {
    FaInstagram,
    FaFacebookSquare,
    FaCalendarAlt,
    FaRobot,
    FaImage,
    FaShieldAlt,
    FaBolt,
    FaMagic,
} from "react-icons/fa";

// Material UI
import { Button, Chip, Tooltip, Divider } from "@mui/material";

export default function Welcome() {
    const user = usePage().props?.auth?.user ?? { name: "Usuario" };

    return (
        <AuthenticatedLayout>
            <main className="min-h-screen w-full bg-gray-50">
                {/* HERO */}
                <section className="relative overflow-hidden">
                    <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-[#eef2f9] blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#fbeaec] blur-3xl" />

                    <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20 relative">
                        <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
                            <div className="flex-1 text-center lg:text-left">
                                <Chip
                                    label={
                                        <p>
                                            Post
                                            <span className="text-[#ee3c06]">
                                                IA
                                            </span>
                                            lo
                                        </p>
                                    }
                                    color="primary"
                                    className="!bg-[#002073] !text-white !font-bold"
                                />
                                <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-[#002073] leading-tight text-wrap">
                                    ¡Bienvenido, {user.name}!
                                </h1>
                                <p className="mt-3 text-gray-600 text-lg">
                                    Genere contenido profesional, prográmelo y
                                    publique sin perder tiempo. Todo desde un
                                    solo lugar..
                                </p>

                                <div className="mt-6 flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                                    <Tooltip title="Crear una publicación con IA">
                                        <Button
                                            component={Link}
                                            href={
                                                route?.("schedules.index") ??
                                                "#"
                                            }
                                            variant="contained"
                                            className="!bg-[#002073] !px-5 !py-2.5 !rounded-xl"
                                            startIcon={<FaRobot />}
                                        >
                                            Crear post con IA
                                        </Button>
                                    </Tooltip>

                                    <Tooltip title="Programar publicaciones en tu calendario">
                                        <Button
                                            component={Link}
                                            href={
                                                route?.(
                                                    "schedules.calendar",
                                                ) ?? "#"
                                            }
                                            variant="outlined"
                                            className="!border-[#002073] !text-[#002073] !px-5 !py-2.5 !rounded-xl"
                                            startIcon={<FaCalendarAlt />}
                                        >
                                            Ver calendario
                                        </Button>
                                    </Tooltip>

                                    <div className="flex items-center gap-2 ml-2">
                                        <FaInstagram className="text-pink-600 text-2xl" />
                                        <FaFacebookSquare className="text-blue-600 text-2xl" />
                                    </div>
                                </div>
                                {/* 
                <div className="mt-4 flex items-center gap-3 justify-center lg:justify-start flex-wrap">
                  <Chip
                    label="Publicación automática"
                    variant="outlined"
                    className="!border-gray-300 !text-gray-700"
                  />
                  <Chip
                    label="Generación de imágenes"
                    variant="outlined"
                    className="!border-gray-300 !text-gray-700"
                  />
                  <Chip
                    label="Copys con IA"
                    variant="outlined"
                    className="!border-gray-300 !text-gray-700"
                  />
                </div> */}
                            </div>

                            <div className="flex-1 w-full">
                                {/* Mockup tarjeta previa del post */}
                                <div className="mx-auto max-w-md rounded-2xl shadow-lg border bg-white overflow-hidden">
                                    <div className="h-56 bg-gradient-to-br from-[#002073] to-[#5e7ae6] flex items-center justify-center">
                                        <FaImage className="text-white/90 text-6xl" />
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <FaCalendarAlt />
                                            <span>Programado: Hoy 4:30 PM</span>
                                        </div>
                                        <h3 className="mt-2 font-bold text-gray-900">
                                            “Lanzamiento de nuestra nueva
                                            colección”
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Copys generados con IA, hashtags y
                                            emojis listos para maximizar
                                            alcance.
                                        </p>
                                        <Divider className="!my-3" />
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <FaInstagram className="text-pink-600" />
                                                <FaFacebookSquare className="text-blue-600" />
                                            </div>
                                            <Chip
                                                size="small"
                                                label="Auto"
                                                className="!bg-emerald-50 !text-emerald-700 !font-semibold"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* /mockup */}
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURES */}
                <section className="mx-auto max-w-6xl px-6 py-12">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#002073] text-center">
                        Tu publicador que lo tiene todo
                    </h2>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={<FaRobot />}
                            title="Copys generados automáticamente"
                            desc="Textos adaptados a su identidad de marca. Ideas, tonos, hashtags y variaciones listos para utilizar, según lo que usted defina."
                        />
                        <FeatureCard
                            icon={<FaImage />}
                            title="Generación de Imágenes"
                            desc="Diseños visuales con el estilo de su negocio, creados a partir de lo que usted desea comunicar."
                        />
                        <FeatureCard
                            icon={<FaCalendarAlt />}
                            title="Programación"
                            desc="Calendario de publicaciones con vista mensual, recordatorios automáticos y control total de su contenido desde nuestro portal exclusivo."
                        />
                        <FeatureCard
                            icon={<FaBolt />}
                            title="Publicación automática"
                            desc="Posteo automático en sus cuentas de Instagram y Facebook"
                        />
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section className="mx-auto max-w-6xl px-6 pb-16">
                    <div className="bg-white border rounded-2xl shadow-sm p-6 md:p-8">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002073]">
                            ¿Cómo funciona?
                        </h3>
                        <ol className="mt-6 grid md:grid-cols-4 gap-6">
                            <Step
                                n={1}
                                title="Defina su marca"
                                desc="Ingrese su logotipo, colores, sitio web y número de WhatsApp. Esta información será la base para todo el contenido que se generará para su negocio."
                            />
                            <Step
                                n={2}
                                title="Personalice su publicación"
                                desc="Indique el tema, el objetivo de comunicación y cómo desea que se vea la imagen."
                            />
                            <Step
                                n={3}
                                title="Escoja su plantilla"
                                desc="Seleccione una de las plantillas prediseñadas disponibles. Estas se ajustarán automáticamente a la identidad visual que usted definió."
                            />
                            <Step
                                n={4}
                                title="Programe y publique"
                                desc="Revise y apruebe el contenido. Luego, decida si desea programar sus publicaciones o hacerlas visibles de inmediato en sus redes sociales."
                            />
                        </ol>

                        {/* <div className="mt-8 flex flex-wrap gap-3">
                            <Chip
                                icon={<FaShieldAlt />}
                                label="Roles seguros (no pedimos tu password)"
                                variant="outlined"
                                className="!border-gray-300 !text-gray-700"
                            />
                            <Chip
                                icon={<FaMagic />}
                                label="Plantillas inteligentes"
                                variant="outlined"
                                className="!border-gray-300 !text-gray-700"
                            />
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Tooltip title="Iniciar creación con IA">
                                <Button
                                    component={Link}
                                    href={route?.("schedules.index") ?? "#"}
                                    variant="contained"
                                    className="!bg-[#002073] !px-5 !py-2.5 !rounded-xl"
                                    startIcon={<FaRobot />}
                                >
                                    Empezar ahora
                                </Button>
                            </Tooltip>

                            <Tooltip title="Ver tus publicaciones programadas">
                                <Button
                                    component={Link}
                                    href={
                                        route?.("scheduled-posts.index") ?? "#"
                                    }
                                    variant="outlined"
                                    className="!border-[#002073] !text-[#002073] !px-5 !py-2.5 !rounded-xl"
                                    startIcon={<FaCalendarAlt />}
                                >
                                    Ir al calendario
                                </Button>
                            </Tooltip>
                        </div> */}
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="py-8 border-t bg-white">
                    <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} PostIAlo — Publicación
                            automática con IA.
                        </p>
                        <div className="flex items-center gap-4 text-gray-400">
                            <FaInstagram className="text-pink-600 text-xl" />
                            <FaFacebookSquare className="text-blue-600 text-xl" />
                        </div>
                    </div>
                </footer>
            </main>
        </AuthenticatedLayout>
    );
}

/* ----------------- Subcomponentes ----------------- */

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="h-11 w-11 rounded-xl bg-[#eef2f9] text-[#002073] flex items-center justify-center text-xl">
                {icon}
            </div>
            <h4 className="mt-4 font-bold text-gray-900">{title}</h4>
            <p className="text-gray-600 mt-1">{desc}</p>
        </div>
    );
}

function Step({ n, title, desc }) {
    return (
        <li className="relative pl-14 min-h-[2.75rem]">
            <span className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full shadow bg-[#002073] text-white font-bold">
                {n}
            </span>
            <h5 className="font-semibold text-gray-900">{title}</h5>
            <p className="text-gray-600 text-sm">{desc}</p>
        </li>
    );
}
