import { useEffect, useState } from "react";

function ImagePreview({templateHtml, imageUrl, className}) {
    console.log(templateHtml);
    console.log(imageUrl);
    const [htmlFinal, setHtmlFinal] = useState("");

    useEffect(() => {
        // Reemplaza el src de la imagen de fondo en la plantilla
        const htmlConImagen = templateHtml.replace(
            /<img class="background-img"[^>]*src="[^"]*"([^>]*)>/,
            `<img class="background-img" src="storage/${imageUrl}" $1>`
        );

        setHtmlFinal(htmlConImagen);
    }, [templateHtml, imageUrl]);

    return (

        <iframe
        srcDoc={htmlFinal}
        className={className}
    />
    );
}

export default ImagePreview;