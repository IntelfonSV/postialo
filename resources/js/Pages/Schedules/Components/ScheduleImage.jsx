import ScheduleFileInput from "./ScheduleFileInput";
import ScheduleSelectApiImage from "./ScheduleSelectApiImage";
import ScheduleTextArea from "./ScheduleTextArea";

function ScheduleImage({
    data,
    edit,
    disabled,
    errors,
    setData,
    schedule,
    images,
    setPreview,
    preview,
    fileInputRef,
}) {
    const hadleUsePrompt = () => {
        setData({ ...data, image_source: "generated", image: null });
        setPreview(null);
    };
    return (
        <div>
            {data.image_source === "generated" && (
                <ScheduleTextArea
                    value={data.prompt_image}
                    onChange={(e) => setData("prompt_image", e.target.value)}
                    edit={edit}
                    disabled={disabled}
                    error={errors.prompt_image}
                    label="Prompt de imagen"
                    rows={route().current("schedules.create") ? 10 : 4}
                />
            )}

            {!edit &&
                schedule?.id &&
                (data.image_source === "uploaded" ||
                    data.image_source === "api") && (
                    <img
                        src={
                            data.image_source == "api"
                                ? schedule?.selected_image?.image_path
                                : `storage/${schedule?.selected_image?.image_path}`
                        }
                        alt="Vista previa"
                        className="h-24 object-contain rounded-lg shadow-md my-2"
                    />
                )}

            {edit &&
                data.image_source === "uploaded" &&
                !preview &&
                schedule?.selected_image && (
                    <img
                        src={"storage/" + schedule?.selected_image?.image_path}
                        alt="Vista previa"
                        className="h-24 object-contain rounded-lg shadow-md my-2"
                    />
                )}

            {preview && (
                <img
                    src={preview}
                    alt="Vista previa"
                    className="h-24 object-contain rounded-lg shadow-md my-2"
                />
            )}

            {errors.image_source && (
                <p className="text-red-500 text-xs mt-1">
                    {errors.image_source}
                </p>
            )}

            {edit && (
                <div className="flex flex-wrap gap-3 mt-2 w-full ">
                    <ScheduleFileInput
                        fileInputRef={fileInputRef}
                        setData={setData}
                        setPreview={setPreview}
                        preview={preview}
                    />

                    {images.length > 0 && (
                        <ScheduleSelectApiImage
                            images={images}
                            setData={setData}
                            data={data}
                            setPreview={setPreview}
                        />
                    )}

                    {(data.image_source === "uploaded" ||
                        data.image_source === "api") && (
                        <button
                            type="button"
                            onClick={hadleUsePrompt}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                            Volver a usar prompt
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default ScheduleImage;
