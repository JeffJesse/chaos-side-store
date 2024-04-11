let iconoCarrito = document.querySelector('.carrito');
let cerrarCarrito = document.querySelector('.cerrarCarrito');
let body = document.querySelector('.all-body');
let listaProductosHTML = document.querySelector('.listProduct');
let listaCarritoHTML = document.querySelector('.contenido-carrito');
let numProdCarrito = document.querySelector('.nav-links span');
let costoTotalProductos = document.querySelector('.costo-total-productos span');

function compraSFX() {
    const sfx = new Audio('resources/lolsfxcompra.mp3');
    sfx.play();
}

let listaProductos = [];
let contenidoCarrito = [];

iconoCarrito.addEventListener('click', () => {
    body.classList.toggle('mostrarCarrito')
})

cerrarCarrito.addEventListener('click', () => {
    body.classList.toggle('mostrarCarrito')
})

const pasarInfoJSON = () => {
    listaProductosHTML.innerHTML = '';
    if (listaProductos.length > 0) {
        listaProductos.forEach(product => {
            let nuevoProducto = document.createElement('div');
            nuevoProducto.classList.add('item');
            nuevoProducto.dataset.id = product.id;
            nuevoProducto.innerHTML = `
            <img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">$${product.price}</div>
            <button class="addCart">
                AÑADIR AL CARRITO
            </button>
            `
            listaProductosHTML.appendChild(nuevoProducto);
        })
    }
}

listaProductosHTML.addEventListener('click', (event) =>{
    let posicionClick = event.target;
    if (posicionClick.classList.contains('addCart')){
        let producto_id = posicionClick.parentElement.dataset.id;
        compraSFX();
        agregarAlCarrito(producto_id);
    }
})

const agregarAlCarrito = (producto_id) => {
    let productoEnCarrito = contenidoCarrito.findIndex((value) => value.producto_id == producto_id);
    if (contenidoCarrito.length  <= 0) {
        contenidoCarrito = [{
            producto_id: producto_id,
            quantity: 1
        }]
    } else if(productoEnCarrito < 0){
        contenidoCarrito.push({
            producto_id: producto_id,
            quantity: 1
        })
    } else {
        contenidoCarrito[productoEnCarrito].quantity = contenidoCarrito[productoEnCarrito].quantity + 1;
    }
    agregProduCarrito();
    memoriaSobreCarrito();
}

const memoriaSobreCarrito = () =>{
    localStorage.setItem('carrito', JSON.stringify(contenidoCarrito));
}

const agregProduCarrito = () => {
    listaCarritoHTML.innerHTML = '';
    let cantTotal = 0;
    let costoTotal = 0;
    if (contenidoCarrito.length > 0) {
        contenidoCarrito.forEach(carrito => {
            cantTotal = cantTotal + carrito.quantity;
            let carritoActualizado = document.createElement('div');
            carritoActualizado.classList.add('producto-carrito');
            carritoActualizado.dataset.id = carrito.producto_id;
            let posicionProducto = listaProductos.findIndex((value) => value.id == carrito.producto_id);
            let info = listaProductos[posicionProducto];
            costoTotal = costoTotal + (info.price * carrito.quantity);
            carritoActualizado.innerHTML = `
            <div class="img-producto-carrito">
                        <img src="${info.image}" alt="espDoran" width="40" height="40">
                    </div>
                    <div class="nombre-producto">
                        <p>${info.name}</p>
                    </div>
                    <div class="precio-producto">
                        <p class="precio">$${info.price * carrito.quantity}</p>
                    </div>
                    <div class="cant-producto">
                        <span class="quitar"><</span>
                        <span>${carrito.quantity}</span>
                        <span class="agregar">></span>
                    </div>
            `;
            listaCarritoHTML.appendChild(carritoActualizado);
        })
    }
    numProdCarrito.innerText = cantTotal;
    costoTotalProductos.innerText = `$${costoTotal.toFixed(2)}`;
}

listaCarritoHTML.addEventListener('click', (event) => {
    let posicionClick = event.target;
    if(posicionClick.classList.contains('quitar') || posicionClick.classList.contains('agregar')){
        let producto_id = posicionClick.parentElement.parentElement.dataset.id;
        let accion = 'quitar';
        if(posicionClick.classList.contains('agregar')){
            accion = 'agregar';
        }
        cambiarCantProductos(producto_id, accion);
    }
})

const cambiarCantProductos = (producto_id, accion) => {
    let posicionProdEnCarro = contenidoCarrito.findIndex((value) => value.producto_id == producto_id)
    if(posicionProdEnCarro >= 0){
        switch (accion) {
            case 'agregar':
                contenidoCarrito[posicionProdEnCarro].quantity = contenidoCarrito[posicionProdEnCarro].quantity + 1;
                break;

            default:
                let valorCambiado = contenidoCarrito[posicionProdEnCarro].quantity - 1;
                if (valorCambiado > 0) {
                    contenidoCarrito[posicionProdEnCarro].quantity = valorCambiado;
                } else {
                    contenidoCarrito.splice(posicionProdEnCarro, 1);
                }
                break;
        }
    }
    memoriaSobreCarrito();
    agregProduCarrito();
}

const mandarDatosJSON = () => {
    fetch('productos.json')
    .then(response => response.json())
    .then(data =>{
        listaProductos = data;
        pasarInfoJSON();
        if(localStorage.getItem('carrito')){
            contenidoCarrito = JSON.parse(localStorage.getItem('carrito'));
            agregProduCarrito();
        }
    })
}
mandarDatosJSON();

