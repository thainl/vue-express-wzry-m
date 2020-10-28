<template>
    <div class="api-right-list">
        <h2>接口权限列表</h2>
        <el-form @submit.native.prevent="search">
            <el-form-item class="el-form-search-item">
                <el-input
                    clearable
                    v-model="searchKeyword"
                    @clear="clearSearch"
                    placeholder="搜索页面"
                    prefix-icon="el-icon-search"
                ></el-input>
                <el-button native-type="submit" v-permission="{action: 'search', effect: 'disabled'}" type="primary">搜索</el-button>
                <el-button
                    title="刷新"
                    @click="searchKeyword ? search() : fetch()"
                    icon="el-icon-refresh-left"
                ></el-button>
            </el-form-item>
        </el-form>
        <el-table :data="api_rights">
            <el-table-column prop="_id" label="id" sortable width="220px">
            </el-table-column>
            <el-table-column prop="path" label="接口路径"> </el-table-column>
            <el-table-column prop="category.name" label="操作模型"> </el-table-column>
            <el-table-column prop="methods" label="接口权限">
                <template v-slot="{row: {methods}}">
                    <el-tag v-for="(item, i) of methods" :key="'rtag'+i" :type="methodType[item]">
                        {{ item }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template v-slot="scope">
                    <el-button
                        v-permission="{action: 'put', effect: 'disabled'}"
                        @click="
                            $router.push(`/api_rights/edit/${scope.row._id}`)
                        "
                        size="small"
                        >编辑</el-button
                    >
                    <el-button
                        v-permission="{action: 'delete'}"
                        @click="remove(scope.row)"
                        type="danger"
                        size="small"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[5, 10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSize"
        >
        </el-pagination>
    </div>
</template>

<script>
export default {
    name: "ApiRightList",
    data() {
        return {
            api_rights: [],
            pageSize: 10,
            currentPage: 1,
            totalSize: 0,
            searchKeyword: "",
            methodType: {
                POST: "success",
                PUT: "warning",
                DELETE: "danger",
            },
        };
    },
    methods: {
        async search(e, reset) {
            if (!this.searchKeyword) return;
            if (!reset) {
                this.currentPage = 1;
            }
            const res = await this.$http.get(
                `/rest/api_rights/search?keyword=${this.searchKeyword}&size=${this.pageSize}&page=${this.currentPage}`
            );
            this.api_rights = res.data.items;
            this.totalSize = res.data.totalCount;
        },
        clearSearch() {
            this.fetch();
            this.currentPage = 1;
        },
        handleSizeChange(size) {
            this.pageSize = size;
            this.searchKeyword ? this.search(null, true) : this.fetch();
        },
        handleCurrentChange(p) {
            this.currentPage = p;
            this.searchKeyword ? this.search(null, true) : this.fetch();
        },
        async fetch() {
            const res = await this.$http.get(
                `/rest/api_rights?size=${this.pageSize}&page=${this.currentPage}`
            );
            if (res.status === 200) {
                this.api_rights = res.data.items;
                this.totalSize = res.data.totalCount;
            }
        },
        async remove(row) {
            this.$confirm(`是否确定要删除接口权限 "${row.path}"`, "提示", {
                confirmButtonText: "删除",
                cancelButtonText: "取消",
                type: "warning",
            }).then(async () => {
                let res = await this.$http.delete(
                    "/rest/api_rights/" + row._id
                );
                if (res.data.success) {
                    this.$message({
                        type: "success",
                        message: "删除成功",
                    });
                    this.fetch();
                }
            });
        },
    },
    created() {
        this.fetch();
    },
};
</script>

<style>
.el-tag {
    margin: 0 2px;
}
</style>