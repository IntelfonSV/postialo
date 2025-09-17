import BlueButton from '@/Components/BlueButton';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar contraseña" />

            <div className="mb-4 text-sm text-gray-600">
                ¿Olvidaste tu contraseña? No hay problema. Solo dinos tu correo
                electrónico y te enviaremos un enlace para restablecer tu contraseña
                que te permitirá elegir una nueva.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status === 'We have emailed your password reset link.' 
                        ? 'Hemos enviado un enlace para restablecer tu contraseña a tu correo electrónico.' 
                        : status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-end">
                    <BlueButton className="ms-4" disabled={processing}>
                        Enviar enlace de restablecimiento
                        </BlueButton>
                </div>
            </form>
        </GuestLayout>
    );
}
