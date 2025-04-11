"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../enums/enums");
const userSchema = new mongoose_1.default.Schema({
    name: String,
    email: String,
    password: String,
    languages: {
        type: [String],
        enum: enums_1.LanguagesEnum,
        default: [],
        required: true,
    },
    interests: {
        type: [String],
        enum: enums_1.InterestsEnum,
        default: [],
        required: true,
    },
});
const userModel = mongoose_1.default.model("Users", userSchema);
exports.default = userModel;
