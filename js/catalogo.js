const todosLosCheck = document.querySelectorAll(".opcion input")
const categoriasEtiquetas = document.querySelectorAll("#tipos input")
const marcasEtiquetas = document.querySelectorAll("#marca input")
let categorias = []
let marcas = []

for(i = 0; i < categoriasEtiquetas.length; i++){
    categorias.push(categoriasEtiquetas[i].name)
}
for(i = 0; i < marcasEtiquetas.length; i++){
    marcas.push(marcasEtiquetas[i].name)
}

//console.log(marcas)

let objeto_filtrar = {
    categoria: "",
    marca: "",
    pma: false,
    pmb: false,
    promocion: false
}

for(i = 0; i < todosLosCheck.length; i++){
    todosLosCheck[i].addEventListener("change", (evento) => {
        const checkbox = evento.target
        const nombre = checkbox.name

        if (categorias.includes(nombre)) {
            actualizarCampoMultiple(objeto_filtrar, "categoria", nombre, checkbox.checked)
        }

        else if (marcas.includes(nombre)) {
            actualizarCampoMultiple(objeto_filtrar, "marca", nombre, checkbox.checked)
        }

        else if (nombre == "precioAlto") objeto_filtrar.pma = checkbox.checked
        else if (nombre == "precioBajo") objeto_filtrar.pmb = checkbox.checked
        else if (nombre == "promociones") objeto_filtrar.promocion = checkbox.checked

        console.log("Objeto filtro actualizado: ", objeto_filtrar)

        ActualizarCatalogo(objeto_filtrar)
    });
}

let totalGlobal = 0;
let carritoCatalogo = JSON.parse(localStorage.getItem("carrito_publico"))
console.log(carritoCatalogo)
const categoriaGuardada = localStorage.getItem("categoria")


switch(localStorage.getItem("categoria")){
    case "herramientaManual":
        herManual.checked = true
        actualizarCampoMultiple(objeto_filtrar, "categoria", categoriaGuardada, herManual.checked)
        ActualizarCatalogo(objeto_filtrar)
        break;
    case "herramientaElectrica":
        herElectrica.checked = true
        actualizarCampoMultiple(objeto_filtrar, "categoria", categoriaGuardada, herElectrica.checked)
        ActualizarCatalogo(objeto_filtrar)
        break;
    case "estacionarias":
        herEstacionaria.checked = true
        actualizarCampoMultiple(objeto_filtrar, "categoria", categoriaGuardada, herEstacionaria.checked)
        ActualizarCatalogo(objeto_filtrar)
        break;
    case "contenedores":
        contenedores.checked = true
        actualizarCampoMultiple(objeto_filtrar, "categoria", categoriaGuardada, contenedores.checked)
        ActualizarCatalogo(objeto_filtrar)
        break;
    case "compresores":
        compresores.checked = true
        actualizarCampoMultiple(objeto_filtrar, "categoria", categoriaGuardada, compresores.checked)
        ActualizarCatalogo(objeto_filtrar)
        break;
    case "sujecion":
        sujecion.checked = true
        actualizarCampoMultiple(objeto_filtrar, "categoria", categoriaGuardada, sujecion.checked)
        ActualizarCatalogo(objeto_filtrar)
        break;
    case "bisacha":
        bisagras.checked = true
        manijas.checked = true
        actualizarCampoMultiple(objeto_filtrar, "categoria", categoriaGuardada, bisagras.checked)
        ActualizarCatalogo(objeto_filtrar)
        break;
    case "tornilleria":
        tornilleria.checked = true
        actualizarCampoMultiple(objeto_filtrar, "categoria", categoriaGuardada, tornilleria.checked)
        ActualizarCatalogo(objeto_filtrar)
        break;
    default:
        
        break;
}
ActualizarCatalogo(objeto_filtrar)

if (categoriaGuardada && categoriaGuardada == "") {
    ActualizarCatalogo(objeto_filtrar)
    //actualizarCampoMultiple(objeto_filtrar, "categoria", categoriaGuardada, checkbox.checked)
    //ActualizarCatalogo(categoriaGuardada)
} /*else {
    //actualizarCampoMultiple(objeto_filtrar, "categoria", categoriaGuardada, checkbox.checked)
    //ActualizarCatalogo("nada")
}*/

