const precioAlto = document.querySelector("#precioAlto")
const precioBajo = document.querySelector("#precioBajo")
const promociones = document.querySelector("#promociones")

const herManual = document.querySelector("#herManual")
const herElectrica = document.querySelector("#herElectrica")
const herEstacionaria = document.querySelector("#herEstacionaria")
const contenedores = document.querySelector("#contenedores")
const compresores = document.querySelector("#compresores")
const sujecion = document.querySelector("#sujecion")
const bisagras = document.querySelector("#bisagras")
const manijas = document.querySelector("#manijas")
const tornilleria = document.querySelector("#tornilleria")
const soldadura = document.querySelector("#soldadura")

const dewalt = document.querySelector("#dewalt")
const milwaukee = document.querySelector("#milwaukee")
const bocsh = document.querySelector("#bocsh")
const makita = document.querySelector("#makita")
const stanley = document.querySelector("#stanley")
const ryobi = document.querySelector("#ryobi")
const infra = document.querySelector("#infra")
const truper = document.querySelector("#truper")
const generica = document.querySelector("#generica")

let totalGlobal = 0

switch(localStorage.getItem("categoria")){
    case "herramientaElectrica":
        herElectrica.checked = true;
        break;
    case "herramientaManual":
        herManual.checked = true;
        break;
    case "estacionarias":
        herEstacionaria.checked = true;
        break;
    case "contenedores":
        contenedores.checked = true;
        break;
    case "compresores":
        compresores.checked = true;
        break;
    case "sujecion":
        sujecion.checked = true;
        break;
    case "bisacha":
        bisagras.checked = true;
        break;
    case "tornilleria":
        tornilleria.checked = true;
        break;
    default:
        const catalogoProductos = document.querySelector("#catalogoProductos")
        const tarjetaCatalogo = document.querySelector(".tarjetaCatalogo")

        fetch("http://localhost:3000/herramientas_catalogo").then(recurso => recurso.json()).then(respuesta => {
            for(i = 0; i < respuesta.idHerramientas.length; i++){
                const clonTarjetaCatalogo = tarjetaCatalogo.cloneNode(true)
                catalogoProductos.appendChild(clonTarjetaCatalogo)

                fetch("http://localhost:3000/obtener_herramienta_" + respuesta.idHerramientas[i]).then(recurso => recurso.json()).then(respuesta => {
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
                        
                        /*if(tarjetaCarrito){
                            tarjetaCarrito.remove()
                        }*/
                       tarjetaCarrito.style.display = "none"
                       actualizarTotal();
                    })
                })
            }
            tarjetaCatalogo.remove()
        })
        break;
}

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