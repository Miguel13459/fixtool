const http = require("node:http")
const fs = require("node:fs")
const basedatos = require("mysql")
const jwt = require("jsonwebtoken")
const puerto = 3000
const llave = "UnL0v0s1eMpr3Cuid4aSuLovA"

/* con este creo los sku */
const identificadorSKU = {
    "departamento": "HR", 
    "manual": "01", 
    "electrica": "02",
    "herramientaMesa": "03",
    "contenedores": "04",
    "compresores": "05",
    "sujecion": "06",
    "chapas": "07",
    "tornilleria": "08"
}

/*conexion a la base de datos*/
const conexion_db = basedatos.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "fixtool_db"
})

/* leer imagenes portada */
let arregloimagenes = []
let arregloNombreImagenes = []
let posicionPortada = 0
fs.readdir("./backend/img/inicio", (err, arregloFiles) => {
    if(err){
        console.log("Hubo un error", err)
    }else{
        arregloNombreImagenes = arregloFiles
        for(i = 0; i < arregloFiles.length; i++){
            fs.readFile("./backend/img/inicio/" + arregloFiles[i], (err, file) => {
                if(err){
                    console.log("Hubo un error", err)
                }else{
                    arregloimagenes.push(file)
                }
            })
        }
    }
})

/*leer imagen sobrenosotros*/
let imgNosotros
fs.readFile("./backend/img/sobrenosotros/nosotros.jpg", (err, imagen) => {
    if(err){
        console.log("Hubo un error", err)
        return 0
    }
    imgNosotros = imagen
})

/*leer json sobre nosotros */
let objetoNosotros
fs.readFile("./backend/sobrenosotros/sobrenosotros.json", (err, file) => {
    if(err){
        console.log("Hubo un error leyendo el json", err)
        return 0
    }
    objetoNosotros = JSON.parse(file.toString())
})

/* categorias de herramientas */
let objetoCategorias
fs.readFile("./backend/herramientas/clasificacion.json", (err, file) => {
    if(err){
        console.log("Hubo un error leyendo las categorias", err)
        return 0
    }
    objetoCategorias = JSON.parse(file.toString())
})

