export const mapearRequest = (data) => {
    const mapeoCampos = {
        typeDocument: 'tipoDeDocumento',
        category: 'genero',
        author: 'autor',
        nameDocument: 'nombreDocumento',
        quantity: 'cantidadDisponible',
        stateDocument: 'estadoDelDocumento',
        location: 'ubicacion',
        fotoDelDocumento: 'fotoDelDocumento'
    };

    // 2. Crear objeto con los nombres de la base de datos
    const datosActualizacion = {};
    
    Object.keys(data).forEach(campoFrontend => {
        const campoBD = mapeoCampos[campoFrontend];
        if (campoBD && data[campoFrontend] !== undefined) {
            datosActualizacion[campoBD] = data[campoFrontend];
        }
    });

    return datosActualizacion;

}