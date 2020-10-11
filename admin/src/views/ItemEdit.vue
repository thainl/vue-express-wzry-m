<template>
    <div class="item-edit">
        <h2>{{ _id ? "编辑" : "新建" }}物品</h2>
        <el-form @submit.native.prevent="save" ref="ruleForm" :model="model" :rules="rules" label-width="120px">
            <el-form-item label="名称" prop="name" :error="nameErrorTip">
                <el-input
                    placeholder="输入物品名称"
                    v-model="model.name"
                ></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-input
                    placeholder="输入图片url地址或者点击上传按钮上传图片"
                    v-model="model.icon"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-upload
                    class="icon-uploader"
                    :action="`${$http.defaults.baseURL}/upload`"
                    :show-file-list="false"
                    :on-success="handleIconSuccess"
                    :before-upload="beforeIconUpload"
                    title="点击选择图片上传"
                >
                    <img v-if="model.icon" :src="model.icon" class="icon" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
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
    name: "ItemEdit",
    props: {
        id: String,
    },
    data() {
        const validateImg = (rule, val, cb)=> {
            if(this.imgStatus === false && val) { // 图片显示错误
                cb(new Error('图片显示错误，请检查图片地址'));
            }else {
                cb();
            }
        }
        return {
            model: {},
            rules: {
                name: [{required: true, message:'请输入名称', trigger: 'blur'}],
                icon: [{validator: validateImg, trigger: 'blur'}]
            },
            nameErrorTip: ''
        };
    },
    computed: {
        _id() {
            if (this.$route.path == "/rest/items/create") {
                return undefined;
            } else {
                return this.id;
            }
        },
        imgStatus() {
            if (this.model.icon) {
                return this.checkImg(this.model.icon);
            }
            return -1;
        },
    },
    methods: {
        save() {
            this.nameErrorTip = '';
            this.$refs.ruleForm.validate(async valid => {
                if(valid) {
                    let res;
                    if (this._id) {
                        res = await this.$http.put(
                            "/rest/items/" + this._id,
                            this.model
                        );
                    } else {
                        res = await this.$http.post("/rest/items", this.model);
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
                            this.$router.push("/items/list");
                        }
                        
                    }
                }else {
                    return false;
                }
            })
        },
        async fetch() {
            const res = await this.$http.get("/rest/items/" + this._id);
            if (res.status === 200) {
                this.model = res.data;
            }
        },
        checkImg(url) {
            // 检查图片是否正常显示
            let img = new Image();
            img.src = url;
            if (img.sizes > 0 || (img.width > 0 && img.height > 0)) {
                return true;
            } else {
                return false;
            }
        },
        handleIconSuccess(res) {
            if (res.url) {
                this.$set(this.model, "icon", res.url);
            }
        },
        beforeIconUpload() {},
    },
    created() {
        this._id && this.fetch();
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.$refs.ruleForm.clearValidate(); // 清除表单验证错误
            if (
                to.path == "/items/create" &&
                from.path == "/items/edit/" + from.params.id
            ) {
                vm.model = {};
            }
        });
    },
};
</script>

<style>
.icon-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.icon-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.icon-uploader .icon {
    width: 178px;
    height: 178px;
    display: block;
}
</style>