declare namespace responseResult {
  interface CourseItem {
    title: string;
    count: number;
  }

  interface DataStructor {
    [key: string]: CourseItem[];
  }

  type islogin = boolean;
  type Login = boolean;
  type logout = boolean;
  type getData = boolean;
  type showData = boolean | DataStructor;
}
