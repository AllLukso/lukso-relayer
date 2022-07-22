// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package lsp

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
)

// AccountMetaData contains all meta data concerning the Account contract.
var AccountMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"stateMutability\":\"payable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"operation\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"contractAddress\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"ContractCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"dataKey\",\"type\":\"bytes32\"}],\"name\":\"DataChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"operation\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes4\",\"name\":\"selector\",\"type\":\"bytes4\"}],\"name\":\"Executed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"typeId\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes\",\"name\":\"returnedValue\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"receivedData\",\"type\":\"bytes\"}],\"name\":\"UniversalReceiver\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"ValueReceived\",\"type\":\"event\"},{\"stateMutability\":\"payable\",\"type\":\"fallback\"},{\"inputs\":[],\"name\":\"claimOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"operation\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"execute\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"result\",\"type\":\"bytes\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"dataKeys\",\"type\":\"bytes32[]\"}],\"name\":\"getData\",\"outputs\":[{\"internalType\":\"bytes[]\",\"name\":\"dataValues\",\"type\":\"bytes[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"dataKey\",\"type\":\"bytes32\"}],\"name\":\"getData\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"dataValue\",\"type\":\"bytes\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"dataHash\",\"type\":\"bytes32\"},{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"}],\"name\":\"isValidSignature\",\"outputs\":[{\"internalType\":\"bytes4\",\"name\":\"magicValue\",\"type\":\"bytes4\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"pendingOwner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"dataKeys\",\"type\":\"bytes32[]\"},{\"internalType\":\"bytes[]\",\"name\":\"dataValues\",\"type\":\"bytes[]\"}],\"name\":\"setData\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"dataKey\",\"type\":\"bytes32\"},{\"internalType\":\"bytes\",\"name\":\"dataValue\",\"type\":\"bytes\"}],\"name\":\"setData\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"typeId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"universalReceiver\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"returnValue\",\"type\":\"bytes\"}],\"stateMutability\":\"payable\",\"type\":\"function\"}]",
}

// AccountABI is the input ABI used to generate the binding from.
// Deprecated: Use AccountMetaData.ABI instead.
var AccountABI = AccountMetaData.ABI

// Account is an auto generated Go binding around an Ethereum contract.
type Account struct {
	AccountCaller     // Read-only binding to the contract
	AccountTransactor // Write-only binding to the contract
	AccountFilterer   // Log filterer for contract events
}

// AccountCaller is an auto generated read-only Go binding around an Ethereum contract.
type AccountCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AccountTransactor is an auto generated write-only Go binding around an Ethereum contract.
type AccountTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AccountFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type AccountFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AccountSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type AccountSession struct {
	Contract     *Account          // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// AccountCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type AccountCallerSession struct {
	Contract *AccountCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts  // Call options to use throughout this session
}

// AccountTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type AccountTransactorSession struct {
	Contract     *AccountTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts  // Transaction auth options to use throughout this session
}

// AccountRaw is an auto generated low-level Go binding around an Ethereum contract.
type AccountRaw struct {
	Contract *Account // Generic contract binding to access the raw methods on
}

// AccountCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type AccountCallerRaw struct {
	Contract *AccountCaller // Generic read-only contract binding to access the raw methods on
}

// AccountTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type AccountTransactorRaw struct {
	Contract *AccountTransactor // Generic write-only contract binding to access the raw methods on
}

