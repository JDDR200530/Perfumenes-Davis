document.addEventListener("DOMContentLoaded", function () {
    const productosPorPagina = 6; // Número de productos por página
    let paginaActual = 1;
    let productosFiltrados = []; // Almacena los productos filtrados durante la búsqueda

    /**
     * Carga y muestra los productos en la página actual.
     * @param {number} pagina - Número de la página a cargar.
     * @param {Array} productos - Lista de productos (opcional).
     */
    function cargarProductos(pagina, productos = null) {
        const productosSection = document.querySelector("#productos");
        productosSection.innerHTML = ""; // Limpiar los productos previos

        const fetchProductos = productos ? Promise.resolve(productos) : fetch("Perfum.json").then(res => res.json());
        const fetchImagenes = fetch("Imag.json").then(res => res.json());

        Promise.all([fetchProductos, fetchImagenes])
            .then(([productos, imagenes]) => {
                productosFiltrados = productos; // Actualizar productos filtrados

                const totalProductos = productos.length;
                const inicio = (pagina - 1) * productosPorPagina;
                const fin = inicio + productosPorPagina;
                const productosPagina = productos.slice(inicio, fin);

                productosPagina.forEach(producto => {
                    const imagenProducto = imagenes.find(img => img.id === producto.id);
                    const firstImageUrl = imagenProducto ? imagenProducto.imagenes[0] : "";

                    const productCard = document.createElement("div");
                    productCard.classList.add("product-card");

                    productCard.innerHTML = `
                        <img class="product-image" src="${firstImageUrl}" alt="Imagen de ${producto.nombre}" onclick="viewProductDetails(${producto.id})">
                        <h3>${producto.nombre}</h3>
                        <p>${producto.descripcion}</p>
                        <div class="price">${producto.precio.toFixed(2)} lps</div>
                    `;

                    productosSection.appendChild(productCard);
                });

                const totalPaginas = Math.ceil(totalProductos / productosPorPagina);
                crearPaginacion(totalPaginas, pagina);
            })
            .catch(error => console.error("Error cargando productos o imágenes:", error));
    }

    /**
     * Crea los botones de paginación.
     * @param {number} totalPaginas - Total de páginas disponibles.
     * @param {number} paginaActual - Página actualmente activa.
     */
    function crearPaginacion(totalPaginas, paginaActual) {
        const paginationContainer = document.querySelector("#pagination");
        paginationContainer.innerHTML = ""; // Limpiar la paginación previa

        // Botón "Anterior"
        if (paginaActual > 1) {
            const prevButton = document.createElement("button");
            prevButton.textContent = "Anterior";
            prevButton.classList.add("pagination-button");
            prevButton.addEventListener("click", () => cargarProductos(paginaActual - 1, productosFiltrados));
            paginationContainer.appendChild(prevButton);
        }

        // Rango de botones de página (del 1 al 4, ajustable)
        let startPage = Math.max(1, paginaActual - 1); // Empieza de la página actual menos 1
        let endPage = Math.min(totalPaginas, startPage + 3); // Termina en la página actual más 3, pero no más allá del total de páginas

        // Mostrar los botones del rango seleccionado
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.classList.add("pagination-button");
            if (i === paginaActual) pageButton.classList.add("active");
            pageButton.addEventListener("click", () => cargarProductos(i, productosFiltrados));
            paginationContainer.appendChild(pageButton);
        }

        // Botón "Siguiente"
        if (paginaActual < totalPaginas) {
            const nextButton = document.createElement("button");
            nextButton.textContent = "Siguiente";
            nextButton.classList.add("pagination-button");
            nextButton.addEventListener("click", () => cargarProductos(paginaActual + 1, productosFiltrados));
            paginationContainer.appendChild(nextButton);
        }
    }

    // Resto de las funciones (buscarProductos, viewProductDetails, etc.)
    // ...

    // Cargar la primera página de productos
    cargarProductos(paginaActual);
});
