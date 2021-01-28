"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseUrl = exports.port = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
exports.port = process.env.PORT || 3333;
exports.baseUrl = process.env.NODE_ENV === 'production' ? 'https://youtube-dl-node.herokuapp.com' : 'http://localhost';
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(routes_1.default);
app.listen(exports.port, () => console.log(`💻  Server is running at ${exports.baseUrl}:${exports.port}/`));
