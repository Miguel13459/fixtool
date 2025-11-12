const header = document.querySelector("header")

header.innerHTML = `<div id="barraArriba">
            <div id="logo">
                <img src="./recursos/img/logo.svg" alt="logo" id="logo">
            </div>
            <div id="barraBusquedaContenedor">
                <input type="search" name="buscador" id="barraBusqueda" placeholder="Buscar">
            </div>
            <div id="usuarioControles">
                <div id="contenedorInicioSesion">
                    <div id="botonesLogin">
                        <button id="inicioSesion" class="botonesRegistro" onclick="IniciarSesion()">Iniciar Sesión</button>
                        <button id="registrar" class="botonesRegistro" onclick="Registrarse()">Registrarse</button>
                    </div>
                    <div id="sesionNombreFoto">
                        <p>Bienvenido [Nombre]</p>
                        <img src="./recursos/img/view-preview-svgrepo-com.svg" alt="perfil" id="imgPerfil">
                        <div id="menuPerfil">
                            <label class="opcionMenu">
                                <input type="checkbox" id="modoVendedor"> Modo vendedor
                            </label>
                            <div class="opcionMenu" id="cerrarSesion">Cerrar sesión</div>
                        </div>
                    </div>
                </div>
                <div id="carritoContenedor">
                    <img src="./recursos/iconos/carrito.svg" alt="carrito de compra" class="icono" onclick="AparecerCarrito()">
                </div>
            </div>
        </div>
        <hr style="width: 90%;">
        <div id="contenedorNav">
            <nav>
                <div class="botonBarraNav" onclick="window.location.href = 'index.html'"><p>Inicio</p></div>
                <div class="botonBarraNav" onclick="window.location.href = 'catalogo.html'"><p>Catálogo</p></div>
                <div class="botonBarraNav" onclick="window.location.href = 'nosotros.html'"><p>Sobre nosotros</p></div>
            </nav>
        </div>`

const ventanaOscuraInicioSesion = document.querySelector("#ventanaOscuraInicioSesion")
const ventanaOscuraRegistro = document.querySelector("#ventanaOscuraRegistro")

function IniciarSesion(){
    ventanaOscuraInicioSesion.style.display = "flex"
}

function Registrarse(){
    ventanaOscuraRegistro.style.display = "flex"
}

function QuitarVentanaSesion(){
    ventanaOscuraInicioSesion.style.display = "none"
}

function QuitarVentanaRegistro(){
    ventanaOscuraRegistro.style.display = "none"
}

function AparecerCarrito(){
    ventanaOscuraCarrito.style.display = "flex"
}

window.addEventListener("keydown", function(evento){
    //console.log(evento)
    if(evento.key === "Escape"){
        ventanaOscuraInicioSesion.style.display = "none"
        ventanaOscuraRegistro.style.display = "none"
    }
})