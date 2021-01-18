<template>
    <div class="category-edit">
        <h2>{{ _id ? "编辑" : "新建" }}分类</h2>
        <el-form
            @submit.native.prevent="save"
            ref="ruleForm"
            :rules="rules"
            :model="model"
            label-width="120px"
        >
            <el-form-item label="上级分类">
                <el-select filterable v-model="model.parent" placeholder="请选择父级分类">
                    <el-option selected label="__无__" :value="null"></el-option>
                    <el-option
                        v-for="item in parents"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name" :error="nameErrorTip">
                <el-input
                    placeholder="输入分类名称"
                    v-model="model.name"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" v-permission="{action: _id ? 'put' : 'post', effect: 'disabled'}" native-type="submit">{{
                    _id ? "保存" : "新建"
                }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import editPageMixin from '@/libs/editPageMixin.js';
import { getResourceSimpleList } from '@/libs/api.js';

export default {
    name: "CategoryEdit",
    mixins: [editPageMixin],
    data() {
        return {
            model: {
                parent: null
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
        };
    },
    methods: {
        async fetchParents() {
            const res = await getResourceSimpleList('categories');
            if (res.status === 200) {
                this.parents = res.data;
            }
        },
    },
    created() {
        this.fetchParents();
    },
};
</script>