console.log(sessionStorage)
ObtenerMisHerramientas()

const formulario = document.querySelector("#formulario")
const CajaBotonCrearPublicacion = document.querySelector("#CajaBotonCrearPublicacion")

const skuProducto = document.querySelector("#skuProducto")

const preview = document.querySelector("#preview")
const ingresarImagen = document.querySelector("#ingresarImagen")

const nombreProducto = document.querySelector("#nombreProducto")
const textoDescripcion = document.querySelector("#textoDescripcion")

const precioPorLote = document.querySelector("#precioPorLote")
const paquetePorLote = document.querySelector("#paquetePorLote")
const precioDePiezasPorPaquete = document.querySelector("#precioDePiezasPorPaquete") //precioUnidads CALCULAR

const trianguloTipo = document.querySelector("#tipo img")
const trianguloMarca = document.querySelector("#marca img")

const inputtipoProducto = document.querySelector("#tipoProducto")
const inputmarcaProducto = document.querySelector("#marcaProducto")

const opcionesTipo = document.querySelector("#opcionesTipo")
const opcionesMarca = document.querySelector("#opcionesMarca")

const opcionTipo = document.querySelector("#opcionesTipo li")
const opcionMarca = document.querySelector("#opcionesMarca li")

const estaPromocion = document.querySelector("#estaPromocion")
const promocionAplicable = document.querySelector("#promocionAplicable")
const ponerPromocion = document.querySelector("#ponerPromocion")

const estatus = document.querySelector("#estatus")
const estaActivo = document.querySelector("#estaActivo")
const estaDescontinuado = document.querySelector("#estaDescontinuado")

const tipoMarca = document.querySelectorAll("#tipoMarcaCaja input")
const precios = document.querySelectorAll("#precioCantidadCaja input")

const precioConDescuento = document.querySelector("#precioConDescuento")

const botonSubirProducto = document.querySelector("#contenedorBoton button")

