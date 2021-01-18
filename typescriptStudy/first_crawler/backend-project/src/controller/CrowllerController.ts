import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { controller, use, get } from "../decorator/index";
import { getResponseData } from "../utils/util";
import Crowler from "../utils/crowler";
import Analyzer from "../utils/Analyzer";

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const checkLogin = (
  req: BodyRequest,
  res: Response,
  next: NextFunction
): void => {
  console.log("checklogin");
  const isLogin = !!(req.session ? req.session.login : false);
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, "请先登录"));
  }
};
// const test = (req: BodyRequest, res: Response, next: NextFunction): void => {
//   console.log("test");
// };

@controller("/api")
export class CrowllerController {
  @get("/getData")
  // @use(test)
  @use(checkLogin)
  getData(req: BodyRequest, res: Response): void {
    const secret = "x3b174jsx";
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = Analyzer.getInstance();
    new Crowler(url, analyzer);
    res.json(getResponseData<responseResult.getData>(true));
  }

  @get("/showData")
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, "../../data/course.json");
      const result = fs.readFileSync(position, "utf-8");
      res.json(getResponseData<responseResult.showData>(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData<boolean>(false, "数据不存在"));
    }
  }
}
