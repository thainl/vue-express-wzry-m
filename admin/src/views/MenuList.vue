<template>
    <div class="menu-list">
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
            <el-table-column
                prop="name"
                label="菜单名称"
                sortable="custom"
                :sort-orders="sortOrder"
            >
            </el-table-column>
            <el-table-column prop="parent" label="层级">
                <template v-slot="{ row: { parent } }">
                    <span v-if="!parent" title="菜单的分类"
                        ><el-tag type="warning">分类</el-tag></span
                    >
                    <span
                        v-else-if="parent && !parent.parent"
                        title="菜单的分组，父级为菜单分类"
                        ><el-tag type="info">分组</el-tag></span
                    >
                    <span v-else title="真正的菜单选项，父级为菜单分组"
                        ><el-tag>菜单</el-tag></span
                    >
                </template>
            </el-table-column>
            <el-table-column prop="parent.name" label="父级菜单">
            </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column
                prop="isShow"
                label="是否显示"
                sortable="custom"
                :sort-orders="sortOrder"
            >
                <template v-slot="scope">
                    <el-tag :type="scope.row.isShow ? 'success' : 'info'">{{
                        scope.row.isShow ? "显示" : "隐藏"
                    }}</el-tag>
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

export default {
    name: "MenuList",
    mixins: [listPageMixin],
};
</script>
