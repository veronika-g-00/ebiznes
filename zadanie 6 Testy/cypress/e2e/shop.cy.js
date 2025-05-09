/* eslint-disable no-undef */
describe('Dzialanie sklepu', () => {
  const productNames = [
    'MacBook Air',
    'AirPods Max',
    'Klawiatura Magic Keyboard',
    'Silikonowe etui do iPhone'
  ];

  const product1 = productNames[0]; // MacBook Air
  const product2 = productNames[1]; // AirPods Max
  const product3 = productNames[2]; // Klawiatura Magic Keyboard
  const product4 = productNames[3]; // Silikonowe etui do iPhone

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  //ladowanie strony
  context('Ladowanie strony', () => {
    it('1. Strona glowna', () => {
      cy.url().should('include', 'localhost:3000');
    });

    it('2. tytul "Moj sklep"', () => {
      cy.contains('h1', 'Mój Sklep').should('be.visible');
    });

    it('3. tytul "Nasze produkty"', () => {
      cy.contains('h2', 'Nasze Produkty').should('be.visible');
    });

    it('4. tytul "Koszyk"', () => {
      cy.contains('h2', 'Koszyk').should('be.visible');
    });

    it('5. tytul "Platnosc"', () => {
      cy.contains('li', product1).find('button').contains('Dodaj do koszyka').click();
      cy.contains('h2', 'Płatność').should('be.visible');
    });
  });
  
  //lista produktow
  context('Lista Produktow', () => {
    it('6. wyswietlanie listy produktow', () => {
      cy.contains('h2', 'Nasze Produkty').next('ul').find('li', { timeout: 10000 })
        .should('have.length.greaterThan', 0)
    });

    it('7. wyswietlenie produktu Macbook', () => {
      cy.contains('li', 'MacBook Air').should('be.visible');
    });

    it('8. wyswietlenie ceny dla Macbook', () => {
      cy.contains('li', 'MacBook Air').should('contain.text', 'PLN').and('be.visible');
    });

    it('9. wyswietlenie przycisku "Dodaj do koszyka" dla Macbook', () => {
      cy.contains('li', 'MacBook Air').find('button').contains('Dodaj do koszyka')
        .should('be.visible');
    });

    it('10. wyswietlenie produktu Etui', () => {
      cy.contains('li', 'Silikonowe etui do iPhone').should('be.visible');
    });
  });

  // dodawanie produktow
  context('Dodawanie produktów do koszyka', () => {
    it(`11. Dodanie "${product1}" (MacBook Air) do koszyka`, () => {
      cy.contains('li', product1).find('button').contains('Dodaj do koszyka').click();
      cy.get('.cart-summary').should('contain.text', product1);
    });

    it('12. Aktualizacja sumy w koszyku po dodaniu pierwszego produktu', () => {
      cy.contains('li', product1).find('button').contains('Dodaj do koszyka').click();
      cy.get('.cart-summary h3').should('not.contain.text', '0.00 PLN');
      cy.get('.cart-summary h3').contains('PLN');
    });

    it(`13. Zmiana przycisku "${product1}" z "Dodaj" na "Usun z koszyka"`, () => {
      cy.contains('li', product1).find('button').contains('Dodaj do koszyka').click();
      cy.contains('li', product1).find('button').should('contain.text', 'Usuń z koszyka');
    });

    it(`14. Dodanie "${product2}" (AirPods Max) do koszyka, gdy "${product1}" juz jest`, () => {
      cy.contains('li', product1).find('button').contains('Dodaj do koszyka').click();
      cy.contains('li', product2).find('button').contains('Dodaj do koszyka').click();
      cy.get('.cart-summary').should('contain.text', product1);
      cy.get('.cart-summary').should('contain.text', product2);
    });

    it('15. Aktualizacaj sumy w koszyku po dodaniu dwoch produktow', () => {
      let initialTotalText;
      cy.contains('li', product1).find('button').contains('Dodaj do koszyka').click();
      cy.get('.cart-summary h3').invoke('text').then((text) => {
        initialTotalText = text;
        cy.contains('li', product2).find('button').contains('Dodaj do koszyka').click();
        cy.get('.cart-summary h3').invoke('text').should('not.equal', initialTotalText);
      });
    });

    it(`16. Zmiana przycisku "${product3}" (Klawiatura) z "Dodaj" na "Usun z koszyka" po dodaniu`, () => {
      cy.contains('li', product3).find('button').contains('Dodaj do koszyka').click();
      cy.contains('li', product3).find('button').should('contain.text', 'Usuń z koszyka');
    });

    it('17. Dodanie czterech produktow do koszyka', () => {
      productNames.forEach(name => {
        cy.contains('li', name).find('button').contains('Dodaj do koszyka').click();
      });
      productNames.forEach(name => {
        cy.get('.cart-summary').should('contain.text', name);
      });
      cy.get('.cart-summary').find('li').should('have.length', 4);
    });
  });

  // usuwanie produktow
  context('Usuwanie produktow z koszyka', () => {
    beforeEach(() => {
      productNames.forEach(name => {
        cy.contains('li', name).find('button:contains("Dodaj do koszyka")').click();
      });
      cy.get('.cart-summary').find('li').should('have.length', 4);
    });

    it(`18. Usuniecie "${product1}" (MacBook Air) z koszyka uzywajac przycisk "Usun" w sekcji koszyka`, () => {
      cy.get('.cart-summary').contains('li', product1).find('button').contains('Usuń').click();
      cy.get('.cart-summary').should('not.contain.text', product1);
      cy.get('.cart-summary').find('li').should('have.length', 3);
    });

    it('19. Aktualizacja sumy po usunieciu jednego przedmiotu z koszyka', () => {
      cy.get('.cart-summary h3').invoke('text').then((totalTextBeforeRemove) => {
        cy.get('.cart-summary').contains('li', product1).find('button').contains('Usuń').click();
        cy.get('.cart-summary h3').invoke('text').should('not.equal', totalTextBeforeRemove);
      });
    });

    it(`20. Zmiana przycisku "${product1}" na liscie produktow z "Usun" do "Dodaj do koszyka" po usunieciu z koszyka`, () => {
      cy.get('.cart-summary').contains('li', product1).find('button').contains('Usuń').click();
      cy.contains('li', product1).find('button').should('contain.text', 'Dodaj do koszyka');
    });

    it(`21. Usuniecie "${product2}" (AirPods Max) z koszyka uzywajac przycisku "Usun z koszyka" na liscie produktow`, () => {
      cy.contains('li', product2).find('button').contains('Usuń z koszyka').click();
      cy.get('.cart-summary').should('not.contain.text', product2);
      cy.get('.cart-summary').find('li').should('have.length', 3);
    });

    it('22. Aktualizacja sumy po usunieciu drugiego produktu (innym sposobem)', () => {
       cy.get('.cart-summary h3').invoke('text').then((totalTextBeforeRemove) => {
        cy.contains('li', product2).find('button').contains('Usuń z koszyka').click();
        cy.get('.cart-summary h3').invoke('text').should('not.equal', totalTextBeforeRemove);
      });
    });

    it(`23. Zmiana przycisku "${product4}" (Etui) na "Dodaj do koszyka" po usunieciu z koszyka`, () => {
      cy.get('.cart-summary').contains('li', product4).find('button').contains('Usuń').click();
      cy.contains('li', product4).find('button').should('contain.text', 'Dodaj do koszyka');
    });

    it('24. Wyswietlanie "Koszyk jest pusty" po usunieciu wszystkich produktow', () => {
      productNames.forEach(name => {
        cy.get('.cart-summary').then($cart => {
          if ($cart.find(`li:contains("${name}")`).length > 0) {
            cy.get('.cart-summary').contains('li', name).find('button').contains('Usuń').click();
          }
        });
      });
      cy.get('.cart-summary').should('contain.text', 'Koszyk jest pusty.');
      cy.get('.cart-summary h3').should('contain.text', '0.00 PLN');
    });
  });

});