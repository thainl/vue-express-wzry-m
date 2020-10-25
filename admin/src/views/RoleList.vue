<template>
    <div class="role-list">
        <h2>角色列表</h2>
        <el-form @submit.native.prevent="search">
            <el-form-item class="el-form-search-item">
                <el-input
                    clearable
                    v-model="searchKeyword"
                    @clear="clearSearch"
                    placeholder="搜索名称"
                    prefix-icon="el-icon-search"
                ></el-input>
                <el-button native-type="submit" type="primary">搜索</el-button>
                <el-button
                    title="刷新"
                    @click="searchKeyword ? search() : fetch()"
                    icon="el-icon-refresh-left"
                ></el-button>
            </el-form-item>
        </el-form>
        <el-table :data="roles">
            <el-table-column prop="_id" label="id" width="220px">
            </el-table-column>
            <el-table-column prop="name" label="名称"> </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template v-slot="scope">
                    <el-button
                        @click="
                            $router.push(`/roles/edit/${scope.row._id}`)
                        "
                        size="small"
                        >编辑</el-button
                    >
                    <el-button
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
    name: "RoleList",
    data() {
        return {
            roles: [],
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
                `/rest/roles/search?keyword=${this.searchKeyword}&size=${this.pageSize}&page=${this.currentPage}`
            );
            this.roles = res.data.items;
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
                `/rest/roles?size=${this.pageSize}&page=${this.currentPage}`
            );
            if (res.status === 200) {
                this.roles = res.data.items;
                this.totalSize = res.data.totalCount;
            }
        },
        async remove(row) {
            this.$confirm(`是否确定要删除角色 "${row.name}"`, "提示", {
                confirmButtonText: "删除",
                cancelButtonText: "取消",
                type: "warning",
            }).then(async () => {
                let res = await this.$http.delete(
                    "/rest/roles/" + row._id
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
</style>