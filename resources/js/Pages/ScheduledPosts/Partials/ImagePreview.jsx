import { useEffect, useState } from "react";

function ImagePreview({
    templateHtml = "",
    imageUrl = "",
    logo = "",
    className = "",
    whatsapp = "",
    website = "",
}) {
    console.log(imageUrl);
    const [htmlFinal, setHtmlFinal] = useState("");

    useEffect(() => {
        // Reemplaza el src de la imagen de fondo en la plantilla
        //validar si contiene <img class="background-img"
        whatsapp == "" || whatsapp == null
            ? (whatsapp = "50379887589")
            : whatsapp;
        website == "" || website == null
            ? (website = "www.tunegocio.com")
            : website;
        if (
            templateHtml !== "" &&
            templateHtml.includes('<img class="background-img"')
        ) {
            let htmlConImagen = "";
            if (!imageUrl) {
                // No hay imagen: reemplaza el <img> por un bloque con gradiente y SVG
                htmlConImagen = templateHtml.replace(
                    /<img[^>]*class="background-img"[^>]*>/i,
                    `
                    <div class="background-img" 
                        style="background: linear-gradient(to bottom right, #002073, #5e7ae6); background-size: cover; background-position: center; background-repeat: no-repeat; display: flex; align-items: center; justify-content: center;">
                    <svg fill="#fff" width="64px" height="64px" viewBox="0 0 36 36" version="1.1"  preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <title>image-solid</title>
                        <path d="M32,4H4A2,2,0,0,0,2,6V30a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V6A2,2,0,0,0,32,4ZM8.92,8a3,3,0,1,1-3,3A3,3,0,0,1,8.92,8ZM6,27V22.9l6-6.08a1,1,0,0,1,1.41,0L16,19.35,8.32,27Zm24,0H11.15l6.23-6.23,5.4-5.4a1,1,0,0,1,1.41,0L30,21.18Z" class="clr-i-solid clr-i-solid-path-1"></path>
                        <rect x="0" y="0" width="64" height="64" fill-opacity="0"/>
                    </svg>
                    </div>`,
                );
            } else {
                // Hay imagen: reemplaza el src existente por el nuevo
                htmlConImagen = templateHtml.replace(
                    /<img[^>]*class="background-img"[^>]*src="[^"]*"[^>]*>/i,
                    `<img class="background-img" src="${imageUrl}" alt="Imagen de fondo">`,
                );
            }
            const htmlConLogo = htmlConImagen.replace(
                /<img class="logo"[^>]*src="[^"]*"([^>]*)>/,
                `<img class="logo" src="${logo}" $1>`,
            );

            //<span class="website">🌐 www.tunegocio.com</span>
            const htmlConWebsite = htmlConLogo.replace(
                /<span class="website">[^<]*<\/span>/,
                `<span class="website">${website}</span>`,
            );

            //<span class="whatsapp">0000-0000</span>
            const htmlConWhatsapp = htmlConWebsite.replace(
                /<span class="whatsapp">[^<]*<\/span>/,
                `<span class="whatsapp">${whatsapp}</span>`,
            );

            setHtmlFinal(htmlConWhatsapp);
        }
    }, [templateHtml, imageUrl, logo, whatsapp, website]);

    const iframeKey =
        (htmlFinal || templateHtml) +
        "|" +
        imageUrl +
        "|" +
        logo +
        "|" +
        whatsapp +
        "|" +
        website;

    if (!templateHtml) return null;

    return (
        <div>
            {templateHtml &&
            templateHtml.includes('<img class="background-img"') ? (
                <iframe srcDoc={htmlFinal} className={className} key={iframeKey}S />
            ) : imageUrl ? (
                <img src={imageUrl} className={className} />
            ) : null}
        </div>
    );
}

export default ImagePreview;
