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
            <el-form-item label="分类" prop="category">
                <el-select
                    v-model="model.category"
                    filterable
                    placeholder="选择物品分类"
                >
                    <el-option
                        v-for="item in categories"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="售价" prop="price">
                <el-input placeholder="物品售价" v-model.number="model.price"></el-input>
            </el-form-item>
            <el-form-item label="总价" prop="totalPrice">
                <el-input placeholder="物品总价" v-model.number="model.totalPrice"></el-input>
            </el-form-item>
            <el-form-item label="功效" prop="_effect">
                <el-input type="textarea" placeholder="回车可以换行，请勿多余换行" v-model="model._effect" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="_description">
                <el-input type="textarea" placeholder="回车可以换行，请勿多余换行" v-model="model._description" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
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
                    :action="uploadUrl"
                    :headers="getAuthHeaders()"
                    :show-file-list="false"
                    :on-success="handleIconSuccess"
                    accept=".png,.jpg,.jpeg,.gif,.webp"
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
import validatorMixin from '@/assets/js/validatorMixin.js';
export default {
    name: "ItemEdit",
    mixins: [validatorMixin],
    props: {
        id: String,
    },
    data() {
        return {
            categories: [],
            model: {},
            rules: {
                name: [{required: true, message:'请输入名称', trigger: 'blur'}],
                icon: [{validator: this.validatePic, trigger: 'blur'}]
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
        }
    },
    methods: {
        save() {
            this.nameErrorTip = '';
            this.$refs.ruleForm.validate(async valid => {
                if(valid) {
                    let res;
                    // 把文字转为html字符串
                    if(this.model._effect) {
                        console.log(1);
                        this.$set(this.model, 'effect', this.textToHtml(this.model._effect));
                    }
                    if(this.model._description) {
                        this.$set(this.model, 'description', this.textToHtml(this.model._description));
                    }
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
                this.$set(this.model, '_effect', this.htmlToText(this.model.effect))
                this.$set(this.model, '_description', this.htmlToText(this.model.description))
            }
        },
        async fetchCategories() {
            const res = await this.$http.get('/rest/categories/selectlist');
            if(res.status === 200) {
                this.categories = res.data;
            }
        },
        handleIconSuccess(res) {
            if (res.url) {
                this.$set(this.model, "icon", res.url);
            }
        },
        textToHtml(str) {
            if (str) {
                let res = str.replace(/\n/g, "<br/>"); // 回车加上br标签
                return `<p>${res}</p>`;
            }
            return str;
        },
        htmlToText(str) {
            let flag = /^(<p>)[\s\S]*(<\/p>)$/gi.test(str); // 是否包含p标签
            if(str && flag) {
                let res = str.match(/<p>([\s\S]*)<\/p>/i)[1]; // 取出p标签之间的内容
                return res.replace(/<br[\s]*[/]?[\s]*>/gi, '\n'); // 把br标签替换为回车
            }else {
                return str;
            }
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