package main

import (
	v1 "github.com/Rask467/lukso-relayer/app/services/relayer/handlers/v1"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()
	v1.Routes(e)
	e.Logger.Fatal(e.Start(":1323"))
}
