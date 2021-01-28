"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const controller_1 = __importDefault(require("./controller"));
const routes = express_1.default.Router();
//host output folder files
routes.use('/output', express_1.default.static(path_1.default.resolve(__dirname, '..', 'output')));
routes.get('/list', controller_1.default.listFiles);
routes.get('/', controller_1.default.welcome);
routes.post('/', controller_1.default.downloadMusic);
exports.default = routes;
