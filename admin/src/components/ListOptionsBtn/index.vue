<template>
    <div>
        <el-button
            v-if="showViewBtn"
            v-permission="{ action: 'put', effect: 'disabled' }"
            @click="$router.push(`/${modelName}/edit/${row._id}?view`)"
            size="small"
            >查看</el-button
        >
        <el-button
            v-permission="editBtnPermission"
            @click="$router.push(`/${modelName}/edit/${row._id}`)"
            size="small"
            >编辑</el-button
        >
        <el-button
            v-permission="deleteBtnPermission"
            @click="deleteOne(row)"
            type="danger"
            size="small"
            >删除</el-button
        >
    </div>
</template>

<script>
export default {
    name: "ListOptionsBtn",
    props: {
        modelName: String,
        row: Object,
        deleteOne: Function,
        editBtnHide: {
            type: Boolean,
            default: false,
        },
        deleteBtnHide: {
            type: Boolean,
            default: false,
        },
        showViewBtn: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        editBtnPermission() {
            return this.editBtnHide
                ? { action: "put" }
                : { action: "put", effect: "disabled" };
        },
        deleteBtnPermission() {
            return this.deleteBtnHide
                ? { action: "delete" }
                : { action: "delete", effect: "disabled" };
        },
    },
};
</script>