package handlers

import (
	"net/http"
	"project_go/models" 
	"strconv"

	"github.com/labstack/echo/v4"
)

var products = make(map[uint]models.Product) 
var nextProdID uint = 1                       

func CreateProduct(c echo.Context) error {
	var newProduct models.Product 

	err := c.Bind(&newProduct)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Błędne dane produktu"})
	}

	newProduct.ID = nextProdID
	products[newProduct.ID] = newProduct
	nextProdID = nextProdID + 1 
	return c.JSON(http.StatusCreated, newProduct)
}

func GetProducts(c echo.Context) error {
	productList := []models.Product{} 

	for _, product := range products {
		productList = append(productList, product)
	}

	return c.JSON(http.StatusOK, productList)
}

func GetProduct(c echo.Context) error {
	idString := c.Param("id") 
	
	id, err := strconv.ParseUint(idString, 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Niepoprawne ID"})
	}

	product, found := products[uint(id)] 
	if !found {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Produkt nie istnieje"})
	}

	return c.JSON(http.StatusOK, product)
}

func UpdateProduct(c echo.Context) error {
	idString := c.Param("id")
	id, err := strconv.ParseUint(idString, 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Niepoprawne ID"})
	}

	_, found := products[uint(id)]
	if !found {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Produkt do aktualizacji nie istnieje"})
	}

	var updatedProductData models.Product
	err = c.Bind(&updatedProductData)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Błędne dane produktu"})
	}

	updatedProductData.ID = uint(id)
	products[uint(id)] = updatedProductData 

	return c.JSON(http.StatusOK, updatedProductData)
}

func DeleteProduct(c echo.Context) error {
	idString := c.Param("id")
	id, err := strconv.ParseUint(idString, 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Niepoprawne ID"})
	}

	_, found := products[uint(id)]
	if !found {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Produkt do usunięcia nie istnieje"})
	}

	delete(products, uint(id)) 

	return c.NoContent(http.StatusNoContent)
}