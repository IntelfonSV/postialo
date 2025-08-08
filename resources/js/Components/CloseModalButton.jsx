import { FaTimes } from "react-icons/fa";

function CloseModalButton({close, className}) {
    return (
        <button onClick={close} className={`btn btn--outline btn--sm bg-red-500 hover:bg-red-600 text-white rounded-full p-1 ${className}`}>
            <FaTimes className="w-5 h-5" />
        </button>
    );
}

export default CloseModalButton;