package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type Product struct {
	ID    int     `json:"id"`
	Nazwa string  `json:"nazwa"`
	Cena  float64 `json:"cena"`
}

var products = []Product{
	{ID: 1, Nazwa: "MacBook Air", Cena: 5999.00},
	{ID: 2, Nazwa: "AirPods Max", Cena: 2499.99},
	{ID: 3, Nazwa: "Klawiatura Magic Keyboard", Cena: 999.00},
	{ID: 4, Nazwa: "Silikonowe etui do iPhone’a", Cena: 154.50},
}

type PaymentData struct {
	Kwota  float64 `json:"kwota"`
	Metoda string  `json:"metoda"`
}

func getProductsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func handlePaymentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Niedozwolona metoda", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Błąd odczytu ciała żądania", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var paymentData PaymentData
	err = json.Unmarshal(body, &paymentData)
	if err != nil {
		log.Printf("Błąd dekodowania JSON płatności: %v. Otrzymano ciało: %s", err, string(body))
		http.Error(w, "Nieprawidłowy format danych JSON", http.StatusBadRequest)
		return
	}

	log.Printf("Otrzymano płatność: Kwota=%.2f, Metoda=%s\n", paymentData.Kwota, paymentData.Metoda)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Płatność otrzymana"})
}

func main() {
	http.HandleFunc("/api/products", getProductsHandler)
	http.HandleFunc("/api/payments", handlePaymentHandler)

	port := ":8080"
	fmt.Printf("Serwer uruchomiony na porcie %s\n", port)

	log.Fatal(http.ListenAndServe(port, nil))
}
