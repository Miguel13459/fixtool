/*tarjetas */
const contenedorOferta = document.querySelector("#contenedorOferta")
const tarjetaOferta = document.querySelector(".tarjetaOferta")
const anteriorBoton = document.querySelector("#anteriorBoton")
const siguienteBoton = document.querySelector("#siguienteBoton")

/*carrito */
const ventanaOscuraCarrito = document.querySelector("#ventanaOscuraCarrito")
const contenedorMercanciaCarrito = document.querySelector("#contenedorMercanciaCarrito")
const tarjetaCarrito = document.querySelector(".tarjetaCarrito")

let carritoUsuarioVisitante = {
    estaVacio: true,
    productos: []
}

/*indices bolitas */
let indiceActual = 0
const tarjetasVisibles = 5
let totalTarjetas = 0

fetch("http://localhost:3000/herramientas_inicio").then(recurso => recurso.json()).then(respuesta => { 
    console.log(respuesta)   
    for(i = 0; i < respuesta.idHerramientas.length; i++){
        let tarjetaClonOferta = tarjetaOferta.cloneNode(true)
        contenedorOferta.appendChild(tarjetaClonOferta)

        fetch("http://localhost:3000/obtener_herramienta_" + respuesta.idHerramientas[i]).then(recurso => recurso.json()).then(respuesta => {
            //console.log(respuesta)

            const sku = tarjetaClonOferta.querySelector(".sku")
            sku.innerHTML = "SKU: " + respuesta.idHerramienta

            const imgProducto = tarjetaClonOferta.querySelector(".imgProducto")
            const arregloBytes = new Uint8Array(respuesta.imagen.data)
            const blob = new Blob([arregloBytes])
            const imagen_base64 = URL.createObjectURL(blob)
            imgProducto.src = imagen_base64

            const marca = tarjetaClonOferta.querySelector(".marca h3")
            marca.innerHTML = respuesta.marca

            const titulo = tarjetaClonOferta.querySelector(".titulo p")
            let titulo_modificado = respuesta.titulo
            const maximo_caracteres = 50
            if(respuesta.titulo.length > maximo_caracteres) titulo_modificado = titulo_modificado.slice(0, maximo_caracteres - 3) + "..."
            titulo.innerHTML = titulo_modificado

            const precioFinal = tarjetaClonOferta.querySelector(".precioFinal p")
            precioFinal.innerHTML = "$" + respuesta.costoPorLote.toFixed(2)

            const precioAntes = tarjetaClonOferta.querySelector(".precioAntes p")
            precioAntes.innerHTML = "Antes: $ " + respuesta.PrecioAntes.toFixed(2)

            const ahorra = tarjetaClonOferta.querySelector(".ahorra p")
            ahorra.innerHTML = "Ahorras: $ " + respuesta.ahorras.toFixed(2)

            const porUnidad = tarjetaClonOferta.querySelector(".porUnidad")
            porUnidad.innerHTML = "$" + respuesta.costoPorPieza.toFixed(2) + " por pieza"

            const cantidadPorPaquete = tarjetaClonOferta.querySelector(".cantidadPorPaquete")
            cantidadPorPaquete.innerHTML = "Paquete de " + respuesta.paquetesPorLote + "pz"

            //funcionalidad de botones, input y agregar para el carrito 
            const noPaquetes = tarjetaClonOferta.querySelector(".noPaquetes")
            const botonMas = tarjetaClonOferta.querySelector(".botonMas")
            const botonMenos = tarjetaClonOferta.querySelector(".botonMenos")
            const agregar = tarjetaClonOferta.querySelector(".agregar")
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
            

            agregar.addEventListener("click", (evento) => {
                ventanaOscuraCarrito.style.display = "flex"

                //console.log(evento.currentTarget.informacionProducto.carritoSKU)
                //console.log(noPaquetes.value)

                let encontrado = false
                if(carritoUsuarioVisitante.estaVacio){
                     carritoUsuarioVisitante.productos.push({
                        "idHerramienta": evento.currentTarget.informacionProducto.carritoSKU,
                        "cantidad": parseInt(noPaquetes.value)
                    })
                    carritoUsuarioVisitante.estaVacio = false
                }else{
                    for(i = 0; i < carritoUsuarioVisitante.productos.length; i++){
                        if(carritoUsuarioVisitante.productos[i].idHerramienta == evento.currentTarget.informacionProducto.carritoSKU){
                            carritoUsuarioVisitante.productos[i].cantidad = parseInt(noPaquetes.value) + parseInt(carritoUsuarioVisitante.productos[i].cantidad)
                            encontrado = true
                            break;
                        }
                    }
                    if(!encontrado){
                        carritoUsuarioVisitante.productos.push({
                            "idHerramienta": evento.currentTarget.informacionProducto.carritoSKU,
                            "cantidad": parseInt(noPaquetes.value)
                        })
                    }
                }

                ActualizarCarrito()
            })

        }).catch(error => console.log(error))
        
    }
    tarjetaOferta.remove()
    totalTarjetas = respuesta.idHerramientas.length

    const bolitas = document.querySelector("#bolitas")
    const bolitaTarjeta = document.querySelector(".bolitaTarjeta")
    for(i = 0; i < Math.ceil(totalTarjetas/tarjetasVisibles); i++){
        
        let clonBolitaProductos = bolitaTarjeta.cloneNode(true)
        bolitas.appendChild(clonBolitaProductos)
        clonBolitaProductos.id = "producto" + i

        //const bolitaProductos = document.querySelector("#producto"+i)
        if("producto" + indiceActual == clonBolitaProductos.id){
            clonBolitaProductos.style.backgroundColor = "#0D2555"
        }else{
            clonBolitaProductos.style.backgroundColor = "#9a9a9a"
        }
    }
    bolitaTarjeta.remove()
})