// NewAccount creates a new instance of Account, bound to a specific deployed contract.
func NewAccount(address common.Address, backend bind.ContractBackend) (*Account, error) {
	contract, err := bindAccount(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Account{AccountCaller: AccountCaller{contract: contract}, AccountTransactor: AccountTransactor{contract: contract}, AccountFilterer: AccountFilterer{contract: contract}}, nil
}

// NewAccountCaller creates a new read-only instance of Account, bound to a specific deployed contract.
func NewAccountCaller(address common.Address, caller bind.ContractCaller) (*AccountCaller, error) {
	contract, err := bindAccount(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &AccountCaller{contract: contract}, nil
}

// NewAccountTransactor creates a new write-only instance of Account, bound to a specific deployed contract.
func NewAccountTransactor(address common.Address, transactor bind.ContractTransactor) (*AccountTransactor, error) {
	contract, err := bindAccount(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &AccountTransactor{contract: contract}, nil
}

// NewAccountFilterer creates a new log filterer instance of Account, bound to a specific deployed contract.
func NewAccountFilterer(address common.Address, filterer bind.ContractFilterer) (*AccountFilterer, error) {
	contract, err := bindAccount(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &AccountFilterer{contract: contract}, nil
}

// bindAccount binds a generic wrapper to an already deployed contract.
func bindAccount(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(AccountABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Account *AccountRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Account.Contract.AccountCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Account *AccountRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Account.Contract.AccountTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Account *AccountRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Account.Contract.AccountTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Account *AccountCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Account.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Account *AccountTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Account.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Account *AccountTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Account.Contract.contract.Transact(opts, method, params...)
}

// GetData is a free data retrieval call binding the contract method 0x4e3e6e9c.
//
// Solidity: function getData(bytes32[] dataKeys) view returns(bytes[] dataValues)
func (_Account *AccountCaller) GetData(opts *bind.CallOpts, dataKeys [][32]byte) ([][]byte, error) {
	var out []interface{}
	err := _Account.contract.Call(opts, &out, "getData", dataKeys)

	if err != nil {
		return *new([][]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([][]byte)).(*[][]byte)

	return out0, err

}

// GetData is a free data retrieval call binding the contract method 0x4e3e6e9c.
//
// Solidity: function getData(bytes32[] dataKeys) view returns(bytes[] dataValues)
func (_Account *AccountSession) GetData(dataKeys [][32]byte) ([][]byte, error) {
	return _Account.Contract.GetData(&_Account.CallOpts, dataKeys)
}

// GetData is a free data retrieval call binding the contract method 0x4e3e6e9c.
//
// Solidity: function getData(bytes32[] dataKeys) view returns(bytes[] dataValues)
func (_Account *AccountCallerSession) GetData(dataKeys [][32]byte) ([][]byte, error) {
	return _Account.Contract.GetData(&_Account.CallOpts, dataKeys)
}

// GetData0 is a free data retrieval call binding the contract method 0x54f6127f.
//
// Solidity: function getData(bytes32 dataKey) view returns(bytes dataValue)
func (_Account *AccountCaller) GetData0(opts *bind.CallOpts, dataKey [32]byte) ([]byte, error) {
	var out []interface{}
	err := _Account.contract.Call(opts, &out, "getData0", dataKey)

	if err != nil {
		return *new([]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([]byte)).(*[]byte)

	return out0, err

}

// GetData0 is a free data retrieval call binding the contract method 0x54f6127f.
//
// Solidity: function getData(bytes32 dataKey) view returns(bytes dataValue)
func (_Account *AccountSession) GetData0(dataKey [32]byte) ([]byte, error) {
	return _Account.Contract.GetData0(&_Account.CallOpts, dataKey)
}

// GetData0 is a free data retrieval call binding the contract method 0x54f6127f.
//
// Solidity: function getData(bytes32 dataKey) view returns(bytes dataValue)
func (_Account *AccountCallerSession) GetData0(dataKey [32]byte) ([]byte, error) {
	return _Account.Contract.GetData0(&_Account.CallOpts, dataKey)
}

// IsValidSignature is a free data retrieval call binding the contract method 0x1626ba7e.
//
// Solidity: function isValidSignature(bytes32 dataHash, bytes signature) view returns(bytes4 magicValue)
func (_Account *AccountCaller) IsValidSignature(opts *bind.CallOpts, dataHash [32]byte, signature []byte) ([4]byte, error) {
	var out []interface{}
	err := _Account.contract.Call(opts, &out, "isValidSignature", dataHash, signature)

	if err != nil {
		return *new([4]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([4]byte)).(*[4]byte)

	return out0, err

}

// IsValidSignature is a free data retrieval call binding the contract method 0x1626ba7e.
//
// Solidity: function isValidSignature(bytes32 dataHash, bytes signature) view returns(bytes4 magicValue)
func (_Account *AccountSession) IsValidSignature(dataHash [32]byte, signature []byte) ([4]byte, error) {
	return _Account.Contract.IsValidSignature(&_Account.CallOpts, dataHash, signature)
}

// IsValidSignature is a free data retrieval call binding the contract method 0x1626ba7e.
//
// Solidity: function isValidSignature(bytes32 dataHash, bytes signature) view returns(bytes4 magicValue)
func (_Account *AccountCallerSession) IsValidSignature(dataHash [32]byte, signature []byte) ([4]byte, error) {
	return _Account.Contract.IsValidSignature(&_Account.CallOpts, dataHash, signature)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_Account *AccountCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _Account.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_Account *AccountSession) Owner() (common.Address, error) {
	return _Account.Contract.Owner(&_Account.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_Account *AccountCallerSession) Owner() (common.Address, error) {
	return _Account.Contract.Owner(&_Account.CallOpts)
}

// PendingOwner is a free data retrieval call binding the contract method 0xe30c3978.
//
// Solidity: function pendingOwner() view returns(address)
func (_Account *AccountCaller) PendingOwner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _Account.contract.Call(opts, &out, "pendingOwner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// PendingOwner is a free data retrieval call binding the contract method 0xe30c3978.
//
// Solidity: function pendingOwner() view returns(address)
func (_Account *AccountSession) PendingOwner() (common.Address, error) {
	return _Account.Contract.PendingOwner(&_Account.CallOpts)
}

// PendingOwner is a free data retrieval call binding the contract method 0xe30c3978.
//
// Solidity: function pendingOwner() view returns(address)
func (_Account *AccountCallerSession) PendingOwner() (common.Address, error) {
	return _Account.Contract.PendingOwner(&_Account.CallOpts)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_Account *AccountCaller) SupportsInterface(opts *bind.CallOpts, interfaceId [4]byte) (bool, error) {
	var out []interface{}
	err := _Account.contract.Call(opts, &out, "supportsInterface", interfaceId)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_Account *AccountSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _Account.Contract.SupportsInterface(&_Account.CallOpts, interfaceId)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_Account *AccountCallerSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _Account.Contract.SupportsInterface(&_Account.CallOpts, interfaceId)
}

// ClaimOwnership is a paid mutator transaction binding the contract method 0x4e71e0c8.
//
// Solidity: function claimOwnership() returns()
func (_Account *AccountTransactor) ClaimOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Account.contract.Transact(opts, "claimOwnership")
}

// ClaimOwnership is a paid mutator transaction binding the contract method 0x4e71e0c8.
//
// Solidity: function claimOwnership() returns()
func (_Account *AccountSession) ClaimOwnership() (*types.Transaction, error) {
	return _Account.Contract.ClaimOwnership(&_Account.TransactOpts)
}

// ClaimOwnership is a paid mutator transaction binding the contract method 0x4e71e0c8.
//
// Solidity: function claimOwnership() returns()
func (_Account *AccountTransactorSession) ClaimOwnership() (*types.Transaction, error) {
	return _Account.Contract.ClaimOwnership(&_Account.TransactOpts)
}

// Execute is a paid mutator transaction binding the contract method 0x44c028fe.
//
// Solidity: function execute(uint256 operation, address to, uint256 value, bytes data) payable returns(bytes result)
func (_Account *AccountTransactor) Execute(opts *bind.TransactOpts, operation *big.Int, to common.Address, value *big.Int, data []byte) (*types.Transaction, error) {
	return _Account.contract.Transact(opts, "execute", operation, to, value, data)
}

// Execute is a paid mutator transaction binding the contract method 0x44c028fe.
//
// Solidity: function execute(uint256 operation, address to, uint256 value, bytes data) payable returns(bytes result)
func (_Account *AccountSession) Execute(operation *big.Int, to common.Address, value *big.Int, data []byte) (*types.Transaction, error) {
	return _Account.Contract.Execute(&_Account.TransactOpts, operation, to, value, data)
}

// Execute is a paid mutator transaction binding the contract method 0x44c028fe.
//
// Solidity: function execute(uint256 operation, address to, uint256 value, bytes data) payable returns(bytes result)
func (_Account *AccountTransactorSession) Execute(operation *big.Int, to common.Address, value *big.Int, data []byte) (*types.Transaction, error) {
	return _Account.Contract.Execute(&_Account.TransactOpts, operation, to, value, data)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Account *AccountTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Account.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Account *AccountSession) RenounceOwnership() (*types.Transaction, error) {
	return _Account.Contract.RenounceOwnership(&_Account.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_Account *AccountTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _Account.Contract.RenounceOwnership(&_Account.TransactOpts)
}

// SetData is a paid mutator transaction binding the contract method 0x14a6e293.
//
// Solidity: function setData(bytes32[] dataKeys, bytes[] dataValues) returns()
func (_Account *AccountTransactor) SetData(opts *bind.TransactOpts, dataKeys [][32]byte, dataValues [][]byte) (*types.Transaction, error) {
	return _Account.contract.Transact(opts, "setData", dataKeys, dataValues)
}

// SetData is a paid mutator transaction binding the contract method 0x14a6e293.
//
// Solidity: function setData(bytes32[] dataKeys, bytes[] dataValues) returns()
func (_Account *AccountSession) SetData(dataKeys [][32]byte, dataValues [][]byte) (*types.Transaction, error) {
	return _Account.Contract.SetData(&_Account.TransactOpts, dataKeys, dataValues)
}

// SetData is a paid mutator transaction binding the contract method 0x14a6e293.
//
// Solidity: function setData(bytes32[] dataKeys, bytes[] dataValues) returns()
func (_Account *AccountTransactorSession) SetData(dataKeys [][32]byte, dataValues [][]byte) (*types.Transaction, error) {
	return _Account.Contract.SetData(&_Account.TransactOpts, dataKeys, dataValues)
}

// SetData0 is a paid mutator transaction binding the contract method 0x7f23690c.
//
// Solidity: function setData(bytes32 dataKey, bytes dataValue) returns()
func (_Account *AccountTransactor) SetData0(opts *bind.TransactOpts, dataKey [32]byte, dataValue []byte) (*types.Transaction, error) {
	return _Account.contract.Transact(opts, "setData0", dataKey, dataValue)
}

// SetData0 is a paid mutator transaction binding the contract method 0x7f23690c.
//
// Solidity: function setData(bytes32 dataKey, bytes dataValue) returns()
func (_Account *AccountSession) SetData0(dataKey [32]byte, dataValue []byte) (*types.Transaction, error) {
	return _Account.Contract.SetData0(&_Account.TransactOpts, dataKey, dataValue)
}

// SetData0 is a paid mutator transaction binding the contract method 0x7f23690c.
//
// Solidity: function setData(bytes32 dataKey, bytes dataValue) returns()
func (_Account *AccountTransactorSession) SetData0(dataKey [32]byte, dataValue []byte) (*types.Transaction, error) {
	return _Account.Contract.SetData0(&_Account.TransactOpts, dataKey, dataValue)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address _newOwner) returns()
func (_Account *AccountTransactor) TransferOwnership(opts *bind.TransactOpts, _newOwner common.Address) (*types.Transaction, error) {
	return _Account.contract.Transact(opts, "transferOwnership", _newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address _newOwner) returns()
func (_Account *AccountSession) TransferOwnership(_newOwner common.Address) (*types.Transaction, error) {
	return _Account.Contract.TransferOwnership(&_Account.TransactOpts, _newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address _newOwner) returns()
func (_Account *AccountTransactorSession) TransferOwnership(_newOwner common.Address) (*types.Transaction, error) {
	return _Account.Contract.TransferOwnership(&_Account.TransactOpts, _newOwner)
}

// UniversalReceiver is a paid mutator transaction binding the contract method 0x6bb56a14.
//
// Solidity: function universalReceiver(bytes32 typeId, bytes data) payable returns(bytes returnValue)
func (_Account *AccountTransactor) UniversalReceiver(opts *bind.TransactOpts, typeId [32]byte, data []byte) (*types.Transaction, error) {
	return _Account.contract.Transact(opts, "universalReceiver", typeId, data)
}

// UniversalReceiver is a paid mutator transaction binding the contract method 0x6bb56a14.
//
// Solidity: function universalReceiver(bytes32 typeId, bytes data) payable returns(bytes returnValue)
func (_Account *AccountSession) UniversalReceiver(typeId [32]byte, data []byte) (*types.Transaction, error) {
	return _Account.Contract.UniversalReceiver(&_Account.TransactOpts, typeId, data)
}

// UniversalReceiver is a paid mutator transaction binding the contract method 0x6bb56a14.
//
// Solidity: function universalReceiver(bytes32 typeId, bytes data) payable returns(bytes returnValue)
func (_Account *AccountTransactorSession) UniversalReceiver(typeId [32]byte, data []byte) (*types.Transaction, error) {
	return _Account.Contract.UniversalReceiver(&_Account.TransactOpts, typeId, data)
}

// Fallback is a paid mutator transaction binding the contract fallback function.
//
// Solidity: fallback() payable returns()
func (_Account *AccountTransactor) Fallback(opts *bind.TransactOpts, calldata []byte) (*types.Transaction, error) {
	return _Account.contract.RawTransact(opts, calldata)
}

// Fallback is a paid mutator transaction binding the contract fallback function.
//
// Solidity: fallback() payable returns()
func (_Account *AccountSession) Fallback(calldata []byte) (*types.Transaction, error) {
	return _Account.Contract.Fallback(&_Account.TransactOpts, calldata)
}

// Fallback is a paid mutator transaction binding the contract fallback function.
//
// Solidity: fallback() payable returns()
func (_Account *AccountTransactorSession) Fallback(calldata []byte) (*types.Transaction, error) {
	return _Account.Contract.Fallback(&_Account.TransactOpts, calldata)
}

// AccountContractCreatedIterator is returned from FilterContractCreated and is used to iterate over the raw logs and unpacked data for ContractCreated events raised by the Account contract.
type AccountContractCreatedIterator struct {
	Event *AccountContractCreated // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AccountContractCreatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AccountContractCreated)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AccountContractCreated)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AccountContractCreatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AccountContractCreatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AccountContractCreated represents a ContractCreated event raised by the Account contract.
type AccountContractCreated struct {
	Operation       *big.Int
	ContractAddress common.Address
	Value           *big.Int
	Raw             types.Log // Blockchain specific contextual infos
}

// FilterContractCreated is a free log retrieval operation binding the contract event 0x01c42bd7e97a66166063b02fce6924e6656b6c2c61966630165095c4fb0b7b2f.
//
// Solidity: event ContractCreated(uint256 indexed operation, address indexed contractAddress, uint256 indexed value)
func (_Account *AccountFilterer) FilterContractCreated(opts *bind.FilterOpts, operation []*big.Int, contractAddress []common.Address, value []*big.Int) (*AccountContractCreatedIterator, error) {

	var operationRule []interface{}
	for _, operationItem := range operation {
		operationRule = append(operationRule, operationItem)
	}
	var contractAddressRule []interface{}
	for _, contractAddressItem := range contractAddress {
		contractAddressRule = append(contractAddressRule, contractAddressItem)
	}
	var valueRule []interface{}
	for _, valueItem := range value {
		valueRule = append(valueRule, valueItem)
	}

	logs, sub, err := _Account.contract.FilterLogs(opts, "ContractCreated", operationRule, contractAddressRule, valueRule)
	if err != nil {
		return nil, err
	}
	return &AccountContractCreatedIterator{contract: _Account.contract, event: "ContractCreated", logs: logs, sub: sub}, nil
}

// WatchContractCreated is a free log subscription operation binding the contract event 0x01c42bd7e97a66166063b02fce6924e6656b6c2c61966630165095c4fb0b7b2f.
//
// Solidity: event ContractCreated(uint256 indexed operation, address indexed contractAddress, uint256 indexed value)
func (_Account *AccountFilterer) WatchContractCreated(opts *bind.WatchOpts, sink chan<- *AccountContractCreated, operation []*big.Int, contractAddress []common.Address, value []*big.Int) (event.Subscription, error) {

	var operationRule []interface{}
	for _, operationItem := range operation {
		operationRule = append(operationRule, operationItem)
	}
	var contractAddressRule []interface{}
	for _, contractAddressItem := range contractAddress {
		contractAddressRule = append(contractAddressRule, contractAddressItem)
	}
	var valueRule []interface{}
	for _, valueItem := range value {
		valueRule = append(valueRule, valueItem)
	}

	logs, sub, err := _Account.contract.WatchLogs(opts, "ContractCreated", operationRule, contractAddressRule, valueRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AccountContractCreated)
				if err := _Account.contract.UnpackLog(event, "ContractCreated", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseContractCreated is a log parse operation binding the contract event 0x01c42bd7e97a66166063b02fce6924e6656b6c2c61966630165095c4fb0b7b2f.
//
// Solidity: event ContractCreated(uint256 indexed operation, address indexed contractAddress, uint256 indexed value)
func (_Account *AccountFilterer) ParseContractCreated(log types.Log) (*AccountContractCreated, error) {
	event := new(AccountContractCreated)
	if err := _Account.contract.UnpackLog(event, "ContractCreated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AccountDataChangedIterator is returned from FilterDataChanged and is used to iterate over the raw logs and unpacked data for DataChanged events raised by the Account contract.
type AccountDataChangedIterator struct {
	Event *AccountDataChanged // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AccountDataChangedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AccountDataChanged)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AccountDataChanged)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AccountDataChangedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AccountDataChangedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AccountDataChanged represents a DataChanged event raised by the Account contract.
type AccountDataChanged struct {
	DataKey [32]byte
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterDataChanged is a free log retrieval operation binding the contract event 0xcdf4e344c0d23d4cdd0474039d176c55b19d531070dbe17856bfb993a5b5720b.
//
// Solidity: event DataChanged(bytes32 indexed dataKey)
func (_Account *AccountFilterer) FilterDataChanged(opts *bind.FilterOpts, dataKey [][32]byte) (*AccountDataChangedIterator, error) {

	var dataKeyRule []interface{}
	for _, dataKeyItem := range dataKey {
		dataKeyRule = append(dataKeyRule, dataKeyItem)
	}

	logs, sub, err := _Account.contract.FilterLogs(opts, "DataChanged", dataKeyRule)
	if err != nil {
		return nil, err
	}
	return &AccountDataChangedIterator{contract: _Account.contract, event: "DataChanged", logs: logs, sub: sub}, nil
}

// WatchDataChanged is a free log subscription operation binding the contract event 0xcdf4e344c0d23d4cdd0474039d176c55b19d531070dbe17856bfb993a5b5720b.
//
// Solidity: event DataChanged(bytes32 indexed dataKey)
func (_Account *AccountFilterer) WatchDataChanged(opts *bind.WatchOpts, sink chan<- *AccountDataChanged, dataKey [][32]byte) (event.Subscription, error) {

	var dataKeyRule []interface{}
	for _, dataKeyItem := range dataKey {
		dataKeyRule = append(dataKeyRule, dataKeyItem)
	}

	logs, sub, err := _Account.contract.WatchLogs(opts, "DataChanged", dataKeyRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AccountDataChanged)
				if err := _Account.contract.UnpackLog(event, "DataChanged", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseDataChanged is a log parse operation binding the contract event 0xcdf4e344c0d23d4cdd0474039d176c55b19d531070dbe17856bfb993a5b5720b.
//
// Solidity: event DataChanged(bytes32 indexed dataKey)
func (_Account *AccountFilterer) ParseDataChanged(log types.Log) (*AccountDataChanged, error) {
	event := new(AccountDataChanged)
	if err := _Account.contract.UnpackLog(event, "DataChanged", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AccountExecutedIterator is returned from FilterExecuted and is used to iterate over the raw logs and unpacked data for Executed events raised by the Account contract.
type AccountExecutedIterator struct {
	Event *AccountExecuted // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AccountExecutedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AccountExecuted)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AccountExecuted)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AccountExecutedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AccountExecutedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AccountExecuted represents a Executed event raised by the Account contract.
type AccountExecuted struct {
	Operation *big.Int
	To        common.Address
	Value     *big.Int
	Selector  [4]byte
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterExecuted is a free log retrieval operation binding the contract event 0x4810874456b8e6487bd861375cf6abd8e1c8bb5858c8ce36a86a04dabfac199e.
//
// Solidity: event Executed(uint256 indexed operation, address indexed to, uint256 indexed value, bytes4 selector)
func (_Account *AccountFilterer) FilterExecuted(opts *bind.FilterOpts, operation []*big.Int, to []common.Address, value []*big.Int) (*AccountExecutedIterator, error) {

	var operationRule []interface{}
	for _, operationItem := range operation {
		operationRule = append(operationRule, operationItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}
	var valueRule []interface{}
	for _, valueItem := range value {
		valueRule = append(valueRule, valueItem)
	}

	logs, sub, err := _Account.contract.FilterLogs(opts, "Executed", operationRule, toRule, valueRule)
	if err != nil {
		return nil, err
	}
	return &AccountExecutedIterator{contract: _Account.contract, event: "Executed", logs: logs, sub: sub}, nil
}

// WatchExecuted is a free log subscription operation binding the contract event 0x4810874456b8e6487bd861375cf6abd8e1c8bb5858c8ce36a86a04dabfac199e.
//
// Solidity: event Executed(uint256 indexed operation, address indexed to, uint256 indexed value, bytes4 selector)
func (_Account *AccountFilterer) WatchExecuted(opts *bind.WatchOpts, sink chan<- *AccountExecuted, operation []*big.Int, to []common.Address, value []*big.Int) (event.Subscription, error) {

	var operationRule []interface{}
	for _, operationItem := range operation {
		operationRule = append(operationRule, operationItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}
	var valueRule []interface{}
	for _, valueItem := range value {
		valueRule = append(valueRule, valueItem)
	}

	logs, sub, err := _Account.contract.WatchLogs(opts, "Executed", operationRule, toRule, valueRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AccountExecuted)
				if err := _Account.contract.UnpackLog(event, "Executed", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseExecuted is a log parse operation binding the contract event 0x4810874456b8e6487bd861375cf6abd8e1c8bb5858c8ce36a86a04dabfac199e.
//
// Solidity: event Executed(uint256 indexed operation, address indexed to, uint256 indexed value, bytes4 selector)
func (_Account *AccountFilterer) ParseExecuted(log types.Log) (*AccountExecuted, error) {
	event := new(AccountExecuted)
	if err := _Account.contract.UnpackLog(event, "Executed", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AccountOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the Account contract.
type AccountOwnershipTransferredIterator struct {
	Event *AccountOwnershipTransferred // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AccountOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AccountOwnershipTransferred)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AccountOwnershipTransferred)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AccountOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AccountOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AccountOwnershipTransferred represents a OwnershipTransferred event raised by the Account contract.
type AccountOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Account *AccountFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*AccountOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _Account.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &AccountOwnershipTransferredIterator{contract: _Account.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Account *AccountFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *AccountOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _Account.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AccountOwnershipTransferred)
				if err := _Account.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseOwnershipTransferred is a log parse operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Account *AccountFilterer) ParseOwnershipTransferred(log types.Log) (*AccountOwnershipTransferred, error) {
	event := new(AccountOwnershipTransferred)
	if err := _Account.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AccountUniversalReceiverIterator is returned from FilterUniversalReceiver and is used to iterate over the raw logs and unpacked data for UniversalReceiver events raised by the Account contract.
type AccountUniversalReceiverIterator struct {
	Event *AccountUniversalReceiver // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AccountUniversalReceiverIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AccountUniversalReceiver)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AccountUniversalReceiver)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AccountUniversalReceiverIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AccountUniversalReceiverIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AccountUniversalReceiver represents a UniversalReceiver event raised by the Account contract.
type AccountUniversalReceiver struct {
	From          common.Address
	Value         *big.Int
	TypeId        [32]byte
	ReturnedValue common.Hash
	ReceivedData  []byte
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterUniversalReceiver is a free log retrieval operation binding the contract event 0x9c3ba68eb5742b8e3961aea0afc7371a71bf433c8a67a831803b64c064a178c2.
//
// Solidity: event UniversalReceiver(address indexed from, uint256 value, bytes32 indexed typeId, bytes indexed returnedValue, bytes receivedData)
func (_Account *AccountFilterer) FilterUniversalReceiver(opts *bind.FilterOpts, from []common.Address, typeId [][32]byte, returnedValue [][]byte) (*AccountUniversalReceiverIterator, error) {

	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}

	var typeIdRule []interface{}
	for _, typeIdItem := range typeId {
		typeIdRule = append(typeIdRule, typeIdItem)
	}
	var returnedValueRule []interface{}
	for _, returnedValueItem := range returnedValue {
		returnedValueRule = append(returnedValueRule, returnedValueItem)
	}

	logs, sub, err := _Account.contract.FilterLogs(opts, "UniversalReceiver", fromRule, typeIdRule, returnedValueRule)
	if err != nil {
		return nil, err
	}
	return &AccountUniversalReceiverIterator{contract: _Account.contract, event: "UniversalReceiver", logs: logs, sub: sub}, nil
}

// WatchUniversalReceiver is a free log subscription operation binding the contract event 0x9c3ba68eb5742b8e3961aea0afc7371a71bf433c8a67a831803b64c064a178c2.
//
// Solidity: event UniversalReceiver(address indexed from, uint256 value, bytes32 indexed typeId, bytes indexed returnedValue, bytes receivedData)
func (_Account *AccountFilterer) WatchUniversalReceiver(opts *bind.WatchOpts, sink chan<- *AccountUniversalReceiver, from []common.Address, typeId [][32]byte, returnedValue [][]byte) (event.Subscription, error) {

	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}

	var typeIdRule []interface{}
	for _, typeIdItem := range typeId {
		typeIdRule = append(typeIdRule, typeIdItem)
	}
	var returnedValueRule []interface{}
	for _, returnedValueItem := range returnedValue {
		returnedValueRule = append(returnedValueRule, returnedValueItem)
	}

	logs, sub, err := _Account.contract.WatchLogs(opts, "UniversalReceiver", fromRule, typeIdRule, returnedValueRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AccountUniversalReceiver)
				if err := _Account.contract.UnpackLog(event, "UniversalReceiver", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseUniversalReceiver is a log parse operation binding the contract event 0x9c3ba68eb5742b8e3961aea0afc7371a71bf433c8a67a831803b64c064a178c2.
//
// Solidity: event UniversalReceiver(address indexed from, uint256 value, bytes32 indexed typeId, bytes indexed returnedValue, bytes receivedData)
func (_Account *AccountFilterer) ParseUniversalReceiver(log types.Log) (*AccountUniversalReceiver, error) {
	event := new(AccountUniversalReceiver)
	if err := _Account.contract.UnpackLog(event, "UniversalReceiver", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AccountValueReceivedIterator is returned from FilterValueReceived and is used to iterate over the raw logs and unpacked data for ValueReceived events raised by the Account contract.
type AccountValueReceivedIterator struct {
	Event *AccountValueReceived // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AccountValueReceivedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AccountValueReceived)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AccountValueReceived)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AccountValueReceivedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AccountValueReceivedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AccountValueReceived represents a ValueReceived event raised by the Account contract.
type AccountValueReceived struct {
	Sender common.Address
	Value  *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterValueReceived is a free log retrieval operation binding the contract event 0x7e71433ddf847725166244795048ecf3e3f9f35628254ecbf736056664233493.
//
// Solidity: event ValueReceived(address indexed sender, uint256 indexed value)
func (_Account *AccountFilterer) FilterValueReceived(opts *bind.FilterOpts, sender []common.Address, value []*big.Int) (*AccountValueReceivedIterator, error) {

	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}
	var valueRule []interface{}
	for _, valueItem := range value {
		valueRule = append(valueRule, valueItem)
	}

	logs, sub, err := _Account.contract.FilterLogs(opts, "ValueReceived", senderRule, valueRule)
	if err != nil {
		return nil, err
	}
	return &AccountValueReceivedIterator{contract: _Account.contract, event: "ValueReceived", logs: logs, sub: sub}, nil
}

// WatchValueReceived is a free log subscription operation binding the contract event 0x7e71433ddf847725166244795048ecf3e3f9f35628254ecbf736056664233493.
//
// Solidity: event ValueReceived(address indexed sender, uint256 indexed value)
func (_Account *AccountFilterer) WatchValueReceived(opts *bind.WatchOpts, sink chan<- *AccountValueReceived, sender []common.Address, value []*big.Int) (event.Subscription, error) {

	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}
	var valueRule []interface{}
	for _, valueItem := range value {
		valueRule = append(valueRule, valueItem)
	}

	logs, sub, err := _Account.contract.WatchLogs(opts, "ValueReceived", senderRule, valueRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AccountValueReceived)
				if err := _Account.contract.UnpackLog(event, "ValueReceived", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseValueReceived is a log parse operation binding the contract event 0x7e71433ddf847725166244795048ecf3e3f9f35628254ecbf736056664233493.
//
// Solidity: event ValueReceived(address indexed sender, uint256 indexed value)
func (_Account *AccountFilterer) ParseValueReceived(log types.Log) (*AccountValueReceived, error) {
	event := new(AccountValueReceived)
	if err := _Account.contract.UnpackLog(event, "ValueReceived", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
