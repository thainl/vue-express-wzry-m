<template>
    <div class="admin-web-list">
        <h2>{{this.listName}}列表</h2>
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
                width="220px"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                sortable="custom"
                :sort-orders="sortOrder"
            >
            </el-table-column>
            <el-table-column
                prop="path"
                label="路径"
                sortable="custom"
                :sort-orders="sortOrder"
            >
            </el-table-column>
            <el-table-column prop="menu.name" label="对应菜单">
            </el-table-column>
            <el-table-column prop="rights" label="操作权限">
                <template v-slot="{ row: { rights } }">
                    <el-tag
                        v-for="(item, i) of rights"
                        :key="'rtag' + i"
                        :type="methodType[item]"
                    >
                        {{ item }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
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
    name: "AdminWebList",
    mixins: [listPageMixin],
    data() {
        return {
            methodType: {
                POST: "success",
                PUT: "warning",
                DELETE: "danger",
            },
        };
    },
};
</script>

<style>
.el-tag {
    margin: 0 2px;
}
</style>