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
            const db = req.app.get("db");
            const { address, signature } = req.body;
            // Ensure that they own the address they are adding as a signer.
            const message = ethers_1.default.utils.solidityKeccak256(["address"], [address]);
            const signer = ethers_1.default.utils.verifyMessage(ethers_1.default.utils.arrayify(message), signature);
            if (address !== signer)
                throw "not address owner";
            let user = req.user;
            yield db.task((t) => __awaiter(this, void 0, void 0, function* () {
                yield t.none("INSERT INTO signers(address, user_id) VALUES($1, $2)", [
                    address,
                    user.id,
                ]);
            }));
            res.send("added signer");
        }
        catch (err) {
            console.log(err);
            return next("Failed to create signer");
        }
    });
}
module.exports = { create };
//# sourceMappingURL=signer.js.map