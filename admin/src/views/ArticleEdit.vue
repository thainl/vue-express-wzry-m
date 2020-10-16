<template>
    <div class="article-edit">
        <h2>{{ _id ? "编辑" : "新建" }}文章</h2>
        <el-form @submit.native.prevent="save" ref="ruleForm" :model="model" label-width="120px">
            <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '文章标题不能为空', trigger: 'blur' }]">
                <el-input
                    placeholder="输入文章名称"
                    v-model="model.title"
                ></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="categories">
                <el-select
                    v-model="model.categories"
                    filterable
                    multiple
                    placeholder="选择文章分类"
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
            <el-form-item label="作者" prop="author">
                <el-input v-model="model.author"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="body" :rules="[{ required: true, message: '文章内容不能为空', trigger: 'blur' }]">
                <vue-editor v-model="model.body" useCustomImageHandler @image-added="handleImageAdded"></vue-editor>
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
import { VueEditor } from "vue2-editor";
export default {
    name: "ArticleEdit",
    props: {
        id: String,
    },
    data() {
        return {
            categories: [],
            model: {},
        };
    },
    computed: {
        _id() {
            if (this.$route.path == "/rest/articles/create") {
                return undefined;
            } else {
                return this.id;
            }
        },
    },
    methods: {
        save() {
            this.$refs.ruleForm.validate(async valid => {
                if(valid) {
                    let res;
                    if (this._id) {
                        res = await this.$http.put(
                            "/rest/articles/" + this._id,
                            this.model
                        );
                    } else {
                        res = await this.$http.post("/rest/articles", this.model);
                    }
                    if (res.status === 200) {
                        this.$message({
                            type: "success",
                            message: this._id ? "修改成功" : "新建成功",
                        });
                        this.$router.push("/articles/list");
                    }
                }else {
                    return false;
                }
            })
        },
        async fetch() {
            const res = await this.$http.get("/rest/articles/" + this._id);
            if (res.status === 200) {
                this.model = res.data;
            }
        },
        async fetchCategories() {
            const res = await this.$http.get('/rest/categories');
            if(res.status === 200) {
                this.categories = res.data;
            }
        },
        async handleImageAdded (file, Editor, cursorLocation, resetUploader) {
            const formData = new FormData();
            formData.append("file", file);
            const res = await this.$http.post('/upload', formData);
            if(res.status === 200)
            Editor.insertEmbed(cursorLocation, "image", res.data.url);
            resetUploader();
        }
    },
    created() {
        this._id && this.fetch();
        this.fetchCategories();
    },
    components: {
        VueEditor
    }
};
</script>

<style>
</style>