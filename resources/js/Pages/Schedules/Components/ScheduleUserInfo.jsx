import StatusHelper from "@/Helpers/StatusHelper";
import { usePage } from "@inertiajs/react";

function ScheduleUserInfo({ number, user }) {
    const { auth } = usePage().props;
    const { badge } = StatusHelper();
    return (
        <div>
            <span className="text-sm font-medium text-gray-700">
                Publicación #{number}
            </span>
            {user ? (
                <p className="font-bold text-lg text-gray-800 my-2 flex items-center gap-2">
                    Usuario:
                    <span className={badge("in_progress")}>{user.name}</span>
                </p>
            ) : (
                <p className="font-bold text-lg text-gray-800 my-2 flex items-center gap-2">
                    Usuario:
                    <span className={badge("in_progress")}>
                        {auth.user.name}
                    </span>
                </p>
            )}
        </div>
    );
}

export default ScheduleUserInfo;
