/*esta funcion cuando recarga la página vuelve a la portada 0
primero hace un PUT y luego retorna un fetch a cantidadimg
para saber en qué posición esta y así hacer los cambios */
window.addEventListener("load", () => {
    fetch("http://localhost:3000/recarga",{
        method: "PUT",
        body: JSON.stringify({"posicion" : 0})
    }).then(recurso => recurso.blob()).then(archivo =>{
        let imagen = URL.createObjectURL(archivo)
        const portada = document.querySelector(".portada")
        portada.src = imagen

        return fetch("http://localhost:3000/cantidadimg")
    }).then(recurso => recurso.json()).then(respuesta => {
    const posicionPortada = document.querySelector("#posicionPortada")
    const bolitaPortada = document.querySelector(".bolitaPortada")

    for(i = 0; i < respuesta.cantidad; i++){
        let clonBolita = bolitaPortada.cloneNode(true)
        posicionPortada.appendChild(clonBolita)
        clonBolita.id = "bolita" + i
        if(respuesta.posicion == i){
            clonBolita.style.backgroundColor = "#0D2555"
        }
    }
    bolitaPortada.remove()
})
})

/*fetch("http://localhost:3000/imagenportada").then(recurso => recurso.blob()).then(archivo => {
    let imagen = URL.createObjectURL(archivo)
    const portada = document.querySelector(".portada")
    portada.src = imagen
})*/


function ImagenAnterior(){
    fetch("http://localhost:3000/cambiarportada",{
        method: "PUT",
        body: JSON.stringify({"cambiarPortada" : -1})
    }).then(recurso => recurso.blob()).then(archivo =>{
        let imagen = URL.createObjectURL(archivo)
        const portada = document.querySelector(".portada")
        portada.src = imagen

        return fetch("http://localhost:3000/cantidadimg")
    }).then(recurso => recurso.json()).then(respuesta => {
        for(i = 0; i < respuesta.cantidad; i++){
            const bolita = document.querySelector("#bolita"+i)
            if(respuesta.posicion == i){
                bolita.style.backgroundColor = "#0D2555"
            }else{
                bolita.style.backgroundColor = "#9a9a9a"
            }
        }
    })
}

function ImagenSiguiente(){
    fetch("http://localhost:3000/cambiarportada",{
        method: "PUT",
        body: JSON.stringify({"cambiarPortada" : 1})
    }).then(recurso => recurso.blob()).then(archivo =>{
        let imagen = URL.createObjectURL(archivo)
        const portada = document.querySelector(".portada")
        portada.src = imagen

        return fetch("http://localhost:3000/cantidadimg")
    }).then(recurso => recurso.json()).then(respuesta => {
        for(i = 0; i < respuesta.cantidad; i++){
            const bolita = document.querySelector("#bolita"+i)
            if(respuesta.posicion == i){
                bolita.style.backgroundColor = "#0D2555"
            }else{
                bolita.style.backgroundColor = "#9a9a9a"
            }
        }
    })
}

