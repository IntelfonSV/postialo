import BlueButton from "@/Components/BlueButton";
import DangerButton from "@/Components/DangerButton";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";

function ScheduleButtons({
    edit,
    setEdit,
    processing,
    schedule,
    handleSave,
    handleCancel,
    
    
}) {

        // Eliminar / Cancelar
    const handleDelete = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, bórralo",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("schedules.destroy", schedule.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setNewSchedule(false);
                        reset();
                    },
                });
            }
        });
    };

    const handleCancelSchedule = () => {
        Swal.fire({
            title: "¿Cancelar publicación?",
            text: "La publicación se eliminará de pendientes.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(route("schedules.cancel", schedule.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setNewSchedule(false);
                        reset();
                    },
                });
            }
        });
    };




    return (
        <div className="flex justify-between w-full mt-4 px-5">
            <div className="flex gap-2">
                {edit ? (
                    <BlueButton onClick={handleSave} disabled={processing}>
                        {processing ? "Guardando..." : "Guardar Cambios"}
                    </BlueButton>
                ) : schedule?.status === "pending" ? (
                    <BlueButton onClick={() => setEdit(true)}>
                        Editar
                    </BlueButton>
                ) : (
                    ""
                )}
                {(edit || !schedule?.id) && (
                    <DangerButton onClick={handleCancel}>Cancelar</DangerButton>
                )}
            </div>

            {schedule?.id && (
                <div>
                    {schedule.status === "pending" ? (
                        <DangerButton onClick={handleDelete}>
                            Eliminar
                        </DangerButton>
                    ) : schedule.status !== "cancelled" ? (
                        <DangerButton onClick={handleCancelSchedule}>
                            Cancelar publicación
                        </DangerButton>
                    ) : null}
                </div>
            )}
        </div>
    );
}

export default ScheduleButtons;
