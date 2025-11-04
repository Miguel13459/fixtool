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
                    <button>Iniciar sesión</button>
                </div>
                <div id="mensajeDirigirCrearCuenta" class="elementosLogin">
                    <p>¿Aún no tienes una cuenta?</p>
                </div>
                <div id="crearCuentaBoton" class="elementosLogin">
                    <button>Crear cuenta</button>
                </div>
            </div>
        </div>`

