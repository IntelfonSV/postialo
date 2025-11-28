import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
const SOCIAL_NETWORKS = ["facebook", "instagram"];
function ScheduleNetworksInput({ data, setData, errors, disabled }) {

        const toggleNetwork = (network) => {
        setData((prev) => {
            const networks = prev.networks.includes(network)
                ? prev.networks.filter((n) => n !== network)
                : [...prev.networks, network];
            return { ...prev, networks };
        });
    };
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Redes Sociales
            </label>
            <div className="flex flex-col space-y-2">
                {SOCIAL_NETWORKS.map((net) => (
                    <label key={net} className="flex items-center text-sm">
                        <input
                            type="checkbox"
                            checked={data?.networks?.includes(net)}
                            onChange={() => toggleNetwork(net)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            disabled={disabled}
                        />
                        <span className="ml-2 text-gray-700 flex items-center gap-2">
                            {net === "facebook" ? (
                                <FaFacebookSquare className="text-blue-600 text-xl" />
                            ) : (
                                <FaInstagram className="text-pink-600 text-xl" />
                            )}
                        </span>
                    </label>
                ))}
                {errors.networks && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.networks}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ScheduleNetworksInput;
