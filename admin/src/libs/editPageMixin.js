import { updateResourceItem, createResourceItem, getResourceItem } from './api';

export default {
    props: {
        id: String
    },
    data() {
        return {
            nameErrorTip: '',
            modelName: this.$route.path.match(/\/(\w+?)\//i)[1], // 对应操作模型的名称
            isFetching: false,
        }
    },
    computed: {
        _id() {
            if (/\/create[/]*/gi.test(this.$route.path) == "/ads/create") {
                return undefined;
            } else {
                return this.id;
            }
        }
    },
    methods: {
        save() {
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    let res;
                    if (this._id) {
                        res = await updateResourceItem(this.modelName, this._id, this.model);
                    } else {
                        res = await createResourceItem(this.modelName, this.model);
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
                            this.$router.push("/" + this.modelName + "/list" + (this._id ? '' : '?sort=_id:-1'));
                        }
                        
                    }
                } else {
                    this.$message({
                        type: "error",
                        message: "表单存在错误，请检查",
                        offset: 220,
                    });
                    return false;
                }
            });
        },
        async fetch() {
            this.isFetching = true;
            // 获取当前要编辑的信息
            const res = await getResourceItem(this.modelName, this._id);
            // 对象合并，防止实例里的model的属性与获取到的属性不一致
            this.model = Object.assign({}, this.model, res.data);
            this.isFetching = false;
        },
    },
    created() {
        this._id && this.fetch();
    },
};