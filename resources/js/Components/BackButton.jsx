import { Link } from "@inertiajs/react";
import { AiOutlineArrowLeft } from "react-icons/ai";

function BackButton({ href }) {
    return (
        <Link href={href}>
            <button className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg inline-flex items-center shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                <AiOutlineArrowLeft className="size-5 mr-2" />
                <span>Volver</span>
            </button>
        </Link>
    );
}

export default BackButton;