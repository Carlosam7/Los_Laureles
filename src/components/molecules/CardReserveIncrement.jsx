import React from 'react';

export const CardReserveIncrement = ({
  name,
  price,
  capacity,
  image,
  description,
  availability,
  quantity,
  onQuantityChange,
}) => {

  const decrement = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  const increment = () => {
    if (quantity < availability) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 m-5 overflow-hidden max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row">
        {/* Imagen */}
        <div className="lg:w-2/5">
          <img
            src={image}
            alt={name}
            className="w-full h-64 lg:h-full object-cover"
          />
        </div>

        {/* Contenido */}
        <div className="lg:w-3/5 p-6 flex flex-col justify-between">
          <div className="pl-e">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#BF5A30]">
                  ${price.toLocaleString()}
                </span>
                <span className="text-gray-600 ml-1">/Noche</span>
              </div>
            </div>

            {/* Información de capacidad y disponibilidad */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                {/* Icono de personas usando SVG */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>{capacity} Personas</span>
              </div>
            </div>

            {/* Descripción */}
            <p className="text-gray-600 mb-4 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Controles de cantidad */}
          <div className="flex items-center gap-4 rounded-lg">
            <button
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={decrement}
              disabled={quantity === 0}
              aria-label={`Disminuir cantidad de ${name}`}
            >
              {/* Icono menos */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
              </svg>
            </button>

            <span className="text-2xl font-semibold w-12 text-center" aria-live="polite" aria-atomic="true">
              {quantity}
            </span>

            <button
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              onClick={increment}
              disabled={quantity === availability}
              aria-label={`Aumentar cantidad de ${name}`}
            >
              {/* Icono más */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};