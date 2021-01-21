<template>
    <div class="role-edit">
        <h2>{{ _id ? "编辑" : "新建" }}角色</h2>
        <el-form
            @submit.native.prevent="save"
            ref="ruleForm"
            :rules="rules"
            :model="model"
            label-width="120px"
            v-loading="isFetching"
            element-loading-text="Loading..."
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
            <el-form-item>
                <el-tabs type="border-card">
                    <el-tab-pane label="权限">
                        <div class="right-wrapper d-flex">
                            <div class="flex-1">
                                <h4>前端界面权限:</h4>
                                <el-tree
                                    :data="adminWebTreeData"
                                    show-checkbox
                                    node-key="id"
                                    :indent="44"
                                    :expand-on-click-node="false"
                                    :check-on-click-node="true"
                                    :default-expand-all="1 ? true : false"
                                    :default-expanded-keys="[]"
                                    :default-checked-keys="defaultAdminWebCheckedKeys"
                                    ref="webTree"
                                    class="right-tree"
                                    @check="clickWebTree"
                                >
                                    <template v-slot="{ data }">
                                        <span class="tree-item cate" v-if="data.type=='cate'"><el-tag type="info">{{data.label}}</el-tag></span>
                                        <span class="tree-item" v-else-if="data.type=='right'"><el-tag :type="methodType[data.right]" class="method">{{data.right}}</el-tag><span>{{data.desc}}</span></span>
                                        <span class="tree-item" v-else-if="data.type =='page'"><el-tag type="info">{{data.label.replace('页面', '')}}</el-tag><span style="color: #606266;margin-left: -5px;">页面</span></span>
                                        <span class="tree-item" v-else-if="data.type =='group'"><el-tag class="group" type="info">{{data.name}}</el-tag><span style="color: #606266;margin-left: -5px;">分组</span></span>

                                    </template>
                                </el-tree>
                            </div>
                            <div class="flex-1">
                                <h4>API接口权限:</h4>
                                <el-tree
                                    :data="apiRightTreeData"
                                    show-checkbox
                                    node-key="id"
                                    :indent="44"
                                    :expand-on-click-node="false"
                                    :check-on-click-node="true"
                                    :default-expand-all="1 ? true : false"
                                    :default-expanded-keys="[]"
                                    :default-checked-keys="defaultApiRightCheckedKeys"
                                    class="right-tree"
                                    ref="apiTree"
                                    @check="clickApiTree"
                                >
                                    <template v-slot="{ data }">
                                        <span class="tree-item cate" v-if="data.type == 'category'"><el-tag type="info">{{data.name}}</el-tag></span>
                                        <span class="tree-item" v-else-if="data.type == 'right'"><el-tag :type="methodType[data.right]" class="method">{{data.right}}</el-tag><span>{{data.desc}}</span></span>
                                        <span class="tree-item" v-else><el-tag type="info">{{data.path}}</el-tag><span style="color: #606266;margin-left: -5px;"> 接口</span></span>
                                    </template>
                                </el-tree>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-form-item>
            <el-form-item>
                <el-button class="w-100" v-permission="{action: _id ? 'put' : 'post', effect: 'disabled'}"  type="primary" native-type="submit">{{
                    _id ? "保存" : "新建"
                }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { makeWebTree } from '@/libs/utils.js';
import editPageMixin from '@/libs/editPageMixin.js';
import { getResourceList } from '@/libs/api.js';

export default {
    name: "RoleEdit",
    mixins: [editPageMixin],
    data() {
        return {
            apiRights: [],
            adminWebs: [],
            model: {},
            rules: {
                name: [
                    {
                        required: true,
                        message: "名称不能为空",
                        trigger: "blur",
                    },
                ],
            },
            defaultProps: {
                children: "children",
                label: "label",
            },
            methodType: {
                POST: "success",
                PUT: "warning",
                DELETE: "danger",
            },
            defaultAdminWebCheckedKeys: [],
            defaultApiRightCheckedKeys: [],
        };
    },
    computed: {
        adminWebTreeData() {
            let data = [];
            if(this.adminWebs.length > 0) {
                data = makeWebTree(this.adminWebs, true);
            }
            return data;
        },
        apiRightTreeData() {
            let data = [];
            if(this.apiRights.length > 0) {
                const obj = {};
                const uniqueCate = this.apiRights.reduce((arr, v) => {
                    let cate = v.category;
                    if(!obj[cate._id]) {
                        obj[cate._id] = true;
                        arr.push(cate);
                    }
                    return arr;
                }, [])
                data = uniqueCate.map((cate, i) => {
                    cate.id= i + 1;
                    cate.label = cate.name;
                    cate.type = 'category';
                    cate.children = [];
                    this.apiRights.forEach((api) => {
                        if(api.category._id === cate._id) {
                            api.id = api._id;
                            api.label = api.path + ' ' + '接口'
                            api.type = 'url';
                            api.children = [];
                            let methodDesc = api.description.split('、');
                            api.methods.forEach((m, k) => {
                                api.children.push({
                                    label: m + ' ' +methodDesc[k],
                                    id: m + '-' + api._id,
                                    type: 'right',
                                    right: m,
                                    desc: methodDesc[k],
                                    parentId: api._id
                                })
                            })
                            cate.children.push(api);
                        }
                    })
                    return cate;
                })
            }
            return data;
        }
    },
    methods: {
        async fetchAdminWebs() {
            const res = await getResourceList('admin_webs');
            this.adminWebs = res.data.items;
        },
        async fetchApiRights() {
            const res = await getResourceList('api_rights');
            this.apiRights = res.data.items;
        },
        clickWebTree(node, tree) {
            // 选中树形图触发
            const { checkedNodes } = tree;
            this.model.adminWebs = this.checkTree(checkedNodes, 'web');
        },
        clickApiTree(node, tree) {
            const { checkedNodes } = tree;
            this.model.apiRights = this.checkTree(checkedNodes, 'url');
        },
        checkTree(arr, key) {
            /**
             * arr 以选中的节点
             * key 角色表中字段的键值
             */
            let rightNodes = arr.filter( v => v.type === 'right'); // 只要选择的权限节点
            let obj = {};
            rightNodes.forEach((r) => {
                if(obj[r.parentId]) {
                    obj[r.parentId].push(r.right);
                }else {
                    // 页面id为键，值为含有权限的数组
                    obj[r.parentId] = [r.right];
                }
            })
            let data = [];
            for(let item of Object.entries(obj)) {
                let rObj = {
                    rights: item[1]
                }
                rObj[key] = item[0]
                data.push(rObj);
            }
            return data
        },
        getDefaultTreeCheckedKeys(arr, key) {
            /**
             * arr 角色的权限列表
             * key 权限列表项中权限的key
             */
            let tree = key == 'web' ? this.$refs.webTree : this.$refs.apiTree;
            return arr.reduce((res, p) => {
                let node = tree.getNode(p[key]); // 根据节点的id获取节点
                if(node) {
                    p.rights.forEach(r => {
                        node.data.children.forEach(c => {
                            if(r === c.right) {
                                res.push(c.id); // 只需要获取最小层级的节点即可
                            }
                        })
                    })
                }
                return res;
            }, [])
        },
        getDefaultAdminWebCheckedKeys() {
            if(this._id && this.model.adminWebs) {
                return this.getDefaultTreeCheckedKeys(this.model.adminWebs, 'web');
            }else {
                return [];
            }
        },
        getDefaultApiRightCheckedKeys() {
            if(this._id && this.model.apiRights) {
                return this.getDefaultTreeCheckedKeys(this.model.apiRights, 'url');
            }else {
                return [];
            }
        }
    },
    created() {
        this.fetchAdminWebs();
        this.fetchApiRights();
    },
    mounted() {
        this._id && setTimeout(()=>{
            this.defaultAdminWebCheckedKeys = this.getDefaultAdminWebCheckedKeys();
            this.defaultApiRightCheckedKeys = this.getDefaultApiRightCheckedKeys();
        },500)
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
    color: #2f3542;
    font-size: 14px;
    box-sizing: content-box;
    padding: 1px 10px;
    line-height: 19px;
    background-color: #f3f3f3;
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

.right-wrapper {
    padding: 0 20px;
}

.right-tree .el-tag.el-tag--info.group {
    background: #dedede;
    color: #94989c;
}

</style>