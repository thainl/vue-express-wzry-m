<template>
    <div class="api-right-edit">
        <h2>{{ _id ? "编辑" : "新建" }}接口权限</h2>
        <el-form
            @submit.native.prevent="save"
            ref="ruleForm"
            :rules="rules"
            :model="model"
            label-width="120px"
            v-loading="isFetching"
            element-loading-text="Loading..."
        >
            <el-form-item label="接口地址" prop="path" :error="nameErrorTip">
                <el-input
                    placeholder="输入API接口地址，前缀/admin/api不用填"
                    v-model="model.path"
                ></el-input>
            </el-form-item>
            <el-form-item label="操作的模型" prop="category">
                <el-select clearable v-model="model.category" class="el-select-block" placeholder="选择接口所对应的模型">
                    <el-option
                        v-for="(item) of ApiCategories"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="接口方法" prop="methods">
                <el-select multiple v-model="model.methods" class="el-select-block" placeholder="选择权限">
                    <el-option
                        v-for="(val, key, i) in apiMethods"
                        :key="'tmds'+i"
                        :label="key"
                        :value="val"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input type="textarea" v-model="model.description" placeholder="描述与接口方法对应，用、分隔"></el-input>
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
import editPageMixin from '@/libs/editPageMixin.js';
import fetchCategoriesMixin from '@/libs/fetchCategoriesMixin.js';

export default {
    name: "ApiRightEdit",
    mixins: [editPageMixin, fetchCategoriesMixin],
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
        return {
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
                category: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur',
                    }
                ],
                methods: [
                    {
                        required: true,
                        message: '接口请求方式不能为空',
                        trigger: 'blur'
                    }
                ],
                description: [
                    {
                        required: true,
                        message: '接口权限描述不能为空',
                        trigger: 'blur'
                    },
                    {
                        validator: this.descValidator,
                        trigger: 'blur'
                    }
                ]
            },
        };
    },
    computed: {
        ApiCategories() {
            return this.categories.filter(cate => {
                if(cate.parent)
                    return cate.parent.name == '接口权限分类';
            })
        }
    },
    methods: {
        descValidator(rule, val, cb){
            if(val.split('、').length != this.model.methods.length) {
                cb(new Error('描述格式不正确'))
            }else {
                cb();
            }
        }
    },
};
</script>