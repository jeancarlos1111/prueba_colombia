const db = new Dexie("shops_database");
db.version(1).stores({
    products: '++id,nombre,precio,file'
});

db.open();

class Product {
    constructor(nombre, precio, file) {
        this.nombre = nombre;
        this.precio = precio;
        this.file = file;
        
    }

    addProduct(nombre, precio, file) {
       return db.products.add({nombre: nombre, precio, file: file}).then( () => {
        return db.products.reverse().limit(1).toArray();
        }).catch( (error) => {
            alert ("Ooops: " + error);
        });
    }
}

class UI  {
    addProduct() {
        
        db.products.each(product => {
            //console.log(product.nombre);
            swiper.appendSlide(`
            <div class="swiper-slide">
            <div class="slider-box">
                <p class="time">Nuevo</p>
                <div class="img-box">
                    <img src="${product.file}">
                </div>
                <p class="detail">${product.nombre}
                    <a href="#" class="price">Price-${product.precio}$</a>
                </p>
                <div class="cart">
                    <a href="#">Agregar al Carrito</a>
                </div>
            </div>
            </div>`);

            
        });


    }

    resetForm() {
        document.getElementById("form-product").reset();
    }

    showProducts() {
        
        db.products.each(product => {
            //console.log(product.nombre);
            swiper.appendSlide(`
            <div class="swiper-slide">
            <div class="slider-box">
                <p class="time">Nuevo</p>
                <div class="img-box">
                    <img src="${product.file}">
                </div>
                <p class="detail">${product.nombre}
                    <a href="#" class="price">Price-${product.precio}$</a>
                </p>
                <div class="cart">
                    <a href="#">Agregar al Carrito</a>
                </div>
            </div>
            </div>`);
            
        });
    }
}


const swiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    slidesPerView: 3,
      //centeredSlides: true,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
  });

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

//Eventos

window.addEventListener("load", () => {
    const ui = new UI;
    ui.showProducts();
});


document.getElementById("form-product").addEventListener("submit", async (e) => {
    e.preventDefault();
    let nombre = document.getElementById("nombre").value;
    let precio = document.getElementById("precio").value;
    const foto = document.querySelector('#foto').files[0];
    let texto_imagen = await toBase64(foto);
    
    /*const reader = new FileReader();
    let texto_imagen = reader.readAsDataURL(foto.files[0]);*/

    const producto = new Product;
    producto.addProduct(nombre, precio, texto_imagen);
    
    const ui = new UI;
    ui.addProduct();
    ui.resetForm();

    
});




