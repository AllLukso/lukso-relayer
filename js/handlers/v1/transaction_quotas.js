"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = __importDefault(require("ethers"));
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { address, signature } = req.body;
            if (address === "" || address === undefined)
                throw "address must be present";
            const message = ethers_1.default.utils.solidityKeccak256(["address"], [address]);
            const signerAddress = ethers_1.default.utils.verifyMessage(ethers_1.default.utils.arrayify(message), signature);
            if (signerAddress !== address)
                throw "only owner can add to transaction quota";
            const db = req.app.get("db");
            const tq = yield db.one("INSERT INTO transaction_quotas(owner_address, monthly_gas, gas_used) VALUES($1, $2, $3) RETURNING *", [signerAddress, 650000, 0]);
            res.json(tq);
        }
        catch (err) {
            console.log(err);
            return next("failed to create quota");
        }
    });
}
module.exports = { create };
//# sourceMappingURL=transaction_quotas.js.map