const marca = document.querySelector("#marca")
const botonMostrarMas = document.querySelector("#mostrarMas p")
let mostrado = false

function MostrarMasMarcas(){
    if(mostrado){
        marca.style.height = "19vh"
        botonMostrarMas.innerHTML = "Mostrar más..."
        mostrado = false
    }else{
        marca.style.height = "auto"
        botonMostrarMas.innerHTML = "Mostrar menos..."
        mostrado = true
    }
}

window.onload = function(){
    localStorage.clear()
}

function actualizarTotal() {
    let total = 0;
    const productos = contenedorMercanciaCarrito.querySelectorAll(".tarjetaCarrito");
    const totalApagar = document.querySelector("#totalApagar")
    
    /*empieza en 1 por que agarra la tarjeta original */
    for(i = 1; i < productos.length; i++){
        const cantidad = productos[i].querySelector(".noPaquetesCarrito").value
        const precioUnitario = productos[i].querySelector(".precioFinal").textContent.replace("$", "")

        /*console.log(cantidad)
        console.log(precioUnitario)*/
        total += parseInt(cantidad) * parseFloat(precioUnitario)

        /*console.log(parseFloat(precioUnitario))
        console.log(parseInt(cantidad))
        console.log(parseInt(cantidad) * parseFloat(precioUnitario))
        console.log(total)*/
    }

    totalApagar.innerHTML = "Total a pagar: $" + total.toFixed(2);
    totalGlobal = total;
}

function actualizarCampoMultiple(objeto, campo, valor, agregar) {
    /*se tuvo que buscar como acceder a la clave de un json, por que cuando le ponia objeto.campo, siendo que campo tiene la
    propiedad del json que quiero buscar, me marcaba como si campo literalmente fuera una propiedad, así que la forma de
    acceder a la key del json es con objeto[nombre de la propiedad]*/
    let lista
    if(objeto[campo]) lista = objeto[campo].split("_") 
    else lista = []

    if (agregar) {
        if (!lista.includes(valor)) lista.push(valor);
    } else {
        let nuevaLista = [];
        for (i = 0; i < lista.length; i++) {
            if (lista[i] != valor) {
                nuevaLista.push(lista[i]);
            }
        }
        lista = nuevaLista;
    }

    objeto[campo] = lista.join("_");
}

