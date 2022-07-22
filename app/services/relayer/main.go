package main

import (
	"log"

	v1 "github.com/Rask467/lukso-relayer/app/services/relayer/handlers/v1"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	e := echo.New()
	v1.Routes(e)
	e.Logger.Fatal(e.Start(":1323"))
}
