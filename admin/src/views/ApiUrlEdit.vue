<template>
    <div class="api-url-edit">
        <h2>{{ _id ? "编辑" : "新建" }}API接口</h2>
        <el-form
            @submit.native.prevent="save"
            ref="ruleForm"
            :rules="rules"
            :model="model"
            label-width="120px"
        >
            <el-form-item label="path" prop="path" :error="nameErrorTip">
                <el-input
                    placeholder="输入api接口地址, 前缀/admin/api不用填"
                    v-model="model.path"
                ></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="category">
                <el-select
                    v-model="model.category"
                    filterable
                    placeholder="选择接口所对应的模型"
                >
                    <el-option
                        v-for="item in ApiCategories"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" v-model="model.description"></el-input>
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
    name: "ApiUrlEdit",
    props: {
        id: String,
    },
    data() {
        return {
            categories: [],
            model: {
            },
            rules: {
                path: [
                    {
                        required: true,
                        message: "path不能为空",
                        trigger: "blur",
                    },
                ],
                category: [
                    {
                        required: true,
                        message: '必须要选分类',
                        trigger: 'blur'
                    }
                ]
            },
            nameErrorTip: ''
        };
    },
    computed: {
        _id() {
            if (this.$route.path == "/api_urls/create") {
                return undefined;
            } else {
                return this.id;
            }
        },
        ApiCategories() {
            return this.categories.filter(cate => {
                if(cate.parent)
                    return cate.parent.name == 'API接口分类';
            })
        }
    },
    methods: {
        save() {
            this.nameErrorTip = '';
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    let res;
                    if (this._id) {
                        res = await this.$http.put(
                            "/rest/api_urls/" + this._id,
                            this.model
                        );
                    } else {
                        res = await this.$http.post("/rest/api_urls", this.model);
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
                        this.$router.push("/api_urls/list");
                        }
                        
                    }
                } else {
                    return false;
                }
            });
            
        },
        async fetch() {
            const res = await this.$http.get("/rest/api_urls/" + this._id);
            if (res.status === 200) {
                this.model = res.data;
            }
        },
        async fetchCategories() {
            const res = await this.$http.get('/rest/categories');
            this.categories = res.data.items;
        }
    },
    created() {
        this._id && this.fetch();
        this.fetchCategories();
    },
};
</script>

<style>
</style>