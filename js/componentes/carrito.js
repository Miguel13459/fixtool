ventanaOscuraCarrito.innerHTML = `<div id="pantallaDelCarrito">
            <div id="margenCarrito">
                <div id="headCarrito">
                    <h2>Productos de mi carrito</h2>
                    <img src="./recursos/iconos/cancel.svg" alt="cancel" class="cancelCarrito" onclick="quitarVentana()">
                </div>
                <div id="totalApagar">
                    <p>Total a pagar: $00.00</p>
                </div>
                <div id="botonProcederPago">
                    <button id="pagar">PROCEDER CON EL PAGO</button>
                </div>
                <div id="contenedorMercanciaCarrito">
                    <div class="tarjetaCarrito">
                        <div class="margenTarjetaCarrito">
                            <div class="parteSuperiorCarrito">
                                <div class="imagenCarrito">
                                    <img src="./recursos/categorias/carpentry-drill-drilling-svgrepo-com.svg" alt="producto carrito" class="productoCarrito">
                                </div>
                                <div class="infoProducto">
                                    <div class="marcaSKU">
                                        <p class="marcaCarrito">Urrea</p>
                                        
                                    </div>
                                    <div class="tituloProducto"><p>Rotomartillo 1/2 pulgada</p></div>
                                    <div class="extraInfo">
                                        <p class="carritoSKU">SKU: HR-011</p>
                                        <p class="piezasCarrito">Paquete de 4pz</p>
                                        <p class="precioUnidadCarrito">Precio por pieza: $1000.00</p>
                                    </div>
                                </div>
                                <div class="iconoBorrar">
                                    <img src="https://www.svgrepo.com/show/533007/trash.svg" alt="borrar" class="borrarProductoCarrito">
                                </div>
                            </div>
                            <div class="parteInferior">
                                <div class="cantidadAgregarCarrito">
                                    <div class="numeroInfoCarrito">
                                        <label for="noPaquetes">No.Paquetes</label>
                                    </div>
                                    <div class="cajaAgregar">
                                        <div class="cantidadContenedorCarrito">
                                            <input type="text" name="noPaquetes" class="noPaquetesCarrito">
                                            <button class="botonMasCarrito">+</button>
                                            <button class="botonMenosCarrito">-</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="precioCarrito">
                                    <div class="ofertaCarrito">
                                        <p>Promoción</p>
                                        <p class="precioAnterior">Precio anterior: $1200.00</p>
                                    </div>
                                    <div class="precioTotalCarrito">
                                        <p>total:</p>
                                        <p class="precioFinal">$0</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

function quitarVentana(){
    ventanaOscuraCarrito.style.display = "none"
}