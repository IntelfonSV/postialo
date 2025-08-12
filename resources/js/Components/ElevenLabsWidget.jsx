import { useEffect, useMemo } from "react";

export default function ElevenLabsWidget({ user = {} }) {
    // Carga el script del widget una sola vez
    useEffect(() => {
        if (!document.getElementById("elevenlabs-convai-script")) {
            const s = document.createElement("script");
            s.id = "elevenlabs-convai-script";
            s.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
            s.async = true;
            s.type = "text/javascript";
            document.body.appendChild(s);
        }
    }, []);

    // Construye el JSON de dynamic-variables con user_id y user_name
    const dyn = useMemo(() => {
        return JSON.stringify({
            user_id: String(user?.id ?? ""),
            user_name: user?.client_name ?? "",
        });
    }, [user?.id, user?.name]);

    return (
        <div className="mt-6">
            <elevenlabs-convai
                key={user?.id ?? "anon"} // fuerza remonte si cambia usuario
                agent-id="agent_3901k22mkx19esxv8edx2r12qjn8" // hardcodeado
                variant="expanded"
                dynamic-variables={dyn}
            ></elevenlabs-convai>
        </div>
    );
}
