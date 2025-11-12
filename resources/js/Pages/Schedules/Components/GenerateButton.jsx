import GreenButton from "@/Components/GreenButton";
import { FaCheck } from "react-icons/fa";

function GenerateButton({ schedules, onClick}) {
    return (
        <>
            {schedules?.length >= 1 &&
                schedules.find((schedule) => schedule.status == "pending") && (
                    <GreenButton
                        className="flex gap-2"
                        onClick={onClick}
                    >
                        <FaCheck />{" "}
                        <p>
                            Generar{" "}
                            <span className="hidden lg:inline">
                                Publicaciones
                            </span>
                        </p>
                    </GreenButton>
                )}
        </>
    );
}

export default GenerateButton;
