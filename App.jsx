import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const App = () => {
    const [productos, setProductos] = useState([]);
    const [imagenes, setImagenes] = useState([]);

    useEffect(() => {
        // Cargar los datos de los productos
        fetch('Perfum.json')
            .then(response => response.json())
            .then(data => setProductos(data))
            .catch(error => console.error('Error cargando productos:', error));

        // Cargar los datos de las imágenes
        fetch('Imag.json')
            .then(response => response.json())
            .then(data => setImagenes(data))
            .catch(error => console.error('Error cargando imágenes:', error));
    }, []);

    return (
        <div className="App">
            <h1>Tienda de Perfumes</h1>
            <section id="productos" className="products">
                {productos.map(producto => (
                    <ProductCard key={producto.id} producto={producto} imagenes={imagenes} />
                ))}
            </section>
        </div>
    );
};

export default App;
