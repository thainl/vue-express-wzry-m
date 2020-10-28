<template>
    <div class="category-edit">
        <h2>{{ _id ? "编辑" : "新建" }}后台权限</h2>
        <el-form
            @submit.native.prevent="save"
            ref="ruleForm"
            :rules="rules"
            :model="model"
            label-width="120px"
        >
            <el-form-item label="url" prop="url" :error="nameErrorTip">
                <el-select filterable v-model="model.url" class="el-select-block" placeholder="选择API地址">
                    <el-option
                        v-for="(item) of apiUrls"
                        :key="item._id"
                        :label="item.path + '  ' + item.description"
                        :value="item._id"
                    >
                    <span>{{item.path}}</span>
                    <span style="float: right">{{item.description}}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="接口方法" prop="method">
                <el-select v-model="model.method" class="el-select-block" placeholder="选择接口方法">
                    <el-option
                        v-for="(val, key, i) in apiMethods"
                        :key="'mds'+i"
                        :label="key"
                        :value="val"
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
    name: "ServerRightEdit",
    props: {
        id: String,
    },
    data() {
        return {
            apiMethods: {'查看 GET':'GET', '新增 POST': 'POST','修改 PUT':'PUT', '删除 DELETE': 'DELETE'},
            methodType: {
                POST: 'success',
                PUT: 'warning',
                DELETE: 'danger'
            },
            apiUrls: [],
            model: {
            },
            rules: {
                url: [
                    {
                        required: true,
                        message: "url不能为空",
                        trigger: "blur",
                    },
                ],
                method: [
                    {
                        required: true,
                        message: "至少选择一种方法",
                        trigger: "blur",
                    } 
                ],
            },
            nameErrorTip: ''
        };
    },
    computed: {
        _id() {
            if (this.$route.path == "/server_rights/create") {
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
                            "/rest/server_rights/" + this._id,
                            this.model
                        );
                    } else {
                        res = await this.$http.post("/rest/server_rights", this.model);
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
                        this.$router.push("/server_rights/list");
                        }
                        
                    }
                } else {
                    return false;
                }
            });
            
        },
        async fetch() {
            const res = await this.$http.get("/rest/server_rights/" + this._id);
            if (res.status === 200) {
                this.model = res.data;
            }
        },
        async fetchApiUrl() {
            const res = await this.$http.get('/rest/api_urls');
            this.apiUrls = res.data.items;
        }
    },
    created() {
        this._id && this.fetch();
        this.fetchApiUrl();
    },
};
</script>

<style>
</style>