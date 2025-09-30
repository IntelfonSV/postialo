import { useEffect, useState } from "react";

function ImagePreview({templateHtml="", imageUrl="", logo="", className="", whatsapp="", website=""}) {
    console.log(imageUrl);
    const [htmlFinal, setHtmlFinal] = useState("");


    useEffect(() => {
        // Reemplaza el src de la imagen de fondo en la plantilla
        //validar si contiene <img class="background-img"
        whatsapp == "" || whatsapp == null ? whatsapp = "50379887589" : whatsapp;
        website == "" || website == null ? website = "www.tunegocio.com" : website;
        if (templateHtml !== "" && templateHtml.includes("<img class=\"background-img\"")){

            const htmlConImagen = templateHtml.replace(
                /<img class="background-img"[^>]*src="[^"]*"([^>]*)>/,
                `<img class="background-img" src="${imageUrl}" $1>`
            );

            const htmlConLogo = htmlConImagen.replace(
                /<img class="logo"[^>]*src="[^"]*"([^>]*)>/,
                `<img class="logo" src="${logo}" $1>`
            );

            //<span class="website">🌐 www.tunegocio.com</span>
            const htmlConWebsite = htmlConLogo.replace(
                /<span class="website">[^<]*<\/span>/,
                `<span class="website">${website}</span>`
            );

            //<span class="whatsapp">0000-0000</span>
            const htmlConWhatsapp = htmlConWebsite.replace(
                /<span class="whatsapp">[^<]*<\/span>/,
                `<span class="whatsapp">${whatsapp}</span>`
            );
            
            setHtmlFinal(htmlConWhatsapp);
        }
    }, [templateHtml, imageUrl, logo, whatsapp, website]);

    return (

        <div>
        
        { templateHtml && templateHtml.includes("<img class=\"background-img\"") ?

            <iframe
            srcDoc={htmlFinal}
            className={className}
            />
        : imageUrl ?
        <img src={imageUrl} className={className} /> : null}
        </div>
        );
}

export default ImagePreview;