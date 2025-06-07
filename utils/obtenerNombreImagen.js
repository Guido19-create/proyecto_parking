
export const obtenerNombreURL = (url_imagen) => {

    const arregloURL = url_imagen.split('/');

    const nombreExtension = arregloURL[arregloURL.length - 1];

    const arregloNombre = nombreExtension.split('.');

    return arregloNombre[0];

}


export const obtenerExtensionURL = (nombreCompletoimagen) => {

    const arregloURL = nombreCompletoimagen.split('.');

    return arregloURL[arregloURL.length - 1];

}