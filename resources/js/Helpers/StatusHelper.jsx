const StatusHelper = () => {
    function TranslateStatus(status) {
        switch (status) {
            case "draft":
                return "Borrador";
            case "pending":
                return "Pendiente";
            case "rejected":
                return "Rechazado";
            case "in_progress":
                return "En progreso";
            case "in_review":
                return "En revisión";
            case "approved":
                return "Aprobado";
            case "published":
                return "Publicado";
            case "generated":
                return "Generado";
            case "facebook":
                return "Facebook";
            case "instagram":
                return "Instagram";
            case "x":
                return "X";
            default:
                return "Desconocido";
        }
    }

    const badge = (status) => {
        switch (status) {
            case "draft":
                return "bg-yellow-100 text-yellow-800 rounded-full px-2 py-2";
            case "approved":
                return "bg-green-100 text-green-800 rounded-full px-2 py-2";
            case "in_progress":
                return "bg-blue-100 text-blue-800 rounded-full px-2 py-2";
            case "in_review":
                return "bg-blue-100 text-blue-800 rounded-full px-2 py-2";
            case "rejected":
                return "bg-red-100 text-red-800 rounded-full px-2 py-2";
            case "pending":
                return "bg-yellow-100 text-yellow-800 rounded-full px-2 py-2";
            case "generated":
                return "bg-green-100 text-green-800 rounded-full px-2 py-2";
            case "published":
                return "bg-blue-100 text-blue-800 rounded-full px-2 py-2";
            case "facebook":
                return "bg-blue-100 text-blue-800 rounded-full px-2 py-2";
            case "instagram":
                return "bg-pink-100 text-pink-800 rounded-full px-2 py-2";
            case "x":
                return "bg-cyan-100 text-cyan-800 rounded-full px-2 py-2";
            default:
                return "bg-gray-200 text-gray-800 rounded-full p-2";

        }
    };


    return {
        TranslateStatus,
        badge,
    };
};
export default StatusHelper;
