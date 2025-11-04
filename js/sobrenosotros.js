const imgSobreNosotros = document.querySelector("#imgSobreNosotros")

fetch("http://localhost:3000/nosotros").then(recurso => recurso.blob()).then(archivo => {
    let imgNosotros = URL.createObjectURL(archivo)
    imgSobreNosotros.src = imgNosotros

    return fetch("http://localhost:3000/nosotrostexto")
}).then(recurso => recurso.json()).then(respuesta => {
    const primerTextoSobreNosotros = document.querySelector("#primerTextoSobreNosotros")
    const segundoTextoSobreNosotros = document.querySelector("#segundoTextoSobreNosotros")
    const primerTextoMision = document.querySelector("#primerTextoMision")
    const segundoTextoMision = document.querySelector("#segundoTextoMision")
    const primerTextoVision = document.querySelector("#primerTextoVision")
    const segundoTextoVision = document.querySelector("#segundoTextoVision")

    primerTextoSobreNosotros.innerHTML = respuesta.sobreNosotrosPrimerTexto
    segundoTextoSobreNosotros.innerHTML = respuesta.sobreNosotrosSegundoTexto
    primerTextoMision.innerHTML = respuesta.misionPrimerTexto
    segundoTextoMision.innerHTML = respuesta.misionSegundoTexto
    primerTextoVision.innerHTML = respuesta.visionPrimerTexto
    segundoTextoVision.innerHTML = respuesta.visionSegundoTexto
})