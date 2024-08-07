"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const boardSchema = new mongoose_1.default.Schema({
    userid: {
        type: String,
        required: true
    },
    boardMembers: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});
exports.boardModel = mongoose_1.default.model("boards", boardSchema);