function ObtenerMisHerramientas(){
    fetch("http://localhost:3000/obtener_mis_herramientas", {
        method: "GET",
        headers: {
            "Authorization": sessionStorage.getItem("token_sesion")
        }
    }).then(recurso => {
        if(recurso.status == 200){
            recurso.json().then(respuesta => {
                //console.log(respuesta.idHerramientas)
                const listaDeProductos = document.querySelector("#listaDeProductos")
                const cajaProducto = document.querySelector(".cajaProducto")

                for(i = 0; i < respuesta.idHerramientas.length; i++){
                    const clonProducto = cajaProducto.cloneNode(true)
                    listaDeProductos.prepend(clonProducto)

                    fetch("http://localhost:3000/obtener_herramienta_" + respuesta.idHerramientas[i]).then(recurso => recurso.json()).then(respuesta => {
                        const skuInventario = clonProducto.querySelector(".skuInventario")
                        const imgProductoInventario = clonProducto.querySelector(".imgProductoInventario")
                        const marcaInventario = clonProducto.querySelector(".marcaInventario")
                        const tituloInventario = clonProducto.querySelector(".tituloInventario")
                        const piezasPorLoteInventario = clonProducto.querySelector(".piezasPorLoteInventario")
                        const precioUnidadInventario = clonProducto.querySelector(".precioUnidadInventario")
                        const precioTotalInventario = clonProducto.querySelector(".precioTotalInventario")
                        const estatusTexto = clonProducto.querySelector(".estatusTexto")
                        const bolitaEstatus = clonProducto.querySelector(".bolitaEstatus")
                        const promocionPintado = clonProducto.querySelector(".promocionPintado")

                        const botonEliminar = clonProducto.querySelector(".cajaBotonEliminar button")

                        skuInventario.innerHTML = "SKU: " + respuesta.idHerramienta

                        const arregloImg = new Uint8Array(respuesta.imagen.data)
                        const blobInventario = new Blob([arregloImg])
                        const imgInventario64 = URL.createObjectURL(blobInventario)
                        imgProductoInventario.src = imgInventario64

                        marcaInventario.innerHTML = respuesta.marca
                        if(respuesta.estaDescuento == 1) promocionPintado.style.display = "block"
                        console.log(respuesta.estaDescuento)
                        
                        let titulo_modificado = respuesta.titulo
                        const maximo_caracteres = 50
                        if(respuesta.titulo.length > maximo_caracteres) titulo_modificado = titulo_modificado.slice(0, maximo_caracteres - 3) + "..."
                        tituloInventario.innerHTML = titulo_modificado

                        piezasPorLoteInventario.innerHTML = "Piezas por lote: " + respuesta.paquetesPorLote
                        precioUnidadInventario.innerHTML = "Precio por unidad: $ " + respuesta.costoPorPieza.toFixed(2) + " por pieza"
                        precioTotalInventario.innerHTML = "Precio total: $ " + respuesta.costoPorLote.toFixed(2)
                        estatusTexto.innerHTML = (respuesta.activo) ? "Estado: Activo" :  "Estado: Inactivo"
                        bolitaEstatus.style.backgroundColor = (respuesta.activo) ? "#6bb97c" :  "#b94c4c"

                        /* PUT */
                        clonProducto.respuesta = respuesta
                        clonProducto.imagen = imgProductoInventario.src
                        clonProducto.addEventListener("click", (evento) => {
                            CajaBotonCrearPublicacion.style.display = "none"
                            formulario.style.display = "block"
                            promocionAplicable.style.display = "block"
                            estatus.style.display = "block"

                            let precio = (evento.currentTarget.respuesta.estaDescuento == 1) ? ((evento.currentTarget.respuesta.costoPorLote * 100) / (100 - evento.currentTarget.respuesta.descuentoPorcentaje)).toFixed(2) : evento.currentTarget.respuesta.costoPorLote;


                            skuProducto.innerHTML = "SKU: " + evento.currentTarget.respuesta.idHerramienta
                            preview.src = evento.currentTarget.imagen
                            nombreProducto.value = evento.currentTarget.respuesta.titulo
                            textoDescripcion.value = evento.currentTarget.respuesta.descripcion
                            precioPorLote.value = precio
                            paquetePorLote.value = evento.currentTarget.respuesta.paquetesPorLote
                            inputtipoProducto.value = evento.currentTarget.respuesta.categoria
                            inputmarcaProducto.value = evento.currentTarget.respuesta.marca
                            estaPromocion.checked = (evento.currentTarget.respuesta.estaDescuento == 1) ? true : false
                            precioDePiezasPorPaquete.innerHTML = "$ " + (precio/evento.currentTarget.respuesta.paquetesPorLote).toFixed(2) + " por pieza"
                            
                            ingresarImagen.addEventListener("change", () => {
                                let archivo = ingresarImagen.files[0]
                                const reader = new FileReader()
                                reader.readAsDataURL(archivo)
                                reader.onload = () => {
                                    preview.src = reader.result
                                }
                            })
                            
                            MostrarEsconderMenu(
                                trianguloTipo,
                                inputtipoProducto,
                                "http://localhost:3000/tipos",
                                opcionesTipo,
                                opcionTipo
                            )

                            MostrarEsconderMenu(
                                trianguloMarca,
                                inputmarcaProducto,
                                "http://localhost:3000/marcas",
                                opcionesMarca,
                                opcionMarca
                            )
                            
                            if(evento.currentTarget.respuesta.activo){
                                estaActivo.checked = true
                                estaDescontinuado.checked = false
                            }
                            else{
                                estaActivo.checked = false
                                estaDescontinuado.checked = true
                            }

                            estaActivo.addEventListener("change", () => {
                                if(estaActivo.checked == true) estaDescontinuado.checked = false
                            })

                            estaDescontinuado.addEventListener("change", () => {
                                if(estaDescontinuado.checked == true) estaActivo.checked = false
                            })

                            if(estaPromocion.checked){
                                ponerPromocion.value = evento.currentTarget.respuesta.descuentoPorcentaje
                                precioConDescuento.innerHTML = "$ " + parseFloat(precioPorLote.value - ((precioPorLote.value * evento.currentTarget.respuesta.descuentoPorcentaje)/100)).toFixed(2)
                            }

                            estaPromocion.descuento = evento.currentTarget.respuesta.descuentoPorcentaje
                            estaPromocion.precioPorLote = precioPorLote.value
                            estaPromocion.addEventListener("change", (evento) => {
                                if(estaPromocion.checked){
                                    ponerPromocion.value = evento.currentTarget.descuento
                                }else{
                                    ponerPromocion.value = 0
                                    precioConDescuento.innerHTML = "$ " + parseFloat(evento.currentTarget.precioPorLote) - parseFloat((evento.currentTarget.precioPorLote * evento.currentTarget.descuento)/100)
                                }
                            })

                            ponerPromocion.addEventListener("input", () => {

                                let precioOriginal = parseFloat(precioPorLote.value);
                                let descuento = parseFloat(ponerPromocion.value);

                                if (descuento > 0 && descuento <= 100) {
                                    estaPromocion.checked = true;

                                    let precioFinal = precioOriginal - (precioOriginal * descuento / 100);

                                    precioConDescuento.innerHTML = "$ " + precioFinal.toFixed(2);
                                } else {
                                    estaPromocion.checked = false;
                                    precioConDescuento.innerHTML = "$ " + precioOriginal.toFixed(2);
                                }
                            })

                            botonSubirProducto.innerHTML = "Editar producto"

                            let arregloEditarInputs = []
                            LlenarArregloInputs(arregloEditarInputs)
                            arregloEditarInputs = arregloEditarInputs.filter(function(coso) {
                                //console.log("se quitó el elemento", ingresarImagen)
                                return coso !== ingresarImagen
                            })

                            botonSubirProducto.idHerramienta = respuesta.idHerramienta
                            botonSubirProducto.addEventListener("click", (evento) => {
                                let hayElementosVacios = false

                                for(j = 0; j < arregloEditarInputs.length; j++){
                                    if(arregloEditarInputs[j].value.trim() == "" || arregloEditarInputs[j].value.trim() == null){
                                        arregloEditarInputs[j].style.border = "2px solid red";
                                        hayElementosVacios = true
                                    }
                                }

                                if(hayElementosVacios){
                                    alert("Por favor, completa los campos en rojo antes de continuar.")
                                }else{
                                    let PPL
                                    if(precioPorLote.value.includes(",")){
                                        PPL = precioPorLote.value.replace(",", "")
                                    }else{
                                        PPL = precioPorLote.value
                                    }

                                    console.log(PPL)

                                    const objetoEditar = {
                                        "idHerramienta" : evento.currentTarget.idHerramienta,
                                        "imagen" : (ingresarImagen.value == null || ingresarImagen.value == "") ? null : preview.src,
                                        "nombreProducto" : nombreProducto.value,
                                        "textoDescripcion" : textoDescripcion.value,
                                        "precioPorLote" : parseFloat(PPL).toFixed(2),
                                        "paquetePorLote" : paquetePorLote.value,
                                        "inputtipoProducto" : inputtipoProducto.value,
                                        "inputmarcaProducto" : inputmarcaProducto.value,
                                        "estaPromocion" : (estaPromocion.checked) ? 1 : 0,
                                        "activo": (estaActivo.checked) ? 1 : 0,
                                        "ponerPromocion": ponerPromocion.value 
                                    }

                                    console.log(objetoEditar)

                                    //console.log(nuevaHerramienta)
                                    fetch("http://localhost:3000/editar_producto", {
                                        method: "PUT",
                                        headers: {
                                            "Authorization": sessionStorage.getItem("token_sesion")
                                        },
                                        body: JSON.stringify(objetoEditar)
                                    }).then(recurso => {
                                        if(recurso.status == 200){
                                            recurso.json().then(respuesta => {
                                                alert(respuesta.mensaje)
                                                //CajaBotonCrearPublicacion.style.display = "block"
                                                //formulario.style.display = "none"
                                                location.reload()
                                            })
                                        }else{
                                            recurso.json().then(respuesta => {
                                                alert(respuesta.mensaje)
                                            })
                                        }
                                    })
                                }

                            })
                        })

                        botonEliminar.idHerramienta = respuesta.idHerramienta
                        botonEliminar.addEventListener("click", (evento) => {
                            let idHer = evento.currentTarget.idHerramienta
                            let confirmar = confirm("¿Seguro que deseas borrar esta herramienta?")
                            console.log(idHer)

                            if(!confirmar) return

                            fetch("http://localhost:3000/eliminar_herramienta", {
                                method: "DELETE",
                                headers: {
                                            "Authorization": sessionStorage.getItem("token_sesion")
                                },
                                body: JSON.stringify({
                                    idHerramienta: idHer
                                })
                            }).then(recurso => {
                                if(recurso.status == 200){
                                    recurso.json().then(respuesta => {
                                        alert(respuesta.mensaje)
                                        location.reload()
                                    })
                                }else{
                                    recurso.json().then(respuesta => {
                                        alert(respuesta.mensaje)
                                    })
                                }
                            })
                        })

                    }).catch(error => console.log("Hubo un error", error))
                }
                cajaProducto.style.display = "none"

            })
        }else{
            recurso.json().then(respuesta => {
                console.log(respuesta.mensaje)
                alert("Sesión expirada, vuelve a iniciar sesión") //DESCOMENTAAAAAAAAAAAAAAAAAAAAAAR
                window.location.href = "index.html"
            })
        }
    })
}

