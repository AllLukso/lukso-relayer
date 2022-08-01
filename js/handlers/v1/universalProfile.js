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
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = req.app.get("db");
            const { universalProfileAddress } = req.body;
            const universalProfile = yield db.one("INSERT INTO universal_profiles(address, user_id) VALUES($1, $2) RETURNING *", [universalProfileAddress, req.user.id]);
            res.json(universalProfile);
        }
        catch (err) {
            console.log(err);
            return next("failed to create universal profile");
        }
    });
}
module.exports = { create };
//# sourceMappingURL=universalProfile.js.map