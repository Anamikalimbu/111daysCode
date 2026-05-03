import React from 'react';

const ProductCard = ({ title, price, image, description }) => {
  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />
      <div className="product-info">
        <h2 className="product-title">{title}</h2>
        <p className="product-description">{description}</p>
        <span className="product-price">${price.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default ProductCard;
