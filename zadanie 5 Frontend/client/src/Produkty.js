import React from 'react';

function Produkty({ products, cartItems, onAddToCart, onRemoveFromCart }) {

  const isProductInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  return (
    <div>
      <h2>Nasze Produkty</h2>
      {products.length === 0 ? (
        <p>Brak dostępnych produktów.</p>
      ) : (
        <ul>
          {products.map(produkt => (
            <li key={produkt.id}>
              {produkt.nazwa} - {produkt.cena.toFixed(2)} PLN {}
              {isProductInCart(produkt.id) ? (
                // jezeli cos jest w koszyku pokazuje usun
                <button onClick={() => onRemoveFromCart(produkt.id)} style={{ marginLeft: '10px' }}>
                  Usuń z koszyka
                </button>
              ) : (
                // jesli nic nie ma, to jest przycisk dodaj
                <button onClick={() => onAddToCart(produkt)} style={{ marginLeft: '10px' }}>
                  Dodaj do koszyka
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Produkty;