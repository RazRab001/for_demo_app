"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const express_validator_1 = require("express-validator");
const express_1 = require("express");
const router = (0, express_1.Router)();
const RegistrationInput = () => {
    (0, express_validator_1.body)('login').isLength({ min: 3, max: 200 });
    (0, express_validator_1.body)('email').isEmail();
    (0, express_validator_1.body)('password').isStrongPassword({ minLength: 7, minLowercase: 2, minSymbols: 1 });
};
const CatchValidationErrors = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};
router.post('/auth', RegistrationInput, CatchValidationErrors, user_controller_1.default.registration);
module.exports = router;
