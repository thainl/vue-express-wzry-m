<template>
    <div class="login-page">
        <div class="login-container">
            <el-card header="请先登录" class="login-card">
                <el-form
                    @submit.native.prevent="login"
                    ref="ruleForm"
                    :rules="rules"
                    :model="model"
                >
                    <el-form-item
                        label="用户名"
                        prop="name"
                        :error="nameErrorTip"
                    >
                        <el-input v-model="model.name"></el-input>
                    </el-form-item>
                    <el-form-item
                        label="密码"
                        prop="password"
                        :error="pwdErrorTip"
                    >
                        <el-input
                            show-password
                            v-model="model.password"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            class="w-100"
                            native-type="submit"
                            type="primary"
                            :loading="isLoading"
                            >登录</el-button
                        >
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script>
import { adminUserLogin } from "@/libs/api.js";
import { encryptWithMD5 } from "@/libs/utils.js";

export default {
    name: "Login",
    data() {
        return {
            model: {
                name: "user1",
                password: "123456",
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "用户名不能为空",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "密码不能为空",
                        trigger: "blur",
                    },
                    {
                        min: 6,
                        max: 16,
                        message: "密码长度为6~16位",
                        trigger: "blur",
                    },
                ],
            },
            nameErrorTip: "",
            pwdErrorTip: "",
            isLoading: false,
        };
    },
    methods: {
        login() {
            this.isLoading = true;
            this.nameErrorTip = "";
            this.pwdErrorTip = "";
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    this._pwd = this.model.password;
                    this.setPwd(encryptWithMD5(this.model.password));
                    const res = await adminUserLogin(this.model);
                    if (res.data.error === 1) {
                        this.nameErrorTip = res.data.msg;
                        this.setPwd(this._pwd);
                        this.isLoading = false;
                        return;
                    } else if (res.data.error === 2) {
                        this.pwdErrorTip = res.data.msg;
                        this.setPwd(this._pwd);
                        this.isLoading = false;
                        return;
                    } else if (res.data.token) {
                        sessionStorage.setItem("token", res.data.token);
                        this.$router.push("/");
                        this.$message({
                            type: "success",
                            message: "登录成功",
                        });
                    }
                    this.isLoading = false;
                } else {
                    this._pwd && this.setPwd(this._pwd);
                    return false;
                }
            });
        },
        setPwd(pwd) {
            this.model.password = pwd;
        },
    },
};
</script>

<style>
.login-card {
    width: 25rem;
    margin: 12rem auto;
}
</style>
