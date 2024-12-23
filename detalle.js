document.addEventListener("DOMContentLoaded", function () {
    // Obtener los detalles del producto desde el localStorage
    const productDetails = JSON.parse(localStorage.getItem('productDetails'));

    if (productDetails) {
        const productoDetallesSection = document.querySelector('#producto-detalles');

        // Obtener las imágenes del producto
        fetch('Imag.json')
            .then(response => response.json())
            .then(imagenes => {
                const imagenProducto = imagenes.find(img => img.id === productDetails.id);

                if (imagenProducto) {
                    // Generar el HTML del carrusel y detalles
                    const imagesHtml = imagenProducto.imagenes.map((url, index) => `
                        <img src="${url}" alt="Imagen de ${productDetails.nombre}" class="product-image" data-index="${index}">
                    `).join('');

                    productoDetallesSection.innerHTML = `
                        <h1>${productDetails.nombre}</h1>
                        <div class="images-container">
                            <button id="prev-arrow" class="arrow">&#10094;</button>
                            <div class="images">${imagesHtml}</div>
                            <button id="next-arrow" class="arrow">&#10095;</button>
                        </div>
                        <p>${productDetails.descripcion}</p>
                        <div class="price">${productDetails.precio.toFixed(2)} lps</div>
                        <div class="pagination-indicator">
                            ${imagenProducto.imagenes.map((_, index) => `<span class="indicator-circle" data-index="${index}"></span>`).join('')}
                        </div>
                        <button id="contactar-whatsapp">Agregar y Contactar</button>
                    `;

                    // Lógica para el carrusel
                    let currentImageIndex = 0;
                    const images = document.querySelectorAll('.product-image');
                    const totalImages = images.length;
                    const indicatorCircles = document.querySelectorAll('.indicator-circle');

                    function updateImageDisplay() {
                        images.forEach(img => img.classList.remove('active'));
                        images[currentImageIndex].classList.add('active');
                        indicatorCircles.forEach((circle, index) => {
                            circle.classList.toggle('active', index === currentImageIndex);
                        });
                    }

                    document.getElementById('prev-arrow').addEventListener('click', () => {
                        currentImageIndex = (currentImageIndex === 0) ? totalImages - 1 : currentImageIndex - 1;
                        updateImageDisplay();
                    });

                    document.getElementById('next-arrow').addEventListener('click', () => {
                        currentImageIndex = (currentImageIndex === totalImages - 1) ? 0 : currentImageIndex + 1;
                        updateImageDisplay();
                    });

                    indicatorCircles.forEach(circle => {
                        circle.addEventListener('click', () => {
                            currentImageIndex = parseInt(circle.getAttribute('data-index'));
                            updateImageDisplay();
                        });
                    });

                    updateImageDisplay();

                    // Botón de contacto por WhatsApp
                    const btnContactar = document.getElementById('contactar-whatsapp');
                    btnContactar.addEventListener('click', () => {
                        const numeroWhatsApp = "+50498004123"; // Reemplaza con el número deseado
                        const mensaje = `Hola, estoy interesado en el producto: ${productDetails.nombre}
                        a un precio de: ${productDetails.precio.toFixed(2)} lps.
                        Imagen destacada:
                        ${images[currentImageIndex].src}`;

                        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
                        window.open(urlWhatsApp, '_blank');
                    });
                } else {
                    productoDetallesSection.innerHTML = '<p>No se encontraron imágenes para este producto.</p>';
                }
            })
            .catch(error => {
                console.error('Error al cargar las imágenes del producto:', error);
                productoDetallesSection.innerHTML = '<p>Error al cargar las imágenes. Por favor, inténtelo de nuevo más tarde.</p>';
            });
    } else {
        window.location.href = 'index.html';
    }
});