const server = http.createServer((request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    response.setHeader("Access-Control-Allow-Headers", "*")

    const authHeader = request.headers["authorization"]
    //console.log(authHeader)

    switch(request.method){
        case "GET":

            /* -------------- promociones inicio ------------------------------------------------------------------ */
            if(request.url == "/herramientas_inicio"){
                conexion_db.query("SELECT idHerramienta FROM `herramientas` WHERE estaDescuento = 1", (err, resultado) => {
                    if(err){
                        console.log(err)
                        const objeto_error = {
                            "mensaje": "no hay productos en descuento"
                        }
                        response.statusCode = 401;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify(objeto_error));
                        return 0
                    }

                    let arregloId = []
                    for(i = 0; i < resultado.length; i++){
                        arregloId[i] = resultado[i].idHerramienta
                    }

                    const objeto_ids = {
                        "idHerramientas": arregloId
                    }

                    //console.log(objeto_ids)
                    response.statusCode = 200
                    response.setHeader("Content-Type", "application/json")
                    response.end(JSON.stringify(objeto_ids))

                    //marca error, la api se cae con esta linea
                    //conexion_db.end()
                })
               return 0
            }

            if(request.url.startsWith("/obtener_herramienta_")){
                let id = request.url.replace("/obtener_herramienta_", "")
                
                conexion_db.query("SELECT * FROM `herramientas` WHERE idHerramienta = " + id, (err, resultado) => {
                    if(err){
                        console.log(err)
                        const objeto_error = {
                            "mensaje": "error, petición no válida"
                        }
                        response.statusCode = 400;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify(objeto_error));
                        return 0
                    }

                    if(resultado.length == 0){
                        const objeto_error = {
                            "mensaje": "error, herramienta no encontrado"
                        }
                        response.statusCode = 404;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify(objeto_error));
                        return 0
                    }

                    //console.log("------------------------------")
                    //console.log(resultado[0].idHerramienta)
                    
                    let costoPorLote
                    let ahorras
                    let costoPorPieza
                    let objeto_herramienta = null

                    let marca
                    //console.log(objetoCategorias.marcas)
                    //console.log(resultado[0].marca)
                    for(i = 0; i < objetoCategorias.marcas.length; i++){
                        if(objetoCategorias.marcas[i].bd == resultado[0].marca){
                            marca = objetoCategorias.marcas[i].cliente
                            break
                        }
                    }

                    let tipo
                    for(i = 0; i < objetoCategorias.tipos.length; i++){
                        if(objetoCategorias.tipos[i].bd == resultado[0].categoria){
                            tipo = objetoCategorias.tipos[i].cliente
                            break
                        }
                    }

                    if(resultado[0].estaDescuento == 1){
                        costoPorLote = resultado[0].costoPorLote - ((resultado[0].costoPorLote * resultado[0].descuentoPorcentaje)/100)
                        ahorras = resultado[0].costoPorLote - costoPorLote
                        costoPorPieza = costoPorLote/resultado[0].paquetesPorLote

                        objeto_herramienta = {
                            "idHerramienta": resultado[0].idHerramienta,
                            "marca": marca,
                            "categoria": tipo,
                            "titulo": resultado[0].titulo,
                            "estaDescuento": resultado[0].estaDescuento,
                            "descuentoPorcentaje": resultado[0].descuentoPorcentaje,
                            "paquetesPorLote": resultado[0].paquetesPorLote,
                            "costoPorLote": costoPorLote,
                            "ahorras": ahorras,
                            "costoPorPieza": costoPorPieza,
                            "PrecioAntes" : resultado[0].costoPorLote,
                            "descripcion": resultado[0].descripcion,
                            "imagen": resultado[0].imagen,
                            "activo": resultado[0].activo,
                            "vendedor": resultado[0].vendedor
                            
                        }
                    } else{
                        costoPorPieza = resultado[0].costoPorLote/resultado[0].paquetesPorLote
                        objeto_herramienta = {
                            "idHerramienta": resultado[0].idHerramienta,
                            "marca": marca,
                            "categoria": tipo,
                            "titulo": resultado[0].titulo,
                            "estaDescuento": resultado[0].estaDescuento,
                            "descuentoPorcentaje": resultado[0].descuentoPorcentaje,
                            "paquetesPorLote": resultado[0].paquetesPorLote,
                            "costoPorLote": resultado[0].costoPorLote,
                            "ahorras": 0,
                            "costoPorPieza": costoPorPieza,
                            "PrecioAntes" : 0,
                            "descripcion": resultado[0].descripcion,
                            "imagen": resultado[0].imagen,
                            "activo": resultado[0].activo,
                            "vendedor": resultado[0].vendedor
                        }
                    }

                    //console.log("------------objeto")
                    //console.log(objeto_herramienta.idHerramienta)

                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify(objeto_herramienta));
                    
                    //marca error, la api se cae con esta linea
                    //conexion_db.end()
                })
                return 0
            }

            /*------------------- portada ----------------------------------------------------------------------------------*/
            if(request.url == "/imagenportada"){
                let tipo = arregloNombreImagenes[posicionPortada].split(".")[1]
                response.statusCode = 200
                response.setHeader("Content-Type", "image/"+tipo)
                response.end(arregloimagenes[posicionPortada])
                return 0;
            }

            if(request.url == "/cantidadimg"){
                response.statusCode = 200
                response.setHeader("Content-Type", "application/json")
                response.end(JSON.stringify({
                    "cantidad": arregloimagenes.length,
                    "posicion": posicionPortada
                }))
                return 0;
            }

            /*-------- catalogo ----------------------------------------------------------------------------------------------------*/
          
            if(request.url.startsWith("/obtener_ids_filtrado_de")){
                let urlDesmenusar = request.url.replace("/obtener_ids_filtrado_de", "")
                let filtro = urlDesmenusar.split("?")[1]
                //console.log(filtro)
                let consultas = filtro.split("&")
                //console.log(consultas)
                
                let objeto_consulta = {
                    categoria: "",
                    marca: "",
                    pma: false,
                    pmb: false,
                    promocion: false
                }

                for(i = 0; i < consultas.length; i++){
                    if(consultas[i].startsWith("categoria=")) objeto_consulta.categoria = consultas[i].replace("categoria=", "")
                    if(consultas[i].startsWith("marca=")) objeto_consulta.marca = consultas[i].replace("marca=", "")
                    if(consultas[i].startsWith("pma=")) objeto_consulta.pma = consultas[i].replace("pma=", "")
                    if(consultas[i].startsWith("pmb=")) objeto_consulta.pmb = consultas[i].replace("pmb=", "")
                    if(consultas[i].startsWith("promocion=")) objeto_consulta.promocion = consultas[i].replace("promocion=", "")
                }

                //console.log(objeto_consulta)

                let consultaSQL = "SELECT idHerramienta FROM `herramientas`"
                let condiciones = []
                let valores = []

                condiciones.push("activo = 1")

                if(objeto_consulta.pma == "true") consultaSQL = "SELECT idHerramienta, IF(estaDescuento = 1, costoPorLote - ((costoPorLote * descuentoPorcentaje)/100), costoPorLote) AS precioFinal FROM `herramientas`"

                if(objeto_consulta.pmb == "true") consultaSQL = "SELECT idHerramienta, IF(estaDescuento = 1, costoPorLote - ((costoPorLote * descuentoPorcentaje)/100), costoPorLote) AS precioFinal FROM `herramientas`"
                
                if(objeto_consulta.categoria != ""){
                    condiciones.push("categoria = ?")
                    valores.push(objeto_consulta.categoria)
                }

                if(objeto_consulta.marca != ""){
                    condiciones.push("marca = ?")
                    valores.push(objeto_consulta.marca)
                }

                if(objeto_consulta.promocion == "true"){
                    condiciones.push("estaDescuento = ?")
                    valores.push(1)
                }

                if(condiciones.length != 0){
                    consultaSQL += " WHERE " + condiciones.join(" AND ") ;
                }

                if(objeto_consulta.pma == "true") consultaSQL += " ORDER BY precioFinal DESC"

                if(objeto_consulta.categoria == "true") consultaSQL += " ORDER BY precioFinal ASC"

                //console.log(consultaSQL)

                conexion_db.query(consultaSQL, valores, (err, resultado) => {
                    if(err){
                        const objeto_error = {
                            "mensaje": "Error al consultar herramientas"
                        }
                        response.statusCode = 401;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify(objeto_error));
                    }

                    if(resultado.length == 0){
                        const objeto_error = {
                            "mensaje": "No se ha encontrado la herramienta"
                        }
                        response.statusCode = 404;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify(objeto_error));
                        return 0
                    }

                    //console.log(resultado)

                    let arregloId = []
                    for(i = 0; i < resultado.length; i++){
                        arregloId[i] = resultado[i].idHerramienta
                    }
                    //console.log(arregloId)

                    arregloIdsAMandar = [...new Set(arregloId)]
                    //console.log(----------------------------)
                    //console.log(arregloIdsAMandar)

                    const objeto_ids = {
                        "idHerramientas": arregloIdsAMandar
                    };

                    response.statusCode = 200;
                    response.setHeader("Content-Type", "application/json");
                    response.end(JSON.stringify(objeto_ids));
                })
                return 0
            }

            if(request.url == "/herramientas_catalogo"){
                conexion_db.query("SELECT idHerramienta FROM `herramientas`", (err, resultado) => {
                    if(err){
                        console.log(err)
                        const objeto_error = {
                            "mensaje": "error al consultar las herrameintas"
                        }
                        response.statusCode = 401;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify(objeto_error));
                        return 0
                    }

                    if(resultado.length == 0){
                        const objeto_error = {
                            "mensaje": "No se ha encontrado la herramienta"
                        }
                        response.statusCode = 404;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify(objeto_error));
                        return 0
                    }

                    let arregloId = []
                    for(i = 0; i < resultado.length; i++){
                        arregloId[i] = resultado[i].idHerramienta
                    }

                    const objeto_ids = {
                        "idHerramientas": arregloId
                    }

                    response.statusCode = 200
                    response.setHeader("Content-Type", "application/json")
                    response.end(JSON.stringify(objeto_ids))

                    //marca error, la api se cae con esta linea
                    //conexion_db.end()
                })
               return 0
            }

            /*----------sobre nosotros-------------------------------------------------------------------------------------------------*/
            if(request.url == "/nosotros"){
                response.statusCode = 200
                response.setHeader("Content-Type", "image/jpg")
                response.end(imgNosotros)
                return 0;
            }

            if(request.url == "/nosotrostexto"){
                response.statusCode = 200
                response.setHeader("Content-Type", "application/json")
                response.end(JSON.stringify(objetoNosotros))
                return 0;
            }

            /*------INVENTARIO---------------------------------------------------------------------------------------------------------- */

            if(request.url == "/obtener_mis_herramientas"){
                if (!authHeader || authHeader == "" || authHeader == null || authHeader == "null") {
                    response.statusCode = 401;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify({
                        "mensaje": "token no proporcionado"
                    }));
                    return 0
                }

                jwt.verify(authHeader, llave, (err, decoded) => {
                    if(err){
                        console.log("Error al verificar la autenticidad", err)

                        response.statusCode = 401;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify({
                            "mensaje": "Token inválido o expirado, por favor inicie sesión nuevamente"
                        }));
                        return 0
                    }

                    conexion_db.query("SELECT idUsuario FROM `usuarios` WHERE email = ?", [decoded.username], (err, resultado) => {
                        console.log("----------------------")
                        console.log(resultado)
                        if(err){
                            console.log(err)
                            const objeto_error = {
                                "mensaje": "Error intentelo de nuevo"
                            }
                            response.statusCode = 401;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(objeto_error));
                            return 0
                        }

                        //console.log(resultado[0].idUsuario)
                        if(resultado.length == 0){
                            console.log(err)
                            const objeto_error = {
                                "mensaje": "No hay nada por aquí"
                            }
                            response.statusCode = 404;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(objeto_error));
                            return 0
                        }

                        conexion_db.query("SELECT idHerramienta FROM `herramientas` WHERE vendedor = ?", [resultado[0].idUsuario], (err, res) => {
                            console.log(res)
                            if(err){
                                console.log(err)
                                const objeto_error = {
                                    "mensaje": "Error intentelo de nuevo"
                                }
                                response.statusCode = 401;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                                return 0
                            }

                            //console.log(resultado)
                            if(resultado.length == 0){
                                console.log(err)
                                const objeto_error = {
                                    "mensaje": "No hay nada por aquí"
                                }
                                response.statusCode = 404;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                                return 0
                            }

                            let arregloId = []
                            for(i = 0; i < res.length; i++){
                                arregloId[i] = res[i].idHerramienta
                            }

                            const objeto_ids = {
                                "idHerramientas": arregloId
                            }

                            //console.log(objeto_ids)
                            response.statusCode = 200
                            response.setHeader("Content-Type", "application/json")
                            response.end(JSON.stringify(objeto_ids))
                        })

                        //conexion_db.end();
                    })
                })
                
                return 0;
            }


            if(request.url == "/tipos"){
                let objetoTipos = {
                    tipos: []
                }
                for(i = 0; i < objetoCategorias.tipos.length; i++){
                    objetoTipos.tipos.push(objetoCategorias.tipos[i].cliente)
                }
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(objetoTipos));
                return 0
            }

            if(request.url == "/marcas"){
                let objetoMarcas = {
                    marcas: []
                }
                for(i = 0; i < objetoCategorias.marcas.length; i++){
                    objetoMarcas.marcas.push(objetoCategorias.marcas[i].cliente)
                }
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(objetoMarcas));
                return 0
            }

            /*------USUARIOS---------------------------------------------------------------------------------------------------------- */

            if(request.url == "/obtener_usuario"){
                if (!authHeader || authHeader == "" || authHeader == null || authHeader == "null") {
                    response.statusCode = 401;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify({
                        "mensaje": "token no proporcionado"
                    }));
                    return 0
                }

                jwt.verify(authHeader, llave, (err, decoded) => {
                    if(err){
                        console.log("Error al verificar la autenticidad", err)

                        response.statusCode = 401;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify({
                            "mensaje": "Token inválido o expirado, por favor inicie sesión nuevamente"
                        }));
                        return 0
                    }

                    conexion_db.query("SELECT idUsuario, nombre, rol FROM `usuarios` WHERE email = ?", [decoded.username], (err, resultado) => {
                        if (err) {
                            console.log(err);
                            return 0
                        }
                        
                        fs.readFile("./backend/img/user.png", (err, file) => {
                            if(err){
                                console.log(err)
                                return 0
                            }
                            else{
                                response.statusCode = 200;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    "idUsuario": resultado[0].idUsuario,
                                    "imagenPerfil": file,
                                    "nombre": resultado[0].nombre,
                                    "rol": resultado[0].rol
                                }));
                            }
                        })

                        //conexion_db.end();
                    })
                })

                
                return 0
            }

            response.statusCode = 404
            response.setHeader("Content-Type", "application/json")
            response.end(JSON.stringify({
                "mensaje": "Nada por aquí"
            }))
            break;
        case "POST":
            let informacion = ""
            request.on("data", info => {
                informacion += info.toString()
            })

            request.on("end", () => {
                if(request.url == "/iniciar_sesion"){
                    const login = JSON.parse(informacion)
                    //console.log(login)
                    conexion_db.query("SELECT email FROM `usuarios` WHERE email = '" + login.email + "' AND contrasenia = '" + login.contrasena + "'", (err, resultado) => {
                        //console.log(resultado)
                        if(err){
                            console.log(err)
                            const objeto_error = {
                                "mensaje": "Información ingresada erronea"
                            }
                            response.statusCode = 401;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(objeto_error));
                        }

                        if(resultado.length == 0){
                            const objeto_error = {
                                    "mensaje": "Correo y/o contraseña incorrectos"
                                }
                                response.statusCode = 401;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                                return 0
                        }

                        //console.log(resultado)

                        const token = jwt.sign({username: resultado[0].email}, llave, {expiresIn: "1h"})
                        
                        //console.log(token)

                        response.statusCode = 200;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify({
                            "mensaje": "Login exitoso",
                            "token": token
                        }));
                        //conexion_db.end()
                    })
                    return 0
                }

                if(request.url == "/registro"){
                    const registro = JSON.parse(informacion)
                    
                    if (registro.contrasena != registro.confirmarContrasena) {
                        const objeto_error = {
                            "mensaje": "Contraseñas no coinciden, escribelas de nuevo"
                        }
                        response.statusCode = 401;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify(objeto_error));
                        return 0
                    }

                    conexion_db.query("SELECT email FROM `usuarios` WHERE email = '" + registro.correo + "'", (err, resultado) => {
                        if(err){
                            console.log(err)
                            const objeto_error = {
                                "mensaje": "Error intentelo de nuevo"
                            }
                            response.statusCode = 401;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(objeto_error));
                            return 0
                        }

                        //console.log(resultado)
                        if(resultado.length > 0){
                            console.log(err)
                            const objeto_error = {
                                "mensaje": "Correo o usuario propocionado ya registrado en la base de datos, intente iniciar sesión"
                            }
                            response.statusCode = 401;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(objeto_error));
                            return 0
                        }

                        conexion_db.query("INSERT INTO `usuarios`( `email`, `contrasenia`, `nombre`, `apellido`, `rol`)  VALUES (?,?,?,?,?)", [registro.correo, registro.contrasena, registro.nombre, registro.apellido, "vendedor"], (err, resultado) => {
                            if(err){
                                console.log(err)
                                //conexion_db.end()
                                return 0
                            }

                            const objeto_mensaje = {
                                "mensaje": "Registro exitoso"
                            }
                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(objeto_mensaje));
                            //conexion_db.end()
                            return 0
                        })
                    })

                    return 0
                }

                /* INVENTARIO */
                if(request.url == "/subir_nuevo_producto"){
                    //console.log(JSON.parse(informacion.toString()))

                    let objetoInsertar = JSON.parse(informacion.toString())

                    if (!authHeader || authHeader == "" || authHeader == null || authHeader == "null") {
                        response.statusCode = 401;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify({
                            "mensaje": "token no proporcionado"
                        }));
                        return 0
                    }

                    
                    jwt.verify(authHeader, llave, (err, decoded) => {
                        if(err){
                            console.log("Error al verificar la autenticidad", err)

                            response.statusCode = 401;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify({
                                "mensaje": "Token inválido o expirado, por favor inicie sesión nuevamente"
                            }));
                            return 0
                        }

                        //console.log("si esta autorizado")

                        conexion_db.query("SELECT idUsuario FROM `usuarios` WHERE email = ?", [decoded.username], (err, resultado) => {
                            console.log("----------------------")
                            console.log(resultado)
                            if(err){
                                console.log(err)
                                const objeto_error = {
                                    "mensaje": "Error intentando obtener tu usuario, inicie sesión nuevamente"
                                }
                                response.statusCode = 401;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                                return 0
                            }

                            for(i = 0; i < objetoCategorias.marcas.length; i++){
                                if(objetoCategorias.marcas[i].cliente == objetoInsertar.opcionMarca){
                                    objetoInsertar.opcionMarca = objetoCategorias.marcas[i].bd
                                    break
                                }
                            }

                            for(i = 0; i < objetoCategorias.tipos.length; i++){
                                if(objetoCategorias.tipos[i].cliente == objetoInsertar.opcionTipo){
                                    objetoInsertar.opcionTipo = objetoCategorias.tipos[i].bd
                                    break
                                }
                            }
                            
                            if(objetoInsertar.estaPromocion) objetoInsertar.estaPromocion = 1
                            else objetoInsertar.estaPromocion = 0

                            if(objetoInsertar.estatus) objetoInsertar.estatus = 1

                            //if(objetoInsertar.ponerPromocion == '0') objetoInsertar.ponerPromocion = parseInt()

                            const imgHerramienta64 = objetoInsertar.imagen.split(",")[1]
                            let imagenBinariaHerramienta = Buffer(imgHerramienta64, "base64")
                            objetoInsertar.imagen = imagenBinariaHerramienta

                            //console.log("-------------------------------------------------------------------------------------------------")
                            console.log(objetoInsertar)

                            let consultaSQL = "INSERT INTO `herramientas`(`marca`, `categoria`, `titulo`, `estaDescuento`, `descuentoPorcentaje`, `paquetesPorLote`, `costoPorLote`, `descripcion`, `imagen`, `activo`, `vendedor`) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
                            let condicion = [objetoInsertar.opcionMarca, objetoInsertar.opcionTipo, objetoInsertar.titulo, objetoInsertar.estaPromocion, objetoInsertar.ponerPromocion, objetoInsertar.paquetePorLote, objetoInsertar.precioPorLote, objetoInsertar.descripcion, objetoInsertar.imagen, objetoInsertar.estatus, resultado[0].idUsuario]
                            console.log(condicion)
                            
                            conexion_db.query(consultaSQL, condicion, (err, resp) => {
                                console.log("Se esta imprimiendo la respuesta del query", resp)
                                if (err) {
                                    console.log("Error al insertar", err);
                                    return 0
                                }

                                const objeto_mensaje = {
                                    "mensaje": "Producto creado correctamente"
                                }
                                response.statusCode = 200;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_mensaje));
                                
                            })
                        })
                        //conexion_db.end();
                    })
                    
                    return 0;
                }

                response.statusCode = 404
                response.setHeader("Content-Type", "application/json")
                response.end(JSON.stringify({
                    "mensaje": "Nada por aquí"
                }))
            })

            break;
        case "PUT":
            let informacionAEditar = ""
            request.on("data", info => {
                informacionAEditar += info
            })

            request.on("end", () => {
                let infoEditarJson = JSON.parse(informacionAEditar.toString())
                
                if(request.url == "/cambiarportada"){
                    posicionPortada = posicionPortada + infoEditarJson.cambiarPortada
                    if(posicionPortada > 2) posicionPortada = 0
                    else if(posicionPortada < 0) posicionPortada = 2
                    
                    let tipo = arregloNombreImagenes[posicionPortada].split(".")[1]
                    response.statusCode = 200
                    response.setHeader("Content-Type", "image/"+tipo)
                    response.end(arregloimagenes[posicionPortada])
                    return 0;
                }

                if(request.url == "/recarga"){
                    posicionPortada = 0
                    
                    let tipo = arregloNombreImagenes[posicionPortada].split(".")[1]
                    response.statusCode = 200
                    response.setHeader("Content-Type", "image/"+tipo)
                    response.end(arregloimagenes[posicionPortada])
                    return 0;
                }

                if(request.url == "/rol_usuario"){
                    //console.log(infoEditarJson)

                    if(infoEditarJson.rol != "vendedor" && infoEditarJson.rol != "comprador"){
                        response.statusCode = 401;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify({
                            "mensaje": "Error, rol no definido"
                        }));
                        return 0
                    }

                    if (!authHeader || authHeader == "" || authHeader == null || authHeader == "null") {
                        response.statusCode = 401;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify({
                            "mensaje": "token no proporcionado"
                        }));
                        return 0
                    }

                    jwt.verify(authHeader, llave, (err, decoded) => {
                        if(err){
                            console.log("Error al verificar la autenticidad", err)

                            response.statusCode = 401;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify({
                                "mensaje": "Token inválido o expirado, por favor inicie sesión nuevamente"
                            }));
                            return 0
                        }

                        conexion_db.query("SELECT idUsuario FROM `usuarios` WHERE email = ?", [decoded.username], (err, resultado) => {
                            //console.log("----------------------")
                            //console.log(resultado)
                            if(err){
                                console.log(err)
                                const objeto_error = {
                                    "mensaje": "Error intentelo de nuevo"
                                }
                                response.statusCode = 401;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                                return 0
                            }

                            //console.log(resultado)
                            if(resultado.length == 0){
                                console.log(err)
                                const objeto_error = {
                                    "mensaje": "Error, el usuario no coincide con el email"
                                }
                                response.statusCode = 401;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                                return 0
                            }

                            let consultaSQL = "UPDATE `usuarios` SET `rol`= ? WHERE idUsuario = ?"
                            let condicion = [infoEditarJson.rol, resultado[0].idUsuario]
                            //console.log(condicion)
                            
                            conexion_db.query(consultaSQL, condicion, (err, resp) => {
                                console.log(resp)
                                if (err) {
                                    console.log("Error al editar", err);
                                    conexion_db.end()
                                    return 0
                                }

                                //const idUsuario = resultado[0].idUsuario
                                //console.log("idUsuario", idUsuario)
                                conexion_db.query("SELECT rol FROM `usuarios` WHERE idUsuario = ?", [resultado[0].idUsuario], (err, res) => {
                                    //console.log("idConsulta ",resultado[0].idUsuario)
                                    //console.log("respuesta ", res[0])
                                    if(err){
                                        console.log("Error al consultar el rol", err)
                                        conexion_db.end()
                                        return 0
                                    }

                                    let mensaje_rol
                                    if(res[0].rol == "vendedor") mensaje_rol = "Se ha aprobado tu licencia, ahora eres vendedor"
                                    else if(res[0].rol == "comprador") mensaje_rol = "Se ha dado de baja tu perfil como vendedor"

                                    const objeto_mensaje = {
                                        "mensaje": mensaje_rol
                                    }
                                    response.statusCode = 200;
                                    response.setHeader('Content-Type', 'application/json');
                                    response.end(JSON.stringify(objeto_mensaje));
                                })
                                
                            })

                            //conexion_db.end();
                        })
                    })
                    
                    return 0;
                }

                if(request.url.startsWith("/editar_producto")){
                    //console.log("entra a la edicion")
                    //console.log(request.url)
                    

                    if (!authHeader || authHeader == "" || authHeader == null || authHeader == "null") {
                        response.statusCode = 401;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify({
                            "mensaje": "token no proporcionado"
                        }));
                        return 0
                    }

                    //console.log(infoEditarJson)

                    for(i = 0; i < objetoCategorias.marcas.length; i++){
                        if(objetoCategorias.marcas[i].cliente == infoEditarJson.inputmarcaProducto){
                            infoEditarJson.inputmarcaProducto = objetoCategorias.marcas[i].bd
                            break
                        }
                    }

                    for(i = 0; i < objetoCategorias.tipos.length; i++){
                        if(objetoCategorias.tipos[i].cliente == infoEditarJson.inputtipoProducto){
                            infoEditarJson.inputtipoProducto = objetoCategorias.tipos[i].bd
                            break
                        }
                    }

                    let consultaSQL
                    let condiciones
                    if(infoEditarJson.imagen != null){
                        const imgHerramientaEditar64 = infoEditarJson.imagen.split(",")[1]
                        let imagenBinariaEditar = Buffer(imgHerramientaEditar64, "base64")
                        infoEditarJson.imagen = imagenBinariaEditar

                        consultaSQL = "UPDATE `herramientas` SET `marca`= ?,`categoria`= ?,`titulo`= ?,`estaDescuento`= ?,`descuentoPorcentaje`= ?,`paquetesPorLote`= ?,`costoPorLote`= ?,`descripcion`= ?,`imagen`= ?,`activo`= ? WHERE idHerramienta = ?"
                        condiciones = [infoEditarJson.inputmarcaProducto, infoEditarJson.inputtipoProducto, infoEditarJson.nombreProducto, infoEditarJson.estaPromocion, infoEditarJson.ponerPromocion, infoEditarJson.paquetePorLote, infoEditarJson.precioPorLote, infoEditarJson.textoDescripcion, infoEditarJson.imagen, infoEditarJson.activo, infoEditarJson.idHerramienta]
                    }else{
                        consultaSQL = "UPDATE `herramientas` SET `marca`= ?,`categoria`= ?,`titulo`= ?,`estaDescuento`= ?,`descuentoPorcentaje`= ?,`paquetesPorLote`= ?,`costoPorLote`= ?,`descripcion`= ?,`activo`= ? WHERE idHerramienta = ?"
                        condiciones = [infoEditarJson.inputmarcaProducto, infoEditarJson.inputtipoProducto, infoEditarJson.nombreProducto, infoEditarJson.estaPromocion, infoEditarJson.ponerPromocion, infoEditarJson.paquetePorLote, infoEditarJson.precioPorLote, infoEditarJson.textoDescripcion, infoEditarJson.activo, infoEditarJson.idHerramienta]
                    }

                     
                    //console.log(consultaSQL)
                    //console.log(condiciones)

                    conexion_db.query(consultaSQL, condiciones, (err) => {
                        if (err) {
                            console.log("Error al editar", err);
                            response.statusCode = 401;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify({
                                "mensaje": "Error al editar"
                            }));
                            conexion_db.end()
                            return 0
                        }

                        const objeto_mensaje = {
                            "mensaje": "Herramienta editada correctamente"
                        }
                        response.statusCode = 200;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify(objeto_mensaje));
                    })

                    return;
                }

                response.statusCode = 404
                response.setHeader("Content-Type", "application/json")
                response.end(JSON.stringify({
                    "mensaje": "Nada por aquí"
                }))
            })
            break;
        case "DELETE":
            request.on("data", info => {

                let objetoHerramienta = JSON.parse(info.toString())
                if(request.url == "/eliminar_herramienta"){
                    //onsole.log(infoEditarJson)

                    if (!authHeader || authHeader == "" || authHeader == null || authHeader == "null") {
                        response.statusCode = 401;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify({
                            "mensaje": "token no proporcionado"
                        }));
                        return 0
                    }

                    jwt.verify(authHeader, llave, (err, decoded) => {
                        if(err){
                            console.log("Error al verificar la autenticidad", err)

                            response.statusCode = 401;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify({
                                "mensaje": "Token inválido o expirado, por favor inicie sesión nuevamente"
                            }));
                            return 0
                        }

                        let consultaSQL = "DELETE FROM `herramientas` WHERE idHerramienta = ?"
                        let condicion = [objetoHerramienta.idHerramienta]
                        
                        conexion_db.query(consultaSQL, condicion, (err, res) => {
                            
                            if(err){
                                console.log("Error al consultar el rol", err)
                                const objeto_mensaje = {
                                    "mensaje": "Error al eliminar la herramienta, vuelva a intentarlo"
                                }
                                response.statusCode = 200;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_mensaje));
                                
                                conexion_db.end()
                                return 0
                            }

                            const objeto_mensaje = {
                                "mensaje": "Se ha eliminado correctamente la herramienta"
                            }

                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(objeto_mensaje));
                        })
                            
                    })
                    return 0;
                }

                response.statusCode = 404
                response.setHeader("Content-Type", "application/json")
                response.end(JSON.stringify({
                    "mensaje": "Nada por aquí"
                }))
            })
            break;
        case "OPTIONS":
            response.writeHead(204)
            response.end()
            break;
    }
})

server.listen(puerto, () => {
    console.log("Servidor a la escucha en el puerto http://localhost:" + puerto)
})