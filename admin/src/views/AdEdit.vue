<template>
    <div class="ad-edit">
        <h2>{{ _id ? "编辑" : "新建" }}广告位</h2>
        <el-form
            @submit.native.prevent="save"
            ref="ruleForm"
            :model="model"
            label-width="120px"
            v-loading="isFetching"
            element-loading-text="Loading..."
        >
            <el-form-item
                label="名称"
                :prop="`name`"
                :error="nameErrorTip"
                :rules="[
                    {
                        required: true,
                        message: '广告位名称不能为空',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input v-model="model.name"></el-input>
            </el-form-item>
            <br>
            <section
                class="section-item"
                v-for="(item, i) of model.items"
                :key="'sk' + i"
            >
                <h4>
                    <span>广告{{ i + 1 }}：</span>
                    <span>
                        <el-button
                            icon="el-icon-plus"
                            size="mini"
                            circle
                            title="在前面添加一项"
                            @click="model.items.splice(i, 1, {}, item)"
                        ></el-button
                        ><el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            circle
                            title="删除"
                            @click="removeAdItem(item, i)"
                        ></el-button
                    ></span>
                </h4>
                <el-form-item label="链接">
                    <el-input v-model="item.url"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="item.title"></el-input>
                </el-form-item>
                <el-form-item label="描述" :prop="`items.${i}.description`">
                    <el-input
                        type="textarea"
                        v-model="item.description"
                    ></el-input>
                </el-form-item>
                <el-form-item label="图片" :prop="`items.${i}.image`" :rules="[{validator: validatePic, trigger: 'blur'}]">
                    <el-input
                        v-model="item.image"
                        placeholder="输入图片url地址或者点击上传按钮上传图片"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-upload
                        class="icon-uploader"
                        :action="uploadUrl"
                        :headers="getAuthHeaders()"
                        :show-file-list="false"
                        accept=".png,.jpg,.jpeg,.gif,.webp"
                        :on-success="(res) => $set(item, 'image', res.url)"
                        :on-error="handleUploadError"
                        title="点击选择图片上传"
                    >
                        <img v-if="item.image" :src="item.image" class="icon" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </section>
            <div class="add-section">
                <el-button @click="model.items.push({})"
                    ><i class="el-icon-plus"></i> 添加广告</el-button
                >
            </div>
            <el-button class="submit-btn" v-permission="{action: _id ? 'put' : 'post', effect: 'disabled'}" type="primary" native-type="submit">{{
                _id ? "保存" : "新建"
            }}</el-button>
        </el-form>
    </div>
</template>

<script>
import validatorMixin from '@/libs/validatorMixin.js';
import editPageMixin from '@/libs/editPageMixin.js';

export default {
    name: "AdEdit",
    mixins: [validatorMixin, editPageMixin],
    data() {
        return {
            model: {
                items: [],
            },
        };
    },
    methods: {
        removeAdItem(ad, index) {
            if (ad.title || ad.url || ad.description || ad.image) {
                // 确定删除表单项提示框
                this.$confirm(`是否确定要删除 广告${index + 1} ？`, "提示", {
                    confirmButtonText: "删除",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.model.items.splice(index, 1);
                    })
                    .catch(() => {});
            } else {
                this.model.items.splice(index, 1);
            }
        },
    },
};
</script>

<style>
.ad-edit .submit-btn {
    margin-top: 30px;
    width: 100%;
}
.ad-edit .icon-uploader .icon {
    height: 300px;
    width: auto;
}
</style>