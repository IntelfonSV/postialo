import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import GreenButton from "@/Components/GreenButton";

function Create({ auth, roles }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        roles: [],
    });

    const handleRoleChange = (roleName) => {
        let newRoles = [...data.roles];
        if (newRoles.includes(roleName)) {
            newRoles = newRoles.filter(r => r !== roleName);
        } else {
            newRoles.push(roleName);
        }
        setData('roles', newRoles);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Crear Nuevo Usuario
                </h2>
            }
        >
            <Head title="Crear Usuario" />

            <div className="py-12 bg-gray-200 rounded-xl">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            {/* Name */}
                            <div>
                                <InputLabel htmlFor="name" value="Nombre" />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FaUser className="text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="block w-full pl-10"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                </div>
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Email */}
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FaEnvelope className="text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="block w-full pl-10"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password */}
                            <div>
                                <InputLabel htmlFor="password" value="Contraseña" />
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="block w-full pl-10"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Roles */}
                            <div>
                                <InputLabel value="Roles" />
                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {roles.map((role) => (
                                        <label key={role.id} className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700"
                                                checked={data.roles.includes(role.name)}
                                                onChange={() => handleRoleChange(role.name)}
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">{role.name}</span>
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.roles} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end">
                                <GreenButton disabled={processing}>
                                    Crear Usuario
                                </GreenButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Create;