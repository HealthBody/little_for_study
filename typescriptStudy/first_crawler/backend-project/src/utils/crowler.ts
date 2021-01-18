// ts不能够直接引用js  必须 ts -> .d.ts -> js
import fs from "fs";
import path from "path";
import superagent from "superagent";

export  interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crowler {
  private filePath = path.resolve(__dirname, "../../data/course.json");

  constructor(private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess();
  }

  private async initSpiderProcess() {
    const html = await this.getRawHtml();
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }

  private async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }

  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }
}

export default Crowler

// const secret = "x3b174jsx";
// const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;

// const analyzer = new DellAnalyzer();
// const analyzer = DellAnalyzer.getInstance()
// new Crowler(url, analyzer);

console.log('修改之后');


