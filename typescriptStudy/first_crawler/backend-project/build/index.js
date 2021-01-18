"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_session_1 = __importDefault(require("cookie-session"));
var router_1 = __importDefault(require("./router"));
require("./controller/LoginController");
require("./controller/CrowllerController");
// 问题一：express库的类型定义文件 .d.ts文件类型描述不准确
// 可以继承原有的.d.ts文件，定义类型，进行修改
// 问题二：当使用中间件的时候，对req或则res做了修改，实际上类型并不能改变
// 类型融合方法
var app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(cookie_session_1.default({
    name: "session",
    keys: ["teacher dell"],
    maxAge: 24 * 60 * 60 * 1000,
}));
app.use(router_1.default);
app.listen(7001, function () {
    console.log("server is running");
});
