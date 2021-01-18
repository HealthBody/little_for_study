import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import router from "./router";
import "./controller/LoginController";
import "./controller/CrowllerController";

// 问题一：express库的类型定义文件 .d.ts文件类型描述不准确
// 可以继承原有的.d.ts文件，定义类型，进行修改
// 问题二：当使用中间件的时候，对req或则res做了修改，实际上类型并不能改变
// 类型融合方法

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cookieSession({
    name: "session",
    keys: ["teacher dell"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(router);

app.listen(7001, () => {
  console.log("server is running");
});
