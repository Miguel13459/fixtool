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
                    if(resultado[0].estaDescuento == 1){
                        costoPorLote = resultado[0].costoPorLote - ((resultado[0].costoPorLote * resultado[0].descuentoPorcentaje)/100)
                        ahorras = resultado[0].costoPorLote - costoPorLote
                        costoPorPieza = costoPorLote/resultado[0].paquetesPorLote

                        objeto_herramienta = {
                            "idHerramienta": resultado[0].idHerramienta,
                            "marca": resultado[0].marca,
                            "categoria": resultado[0].categoria,
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
                            "vendedor": resultado[0].vendedor
                        }
                    } else{
                        costoPorPieza = resultado[0].costoPorLote/resultado[0].paquetesPorLote
                        objeto_herramienta = {
                            "idHerramienta": resultado[0].idHerramienta,
                            "marca": resultado[0].marca,
                            "categoria": resultado[0].categoria,
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
            if(request.url == "/herramientas_catalogo"){
                conexion_db.query("SELECT idHerramienta FROM `herramientas` LIMIT 16", (err, resultado) => {
                    if(err){
                        console.log(err)
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

            if(request.url.startsWith("/obtener_ids_filtrado_de_")){
                let concepto = request.url.replace("/obtener_ids_filtrado_de_", "")

                const objeto_consultas = {
                    consultas: [
                        {"precioAlto": "SELECT idHerramienta FROM `herramientas` ORDER BY `herramientas`.`costoPorLote` DESC"},
                        {"precioBajo": "SELECT idHerramienta FROM `herramientas` ORDER BY `herramientas`.`costoPorLote` ASC"},
                        {"promociones": "SELECT idHerramienta FROM `herramientas` WHERE estaDescuento = 1"},

                        {"herManual": "SELECT idHerramienta FROM `herramientas` WHERE categoria = 'herManual'"},
                        {"herElectrica": "SELECT idHerramienta FROM `herramientas` WHERE categoria = 'herElectrica'"},
                        {"herEstacionaria": "SELECT idHerramienta FROM `herramientas` WHERE categoria = 'herEstacionaria'"},
                        {"contenedores": "SELECT idHerramienta FROM `herramientas` WHERE categoria = 'contenedores'"},
                        {"compresores": "SELECT idHerramienta FROM `herramientas` WHERE categoria = 'compresores'"},
                        {"sujecion": "SELECT idHerramienta FROM `herramientas` WHERE categoria = 'sujecion'"},
                        {"bisagras": "SELECT idHerramienta FROM `herramientas` WHERE categoria = 'bisagras'"},
                        {"manijas": "SELECT idHerramienta FROM `herramientas` WHERE categoria = 'manijas'"},
                        {"tornilleria": "SELECT idHerramienta FROM `herramientas` WHERE categoria = 'tornilleria'"},
                        {"soldadura": "SELECT idHerramienta FROM `herramientas` WHERE categoria = 'soldadura'"},

                        {"dewalt": "SELECT idHerramienta FROM `herramientas` WHERE marca = 'dewalt'"},
                        {"milwaukee": "SELECT idHerramienta FROM `herramientas` WHERE marca = 'milwaukee'"},
                        {"bocsh": "SELECT idHerramienta FROM `herramientas` WHERE marca = 'bocsh'"},
                        {"makita": "SELECT idHerramienta FROM `herramientas` WHERE marca = 'makita'"},
                        {"stanley": "SELECT idHerramienta FROM `herramientas` WHERE marca = 'stanley'"},
                        {"ryobi": "SELECT idHerramienta FROM `herramientas` WHERE marca = 'ryobi'"},
                        {"infra": "SELECT idHerramienta FROM `herramientas` WHERE marca = 'infra'"},
                        {"truper": "SELECT idHerramienta FROM `herramientas` WHERE marca = 'truper'"},
                        {"generica": "SELECT idHerramienta FROM `herramientas` WHERE marca = 'generica'"},

                        {"nada": "SELECT idHerramienta FROM `herramientas`"}
                    ]
                }

                let arregloConceptos = []
                if(concepto) arregloConceptos = concepto.split("_")
                else arregloConceptos.push("nada")

                let arregloConcatenadoIds = []

                for(i = 0; i < arregloConceptos.length; i++){
                    let consultaObjeto = null //variable para guardar el objeto que se va a consutlar

                    for (j = 0; j < objeto_consultas.consultas.length; j++) { //recorremos el arreglo de las consultas
                        //console.log("entra al for")
                        const objetoActual = objeto_consultas.consultas[j] //guardamo el bjeto actual de objeto consultas en el indice j
                        if (objetoActual[arregloConceptos[i]]) { //verificamos que esté y guardamos el objeto
                            //console.log("entra al if")
                            consultaObjeto = objetoActual
                            break;
                        }
                    }

                    //console.log(consultaObjeto)
                    //console.log("-----------------------------------------------")
                    if(consultaObjeto){
                        const consulta = consultaObjeto[arregloConceptos[i]] //estamos en el concepto actual, se tomo el query del objeto
                        //console.log(consulta)
                        conexion_db.query(consulta, (err, resultado) => {
                            if(err){
                                console.log(err)
                                const objeto_error = {
                                    "mensaje": "error, petición no válida"
                                }
                                response.statusCode = 400;
                                response.setHeader('Content-Type', 'application/json')
                                response.end(JSON.stringify(objeto_error))
                                return 0
                            }

                            if(resultado.length == 0){
                                const objeto_error = {
                                    "mensaje": "error, herramienta no encontrada"
                                }
                                response.statusCode = 404;
                                response.setHeader('Content-Type', 'application/json')
                                response.end(JSON.stringify(objeto_error))
                                return 0
                            }

                            //console.log(resultado)

                            let arregloId = []
                            for(i = 0; i < resultado.length; i++){
                                //console.log("entra al for")
                                arregloId[i] = resultado[i].idHerramienta
                                //console.log(arregloId[i])

                            }

                            arregloConcatenadoIds = arregloConcatenadoIds.concat(arregloId)
                            //console.log(----------------------------)
                            //console.log(arregloConcatenadoIds)

                            const objeto_ids = {
                                "idHerramientas": arregloConcatenadoIds
                            };

                            response.statusCode = 200;
                            response.setHeader("Content-Type", "application/json");
                            response.end(JSON.stringify(objeto_ids));
                        })
                    }
                }
                
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

            /*------USUARIOS---------------------------------------------------------------------------------------------------------- */

            if(request.url == "/obtener_usuario"){
                if (!authHeader || authHeader == "" || authHeader == null || authHeader == undefined) {
                    response.statusCode = 401;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify({
                        "mensaje": "token no proporcionado"
                    }));
                    return 0
                }

                try{
                    const decoded = jwt.verify(authHeader, llave) //esta linea hacia que me crasheara el código, así que lo meti a un try catch MUAJAJA
                    
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
                                    "nombre": resultado[0].nombre
                                }));
                            }
                        })

                        //conexion_db.end();
                    })
                }
                catch (err){
                    console.log("Error al verificar la autenticidad", err.message)

                    let mensaje
                    if(err.name == "TokenExpiredError"){
                        mensaje = "Token expirado, por favor inicie sesión nuevamente"
                    }
                    else{
                        mensaje = "Token inválido"
                    }

                    response.statusCode = 401;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify({
                        "mensaje": mensaje
                    }));
                    return 0
                }
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

                        if(resultado.length <= 0){
                            const objeto_error = {
                                    "mensaje": "Correo y/o contraseña incorrectos"
                                }
                                response.statusCode = 401;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                                return 0
                        }

                        //console.log(resultado)

                        const token = jwt.sign({username: resultado[0].email}, llave, {expiresIn: "10m"})
                        
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
                
            })
            break;
        case "DELETE":
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