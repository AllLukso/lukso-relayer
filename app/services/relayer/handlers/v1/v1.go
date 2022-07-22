package v1

import (
	"github.com/Rask467/lukso-relayer/app/services/relayer/handlers/v1/health"
	"github.com/Rask467/lukso-relayer/app/services/relayer/handlers/v1/transaction"
	"github.com/labstack/echo/v4"
)

func Routes(e *echo.Echo) {
	e.GET("/ping", health.Check)
	e.POST("/v1/execute", transaction.Execute)
	e.POST("/v1/quota", transaction.Quota)
}
