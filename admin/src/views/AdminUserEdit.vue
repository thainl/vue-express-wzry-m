<template>
    <div class="admin-user-edit">
        <h2>{{ _id ? "编辑" : "新建" }}管理员</h2>
        <el-form
            @submit.native.prevent="save"
            ref="ruleForm"
            :model="model"
            :rules="rules"
            label-width="120px"
        >
            <el-form-item label="用户名" prop="name" :error="nameErrorTip">
                <el-input
                    placeholder="输入用户名"
                    v-model="model.name"
                ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input :placeholder=" _id ? '输入新密码' : '输入密码' " v-model="model.password" show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">{{
                    _id ? "保存" : "新建"
                }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "AdminUserEdit",
    props: {
        id: String,
    },
    data() {
        return {
            model: {},
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
        };
    },
    computed: {
        _id() {
            if (this.$route.path == "/rest/admin_users/create") {
                return undefined;
            } else {
                return this.id;
            }
        },
    },
    methods: {
        save() {
            this.nameErrorTip = "";
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    let res;
                    if (this._id) {
                        res = await this.$http.put(
                            "/rest/admin_users/" + this._id,
                            this.model
                        );
                    } else {
                        res = await this.$http.post(
                            "/rest/admin_users",
                            this.model
                        );
                    }
                    if (res.status === 200) {
                        if (res.data.errno === 1) {
                            // 用户名已存在
                            this.nameErrorTip = res.data.msg;
                            return;
                        } else {
                            this.$message({
                                type: "success",
                                message: this._id ? "修改成功" : "新建成功",
                            });
                            this.$router.push("/admin_users/list");
                        }
                    }
                } else {
                    return false;
                }
            });
        },
        async fetch() {
            const res = await this.$http.get("/rest/admin_users/" + this._id);
            if (res.status === 200) {
                this.model = res.data;
            }
        },
    },
    created() {
        this._id && this.fetch();
    }
};
</script>

<style>
</style>