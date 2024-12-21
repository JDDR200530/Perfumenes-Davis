document.addEventListener("DOMContentLoaded", function () {
    const productosPorPagina = 6;
    let paginaActual = 1;
    let productosFiltrados = []; // Para almacenar los productos filtrados en caso de búsqueda

    // Función para cargar los productos
    function cargarProductos(pagina, productos = null) {
        const productosSection = document.querySelector('#productos');
        productosSection.innerHTML = ''; // Limpiar productos previos

        const fetchProductos = productos ? Promise.resolve(productos) : fetch('Perfum.json').then(res => res.json());
        const fetchImagenes = fetch('Imag.json').then(res => res.json());

        Promise.all([fetchProductos, fetchImagenes])
            .then(([productos, imagenes]) => {
                productosFiltrados = productos; // Actualizar productos filtrados
                const totalProductos = productos.length;
                const inicio = (pagina - 1) * productosPorPagina;
                const fin = inicio + productosPorPagina;
                const productosPagina = productos.slice(inicio, fin);

                productosPagina.forEach(producto => {
                    const imagenProducto = imagenes.find(img => img.id === producto.id);
                    const firstImageUrl = imagenProducto ? imagenProducto.imagenes[0] : '';

                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');

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
            .catch(error => console.error('Error cargando productos o imágenes:', error));
    }

    // Función para crear los botones de paginación
    function crearPaginacion(totalPaginas, paginaActual) {
        const paginationContainer = document.querySelector('#pagination');
        paginationContainer.innerHTML = ''; // Limpiar la paginación previa

        // Botón "Anterior"
        if (paginaActual > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Anterior';
            prevButton.classList.add('pagination-button');
            prevButton.addEventListener('click', () => cargarProductos(paginaActual - 1, productosFiltrados));
            paginationContainer.appendChild(prevButton);
        }

        // Botones de número de página
        for (let i = 1; i <= totalPaginas; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('pagination-button');
            if (i === paginaActual) pageButton.classList.add('active');
            pageButton.addEventListener('click', () => cargarProductos(i, productosFiltrados));
            paginationContainer.appendChild(pageButton);
        }

        // Botón "Siguiente"
        if (paginaActual < totalPaginas) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Siguiente';
            nextButton.classList.add('pagination-button');
            nextButton.addEventListener('click', () => cargarProductos(paginaActual + 1, productosFiltrados));
            paginationContainer.appendChild(nextButton);
        }
    }

    // Función para buscar productos por nombre
    function buscarProductos(query) {
        fetch('Perfum.json')
            .then(response => response.json())
            .then(productos => {
                const resultados = productos.filter(producto =>
                    producto.nombre.toLowerCase().includes(query.toLowerCase())
                );

                if (resultados.length > 0) {
                    cargarProductos(1, resultados);
                } else {
                    const productosSection = document.querySelector('#productos');
                    productosSection.innerHTML = '<p>No se encontraron productos con ese nombre.</p>';
                    const paginationContainer = document.querySelector('#pagination');
                    paginationContainer.innerHTML = ''; // Limpiar la paginación
                }
            })
            .catch(error => console.error('Error al buscar productos:', error));
    }

    // Agregar eventos al buscador
    const searchInput = document.querySelector('#searchInput');
    const searchButton = document.querySelector('#searchButton');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) buscarProductos(query);
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        if (!query) cargarProductos(1); // Volver a cargar todos los productos si el input está vacío
    });

    // Función para mostrar detalles del producto
    function viewProductDetails(productId) {
        fetch('Perfum.json')
            .then(response => response.json())
            .then(productos => {
                const producto = productos.find(prod => prod.id === productId);
                if (producto) {
                    localStorage.setItem('productDetails', JSON.stringify(producto));
                    window.location.href = 'detalle.html';
                }
            })
            .catch(error => console.error('Error al cargar los detalles del producto:', error));
    }

    // Cargar la primera página de productos
    cargarProductos(paginaActual);

    // Exportar la función de ver detalles
    window.viewProductDetails = viewProductDetails;
});
