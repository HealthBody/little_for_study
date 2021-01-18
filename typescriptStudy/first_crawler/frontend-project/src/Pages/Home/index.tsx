import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import ReactEcharts from "echarts-for-react";
import { Button, message } from "antd";
import request from "../../request";
import "./style.css";
import moment from "moment";
import { EChartOption } from "echarts";

interface State {
  isLogin: boolean;
  loaded: boolean;
  data: responseResult.DataStructor;
}

// interface LineData {
//   name: string;
//   type: string;
//   data: number[];
// }

class Home extends Component {
  state: State = {
    loaded: true,
    isLogin: true,
    data: {},
  };

  componentDidMount() {
    request.get("/api/isLogin").then((res) => {
      const data: boolean = res.data;
      if (!data) {
        this.setState({
          isLogin: false,
          loaded: true,
        });
      } else {
        this.setState({
          loaded: true,
        });
      }
    });
    request.get("/api/showData").then((res) => {
      const data: responseResult.showData = res.data;
      if (data) {
        this.setState({
          data: data,
        });
      }
    });
  }

  handelLogoutClick = () => {
    request.get("/api/logout").then((res) => {
      const data: responseResult.DataStructor = res.data;
      if (data) {
        this.setState({
          isLogin: false,
        });
      } else {
        message.error("退出失败");
      }
    });
  };

  handelCrowlerClick = () => {
    request.get("/api/getData").then((res) => {
      const data: responseResult.getData = res.data;
      if (data) {
        message.success("爬取成功");
      } else {
        message.error("爬取失败");
      }
    });
  };

  handelShowClick = () => {
    request.get("/api/showData").then((res) => {
      console.log(res);
    });
  };
  getOption: () => echarts.EChartOption = () => {
    const { data } = this.state;
    const courseNames: string[] = [];
    const times: string[] = [];
    const tempData: {
      [key: string]: number[];
    } = {};
    for (let i in data) {
      const item = data[i];
      times.push(moment(Number(i)).format("MM-DD HH:mm"));
      item.forEach((innerItem) => {
        const { title, count } = innerItem;
        if (courseNames.indexOf(title) === -1) {
          courseNames.push(title);
        }
        tempData[title] ? tempData[title].push(count) : (tempData[title] = []);
      });
    }

    const result: EChartOption.Series[] = [];
    for (let i in tempData) {
      result.push({
        name: i,
        type: "line",
        data: tempData[i],
      });
    }

    return {
      title: {
        text: "课程在线学习人数",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: courseNames,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: times,
      },
      yAxis: {
        type: "value",
      },
      series: result,
    };
  };

  render() {
    const { isLogin, loaded } = this.state;
    if (isLogin) {
      if (loaded) {
        return (
          <div className="home-page">
            <div className="buttons">
              <Button
                type="primary"
                style={{ marginRight: "3px" }}
                onClick={this.handelCrowlerClick}
              >
                爬取
              </Button>
              <Button type="primary" onClick={this.handelShowClick}>
                展示
              </Button>
              <Button type="primary" onClick={this.handelLogoutClick}>
                退出
              </Button>
            </div>
            <ReactEcharts option={this.getOption()} />
          </div>
        );
      }
    }
    return <Redirect to="/login"></Redirect>;
  }
}

export default Home;
