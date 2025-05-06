import React, { useState, useEffect } from 'react';

function Platnosci({ totalPrice }) {

  const [metodaPlatnosci, setMetodaPlatnosci] = useState('karta');
  const [statusWysylki, setStatusWysylki] = useState('');

  const formattedTotalPrice = totalPrice.toFixed(2);

   useEffect(() => {
    setStatusWysylki('');
  }, [totalPrice]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusWysylki('Wysyłanie danych...');

    const daneDoWyslania = {
      kwota: totalPrice,
      metoda: metodaPlatnosci,
    };

    if (totalPrice <= 0) {
        setStatusWysylki('Koszyk jest pusty lub suma jest nieprawidłowa.');
        return;
    }


    try {
      const odpowiedz = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(daneDoWyslania),
      });

      if (!odpowiedz.ok) {
         let errorMsg = `HTTP error! status: ${odpowiedz.status}`;
         try {
            const errorBody = await odpowiedz.json();
            errorMsg += ` - ${errorBody.message || JSON.stringify(errorBody)}`;
         } catch(e) {}
         throw new Error(errorMsg);
      }

      setStatusWysylki('Płatność przetworzona pomyślnie!');
      setMetodaPlatnosci('karta');

    } catch (error) {
      console.error("Błąd podczas wysyłania płatności:", error);
      setStatusWysylki(`Błąd: ${error.message || 'Nie udało się przetworzyć płatności.'}`);
    }
  };

  return (
    <div>
      <h2>Płatność</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="kwota">Kwota do zapłaty:</label>
          <input
            type="text"
            id="kwota"
            value={`${formattedTotalPrice} PLN`}
            readOnly
            style={{ marginLeft: '5px', fontWeight: 'bold' }}
          />
        </div>
        <div>
          <label htmlFor="metoda">Metoda płatności:</label>
          <select
            id="metoda"
            value={metodaPlatnosci}
            onChange={(e) => setMetodaPlatnosci(e.target.value)}
          >
            <option value="karta">Karta kredytowa</option>
            <option value="blik">BLIK</option>
            <option value="przelew">Przelew bankowy</option>
          </select>
        </div>
        {}
        <button type="submit" disabled={totalPrice <= 0}>
             Zapłać ({formattedTotalPrice} PLN)
        </button>
      </form>
      {statusWysylki && <p>{statusWysylki}</p>}
    </div>
  );
}

export default Platnosci;