function ActualizarCatalogo(objeto){
    console.log("estamos imprimiendo filtro: ", objeto)
    const catalogoProductos = document.querySelector("#catalogoProductos")
    const tarjetaCatalogo = document.querySelector(".tarjetaCatalogo")
    catalogoProductos.innerHTML = "";

    fetch("http://localhost:3000/obtener_ids_filtrado_de?" + "categoria=" + objeto.categoria + "&" + "marca=" + objeto.marca + "&" + "pma=" + objeto.pma + "&" + "pmb=" + objeto.pmb + "&" + "promocion=" + objeto.promocion ).then(recurso => recurso.json()).then(respuesta => {
        console.log("************")
        console.log(respuesta)
        console.log("************")
        for(i = 0; i < respuesta.idHerramientas.length; i++){
            const clonTarjetaCatalogo = tarjetaCatalogo.cloneNode(true)
            catalogoProductos.appendChild(clonTarjetaCatalogo)

            fetch("http://localhost:3000/obtener_herramienta_" + respuesta.idHerramientas[i]).then(recurso => recurso.json()).then(respuesta => {
                console.log("-----------------")
                console.log(respuesta)
                    console.log("-----------------")
                const sku = clonTarjetaCatalogo.querySelector(".sku")
                sku.innerHTML = "SKU: " + respuesta.idHerramienta

                const imagenProducto = clonTarjetaCatalogo.querySelector(".imgProducto")
                const arregloBytes = new Uint8Array(respuesta.imagen.data)
                const blob = new Blob([arregloBytes])
                const imagen_base64 = URL.createObjectURL(blob)
                imagenProducto.src = imagen_base64

                const marca = clonTarjetaCatalogo.querySelector(".marca h3")
                marca.innerHTML = respuesta.marca

                const titulo = clonTarjetaCatalogo.querySelector(".titulo p")
                let titulo_modificado = respuesta.titulo
                const maximo_caracteres = 50
                if(respuesta.titulo.length > maximo_caracteres) titulo_modificado = titulo_modificado.slice(0, maximo_caracteres - 3) + "..."
                titulo.innerHTML = titulo_modificado

                if(respuesta.estaDescuento == 1){
                    const precioTotal = clonTarjetaCatalogo.querySelector(".precioTotal")
                    precioTotal.style.display = "none"

                    const promocion = clonTarjetaCatalogo.querySelector(".promocion")
                    promocion.style.display = "flex"

                    const precioFinal = clonTarjetaCatalogo.querySelector(".precioFinal p")
                    precioFinal.innerHTML = "$" + respuesta.costoPorLote.toFixed(2)

                    const precioAntes = clonTarjetaCatalogo.querySelector(".precioAntes p")
                    precioAntes.innerHTML = "Antes: $" + respuesta.PrecioAntes.toFixed(2)

                    const ahorra = clonTarjetaCatalogo.querySelector(".ahorra p")
                    ahorra.innerHTML = "Ahorras: $" + respuesta.ahorras.toFixed(2)
                }

                const precioFinalSinPromocion = clonTarjetaCatalogo.querySelector(".precioFinalSinPromocion p")
                precioFinalSinPromocion.innerHTML = "$" + respuesta.costoPorLote.toFixed(2)

                //funcionalidad de botones, input y agregar para el carrito 
                const noPaquetes = clonTarjetaCatalogo.querySelector(".noPaquetes")
                const botonMas = clonTarjetaCatalogo.querySelector(".botonMas")
                const botonMenos = clonTarjetaCatalogo.querySelector(".botonMenos")
                const agregar = clonTarjetaCatalogo.querySelector(".agregar")
                noPaquetes.value = 1

                botonMas.addEventListener("click", () => {
                    noPaquetes.value++
                    if(noPaquetes.value > 9999){
                        noPaquetes.value = 9999
                    }
                })

                botonMenos.addEventListener("click", () => {
                    noPaquetes.value--
                    if(noPaquetes.value < 1){
                        noPaquetes.value = 1
                    }
                })

                agregar.informacionProducto = {
                    "marcaCarrito": respuesta.marca,
                    "tituloProducto": respuesta.titulo,
                    "carritoSKU": respuesta.idHerramienta,
                    "precioPorPieza": respuesta.costoPorPieza.toFixed(2),
                    "piezasCarrito": respuesta.paquetesPorLote,
                    "precioAnterior": respuesta.PrecioAntes.toFixed(2),
                    "precioFinal": respuesta.costoPorLote.toFixed(2),
                    "imagenCarrito": imagen_base64
                }

                let carritoUsuarioVisitante = {
                    producto: []
                }

                agregar.addEventListener("click", (evento) => {
                    const tarjetaCarrito = document.querySelector(".tarjetaCarrito")
                    ventanaOscuraCarrito.style.display = "flex"
                    const cantidadSeleccionada = noPaquetes.value;

                    const sku_buscar = evento.currentTarget.informacionProducto.carritoSKU
                    let arregloClones = contenedorMercanciaCarrito.querySelectorAll(".tarjetaCarrito")
                    let productoExistente = null;

                    for(j = 0; j < arregloClones.length; j++){
                        let sku_comparar = arregloClones[j].querySelector(".carritoSKU").textContent.replace("SKU: ", "")
                        if(sku_buscar == sku_comparar){
                            productoExistente = arregloClones[j]
                            break;
                        }
                    }
                
                    if (productoExistente) {
                        const noPaquetesCarrito = productoExistente.querySelector(".noPaquetesCarrito")

                        noPaquetesCarrito.value = parseInt(noPaquetesCarrito.value) + parseInt(cantidadSeleccionada) //da error si no los convierto a entero
                        actualizarTotal();
                        return
                    }

                    let clonProducto = tarjetaCarrito.cloneNode(true)
                    clonProducto.style.display = "flex"
                    contenedorMercanciaCarrito.appendChild(clonProducto)

                    const productoCarrito = clonProducto.querySelector(".productoCarrito")
                    productoCarrito.src = evento.currentTarget.informacionProducto.imagenCarrito

                    const marcaCarrito = clonProducto.querySelector(".marcaCarrito")
                    marcaCarrito.innerHTML = evento.currentTarget.informacionProducto.marcaCarrito

                    const tituloProducto = clonProducto.querySelector(".tituloProducto p")
                    tituloProducto.innerHTML = evento.currentTarget.informacionProducto.tituloProducto

                    const carritoSKU = clonProducto.querySelector(".carritoSKU")
                    carritoSKU.innerHTML = "SKU: " + evento.currentTarget.informacionProducto.carritoSKU
                    
                    const piezasCarrito = clonProducto.querySelector(".piezasCarrito")
                    piezasCarrito.innerHTML = "Paquete de " + evento.currentTarget.informacionProducto.piezasCarrito + "pz"

                    const precioUnidadCarrito = clonProducto.querySelector(".precioUnidadCarrito")
                    precioUnidadCarrito.innerHTML = "Precio por pieza: $" + evento.currentTarget.informacionProducto.precioPorPieza

                    const precioAnterior = clonProducto.querySelector(".precioAnterior")
                    precioAnterior.innerHTML = "Precio anterior: $" + evento.currentTarget.informacionProducto.precioAnterior

                    const precioFinal = clonProducto.querySelector(".precioFinal")
                    precioFinal.innerHTML = "$" + evento.currentTarget.informacionProducto.precioFinal

                    const noPaquetesCarrito = clonProducto.querySelector(".noPaquetesCarrito")
                    noPaquetesCarrito.value = cantidadSeleccionada
                    
                    const botonMasCarrito = clonProducto.querySelector(".botonMasCarrito")
                    const botonMenosCarrito = clonProducto.querySelector(".botonMenosCarrito")
                    
                    botonMasCarrito.precioFinalModificar = evento.currentTarget.informacionProducto.precioFinal
                    botonMenosCarrito.precioFinalModificar = evento.currentTarget.informacionProducto.precioFinal

                    botonMasCarrito.addEventListener("click", (evento) => {
                        noPaquetesCarrito.value++
                        if(noPaquetesCarrito.value > 9999){
                            noPaquetesCarrito.value = 9999
                        }
                        actualizarTotal();
                    })

                    botonMenosCarrito.addEventListener("click", (evento) => {
                        noPaquetesCarrito.value--
                        if(noPaquetesCarrito.value < 1){
                            noPaquetesCarrito.value = 1
                        }
                        actualizarTotal();
                    })

                    const borrarProductoCarrito = clonProducto.querySelector(".borrarProductoCarrito")
                    borrarProductoCarrito.addEventListener("click", function(){
                        clonProducto.remove()
                        actualizarTotal();
                    })
                    
                    tarjetaCarrito.style.display = "none"
                    actualizarTotal();
                })
            }).catch(err => {
                console.log("Sucedió un error", err)
            })
        }
        tarjetaCatalogo.style.display = "none"
    }).catch(err => {
        console.log("Sucedió un error al obtener los id", err)
    })

    
}

