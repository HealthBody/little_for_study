import React, { Component } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import request from '../../request'
import qs from "qs";
import "./style.css";
import { Store } from "antd/lib/form/interface";
import { Redirect } from "react-router-dom";

class NormalLoginForm extends Component {
  state = {
    isLogin: false,
  };
  onFinish = (values: Store) => {
    request
      .post(
        "/api/login",
        qs.stringify({
          password: values.password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        const data:responseResult.Login = res.data
        if (data) {
          this.setState({ isLogin: true });
        } else{
          message.error('登录失败')
        }
      });
  };

  render() {
    const { isLogin } = this.state;
    if (isLogin) {
      return <Redirect to="/"></Redirect>;
    } else {
      return (
        <div className="login-page">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "请输入登录密码",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      );
    }
  }
}
export default NormalLoginForm;
