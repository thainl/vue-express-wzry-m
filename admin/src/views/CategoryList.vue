<template>
    <div class="category-list">
        <h2>{{ this.listName }}列表</h2>
        <ListForm
            :fetch="fetch"
            :search="search"
            :clear="clearSearch"
            :deleteMany="handleClickDeleteMany"
            :selectedListLength="selectedList.length"
            :searchKeyword="searchKeyword"
            :modelName="modelName"
            :listName="listName"
            :loading="isFetching"
            :searching="isSearching"
            @keywordChange="searchKeyword = $event"
        />
        <el-table
            v-loading="isFetching"
            element-loading-text="Loading..."
            :data="listData"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
        >
            <el-table-column type="selection"></el-table-column>
            <el-table-column
                prop="_id"
                label="id"
                sortable="custom"
                :sort-orders="sortOrder"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="分类名称"
                sortable="custom"
                :sort-orders="sortOrder"
            >
                <template v-slot="scope">
                    <el-tag>{{ scope.row.name }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="parent.name" label="父级分类">
                <template v-slot="scope">
                    <span
                        v-if="scope.row.parent"
                        :title="getCategoryParents(scope.row)"
                        >{{ scope.row.parent.name }}</span
                    >
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template v-slot="scope">
                    <ListOptionsBtn
                        :modelName="modelName"
                        :row="scope.row"
                        :deleteOne="handleClickDeleteOne"
                        deleteBtnHide
                    />
                </template>
            </el-table-column>
        </el-table>
        <ListPagination
            :handleSizeChange="handleSizeChange"
            :handleCurrPageChange="handleCurrPageChange"
            :currentPage="currentPage"
            :pageSize="pageSize"
            :totalSize="totalSize"
            :disabled="isFetching"
        />
    </div>
</template>

<script>
import listPageMixin from "@/libs/listPageMixin.js";
import { getCategoryParents } from "@/libs/utils.js";

export default {
    name: "CategoryList",
    mixins: [listPageMixin],
    methods: {
        getCategoryParents,
    },
};
</script>