window.addEventListener("keydown", (evento) => {
    if(evento.key === "Escape" || evento.key === "Esc"){
        ventanaOscuraCarrito.style.display = "none"
    }
})

console.log(localStorage)
console.log(sessionStorage)

/*const precioAlto = document.querySelector("#precioAlto");
const precioBajo = document.querySelector("#precioBajo");
const promociones = document.querySelector("#promociones");

const herManual = document.querySelector("#herManual");
const herElectrica = document.querySelector("#herElectrica");
const herEstacionaria = document.querySelector("#herEstacionaria");
const contenedores = document.querySelector("#contenedores");
const compresores = document.querySelector("#compresores");
const sujecion = document.querySelector("#sujecion");
const bisagras = document.querySelector("#bisagras");
const manijas = document.querySelector("#manijas");
const tornilleria = document.querySelector("#tornilleria");
const soldadura = document.querySelector("#soldadura");

const dewalt = document.querySelector("#dewalt");
const milwaukee = document.querySelector("#milwaukee");
const bocsh = document.querySelector("#bocsh");
const makita = document.querySelector("#makita");
const stanley = document.querySelector("#stanley");
const ryobi = document.querySelector("#ryobi");
const infra = document.querySelector("#infra");
const truper = document.querySelector("#truper");
const generica = document.querySelector("#generica");*/


/*


        fetch("http://localhost:3000/herramientas_catalogo").then(recurso => recurso.json()).then(respuesta => {
            
        })
*/