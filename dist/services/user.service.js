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
exports.UserService = void 0;
const request_validation_1 = require("../utils/request-validation");
const user_schema_1 = require("../types/request/user.schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const response_1 = require("../utils/response");
class UserService {
    constructor() {
        this.SALT_ROUNDS = 10;
    }
    createUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, request_validation_1.validateRequestData)(req.body, user_schema_1.createUserSchema);
            const { name, email, password, interests, languages } = req.body;
            const existingUser = yield user_model_1.default.find({ email: email }).exec();
            if (existingUser.length > 0) {
                return (0, response_1.buildBadRequestResponse)("User with existing email is found. Failed to create duplicate user");
            }
            let createdUser = null;
            bcrypt_1.default.genSalt(this.SALT_ROUNDS, (err, salt) => {
                if (err) {
                    console.error("Failed to generate salt");
                    return;
                }
                bcrypt_1.default.hash(password, salt, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.error("Failed to hash password");
                        return;
                    }
                    console.log("Hashed password:", hash);
                    createdUser = yield user_model_1.default.create(Object.assign(Object.assign({}, req.body), { password: hash }));
                    return (0, response_1.buildSuccessRes)("User is successfully created", Object.assign(Object.assign({}, req.body), { password: hash }));
                }));
            });
        });
    }
    login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, request_validation_1.validateRequestData)(req.body, user_schema_1.loginSchema);
            // Very simple login
            // No Auth
            const { email, password } = req.body;
            const existingUser = yield user_model_1.default.findOne({ email: email }).exec();
            if (!(existingUser === null || existingUser === void 0 ? void 0 : existingUser.id)) {
                return (0, response_1.buildBadRequestResponse)("No existing user is found. Failed to login");
            }
            bcrypt_1.default.compare(password, existingUser === null || existingUser === void 0 ? void 0 : existingUser.password, (err, result) => {
                if (err) {
                    // Handle error
                    console.error("Error comparing passwords:", err);
                    return;
                }
                if (result) {
                    console.log("Passwords match! User authenticated.");
                    return (0, response_1.buildSuccessRes)("Login successful!", existingUser);
                }
                else {
                    console.log("Passwords do not match! Authentication failed.");
                    return (0, response_1.buildUnauthenticatedResponse)("Incorrect password/email");
                }
            });
        });
    }
}
exports.UserService = UserService;