//SubirNuevoProducto() //QUITAR LINEA
function SubirNuevoProducto(){
    CajaBotonCrearPublicacion.style.display = "none"
    formulario.style.display = "block"

    ingresarImagen.addEventListener("change", () => {
        let archivo = ingresarImagen.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(archivo)
        reader.onload = () => {
            preview.src = reader.result
        }
    })
    
    MostrarEsconderMenu(
        trianguloTipo,
        inputtipoProducto,
        "http://localhost:3000/tipos",
        opcionesTipo,
        opcionTipo
    )

    MostrarEsconderMenu(
        trianguloMarca,
        inputmarcaProducto,
        "http://localhost:3000/marcas",
        opcionesMarca,
        opcionMarca
    )

    estaPromocion.addEventListener("change", () => {
        if(estaPromocion.checked){
            promocionAplicable.style.display = "block"
        }else{
            promocionAplicable.style.display = "none"
        }
    })

    let elementosSubirProductos = []
    //elementosSubirProductos = tipoMarca
    LlenarArregloInputs(elementosSubirProductos)

    botonSubirProducto.addEventListener("click", () => {
        let hayElementosVacios = false

        for(j = 0; j < elementosSubirProductos.length; j++){
            if(elementosSubirProductos[j].value.trim() == "" || elementosSubirProductos[j].value.trim() == null){
                elementosSubirProductos[j].style.border = "2px solid red";
                hayElementosVacios = true
            }
        }

        if(hayElementosVacios){
            alert("Por favor, completa los campos en rojo antes de continuar.")
        }else{
            let PPL
            if(precioPorLote.value.includes(",")){
                PPL = precioPorLote.value.replace(",", "")
            }else{
                PPL = precioPorLote.value
            }

            console.log(PPL)

            let nuevaHerramienta = {
                imagen: preview.src,
                titulo: nombreProducto.value,
                descripcion: textoDescripcion.value,
                precioPorLote: parseFloat(PPL).toFixed(2),
                paquetePorLote: paquetePorLote.value,
                precioDePiezasPorPaquete: parseFloat(PPL/paquetePorLote.value).toFixed(2),
                opcionTipo: inputtipoProducto.value,
                opcionMarca: inputmarcaProducto.value,
                estatus: true,
                estaPromocion: estaPromocion.checked,
                ponerPromocion: ponerPromocion.value
            }

            //console.log(nuevaHerramienta)
            fetch("http://localhost:3000/subir_nuevo_producto", {
                method: "POST",
                headers: {
                    "Authorization": sessionStorage.getItem("token_sesion")
                },
                body: JSON.stringify(nuevaHerramienta)
            }).then(recurso => {
                if(recurso.status == 200){
                    recurso.json().then(respuesta => {
                        alert(respuesta.mensaje)
                        //CajaBotonCrearPublicacion.style.display = "block"
                        //formulario.style.display = "none"
                        location.reload()
                    })
                }else{
                    recurso.json().then(respuesta => {
                        alert(respuesta.mensaje)
                    })
                }
            })
        }
    })
}

