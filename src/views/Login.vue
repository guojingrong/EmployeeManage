<style>
.main {
  text-align: center; /*让div内部文字居中*/
  background-color: #fff;
  border-radius: 20px;
  width: 400px;
  height: 350px;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 100px;
}
</style>
<template>
  <div class="main">
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
      <FormItem prop="userName" label="UserName：">
        <Input v-model="form.userName" placeholder="请输入..." style="width: 300px">
          <Icon type="ios-person" slot="prefix" size="24"/>
        </Input>
      </FormItem>
      <FormItem prop="passWord" label="PassWord：">
        <Input type="password" v-model="form.passWord" placeholder="请输入..." style="width: 300px">
          <Icon type="ios-key" slot="prefix" size="20"/>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">登录</Button>&nbsp;&nbsp;
        <Button type="primary">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "LoginWin",
  data() {
    return {
      form: {
        userName: "",
        passWord: ""
      },
      rules: {
        userName: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        passWord: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          //ajax to do
          //   this.$config.url.local
          axios
            .post(this.$config.url.local + "/account/login", {
              account: this.form.userName,
              pass: this.form.passWord
            })
            .then(res => {
              if (res.data.code == 200) {
                console.log(res.data.data);
                sessionStorage.setItem("account", res.data.data.name);
                this.$router.push({ path: "/home" });
              } else if (res.data.code == 103) {
                this.$Message.warning(res.data.msg);
              } else {
                this.$Notice.error({
                  title:"错误提示",
                  desc:"用户名或是密码不正确！"
                });
              }
            });
        }
      });
    }
  }
};
</script>
