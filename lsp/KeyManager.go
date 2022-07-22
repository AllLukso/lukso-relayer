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

// KeyManagerMetaData contains all meta data concerning the KeyManager contract.
var KeyManagerMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"target_\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[{\"internalType\":\"bytes\",\"name\":\"value\",\"type\":\"bytes\"},{\"internalType\":\"string\",\"name\":\"valueType\",\"type\":\"string\"}],\"name\":\"InvalidABIEncodedArray\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"invalidFunction\",\"type\":\"bytes4\"}],\"name\":\"InvalidERC725Function\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"InvalidLSP6Target\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"signer\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"invalidNonce\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"}],\"name\":\"InvalidRelayNonce\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"}],\"name\":\"NoPermissionsSet\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"disallowedAddress\",\"type\":\"address\"}],\"name\":\"NotAllowedAddress\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"bytes32\",\"name\":\"disallowedKey\",\"type\":\"bytes32\"}],\"name\":\"NotAllowedERC725YKey\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"bytes4\",\"name\":\"disallowedFunction\",\"type\":\"bytes4\"}],\"name\":\"NotAllowedFunction\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"addressNotImplementingAllowedStandard\",\"type\":\"address\"}],\"name\":\"NotAllowedStandard\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"permission\",\"type\":\"string\"}],\"name\":\"NotAuthorised\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes4\",\"name\":\"selector\",\"type\":\"bytes4\"}],\"name\":\"Executed\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"bytes\",\"name\":\"payload\",\"type\":\"bytes\"}],\"name\":\"execute\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"},{\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"payload\",\"type\":\"bytes\"}],\"name\":\"executeRelayCall\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"channelId\",\"type\":\"uint256\"}],\"name\":\"getNonce\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"dataHash\",\"type\":\"bytes32\"},{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"}],\"name\":\"isValidSignature\",\"outputs\":[{\"internalType\":\"bytes4\",\"name\":\"magicValue\",\"type\":\"bytes4\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"target\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
}

// KeyManagerABI is the input ABI used to generate the binding from.
// Deprecated: Use KeyManagerMetaData.ABI instead.
var KeyManagerABI = KeyManagerMetaData.ABI

// KeyManager is an auto generated Go binding around an Ethereum contract.
type KeyManager struct {
	KeyManagerCaller     // Read-only binding to the contract
	KeyManagerTransactor // Write-only binding to the contract
	KeyManagerFilterer   // Log filterer for contract events
}

// KeyManagerCaller is an auto generated read-only Go binding around an Ethereum contract.
type KeyManagerCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// KeyManagerTransactor is an auto generated write-only Go binding around an Ethereum contract.
type KeyManagerTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// KeyManagerFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type KeyManagerFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// KeyManagerSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type KeyManagerSession struct {
	Contract     *KeyManager       // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// KeyManagerCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type KeyManagerCallerSession struct {
	Contract *KeyManagerCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts     // Call options to use throughout this session
}

// KeyManagerTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type KeyManagerTransactorSession struct {
	Contract     *KeyManagerTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts     // Transaction auth options to use throughout this session
}

// KeyManagerRaw is an auto generated low-level Go binding around an Ethereum contract.
type KeyManagerRaw struct {
	Contract *KeyManager // Generic contract binding to access the raw methods on
}

// KeyManagerCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type KeyManagerCallerRaw struct {
	Contract *KeyManagerCaller // Generic read-only contract binding to access the raw methods on
}

// KeyManagerTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type KeyManagerTransactorRaw struct {
	Contract *KeyManagerTransactor // Generic write-only contract binding to access the raw methods on
}

