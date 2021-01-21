<template>
    <div class="admin-user-edit">
        <h2>{{ _id ? "编辑" : "新建" }}管理员</h2>
        <el-form
            @submit.native.prevent="save"
            ref="ruleForm"
            :model="model"
            :rules="rules"
            label-width="120px"
            v-loading="isFetching"
            element-loading-text="Loading..."
        >
            <el-form-item label="用户名" prop="name" :error="nameErrorTip">
                <el-input
                    placeholder="输入用户名"
                    v-model="model.name"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="密码"
                prop="password"
                :rules="[
                    { required: _id ? false : true, message: '密码不能为空' },
                    {
                        min: 6,
                        max: 16,
                        message: '密码长度为6~16位',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input
                    :placeholder="_id ? '修改密码请输入新密码' : '输入密码'"
                    v-model="model.password"
                    show-password
                ></el-input>
            </el-form-item>
            <el-form-item
                label="角色"
                prop="role"
                :rules="[
                    { required: true, message: '请选择角色', trigger: 'blur' },
                ]"
            >
                <el-select
                    v-model="model.role"
                    class="el-select-block"
                    placeholder="选择角色"
                >
                    <el-option
                        v-for="item in roles"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    v-permission="{
                        action: _id ? 'put' : 'post',
                        effect: 'disabled',
                    }"
                    native-type="submit"
                    >{{ _id ? "保存" : "新建" }}</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import editPageMixin from "@/libs/editPageMixin.js";
import { getResourceSimpleList, updateResourceItem, createResourceItem } from "@/libs/api.js";
import { encryptWithMD5 } from "@/libs/utils.js";

export default {
    name: "AdminUserEdit",
    mixins: [editPageMixin],
    data() {
        return {
            roles: [],
            model: {},
            rules: {
                name: [
                    {
                        required: true,
                        message: "用户名不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        save() {
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    this._pwd = this.model.password; // 暂存加密前的密码，方便出错恢复
                    this.setPwd(encryptWithMD5(this.model.password)); // 密码加密传输
                    let res;
                    if (this._id) {
                        res = await updateResourceItem(
                            this.modelName,
                            this._id,
                            this.model
                        );
                    } else {
                        res = await createResourceItem(
                            this.modelName,
                            this.model
                        );
                    }
                    if (res.status === 200) {
                        if (res.data.errno === 1) {
                            // 用户名已存在
                            this.nameErrorTip = res.data.msg;
                            this.setPwd(this._pwd);
                            return;
                        } else {
                            this.$message({
                                type: "success",
                                message: this._id ? "修改成功" : "新建成功",
                            });
                            this.$router.push("/" + this.modelName + "/list");
                        }
                    }
                } else {
                    this._pwd && this.setPwd(this._pwd);
                    this.$message({
                        type: "error",
                        message: "表单存在错误，请检查",
                        offset: 220,
                    });
                    return false;
                }
            });
        },
        setPwd(pwd) {
            this.model.password = pwd;
        },
        async fetchRoles() {
            const res = await getResourceSimpleList("roles");
            this.roles = res.data;
        },
    },
    created() {
        this.fetchRoles();
    },
};
</script>