<template>
    <div class="item-edit">
        <h2>{{ _id ? "编辑" : "新建" }}物品</h2>
        <el-form
            @submit.native.prevent="save"
            ref="ruleForm"
            :model="model"
            :rules="rules"
            label-width="120px"
        >
            <el-form-item label="名称" prop="name" :error="nameErrorTip">
                <el-input
                    placeholder="输入物品名称"
                    v-model="model.name"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="分类"
                prop="category"
                :rules="[
                    {
                        required: true,
                        message: '分类不能为空',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-select
                    v-model="model.category"
                    filterable
                    placeholder="选择物品分类"
                >
                    <el-option
                        v-for="item in itemCategories"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="售价" prop="price">
                <el-input
                    placeholder="物品售价"
                    v-model="model.price"
                ></el-input>
            </el-form-item>
            <el-form-item label="总价" prop="totalPrice">
                <el-input
                    placeholder="物品总价"
                    v-model="model.totalPrice"
                ></el-input>
            </el-form-item>
            <el-form-item label="功效" prop="_effect">
                <el-input
                    type="textarea"
                    placeholder="回车可以换行，请勿多余换行"
                    v-model="model._effect"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                ></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="_description">
                <el-input
                    type="textarea"
                    placeholder="回车可以换行，请勿多余换行"
                    v-model="model._description"
                    :autosize="{ minRows: 2, maxRows: 4 }"
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
                    :action="uploadUrl"
                    :headers="getAuthHeaders()"
                    :show-file-list="false"
                    :on-success="handleIconSuccess"
                    :on-error="handleUploadError"
                    accept=".png,.jpg,.jpeg,.gif,.webp"
                    title="点击选择图片上传"
                >
                    <img v-if="model.icon" :src="model.icon" class="icon" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    v-permission="{
                        action: _id ? 'put' : 'post',
                        effect: 'disabled',
                    }"
                    native-type="submit"
                    >{{ _id ? "保存" : "新建" }}</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import validatorMixin from "@/libs/validatorMixin.js";
import editPageMixin from '@/libs/editPageMixin.js';
import fetchCategoriesMixin from '@/libs/fetchCategoriesMixin.js';
import { updateResourceItem, createResourceItem, getResourceItem } from '@/libs/api.js';

export default {
    name: "ItemEdit",
    mixins: [validatorMixin, editPageMixin, fetchCategoriesMixin],
    data() {
        const numValidator = (rules, val, cb) => {
            if (val && !/^[\d]+$/g.test(val)) {
                cb(new Error("必须为整数"));
            } else {
                cb();
            }
        };
        return {
            model: {},
            rules: {
                name: [
                    { required: true, message: "请输入名称", trigger: "blur" },
                ],
                icon: [{ validator: this.validatePic, trigger: "blur" }],
                price: [{ validator: numValidator, trigger: "blur" }],
                totalPrice: [{ validator: numValidator, trigger: "blur" }],
            },
        };
    },
    computed: {
        itemCategories() {
            return this.categories.filter((cate) => {
                if (cate.parent) return cate.parent.name == "物品分类";
            });
        },
    },
    methods: {
        save() {
            this.nameErrorTip = "";
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    let res;
                    // 把文字转为html字符串
                    if (this.model._effect) {
                        this.$set(
                            this.model,
                            "effect",
                            this.textToHtml(this.model._effect)
                        );
                    }
                    if (this.model._description) {
                        this.$set(
                            this.model,
                            "description",
                            this.textToHtml(this.model._description)
                        );
                    }
                    if (this._id) {
                        res = await updateResourceItem('items', this._id, this.model)
                    } else {
                        res = await createResourceItem('items', this.model);
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
                            this.$router.push("/items/list");
                        }
                    }
                } else {
                    return false;
                }
            });
        },
        async fetch() {
            const res = await getResourceItem('items', this._id);
            if (res.status === 200) {
                this.model = res.data;
                this.$set(
                    this.model,
                    "_effect",
                    this.htmlToText(this.model.effect)
                );
                this.$set(
                    this.model,
                    "_description",
                    this.htmlToText(this.model.description)
                );
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
            if (str && flag) {
                let res = str.match(/<p>([\s\S]*)<\/p>/i)[1]; // 取出p标签之间的内容
                return res.replace(/<br[\s]*[/]?[\s]*>/gi, "\n"); // 把br标签替换为回车
            } else {
                return str;
            }
        },
    },
};
</script>