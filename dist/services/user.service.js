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
const mongodb_1 = require("mongodb");
class UserService {
    constructor() {
        this.SALT_ROUNDS = 10;
        this.DEFAULT_PROFILE_PIC = "https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere.png";
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
                    createdUser = yield user_model_1.default.create(Object.assign(Object.assign({}, req.body), { imageUrl: this.DEFAULT_PROFILE_PIC, password: hash }));
                    console.log("user is created: ", Object.assign(Object.assign({}, req.body), { imageUrl: this.DEFAULT_PROFILE_PIC, password: hash }));
                    return (0, response_1.buildSuccessRes)("User is successfully created", Object.assign(Object.assign({}, req.body), { imageUrl: this.DEFAULT_PROFILE_PIC, password: hash }));
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
            const existingUser = yield user_model_1.default.findOne({ email: email });
            if (!(existingUser === null || existingUser === void 0 ? void 0 : existingUser._id)) {
                return (0, response_1.buildBadRequestResponse)("No existing user is found. Failed to login");
            }
            const isMatch = yield bcrypt_1.default.compare(password, existingUser.password);
            if (isMatch) {
                console.log("Passwords match! User authenticated.");
                const connectionIds = existingUser.connections.map((connection) => new mongodb_1.ObjectId(connection));
                const userDto = Object.assign(Object.assign({}, existingUser["_doc"]), { connections: [] });
                const users = yield user_model_1.default.find({
                    _id: { $in: connectionIds },
                });
                userDto.connections = users;
                return (0, response_1.buildSuccessRes)("Login successful!", userDto);
            }
            else {
                console.log("Passwords do not match! Authentication failed.");
                return (0, response_1.buildUnauthenticatedResponse)("Incorrect password/email");
            }
        });
    }
    getAllUsersExceptCurrent(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const users = yield user_model_1.default.find({
                _id: { $nin: [new mongodb_1.ObjectId(id)] },
            });
            return (0, response_1.buildSuccessRes)("Users successfully fetched", users);
        });
    }
    connectWithUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { originalId, connectWithId } = req.query;
            const originalUser = yield user_model_1.default.findOne({ id: originalId });
            const userToConnect = yield user_model_1.default.findOne({ id: connectWithId });
            if (!originalUser || !userToConnect) {
                return (0, response_1.buildBadRequestResponse)("User with OriginalId/ConnectwithId can't be found.");
            }
            const originalUserData = Object.assign({}, originalUser["_doc"]);
            const connectWithUserData = Object.assign({}, userToConnect["_doc"]);
            originalUserData.connections.push(new mongodb_1.ObjectId(connectWithId));
            connectWithUserData.connections.push(new mongodb_1.ObjectId(connectWithId));
            yield user_model_1.default.updateOne({ id: originalId }, originalUserData);
            yield user_model_1.default.updateOne({ id: connectWithId }, connectWithUserData);
        });
    }
}
exports.UserService = UserService;
