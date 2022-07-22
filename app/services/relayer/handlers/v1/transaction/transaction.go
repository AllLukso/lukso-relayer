package transaction

import (
	"fmt"
	"math/big"
	"net/http"
	"os"

	"github.com/Rask467/lukso-relayer/lsp"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
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

	fmt.Println("Signature: ", terq.Transaction.Signature)
	fmt.Println("Nonce: ", terq.Transaction.Nonce)
	fmt.Println("Abi: ", terq.Transaction.Abi)

	privateKey, err := crypto.HexToECDSA(os.Getenv("PK"))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("failed to load private key: %s", err))
	}

	auth, err := bind.NewKeyedTransactorWithChainID(privateKey, big.NewInt(2828))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to create transactor")
	}

	transaction, err := keyManager.ExecuteRelayCall(auth, []byte(terq.Transaction.Signature), big.NewInt(terq.Transaction.Nonce), []byte(terq.Transaction.Abi))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("failed to ExecuteRelayCall: %s", err))
	}

	terp := TransactionExecuteResponse{TransactionHash: transaction.Hash().String()}

	return c.JSON(http.StatusOK, terp)
}

func Quota(c echo.Context) error {
	return c.String(http.StatusOK, "quota")
}
