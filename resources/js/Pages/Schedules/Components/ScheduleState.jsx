import StatusHelper from "@/Helpers/StatusHelper";

function ScheduleState({ status }) {
    const { TranslateStatus, badge } = StatusHelper();
    return (
        <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">
                Estado
            </label>
            <span className={badge(status)}>{TranslateStatus(status)}</span>
        </div>
    );
}

export default ScheduleState;
