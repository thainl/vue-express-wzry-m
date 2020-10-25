<template>
    <div class="role-edit">
        <h2>{{ _id ? "编辑" : "新建" }}角色</h2>
        <el-form
            @submit.native.prevent="save"
            ref="ruleForm"
            :rules="rules"
            :model="model"
            label-width="120px"
        >
            <el-form-item label="名称" prop="name" :error="nameErrorTip">
                <el-input v-model="model.name"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input
                    type="textarea"
                    v-model="model.description"
                ></el-input>
            </el-form-item>
            <el-form-item label="权限" prop="method">
                <el-select
                    multiple
                    v-model="model.rights"
                    class="el-select-block"
                    placeholder="选择权限"
                >
                    <el-option
                        v-for="item in serverRights"
                        :key="item._id"
                        :label="item.url.path + ' ' + item.method"
                        :value="item._id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-tree
                    :data="treeData"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="[1, 2]"
                    :default-checked-keys="defaultCheckedKeys"
                    class="right-tree"
                    @check="clickRight"
                >
                    <template v-slot="{ data }">
                        <span class="tree-item cate" v-if="data.category"><el-tag type="info">{{data.category}}</el-tag></span>
                        <span class="tree-item" v-else-if="data.method"><el-tag :type="methodType[data.method]" class="method">{{data.method}}</el-tag><span>{{data.description}}</span></span>
                        <span class="tree-item" v-else><el-tag type="info">{{data.path}}</el-tag><span>{{data.description}}</span></span>
                    </template>
                </el-tree>
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
    name: "RoleEdit",
    props: {
        id: String,
    },
    data() {
        return {
            serverRights: [],
            model: {
                rights: []
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "名称不能为空",
                        trigger: "blur",
                    },
                ],
            },
            nameErrorTip: "",
            defaultProps: {
                children: "children",
                label: "label",
            },
            methodType: {
                POST: "success",
                PUT: "warning",
                DELETE: "danger",
            },
        };
    },
    computed: {
        _id() {
            if (this.$route.path == "/roles/create") {
                return undefined;
            } else {
                return this.id;
            }
        },
        treeData() {
            let data = [];
            if (this.serverRights.length > 0) {
                let obj = {};
                let uniqueCate = this.serverRights.reduce((arr, item) => {
                    // 提取接口地址的分类
                    if (!obj[item.url.category.name]) {
                        obj[item.url.category.name] = true;
                        arr.push({
                            category: item.url.category.name,
                        });
                    }
                    return arr;
                }, []);
                let uniqueUrl = this.serverRights.reduce((arr, item) => {
                    // 提取同样的url地址
                    if(!obj[item.url.path]) {
                        obj[item.url.path] = true;
                        arr.push({
                            path: item.url.path,
                            description: item.url.description,
                            cate: item.url.category.name
                        })
                    }
                    return arr
                }, [])

                data = uniqueCate.map((cate, i) => {
                    let cateName = cate.category;
                    cate.label = cateName;
                    cate.id = i + 1;
                    cate.children = [];
                    uniqueUrl.map((u, j) => {
                        if(u.cate === cate.category) {
                            u.label = u.path + ' ' + u.description;
                            u.id = Number(cate.id + '000' + j) + 1;
                            u.children = [];
                            this.serverRights.forEach(v => {
                                if(v.url.path === u.path) {
                                    u.children.push(
                                        Object.assign({
                                            label: v.method + ' ' + v.description,
                                            id: v._id
                                        }, v)
                                    )
                                }
                            })
                            cate.children.push(u)
                        }
                    })
                    return cate;
                });
            }
            return data;
        },
        defaultCheckedKeys() {
            if(this.model.rights.length > 0) {
                return this.model.rights
            }else {
                return []
            }
        }
    },
    methods: {
        save() {
            this.nameErrorTip = "";
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    let res;
                    if (this._id) {
                        res = await this.$http.put(
                            "/rest/roles/" + this._id,
                            this.model
                        );
                    } else {
                        res = await this.$http.post("/rest/roles", this.model);
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
                            this.$router.push("/roles/list");
                        }
                    }
                } else {
                    return false;
                }
            });
        },
        async fetch() {
            const res = await this.$http.get("/rest/roles/" + this._id);
            if (res.status === 200) {
                this.model = res.data;
            }
        },
        async fetchServerRights() {
            const res = await this.$http.get("/rest/server_rights");
            this.serverRights = res.data.items;
        },
        clickRight(node, tree) {
            // 选中树形图触发
            let res = tree.checkedKeys.slice();
            // 过滤掉父节点的id
            this.model.rights = res.filter(item => typeof item !== 'number');
        },
    },
    created() {
        this._id && this.fetch();
        this.fetchServerRights();
    },
};
</script>

<style>
.right-tree .el-tag {
    margin: 2px;
    margin-right: 10px;
    height: 20px;
    line-height: 18px;
}
.right-tree .el-tag.el-tag--info {
    color: #303133;
}
.right-tree .tree-item {
    display: flex;
    align-items: center;
    color: #909399;
}
.right-tree .tree-item.cate .el-tag{
    font-size: 14px;
    color:#555;
    background-color: #e4e7ed;
}
.right-tree .el-tree-node__content {
    height: 28px;
}

</style>