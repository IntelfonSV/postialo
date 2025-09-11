import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function Notification() {
    const { props: { flash } } = usePage();
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash && (flash.success || flash.error)) {
            setVisible(true);
            setMessage(flash.success || flash.error);
            setType(flash.success ? 'success' : 'error');

            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000); // Ocultar después de 5 segundos

            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible) {
        return null;
    }

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const Icon = type === 'success' ? FaCheckCircle : FaTimesCircle;

    return (
        <div className={`fixed top-5 right-5 text-white py-3 px-5 rounded-lg shadow-xl flex items-center z-90 ${bgColor}`}>
            <Icon className="mr-3 text-xl" />
            <span>{message}</span>
            <button onClick={() => setVisible(false)} className="ml-4 text-white hover:text-gray-200">
                &times;
            </button>
        </div>
    );
}
