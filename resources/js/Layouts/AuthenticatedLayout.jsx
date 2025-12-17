import ApplicationLogo from "@/Components/ApplicationLogo";
import DefaultContainer from "@/Components/DefaultContainer";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import Notification from "@/Components/Notification";

export default function AuthenticatedLayout({ header, children }) {
    const { auth, partner } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-white pt-2 px-2 relative">
            <div className="fixed w-full z-50 right-0 top-0 px-2 bg-[#002073] border-b border-gray-200">
                <nav className="">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex ">
                                <div className="flex shrink-0 items-center  gap-2">
                                    {partner && (
                                        <div className="flex shrink-0 items-center">
                                            <a
                                                href={partner.branding.url}
                                                target="_blank"
                                                className="text-white font-bold text-3xl bg-gray-100 p-1 rounded"
                                            >
                                                <img
                                                    src={partner.logo_path}
                                                    alt=""
                                                />
                                            </a>
                                        </div>
                                    )}

                                    {/* <Link
                                        href={route("home")}
                                        className="text-white font-bold text-3xl"
                                    >
                                        Post
                                        <span className="text-red-500">IA</span>
                                        lo
                                    </Link> */}

                                    <Link
                                        href={route("home")}
                                        className="text-white font-bold text-lg"
                                    >
                                        Post
                                        <span className="text-red-500">IA</span>
                                        lo {" "}
                                        <span className="text-white text-lg"><span className="text-red-500">x</span> Restaurantes</span>
                                    </Link>
                                </div>

                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    {auth.user.roles.includes("admin") && (
                                        <NavLink
                                            href={route("dashboard")}
                                            active={route().current(
                                                "dashboard",
                                            )}
                                        >
                                            Dashboard
                                        </NavLink>
                                    )}
                                    {auth.user.roles.includes("admin") && (
                                        <NavLink
                                            href={route("users.index")}
                                            active={route().current(
                                                "users.index",
                                            )}
                                        >
                                            Usuarios
                                        </NavLink>
                                    )}
                                    <NavLink
                                        href={route("brand-identities.index")}
                                        active={route().current(
                                            "brand-identities.index",
                                        )}
                                    >
                                        Identidad de Marca
                                    </NavLink>
                                    <NavLink
                                        href={route("templates.index")}
                                        active={route().current(
                                            "templates.index",
                                        )}
                                    >
                                        Plantillas HTML
                                    </NavLink>
                                    <NavLink
                                        href={route("schedules.index")}
                                        active={route().current(
                                            "schedules.index",
                                        )}
                                    >
                                        Programación
                                    </NavLink>
                                    <NavLink
                                        href={route("scheduled-posts.index")}
                                        active={route().current(
                                            "scheduled-posts.index",
                                        )}
                                    >
                                        Publicaciones
                                    </NavLink>
                                </div>
                            </div>

                            <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                <div className="relative ms-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                >
                                                    {auth.user.name}

                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                            >
                                                Perfil
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                            >
                                                Cerrar Sesión
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState,
                                        )
                                    }
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            className={
                                                !showingNavigationDropdown
                                                    ? "inline-flex"
                                                    : "hidden"
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={
                                                showingNavigationDropdown
                                                    ? "inline-flex"
                                                    : "hidden"
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            (showingNavigationDropdown ? "block" : "hidden") +
                            " sm:hidden"
                        }
                    >
                        <div className="space-y-1 pb-3 pt-2">
                            <ResponsiveNavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                            >
                                Dashboard
                            </ResponsiveNavLink>
                            {auth.user.roles.some(
                                (role) => role.name === "admin",
                            ) && (
                                <ResponsiveNavLink
                                    href={route("users.index")}
                                    active={route().current("users.index")}
                                >
                                    Usuarios
                                </ResponsiveNavLink>
                            )}
                            <ResponsiveNavLink
                                href={route("brand-identities.index")}
                                active={route().current(
                                    "brand-identities.index",
                                )}
                            >
                                Identidad de Marca
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route("templates.index")}
                                active={route().current("templates.index")}
                            >
                                Plantillas HTML
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route("schedules.index")}
                                active={route().current("schedules.index")}
                            >
                                Programación
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route("scheduled-posts.index")}
                                active={route().current(
                                    "scheduled-posts.index",
                                )}
                            >
                                Publicaciones
                            </ResponsiveNavLink>
                        </div>

                        <div className="border-t border-gray-200 pb-1 pt-4">
                            <div className="px-4">
                                <div className="text-base font-medium text-gray-800">
                                    {auth.user.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {auth.user.email}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route("profile.edit")}>
                                    Profile
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                >
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>
                <Notification />
            </div>
            <div className="w-full mt-20 ">
                {header && (
                    <header className="bg-white shadow mt-5 rounded-xl">
                        <DefaultContainer className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-[#002073] rounded-xl shadow-gray-800/50 shadow-md border-gray-200 border">
                            {header}
                        </DefaultContainer>
                    </header>
                )}

                <main className="mt-5">{children}</main>
            </div>
        </div>
    );
}
