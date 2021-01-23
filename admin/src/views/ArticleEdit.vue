<template>
    <div class="article-edit">
        <h2>{{ _id ? "编辑" : "新建" }}文章</h2>
        <el-form
            @submit.native.prevent="save"
            ref="ruleForm"
            :model="model"
            label-width="120px"
            v-loading="isFetching"
            element-loading-text="Loading..."
        >
            <el-form-item
                label="标题"
                prop="title"
                :rules="[
                    {
                        required: true,
                        message: '文章标题不能为空',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input
                    placeholder="输入文章名称"
                    v-model="model.title"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="分类"
                prop="categories"
                :rules="[
                    {
                        required: true,
                        message: '至少选择一个分类',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-select
                    v-model="model.categories"
                    filterable
                    multiple
                    placeholder="选择文章分类"
                >
                    <el-option
                        v-for="item in articleCategories"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="作者" prop="author">
                <el-input v-model="model.author"></el-input>
            </el-form-item>
            <el-form-item
                label="内容"
                prop="body"
                :rules="[
                    {
                        required: true,
                        message: '文章内容不能为空',
                        trigger: 'blur',
                    },
                ]"
            >
                <vue-editor
                    v-model="model.body"
                    useCustomImageHandler
                    @image-added="handleImageAdded"
                ></vue-editor>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    native-type="submit"
                    v-permission="{
                        action: _id ? 'put' : 'post',
                        effect: 'disabled',
                    }"
                    >{{ _id ? "保存" : "新建" }}</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import editPageMixin from "@/libs/editPageMixin.js";
import fetchCategoriesMixin from "@/libs/fetchCategoriesMixin.js";
import { uploadImage } from "@/libs/api.js";
import { VueEditor } from "vue2-editor";

export default {
    name: "ArticleEdit",
    mixins: [fetchCategoriesMixin, editPageMixin],
    data() {
        return {
            model: {},
        };
    },
    computed: {
        articleCategories() {
            return this.categories.filter((cate) => {
                if (cate.parent) return cate.parent.name == "新闻分类";
            });
        },
    },
    methods: {
        async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
            const formData = new FormData();
            formData.append("file", file);
            const res = await uploadImage(formData);
            if (res.status === 200)
                Editor.insertEmbed(cursorLocation, "image", res.data.url);
            resetUploader();
        },
    },
    components: {
        VueEditor,
    },
};
</script>

<style>
.ql-toolbar {
    position: sticky;
    z-index: 100;
    background: #fff;
    top: -20px;
    width: 100%;
}
</style>