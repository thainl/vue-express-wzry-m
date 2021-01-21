<template>
    <el-form
        @submit.native.prevent="search"
        class="search-form d-flex jc-between"
    >
        <el-form-item class="el-form-search-item">
            <el-input
                clearable
                :value="searchKeyword"
                @input="(v) => $emit('keywordChange', v)"
                @clear="clear"
                placeholder="input text to search"
                prefix-icon="el-icon-search"
                v-permission="{ action: 'search', effect: 'disabled' }"
            ></el-input>
            <el-button
                native-type="submit"
                v-permission="{ action: 'search', effect: 'disabled' }"
                type="primary"
                :loading="searching"
                >搜索</el-button
            >
            <el-button
                title="刷新"
                @click="fetch"
                icon="el-icon-refresh-left"
                :loading="loading"
            ></el-button>
        </el-form-item>
        <el-form-item>
            <el-button
                icon="el-icon-plus"
                type="primary"
                @click="$router.push('/' + modelName + '/create')"
                >添加{{listName}}</el-button
            >
            <el-button
                type="danger"
                :disabled="!selectedListLength"
                @click="deleteMany"
                v-permission="{ action: 'delete' }"
                >批量删除</el-button
            >
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: "ListForm",
    props: [
        "fetch",
        "search",
        "clear",
        "deleteMany",
        "selectedListLength",
        "searchKeyword",
        "modelName",
        "loading",
        "searching",
        "listName",
    ],
};
</script>

<style>
</style>