function MostrarEsconderMenu(triangulo, input, url, contenedorOpciones, opcion){
        let estadoMenu

        function MenuSeleccionado(){
            if(estadoMenu){
                triangulo.style.transform = "rotate(0deg)"
                contenedorOpciones.style.display = "none"
                estadoMenu = false
            }
            else{
                triangulo.style.transform = "rotate(-90deg)"
                contenedorOpciones.style.display = "block"

                fetch(url).then(recurso => {
                    if(recurso.status == 200){
                        recurso.json().then(respuesta => {
                            //console.log(respuesta)
                            if(respuesta.tipos){
                                lista = respuesta.tipos
                            }
                            else{
                                lista = respuesta.marcas
                            }
                            //console.log(lista)
                            for(i = 0; i < lista.length; i++){
                                const clon = opcion.cloneNode(true)

                                clon.innerHTML = lista[i]

                                clon.tipo = lista[i]
                                clon.addEventListener("click", function(evento){
                                    input.value = evento.currentTarget.tipo
                                    triangulo.style.transform = "rotate(0deg)"
                                    estadoMenu = false
                                    contenedorOpciones.style.display = "none"
                                })
                                contenedorOpciones.appendChild(clon)
                            }
                            opcion.style.display = "none"
                        })
                    }else{
                        recurso.json().then(respuesta => {
                            alert(respuesta.mensaje)
                        })
                    }
                })
                estadoMenu = true
            }
        }

        triangulo.addEventListener("click", MenuSeleccionado)
        input.addEventListener("click", MenuSeleccionado)
    }

function LlenarArregloInputs(arregloInputs){
    for(j = 0; j < tipoMarca.length; j++){
        arregloInputs.push(tipoMarca[j])
    }
    for(j = 0; j < precios.length; j++){
        arregloInputs.push(precios[j])
    }
    arregloInputs.push(ingresarImagen)
    arregloInputs.push(nombreProducto)
    arregloInputs.push(textoDescripcion)
}