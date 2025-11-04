ventanaOscuraRegistro.innerHTML = `<div id="anuncioRegistro">
            <div class="quitarAnuncio">
                <img src="./recursos/iconos/cancel.svg" alt="cancel" class="cancelarBorrar" onclick="QuitarVentanaRegistro()">
            </div>
            <div class="mentajeRegistro">
                <p>Registrate en nuestra página</p>
            </div>
            <div class="formularioLogin">
                <div id="cajasDobleInput"  class="elementosLogin">
                    <div id="nombreCaja" class="inputsDobles inputTamDoble">
                        <label for="nombre">Nombre</label>
                        <input type="text" name="nombre" id="nombre">
                    </div>
                    <div id="apellidoCaja" class="inputsDobles inputTamDoble">
                        <label for="apellido">Apellido</label>
                        <input type="text" name="apellido" id="apellido">
                    </div>
                </div>
                <div id="correoCaja" class="elementosLogin inputsDobles">
                    <label for="correo">Correo electrónico</label>
                    <input type="text" name="correo" id="correo">
                </div>
                <div id="contrasenasInputs"  class="elementosLogin">
                    <div id="contrasenaCaja" class="inputsDobles inputTamDoble">
                        <label for="contrasena">Contraseña</label>
                        <input type="text" name="contrasena" id="contrasena">
                    </div>
                    <div id="confirmarContrasenaCaja" class="inputsDobles inputTamDoble">
                        <label for="confirmarContrasena">Confirmar contraseña</label>
                        <input type="text" name="confirmarContrasena" id="confirmarContrasena">
                    </div>
                </div>
            </div>
            <div id="terminosYcondiciones" class="elementosLogin">
                <input type="checkbox" name="aceptaTerminos" id="aceptaTerminos">
                <p for="aceptaTerminos">Acepto los <span>términos y condiciones</span> y el <span>aviso de privacidad</span></p>
            </div>
            <div id="dirigirInicioSesion" class="elementosLogin">
                <p>¿Ya cuentas con una cuenta? <span>Inicia sesión</span></a></p>
            </div>
            <div id="crearCuentaBotonCaja" class="elementosLogin">
                <button>Crear cuenta</button>
            </div>
        </div>`