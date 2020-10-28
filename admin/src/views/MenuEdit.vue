<template>
    <div class="menu-edit">
        <h2>{{ _id ? "编辑" : "新建" }}菜单</h2>
        <el-form
            @submit.native.prevent="save"
            ref="ruleForm"
            :rules="rules"
            :model="model"
            label-width="120px"
        >
            <el-form-item label="上级菜单">
                <el-tooltip style="margin: 4px" effect="dark" content="一级为分类，二级为分组，三级才是真正的菜单" placement="top-start">
                    <el-select filterable v-model="model.parent" placeholder="请选择父级菜单">
                        <el-option selected label="__无__" :value="null"></el-option>
                        <el-option
                            v-for="item in parentMenus"
                            :key="item._id"
                            :label="item.name"
                            :value="item._id"
                        >
                        </el-option>
                    </el-select>
                </el-tooltip>
                
            </el-form-item>
            <el-form-item label="名称" prop="name" :error="nameErrorTip">
                <el-input
                    placeholder="输入菜单名称"
                    v-model="model.name"
                ></el-input>
            </el-form-item>
            <div class="d-flex">
                <el-form-item label="图标">
                    <el-select clearable filterable v-model="model.icon" placeholder="选择图标(可选)">
                        <el-option
                            v-for="item in iconArr"
                            :key="item"
                            :label="item"
                            :value="item"
                        >
                            <i class="menu-icon" :class="item"></i><span>{{item}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-tooltip class="item" effect="dark" content="是否在左侧菜单列表显示" placement="top-start">
                        <el-switch
                            v-model="model.isShow"
                            active-color="#409eff"
                            inactive-color="#dcdfe6">
                        </el-switch>
                    </el-tooltip>
                </el-form-item>
            </div>
            <el-form-item label="描述">
                <el-input type="textarea" v-permission="{action: _id ? 'put' : 'post', effect: 'disabled'}"  v-model="model.description"></el-input>
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
import iconArr from '@/assets/js/iconArr';
export default {
    name: "MenuEdit",
    props: {
        id: String,
    },
    data() {
        return {
            iconArr,
            model: {
                parent: null,
                isShow: true,
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
            if (this.$route.path == "/menus/create") {
                return undefined;
            } else {
                return this.id;
            }
        },
        parentMenus() {
            return this.parents.filter( m => {
                if(!m.parent || m.parent && !m.parent.parent) {
                    return m;
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
                            "/rest/menus/" + this._id,
                            this.model
                        );
                    } else {
                        res = await this.$http.post("/rest/menus", this.model);
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
                        this.$router.push("/menus/list");
                        }
                        
                    }
                } else {
                    return false;
                }
            });
            
        },
        async fetch() {
            const res = await this.$http.get("/rest/menus/" + this._id);
            if (res.status === 200) {
                this.model = res.data;
            }
        },
        async fetchParents() {
            const res = await this.$http.get("/rest/menus/selectlist");
            if (res.status === 200) {
                this.parents = res.data;
            }
        },
    },
    created() {
        this._id && this.fetch();
        this.fetchParents();
    },
};
</script>

<style>
.menu-icon{
    font-size: 16px;
    vertical-align: -2px;
    margin-right: 8px;
}
</style>