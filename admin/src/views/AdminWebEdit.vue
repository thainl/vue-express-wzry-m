<template>
    <div class="admin-web-edit">
        <h2>{{ _id ? "编辑" : "新建" }}后台页面</h2>
        <el-form
            @submit.native.prevent="save"
            ref="ruleForm"
            :rules="rules"
            :model="model"
            label-width="120px"
        >
            <el-form-item label="名称" prop="name" :error="nameErrorTip">
                <el-input v-model="model.name" placeholder="以 页面 两个字结尾"></el-input>
            </el-form-item>
            <el-form-item label="path" prop="path">
                <el-input
                    placeholder="输入页面地址"
                    v-model="model.path"
                ></el-input>
            </el-form-item>
            <el-form-item label="所属菜单" prop="menu">
                <el-select clearable v-model="model.menu" class="el-select-block" placeholder="一个菜单对应一个页面">
                    <el-option
                        v-for="(item, i) of menuList"
                        :key="'meni'+i"
                        :label="item.name"
                        :value="item._id"
                        :disabled="item.disabled"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="页面权限" prop="rights">
                <el-tooltip class="item" effect="dark" content="在当前页面可以发起的操作：GET 为获取内容信息，POST为新增权限，PUT为修改权限，DELTET为删除权限，SEARCH为搜索权限" placement="top-start">
                    <el-select multiple v-model="model.rights" class="el-select-block" placeholder="选择权限">
                        <el-option
                            v-for="(val, key, i) in apiMethods"
                            :key="'mds'+i"
                            :label="key"
                            :value="val"
                        >
                        </el-option>
                    </el-select>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" v-model="model.description"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button v-permission="{action: _id ? 'put' : 'post', effect: 'disabled'}" type="primary" native-type="submit">{{
                    _id ? "保存" : "新建"
                }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "AdminWebEdit",
    props: {
        id: String,
    },
    data() {
        let pathValidator = (rule, val, cb) => {
            if(/[\s\S]+\/$/gi.test(val)) {
                cb(new Error('不需要 / 结尾'));
            }else if(! /^\/[\s\S]+/gi.test(val)) {
                cb(new Error('需要 / 开头'));
            }
            else {
                cb();
            }
        }
        let nameValidator = (rule, val, cb) => {
            if(! /[\s\S]+页面$/g.test(val)) {
                cb(new Error('需要以 页面 两个字结尾'))
            }else {
                cb();
            }
        }
        return {
            menus: [],
            apiMethods: {'查看 GET':'GET', '新增 POST': 'POST','修改 PUT':'PUT', '删除 DELETE': 'DELETE', '搜索 SEARCH': 'SEARCH'},
            model: {
            },
            rules: {
                path: [
                    {
                        required: true,
                        message: "path不能为空",
                        trigger: "blur",
                    },
                    {
                        validator: pathValidator,
                        trigger: 'blur'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "名称不为空",
                        trigger: "blur",
                    },
                    {
                        validator: nameValidator,
                        trigger: 'blur'
                    }
                ],
            },
            nameErrorTip: ''
        };
    },
    computed: {
        _id() {
            if (this.$route.path == "/admin_webs/create") {
                return undefined;
            } else {
                return this.id;
            }
        },
        menuList() {
            return this.menus.filter(m => {
                if(m.parent) {
                    if(m.parent.parent) {
                        if(m.page) {
                            // 标记已有页面的菜单
                            m.disabled = true
                        } 
                        return m; // 只返回菜单选项
                    }
                }
                
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
                            "/rest/admin_webs/" + this._id,
                            this.model
                        );
                    } else {
                        res = await this.$http.post("/rest/admin_webs", this.model);
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
                        this.$router.push("/admin_webs/list");
                        }
                        
                    }
                } else {
                    return false;
                }
            });
            
        },
        async fetch() {
            const res = await this.$http.get("/rest/admin_webs/" + this._id);
            if (res.status === 200) {
                this.model = res.data;
            }
        },
        async fetchMenus() {
            const res = await this.$http.get('/rest/menus');
            this.menus = res.data.items;
        }
    },
    created() {
        this._id && this.fetch();
        this.fetchMenus();
    },
};
</script>

<style>
</style>