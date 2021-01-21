<template>
    <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrPageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSize"
        :disabled="disabled"
    >
    </el-pagination>
</template>

<script>
export default {
    name: "ListPagination",
    props: [
        "handleSizeChange",
        "handleCurrPageChange",
        "currentPage",
        "pageSize",
        "totalSize",
        "disabled"
    ],
};
</script>