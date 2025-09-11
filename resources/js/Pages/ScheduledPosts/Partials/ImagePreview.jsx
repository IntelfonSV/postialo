import { useEffect, useState } from "react";

function ImagePreview({templateHtml="", imageUrl="", className=""}) {
    console.log(imageUrl);
    const [htmlFinal, setHtmlFinal] = useState("");

    useEffect(() => {
        // Reemplaza el src de la imagen de fondo en la plantilla
        //validar si contiene <img class="background-img"
        if (templateHtml !== "" && templateHtml.includes("<img class=\"background-img\"")){

            const htmlConImagen = templateHtml.replace(
                /<img class="background-img"[^>]*src="[^"]*"([^>]*)>/,
                `<img class="background-img" src="storage/${imageUrl}" $1>`
            );
            
            setHtmlFinal(htmlConImagen);
        }
    }, [templateHtml, imageUrl]);

    return (

        <div>
        
        { templateHtml && templateHtml.includes("<img class=\"background-img\"") ?

            <iframe
            srcDoc={htmlFinal}
            className={className}
            />
        : imageUrl ?
        <img src={"storage/"+imageUrl} className={className} /> : null}
        </div>
        );
}

export default ImagePreview;