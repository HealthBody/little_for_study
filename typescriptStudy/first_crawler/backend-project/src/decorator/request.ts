import "reflect-metadata";
import { CrowllerController, LoginController } from "../controller/index";

export enum Method {
  get = "get",
  post = "post",
}

function getRequestDecorator(type: Method) {
  return function (path: string) {
    return function (
      target: CrowllerController | LoginController,
      key: string
    ) {
      Reflect.defineMetadata("path", path, target, key);
      Reflect.defineMetadata("method", type, target, key);
    };
  };
}

export const get = getRequestDecorator(Method.get);
export const post = getRequestDecorator(Method.post);
