<template>
    <div class="category-edit">
        <h2>{{ _id ? "编辑" : "新建" }}分类</h2>
        <el-form
            @submit.native.prevent="save"
            ref="ruleForm"
            :rules="rules"
            :model="model"
            label-width="120px"
        >
            <el-form-item label="上级分类">
                <el-select v-model="model.parent" placeholder="请选择父级分类">
                    <el-option selected label="__无__" :value="null"></el-option>
                    <el-option
                        v-for="item in parents"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name" :error="nameErrorTip">
                <el-input
                    placeholder="输入分类名称"
                    v-model="model.name"
                ></el-input>
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
    name: "CategoryEdit",
    props: {
        id: String,
    },
    data() {
        return {
            model: {
                parent: null
            },
            parents: [],
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入名称",
                        trigger: "blur",
                    },
                ],
            },
            nameErrorTip: ''
        };
    },
    computed: {
        _id() {
            if (this.$route.path == "/rest/categories/create") {
                return undefined;
            } else {
                return this.id;
            }
        },
    },
    methods: {
        save() {
            this.nameErrorTip = '';
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    let res;
                    if (this._id) {
                        res = await this.$http.put(
                            "/rest/categories/" + this._id,
                            this.model
                        );
                    } else {
                        res = await this.$http.post("/rest/categories", this.model);
                    }
                    if (res.status === 200) {
                        if(res.data.errno === 1) { // 用户名已存在
                            this.nameErrorTip = res.data.msg;
                            return;
                        }else {
                            this.$message({
                            type: "success",
                            message: this._id ? "修改成功" : "新建成功",
                        });
                        this.$router.push("/categories/list");
                        }
                        
                    }
                } else {
                    return false;
                }
            });
            
        },
        async fetch() {
            const res = await this.$http.get("/rest/categories/" + this._id);
            if (res.status === 200) {
                this.model = res.data;
            }
        },
        async fetchParents() {
            const res = await this.$http.get("/rest/categories");
            if (res.status === 200) {
                this.parents = res.data;
            }
        },
    },
    created() {
        this._id && this.fetch();
        this.fetchParents();
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.$refs.ruleForm.clearValidate(); // 清除表单验证错误
            if (
                to.path == "/categories/create" &&
                from.path == "/categories/edit/" + from.params.id
            ) {
                vm.model = {};
            }
        });
    },
};
</script>

<style scoped>
</style>