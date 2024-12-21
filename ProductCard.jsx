import React, { useState } from 'react';

const ProductCard = ({ producto, imagenes }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Obtener las imágenes del producto
    const imagenProducto = imagenes.find(img => img.id === producto.id);

    // Función para abrir el modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="product-card">
            <img 
                className="product-image" 
                src={imagenProducto ? imagenProducto.imagenes[0] : ''} 
                alt={`Imagen de ${producto.nombre}`} 
                onClick={openModal} 
            />
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <div className="price">${producto.precio.toFixed(2)}</div>
            <button className="add-to-cart">Añadir al carrito</button>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>X</span>
                        {imagenProducto && imagenProducto.imagenes.map((url, index) => (
                            <img key={index} src={url} alt={`Imagen de ${producto.nombre}`} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