function SiguientesTarjetas(){
    /*esta linea divide el total de tarjetas entre las visibles, esto crea "bloques" para mostrar las tarjetas
    por ejemplo si hay 10 tarjetas y solo quiero que sean visibles 3, 10/3 son 3.33
    Math ceil redondea todo al siguiente numero entero, si es 3.33 lo redondea 4, o sea 4 bloques para ver las tarjetas */
    const maximoBloques = Math.ceil(totalTarjetas/tarjetasVisibles) - 1
    if(indiceActual < maximoBloques){
        indiceActual++
        actualizarCarrusel(maximoBloques)
    }
    for(i=0; i<maximoBloques + 1; i++){
        const bolitaProductos = document.querySelector("#producto"+i)
        if(indiceActual == i){
            bolitaProductos.style.backgroundColor = "#0D2555"
        }else{
            bolitaProductos.style.backgroundColor = "#9a9a9a"
        }
    } 

}

function AnterioresTarjetas(){
    if (indiceActual > 0) {
        indiceActual--;
        actualizarCarrusel(0);
    }
    for(i=0; i<Math.ceil(totalTarjetas/tarjetasVisibles) + 1; i++){
        const bolitaProductos = document.querySelector("#producto"+i)
        if(indiceActual == i){
            bolitaProductos.style.backgroundColor = "#0D2555"
        }else{
            bolitaProductos.style.backgroundColor = "#9a9a9a"
        }
    }
}

function actualizarCarrusel(){
    const desplazamiento = indiceActual * (320 + 15) * tarjetasVisibles * -1
    contenedorOferta.style.transform = "translateX(" + desplazamiento + "px)"
}



/*quita el carrito */
function quitarVentana(){
    ventanaOscuraCarrito.style.display = "none"
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
        ventanaOscuraCarrito.style.display = "none"
    }
})


/*CATEGORIAS */

const herramientaElectrica = document.querySelector("#herramientaElectrica")
const herramientaManual = document.querySelector("#herramientaManual")
const estacionarias = document.querySelector("#estacionarias")
const contenedores = document.querySelector("#contenedores")
const compresores = document.querySelector("#compresores")
const sujecion = document.querySelector("#sujecion")
const bisacha = document.querySelector("#bisacha")
const tornilleria = document.querySelector("#tornilleria")


herramientaElectrica.addEventListener("click", () => {Redirigir("herramientaElectrica") })
herramientaManual.addEventListener("click", () => {Redirigir("herramientaManual") })
estacionarias.addEventListener("click", () => {Redirigir("estacionarias") })
contenedores.addEventListener("click", () => {Redirigir("contenedores") })
compresores.addEventListener("click", () => {Redirigir("compresores") })
sujecion.addEventListener("click", () => {Redirigir("sujecion") })
bisacha.addEventListener("click", () => {Redirigir("bisacha") })
tornilleria.addEventListener("click", () => {Redirigir("tornilleria") })


function Redirigir(categoria){
    localStorage.setItem("categoria", categoria)
    window.location.href = "catalogo.html"
}

