import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Produkty from './Produkty';
import Platnosci from './Platnosci';

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loadingError, setLoadingError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setLoadingError(null);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Błąd podczas pobierania produktów:", error);
        setLoadingError("Nie udało się załadować produktów. Czy serwer backendowy działa?");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = useCallback((productToAdd) => {
    setCartItems(prevItems => {
      const isItemInCart = prevItems.find(item => item.id === productToAdd.id);
      if (isItemInCart) {
        return prevItems;
      } else {

        return [...prevItems, { ...productToAdd }];
      }
    });
  }, []);

  const handleRemoveFromCart = useCallback((productIdToRemove) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== productIdToRemove)
    );
  }, []);

  const totalPrice = cartItems.reduce((total, item) => total + item.cena, 0);

  const CartDisplay = () => (
    <div className="cart-summary">
      <h2>Koszyk</h2>
      {cartItems.length === 0 ? (
        <p>Koszyk jest pusty.</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.nazwa} - {item.cena.toFixed(2)} PLN
              <button onClick={() => handleRemoveFromCart(item.id)} style={{marginLeft: '10px'}}>Usuń</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Suma: {totalPrice.toFixed(2)} PLN</h3>
    </div>
  );


  return (
    <div className="App">
      <h1>Mój Sklep</h1>

      {}
      {isLoading && <div>Ładowanie produktów...</div>}
      {loadingError && <div style={{ color: 'red' }}>Błąd: {loadingError}</div>}
      {!isLoading && !loadingError && (
        <Produkty
          products={products}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
        />
      )}

      <hr />

      {}
      <CartDisplay />

      <hr />

      {}
      {cartItems.length > 0 && (
          <Platnosci
            totalPrice={totalPrice}
          />
      )}

    </div>
  );
}

export default App;