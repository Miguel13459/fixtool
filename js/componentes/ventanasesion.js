ventanaOscuraInicioSesion.innerHTML = `<div id="anuncioInicioSesion">
            <div id="contenedorLogin">
                <div class="quitarAnuncio">
                    <img src="./recursos/iconos/cancel.svg" alt="cancel" class="cancelarBorrar" onclick="QuitarVentanaSesion()">
                </div>
                <div class="mentajeRegistro">
                    <p>Inicia sesión en nuestra página</p>
                </div>
                <div class="formularioLogin">
                    <div id="correoCajaSesion" class="elementosLogin inputsDobles">
                        <label for="correoSesion">Correo electrónico</label>
                        <input type="text" name="correoSesion" id="correoSesion" >
                    </div>
                    <div id="contrasenaCajaSesion" class="elementosLogin inputsDobles">
                        <label for="contrasenaSesion">Contraseña</label>
                        <input type="text" name="contrasenaSesion" id="contrasenaSesion" >
                    </div>
                </div>
                <div id="IniciarSesionBotonCaja" class="elementosLogin">
                    <button onclick="ConfirmarSesion()">Iniciar sesión</button>
                </div>
                <div id="mensajeDirigirCrearCuenta" class="elementosLogin">
                    <p>¿Aún no tienes una cuenta?</p>
                </div>
                <div id="crearCuentaBoton" class="elementosLogin">
                    <button onclick="RedirigirRegistro()">Crear cuenta</button>
                </div>
            </div>
        </div>`



function ConfirmarSesion(){
    const correoSesion = document.querySelector("#correoSesion")
    const contrasenaSesion = document.querySelector("#contrasenaSesion")
    //const IniciarSesionBotonCaja = document.querySelector("#IniciarSesionBotonCaja")

    console.log(correoSesion.value)
    console.log(contrasenaSesion.value)

    fetch("http://localhost:3000/iniciar_sesion", {
        "method": "POST",
        "body": JSON.stringify({
            "email": correoSesion.value,
            "contrasena": contrasenaSesion.value
        })
    }).then(recurso => {
        if(recurso.status == 200){
            recurso.json().then(respuesta => {
                //console.log(respuesta)
                sessionStorage.setItem("token_sesion", respuesta.token)
                ObtenerUsuario()
            })
        }else{
            recurso.json().then(respuesta => {
                alert(respuesta.mensaje)
            })
        }
    })
}

function RedirigirRegistro(){
    QuitarVentanaSesion()
    Registrarse()
}

ObtenerUsuario()

const botonesLogin = document.querySelector("#botonesLogin")
const sesionNombreFoto = document.querySelector("#sesionNombreFoto")
const textoSaludo = document.querySelector("#sesionNombreFoto p")
const imagenPerfil = document.querySelector("#imgPerfil")

function ObtenerUsuario(){
    fetch("http://localhost:3000/obtener_usuario", {
        method: "GET",
        headers: {
            "Authorization" : sessionStorage.getItem("token_sesion")
        }
    }).then(recurso => {
        if(recurso.status == 200){
            recurso.json().then(respuesta => {

                botonesLogin.style.display = "none"
                sesionNombreFoto.style.display = "flex"

                textoSaludo.innerHTML = "Bienvenido " + respuesta.nombre
                
                console.log(respuesta.imagenPerfil)
                const arregloBytes = new Uint8Array(respuesta.imagenPerfil.data)
                const blob = new Blob([arregloBytes])
                let imagen64 = URL.createObjectURL(blob)
                imagenPerfil.src = imagen64
                QuitarVentanaSesion()
            })
        }else{
            recurso.json().then(respuesta => {
                console.log("usuario no registrado", respuesta.mensaje)
            })
        }
    })
}

/*
este codigo se encuentra en el header.js
<div id="menuPerfil">
    <label class="opcionMenu">
        <input type="checkbox" id="modoVendedor"> Modo vendedor
    </label>
    <div class="opcionMenu" id="cerrarSesion">Cerrar sesión</div>
</div> */
const menuPerfil = document.querySelector("#menuPerfil");
const cerrarSesion = document.querySelector("#cerrarSesion");
const modoVendedor = document.querySelector("#modoVendedor");

let estaDesplegado = false
imagenPerfil.addEventListener("click", (evento) => {
    //console.log(evento)
    
    evento.stopPropagation(); 
    if(estaDesplegado){
        menuPerfil.style.display = "none"
        estaDesplegado = false
    }else{
        menuPerfil.style.display = "flex"
        estaDesplegado = true
    }
});

document.addEventListener("click", () => {
    menuPerfil.style.display = "none"
});

cerrarSesion.addEventListener("click", () => {
    sessionStorage.removeItem("token_sesion");
    alert("Sesión cerrada correctamente.");
    window.location.reload();
});

modoVendedor.addEventListener("change", () => {
    if (modoVendedor.checked) {
        alert("Modo vendedor activado");
        sessionStorage.setItem("rol_usuario", "true");
    } else {
        alert("Modo vendedor desactivado");
        sessionStorage.setItem("rol_usuario", "false");
    }
});

/*window.addEventListener("DOMContentLoaded", () => {
    const estado = sessionStorage.getItem("rol_usuario");
    if (estado == "true") modoVendedor.checked = true;
});*/