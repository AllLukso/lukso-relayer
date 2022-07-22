package transaction

import (
	"fmt"
	"math/big"
	"net/http"

	"github.com/Rask467/lukso-relayer/lsp"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/labstack/echo/v4"
)

type TransactionExecuteRequest struct {
	Address     string       `json:"address"` // Address of the UP
	Transaction *Transaction `json:"transaction"`
}

type TransactionExecuteResponse struct {
	TransactionHash string `json:"transactionHash"`
}

type Transaction struct {
	Abi       string `json:"abi"`
	Signature string `json:"signature"`
	Nonce     int64  `json:"nonce"` // KeyManager nonce
}

func Execute(c echo.Context) error {
	terq := new(TransactionExecuteRequest)
	if err := c.Bind(terq); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("failed to bind: %s", err))
	}

	client, err := ethclient.Dial("https://rpc.l16.lukso.network")
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("failed to create client: %s", err))
	}

	// I think terq.Address is actually the address of the UP, so maybe I need to call into that first or retrieve the address
	// 	of the key manager?
	account, err := lsp.NewAccount(common.HexToAddress(terq.Address), client)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("failed to create Account: %s", err))
	}

	keyManagerAddress, err := account.Owner(nil)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("failed to get account owner: %s", err))
	}

	keyManager, err := lsp.NewKeyManager(keyManagerAddress, client)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("failed to create KeyManager: %s", err))
	}

	opts := &bind.TransactOpts{}

	fmt.Println("Signature: ", terq.Transaction.Signature)
	fmt.Println("Nonce: ", terq.Transaction.Nonce)
	fmt.Println("Abi: ", terq.Transaction.Abi)

	transaction, err := keyManager.ExecuteRelayCall(opts, []byte(terq.Transaction.Signature), big.NewInt(terq.Transaction.Nonce), []byte(terq.Transaction.Abi))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("failed to ExecuteRelayCall: %s", err))
	}

	terp := TransactionExecuteResponse{TransactionHash: transaction.Hash().String()}

	return c.JSON(http.StatusOK, terp)
}

func Quota(c echo.Context) error {
	return c.String(http.StatusOK, "quota")
}
