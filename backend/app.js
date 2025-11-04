const http = require("node:http")
const fs = require("node:fs")
const basedatos = require("mysql")
const puerto = 3000

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

    switch(request.method){
        case "GET":

            /*promociones inicio */
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

            /*catalogo */
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

            /*portada */
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

            /*sobre nosotros*/
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

            

            response.statusCode = 404
            response.setHeader("Content-Type", "application/json")
            response.end(JSON.stringify({
                "mensaje": "Nada por aquí"
            }))
            break;
        case "POST":
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