// NewKeyManager creates a new instance of KeyManager, bound to a specific deployed contract.
func NewKeyManager(address common.Address, backend bind.ContractBackend) (*KeyManager, error) {
	contract, err := bindKeyManager(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &KeyManager{KeyManagerCaller: KeyManagerCaller{contract: contract}, KeyManagerTransactor: KeyManagerTransactor{contract: contract}, KeyManagerFilterer: KeyManagerFilterer{contract: contract}}, nil
}

// NewKeyManagerCaller creates a new read-only instance of KeyManager, bound to a specific deployed contract.
func NewKeyManagerCaller(address common.Address, caller bind.ContractCaller) (*KeyManagerCaller, error) {
	contract, err := bindKeyManager(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &KeyManagerCaller{contract: contract}, nil
}

// NewKeyManagerTransactor creates a new write-only instance of KeyManager, bound to a specific deployed contract.
func NewKeyManagerTransactor(address common.Address, transactor bind.ContractTransactor) (*KeyManagerTransactor, error) {
	contract, err := bindKeyManager(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &KeyManagerTransactor{contract: contract}, nil
}

// NewKeyManagerFilterer creates a new log filterer instance of KeyManager, bound to a specific deployed contract.
func NewKeyManagerFilterer(address common.Address, filterer bind.ContractFilterer) (*KeyManagerFilterer, error) {
	contract, err := bindKeyManager(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &KeyManagerFilterer{contract: contract}, nil
}

// bindKeyManager binds a generic wrapper to an already deployed contract.
func bindKeyManager(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(KeyManagerABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_KeyManager *KeyManagerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _KeyManager.Contract.KeyManagerCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_KeyManager *KeyManagerRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _KeyManager.Contract.KeyManagerTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_KeyManager *KeyManagerRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _KeyManager.Contract.KeyManagerTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_KeyManager *KeyManagerCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _KeyManager.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_KeyManager *KeyManagerTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _KeyManager.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_KeyManager *KeyManagerTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _KeyManager.Contract.contract.Transact(opts, method, params...)
}

// GetNonce is a free data retrieval call binding the contract method 0x89535803.
//
// Solidity: function getNonce(address from, uint256 channelId) view returns(uint256)
func (_KeyManager *KeyManagerCaller) GetNonce(opts *bind.CallOpts, from common.Address, channelId *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _KeyManager.contract.Call(opts, &out, "getNonce", from, channelId)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetNonce is a free data retrieval call binding the contract method 0x89535803.
//
// Solidity: function getNonce(address from, uint256 channelId) view returns(uint256)
func (_KeyManager *KeyManagerSession) GetNonce(from common.Address, channelId *big.Int) (*big.Int, error) {
	return _KeyManager.Contract.GetNonce(&_KeyManager.CallOpts, from, channelId)
}

// GetNonce is a free data retrieval call binding the contract method 0x89535803.
//
// Solidity: function getNonce(address from, uint256 channelId) view returns(uint256)
func (_KeyManager *KeyManagerCallerSession) GetNonce(from common.Address, channelId *big.Int) (*big.Int, error) {
	return _KeyManager.Contract.GetNonce(&_KeyManager.CallOpts, from, channelId)
}

// IsValidSignature is a free data retrieval call binding the contract method 0x1626ba7e.
//
// Solidity: function isValidSignature(bytes32 dataHash, bytes signature) view returns(bytes4 magicValue)
func (_KeyManager *KeyManagerCaller) IsValidSignature(opts *bind.CallOpts, dataHash [32]byte, signature []byte) ([4]byte, error) {
	var out []interface{}
	err := _KeyManager.contract.Call(opts, &out, "isValidSignature", dataHash, signature)

	if err != nil {
		return *new([4]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([4]byte)).(*[4]byte)

	return out0, err

}

// IsValidSignature is a free data retrieval call binding the contract method 0x1626ba7e.
//
// Solidity: function isValidSignature(bytes32 dataHash, bytes signature) view returns(bytes4 magicValue)
func (_KeyManager *KeyManagerSession) IsValidSignature(dataHash [32]byte, signature []byte) ([4]byte, error) {
	return _KeyManager.Contract.IsValidSignature(&_KeyManager.CallOpts, dataHash, signature)
}

// IsValidSignature is a free data retrieval call binding the contract method 0x1626ba7e.
//
// Solidity: function isValidSignature(bytes32 dataHash, bytes signature) view returns(bytes4 magicValue)
func (_KeyManager *KeyManagerCallerSession) IsValidSignature(dataHash [32]byte, signature []byte) ([4]byte, error) {
	return _KeyManager.Contract.IsValidSignature(&_KeyManager.CallOpts, dataHash, signature)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_KeyManager *KeyManagerCaller) SupportsInterface(opts *bind.CallOpts, interfaceId [4]byte) (bool, error) {
	var out []interface{}
	err := _KeyManager.contract.Call(opts, &out, "supportsInterface", interfaceId)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_KeyManager *KeyManagerSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _KeyManager.Contract.SupportsInterface(&_KeyManager.CallOpts, interfaceId)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_KeyManager *KeyManagerCallerSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _KeyManager.Contract.SupportsInterface(&_KeyManager.CallOpts, interfaceId)
}

// Target is a free data retrieval call binding the contract method 0xd4b83992.
//
// Solidity: function target() view returns(address)
func (_KeyManager *KeyManagerCaller) Target(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _KeyManager.contract.Call(opts, &out, "target")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Target is a free data retrieval call binding the contract method 0xd4b83992.
//
// Solidity: function target() view returns(address)
func (_KeyManager *KeyManagerSession) Target() (common.Address, error) {
	return _KeyManager.Contract.Target(&_KeyManager.CallOpts)
}

// Target is a free data retrieval call binding the contract method 0xd4b83992.
//
// Solidity: function target() view returns(address)
func (_KeyManager *KeyManagerCallerSession) Target() (common.Address, error) {
	return _KeyManager.Contract.Target(&_KeyManager.CallOpts)
}

// Execute is a paid mutator transaction binding the contract method 0x09c5eabe.
//
// Solidity: function execute(bytes payload) payable returns(bytes)
func (_KeyManager *KeyManagerTransactor) Execute(opts *bind.TransactOpts, payload []byte) (*types.Transaction, error) {
	return _KeyManager.contract.Transact(opts, "execute", payload)
}

// Execute is a paid mutator transaction binding the contract method 0x09c5eabe.
//
// Solidity: function execute(bytes payload) payable returns(bytes)
func (_KeyManager *KeyManagerSession) Execute(payload []byte) (*types.Transaction, error) {
	return _KeyManager.Contract.Execute(&_KeyManager.TransactOpts, payload)
}

// Execute is a paid mutator transaction binding the contract method 0x09c5eabe.
//
// Solidity: function execute(bytes payload) payable returns(bytes)
func (_KeyManager *KeyManagerTransactorSession) Execute(payload []byte) (*types.Transaction, error) {
	return _KeyManager.Contract.Execute(&_KeyManager.TransactOpts, payload)
}

// ExecuteRelayCall is a paid mutator transaction binding the contract method 0x902d5fa0.
//
// Solidity: function executeRelayCall(bytes signature, uint256 nonce, bytes payload) payable returns(bytes)
func (_KeyManager *KeyManagerTransactor) ExecuteRelayCall(opts *bind.TransactOpts, signature []byte, nonce *big.Int, payload []byte) (*types.Transaction, error) {
	return _KeyManager.contract.Transact(opts, "executeRelayCall", signature, nonce, payload)
}

// ExecuteRelayCall is a paid mutator transaction binding the contract method 0x902d5fa0.
//
// Solidity: function executeRelayCall(bytes signature, uint256 nonce, bytes payload) payable returns(bytes)
func (_KeyManager *KeyManagerSession) ExecuteRelayCall(signature []byte, nonce *big.Int, payload []byte) (*types.Transaction, error) {
	return _KeyManager.Contract.ExecuteRelayCall(&_KeyManager.TransactOpts, signature, nonce, payload)
}

// ExecuteRelayCall is a paid mutator transaction binding the contract method 0x902d5fa0.
//
// Solidity: function executeRelayCall(bytes signature, uint256 nonce, bytes payload) payable returns(bytes)
func (_KeyManager *KeyManagerTransactorSession) ExecuteRelayCall(signature []byte, nonce *big.Int, payload []byte) (*types.Transaction, error) {
	return _KeyManager.Contract.ExecuteRelayCall(&_KeyManager.TransactOpts, signature, nonce, payload)
}

// KeyManagerExecutedIterator is returned from FilterExecuted and is used to iterate over the raw logs and unpacked data for Executed events raised by the KeyManager contract.
type KeyManagerExecutedIterator struct {
	Event *KeyManagerExecuted // Event containing the contract specifics and raw log

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
func (it *KeyManagerExecutedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(KeyManagerExecuted)
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
		it.Event = new(KeyManagerExecuted)
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
func (it *KeyManagerExecutedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *KeyManagerExecutedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// KeyManagerExecuted represents a Executed event raised by the KeyManager contract.
type KeyManagerExecuted struct {
	Value    *big.Int
	Selector [4]byte
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterExecuted is a free log retrieval operation binding the contract event 0x6b9340454526f665e369d7ac17353d0b73774a4a80f746b959ece8130e0f1d72.
//
// Solidity: event Executed(uint256 indexed value, bytes4 selector)
func (_KeyManager *KeyManagerFilterer) FilterExecuted(opts *bind.FilterOpts, value []*big.Int) (*KeyManagerExecutedIterator, error) {

	var valueRule []interface{}
	for _, valueItem := range value {
		valueRule = append(valueRule, valueItem)
	}

	logs, sub, err := _KeyManager.contract.FilterLogs(opts, "Executed", valueRule)
	if err != nil {
		return nil, err
	}
	return &KeyManagerExecutedIterator{contract: _KeyManager.contract, event: "Executed", logs: logs, sub: sub}, nil
}

// WatchExecuted is a free log subscription operation binding the contract event 0x6b9340454526f665e369d7ac17353d0b73774a4a80f746b959ece8130e0f1d72.
//
// Solidity: event Executed(uint256 indexed value, bytes4 selector)
func (_KeyManager *KeyManagerFilterer) WatchExecuted(opts *bind.WatchOpts, sink chan<- *KeyManagerExecuted, value []*big.Int) (event.Subscription, error) {

	var valueRule []interface{}
	for _, valueItem := range value {
		valueRule = append(valueRule, valueItem)
	}

	logs, sub, err := _KeyManager.contract.WatchLogs(opts, "Executed", valueRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(KeyManagerExecuted)
				if err := _KeyManager.contract.UnpackLog(event, "Executed", log); err != nil {
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

// ParseExecuted is a log parse operation binding the contract event 0x6b9340454526f665e369d7ac17353d0b73774a4a80f746b959ece8130e0f1d72.
//
// Solidity: event Executed(uint256 indexed value, bytes4 selector)
func (_KeyManager *KeyManagerFilterer) ParseExecuted(log types.Log) (*KeyManagerExecuted, error) {
	event := new(KeyManagerExecuted)
	if err := _KeyManager.contract.UnpackLog(event, "Executed", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
