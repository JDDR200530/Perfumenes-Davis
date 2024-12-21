import React from 'react';

// Componente de Paginación
const Pagination = ({ totalPaginas, paginaActual, onChangePage }) => {
    const handlePrevious = () => {
        if (paginaActual > 1) {
            onChangePage(paginaActual - 1);
        }
    };

    const handleNext = () => {
        if (paginaActual < totalPaginas) {
            onChangePage(paginaActual + 1);
        }
    };

    const handlePageClick = (page) => {
        onChangePage(page);
    };

    const pageButtons = [];
    for (let i = 1; i <= totalPaginas; i++) {
        pageButtons.push(
            <button
                key={i}
                className={`pagination-button ${i === paginaActual ? 'active' : ''}`}
                onClick={() => handlePageClick(i)}
            >
                {i}
            </button>
        );
    }

    return (
        <div id="pagination">
            <button
                className="pagination-button"
                onClick={handlePrevious}
                disabled={paginaActual === 1}
            >
                Anterior
            </button>
            {pageButtons}
            <button
                className="pagination-button"
                onClick={handleNext}
                disabled={paginaActual === totalPaginas}
            >
                Siguiente
            </button>
        </div>
    );
};

export default Pagination;
