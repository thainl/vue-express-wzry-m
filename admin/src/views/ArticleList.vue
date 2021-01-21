<template>
    <div class="article-list">
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
                width="220px"
                sortable="custom"
                :sort-orders="sortOrder"
            >
            </el-table-column>
            <el-table-column width="150px" label="文章分类">
                <template v-slot="scope">
                    <span>{{
                        scope.row.categories.map((v) => v.name).join("/")
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="title"
                label="文章名称"
                sortable="custom"
                :sort-orders="sortOrder"
            >
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template v-slot="scope">
                    <ListOptionsBtn
                        :modelName="modelName"
                        :row="scope.row"
                        :deleteOne="handleClickDeleteOne"
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

export default {
    name: "ArticleList",
    mixins: [listPageMixin],
};
</script>

<style>
#item-icon {
    width: 50px;
    height: 50px;
}
</style>