function ActualizarCarrito(){
    contenedorMercanciaCarrito.innerHTML = ""
    console.log(carritoUsuarioVisitante)
    for(i=0; i < carritoUsuarioVisitante.productos.length; i++){
        fetch("http://localhost:3000/obtener_herramienta_" + carritoUsuarioVisitante.productos[i].idHerramienta).then(recurso => recurso.json()).then(respuesta => {
            let clonProducto = tarjetaCarrito.cloneNode(true)
            contenedorMercanciaCarrito.appendChild(clonProducto)
            //clonProducto.id = carritoUsuarioVisitante.productos[i].idHerramienta

            const productoCarrito = clonProducto.querySelector(".productoCarrito")
            const arregloBytesCarrito = new Uint8Array(respuesta.imagen.data)
            const blobCarrito = new Blob([arregloBytesCarrito])
            const imagenCarrito_64 = URL.createObjectURL(blobCarrito)
            productoCarrito.src = imagenCarrito_64

            const marcaCarrito = clonProducto.querySelector(".marcaCarrito")
            marcaCarrito.innerHTML = respuesta.marca

            const tituloProducto = clonProducto.querySelector(".tituloProducto p")
            tituloProducto.innerHTML = respuesta.titulo

            const carritoSKU = clonProducto.querySelector(".carritoSKU")
            carritoSKU.innerHTML = "SKU: " + respuesta.idHerramienta

            const piezasCarrito = clonProducto.querySelector(".piezasCarrito")
            piezasCarrito.innerHTML = "Paquete de " + respuesta.paquetesPorLote + "pz"

            const precioUnidadCarrito = clonProducto.querySelector(".precioUnidadCarrito")
            precioUnidadCarrito.innerHTML = "Precio por pieza: $" + respuesta.costoPorPieza

            const precioAnterior = clonProducto.querySelector(".precioAnterior")
            precioAnterior.innerHTML = "Precio anterior: $" + respuesta.PrecioAntes

            const precioFinal = clonProducto.querySelector(".precioFinal")
            precioFinal.innerHTML = "$" + respuesta.costoPorLote

            const noPaquetesCarrito = clonProducto.querySelector(".noPaquetesCarrito")
            let cantidad = 0
            for(j = 0; j < carritoUsuarioVisitante.productos.length; j++){
                if(carritoUsuarioVisitante.productos[j].idHerramienta != respuesta.sku){
                    cantidad = carritoUsuarioVisitante.productos[j].cantidad
                }
            }
            noPaquetesCarrito.value = cantidad
            
            const botonMasCarrito = clonProducto.querySelector(".botonMasCarrito")
            const botonMenosCarrito = clonProducto.querySelector(".botonMenosCarrito")

            botonMasCarrito.addEventListener("click", (evento) => {
                noPaquetesCarrito.value++
                if(noPaquetesCarrito.value > 9999){
                    noPaquetesCarrito.value = 9999
                }
                actualizarTotal()
                //precioFinal.innerHTML = "$" + (noPaquetesCarrito.value * parseFloat(evento.currentTarget.precioFinalModificar)).toFixed(2)
            })

            botonMenosCarrito.addEventListener("click", (evento) => {
                noPaquetesCarrito.value--
                if(noPaquetesCarrito.value < 1){
                    noPaquetesCarrito.value = 1
                }
                actualizarTotal()
                //precioFinal.innerHTML = "$" + (noPaquetesCarrito.value * parseFloat(evento.currentTarget.precioFinalModificar)).toFixed(2)
            })

            const borrarProductoCarrito = clonProducto.querySelector(".borrarProductoCarrito")
            borrarProductoCarrito.addEventListener("click", function(){
                clonProducto.remove()
                actualizarTotal()
            })
        })
    }
    localStorage.setItem("carrito_publico", JSON.stringify(carritoUsuarioVisitante))
}

function actualizarTotal() {
    let total = 0;
    const productos = contenedorMercanciaCarrito.querySelectorAll(".tarjetaCarrito");
    const totalApagar = document.querySelector("#totalApagar")
    
    /*empieza en 1 por que agarra la tarjeta original */
    for(i = 1; i < productos.length; i++){
        const cantidad = productos[i].querySelector(".noPaquetesCarrito").value
        const precioUnitario = productos[i].querySelector(".precioFinal").textContent.replace("$", "")
        total += parseInt(cantidad) * parseFloat(precioUnitario)
    }

    totalApagar.innerHTML = "Total a pagar: $" + total.toFixed(2);
    totalGlobal = total;
}