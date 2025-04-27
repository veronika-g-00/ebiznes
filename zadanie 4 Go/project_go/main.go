package main

import (
	"project_go/handlers"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	productAPI := e.Group("/products")

	productAPI.POST("", handlers.CreateProduct)      // Tworzenie
	productAPI.GET("", handlers.GetProducts)         // Odczyt (wszystkie)
	productAPI.GET("/:id", handlers.GetProduct)      // Odczyt (jeden)
	productAPI.PUT("/:id", handlers.UpdateProduct)   // Aktualizacja
	productAPI.DELETE("/:id", handlers.DeleteProduct) // Usuwanie

	e.Logger.Fatal(e.Start(":1323"))
}