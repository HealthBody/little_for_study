<template>
  <div>
    <s-form :model="model" :rules="rules" ref="loginForm">
      <s-form-item label="用户名" prop="username">
        <s-input v-model="model.username"></s-input>
      </s-form-item>
      <s-form-item label="密码" prop="password">
        <s-input v-model="model.password" type="password"></s-input>
      </s-form-item>
      <s-form-item>
        <button @click='onLogin'>登录</button>
      </s-form-item>
    </s-form>
  </div>
</template>
<script>
import SInput from "./SInput";
import SFormItem from "./SFormitem";
import SForm from "./SForm";

export default {
  name: "index",
  components: {
    SInput,
    SFormItem,
    SForm
  },
  data() {
    return {
      model: {
        username: "tom",
        password: ""
      },
      rules: {
        username: [{ required: true, message: "用户名必填"//, validator: (rule, value)=> value === 'tom'
        }],
        password: [{ required: true, message: "密码必填" }]
      }
    };
  },
  methods: {
    onLogin() {
      this.$refs.loginForm.validate(isValid => {
        if(isValid) {
          alert('登录')
        }else {
          alert('有错')
        }
      })
    }
  }
};
</script>
<style scoped>
</style>