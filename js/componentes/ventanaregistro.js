ventanaOscuraRegistro.innerHTML = `<div id="anuncioRegistro">
            <div class="quitarAnuncio">
                <img src="./recursos/iconos/cancel.svg" alt="cancel" class="cancelarBorrar" onclick="QuitarVentanaRegistro()">
            </div>
            <div class="mentajeRegistro">
                <p>Registrate en nuestra página</p>
            </div>
            <div class="formularioLogin" id="formularioRegistro">
                <div id="cajasDobleInput"  class="elementosLogin">
                    <div id="nombreCaja" class="inputsDobles inputTamDoble">
                        <label for="nombre">Nombre</label>
                        <input type="text" name="nombre" id="nombre" required>
                    </div>
                    <div id="apellidoCaja" class="inputsDobles inputTamDoble">
                        <label for="apellido">Apellido</label>
                        <input type="text" name="apellido" id="apellido" required>
                    </div>
                </div>
                <div id="correoCaja" class="elementosLogin inputsDobles">
                    <label for="correo">Correo electrónico</label>
                    <input type="text" name="correo" id="correo" required>
                </div>
                <div id="contrasenasInputs"  class="elementosLogin">
                    <div id="contrasenaCaja" class="inputsDobles inputTamDoble">
                        <label for="contrasena">Contraseña</label>
                        <input type="password" name="contrasena" id="contrasena" required>
                    </div>
                    <div id="confirmarContrasenaCaja" class="inputsDobles inputTamDoble">
                        <label for="confirmarContrasena">Confirmar contraseña</label>
                        <input type="password" name="confirmarContrasena" id="confirmarContrasena" required>
                    </div>
                </div>
            </div>
            <div id="terminosYcondiciones" class="elementosLogin">
                <input type="checkbox" name="aceptaTerminos" id="aceptaTerminos">
                <p for="aceptaTerminos">Acepto los <span>términos y condiciones</span> y el <span>aviso de privacidad</span></p>
            </div>
            <div id="dirigirInicioSesion" class="elementosLogin">
                <p>¿Ya cuentas con una cuenta? <span onclick="RedirigirLogin()">Inicia sesión</span></a></p>
            </div>
            <div id="crearCuentaBotonCaja" class="elementosLogin">
                <button onclick="MandarRegistro()">Crear cuenta</button>
            </div>
        </div>`

const nombre = document.querySelector("#nombre")
const apellido = document.querySelector("#apellido")
const correo = document.querySelector("#correo")
const contrasena = document.querySelector("#contrasena")
const confirmarContrasena = document.querySelector("#confirmarContrasena")
const aceptaTerminos = document.querySelector("#aceptaTerminos")
const inputs = document.querySelectorAll("#formularioRegistro input[type='text'], #formularioRegistro input[type='password']")
console.log(inputs)
function MandarRegistro(){

    if(aceptaTerminos.checked){
        let hayCamposVacios = false
        for(i = 0; i < inputs.length; i++){
            //console.log("entra al for")
            if(inputs[i].value.trim() === "" || inputs[i].value.trim() === null){
                inputs[i].style.border = "2px solid red";
                hayCamposVacios = true
                //alert("El campo " + inputs[i].name + " está vacío.")
            }
        }

        if(hayCamposVacios == true) {
            alert("Por favor, completa todos los campos antes de continuar.")
        }else{
            const objeto_registro = {
                nombre: nombre.value,
                apellido: apellido.value,
                correo: correo.value,
                contrasena: contrasena.value,
                confirmarContrasena: confirmarContrasena.value
            }

            //console.log(objeto_registro)
            
            fetch("http://localhost:3000/registro", {
                method: "POST",
                body: JSON.stringify(objeto_registro)
            }).then(recurso => {
                if(recurso.status == 200){
                    recurso.json().then(respuesta => {
                        alert(respuesta.mensaje)
                        QuitarVentanaRegistro()
                        IniciarSesion()
                    })
                }else{
                    recurso.json().then(respuesta => {
                        alert(respuesta.mensaje)
                    })
                }
            })
        }
    }else{
        alert("No has aceptado los terminos y condiciones")
    }
}


function RedirigirLogin(){
    QuitarVentanaRegistro()
    IniciarSesion()
}

