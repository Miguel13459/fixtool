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

function ObtenerUsuario(){
    
}