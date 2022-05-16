<template>
  <div class="login">
    <div class="loginBox">
      <el-form ref="loginForm" :model="loginForm" label-width="0px">
        <el-form-item label="" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="" v-if="!loginFlag" prop="invitationCode">
          <el-input
            v-model="loginForm.invitationCode"
            placeholder="请输入邀请码"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="register" class="loginBtn" v-if="loginFlag"
            >登录</el-button
          >
          <el-button @click="register" class="loginBtn" v-else>注册</el-button>

          <p class="tip" @click="toggleLogin" v-if="loginFlag">去注册</p>
          <p class="tip" @click="toggleLogin" v-else>
            已有账号，去登录
          </p></el-form-item
        >
      </el-form>
    </div>
  </div>
</template>
<script>
import { register, login } from "@/api/api";
import local from "../utils/local";
export default {
  name: "login",
  data() {
    return {
      loginImg: require("../assets/login.png"),
      loginForm: {
        username: "",
        password: "",
        invitationCode: "",
      },
      loginFlag: true,
    };
  },
  methods: {
    register() {
      let params = {
        username: this.loginForm.username,
        password: this.loginForm.password,
      };
      if (this.loginFlag) {
        login(params).then((res) => {
          let { code } = res;
          if (code == 200) {
            let { data } = res;
            this.$refs.loginForm.resetFields();
            local.saveLocal("token", JSON.parse(data).token);
            this.$router.push("home");
          }
        });
      } else {
        params.invitationCode = this.loginForm.invitationCode;
        register(params)
          .then((res) => {
            let { code } = res;
            if (code == 200) {
              this.$message.success("注册成功");
              this.$refs.loginForm.resetFields();
              this.loginFlag = true;
            }
          })
          .catch((error) => {
            let { msg } = error;
            this.$message.error(msg);
          });
      }
    },
    toggleLogin() {
      this.loginFlag = !this.loginFlag;
    },
  },
};
</script>

<style scoped lang="less">
.login {
  height: 100vh;
  background: url("../assets/login.png") no-repeat center center fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  .loginBox {
    border: 1px solid #337fff;
    border-radius: 10px;
    padding: 20px;
    background-color: rgba(0, 0, 160, 0.1);
    width: 440px;
    ::v-deep.el-input__inner {
      height: 66px;
      background-color: transparent;
      color: #fff;
    }
    .loginBtn {
      margin-top: 16px;
      width: 100%;
      height: 66px;
      background-color: #337fff;
      color: #fff;
      border: none;
      font-size: 20px;
      letter-spacing: 4px;
    }
    .tip {
      text-align: right;
      color: #fff;
      margin-top: 10px;
      cursor: pointer;
    }
  }
}
</style>
