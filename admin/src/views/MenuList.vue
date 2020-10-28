<template>
    <div class="menu-list">
        <h2>菜单列表</h2>
        <el-form @submit.native.prevent="search">
            <el-form-item class="el-form-search-item">
                <el-input clearable v-model="searchKeyword" @clear="clearSearch" placeholder="搜索名称" prefix-icon="el-icon-search" ></el-input>
                <el-button native-type="submit" v-permission="{action: 'search', effect: 'disabled'}" type="primary">搜索</el-button>
                <el-button title="刷新" @click="searchKeyword ? search() : fetch()" icon="el-icon-refresh-left"></el-button>
            </el-form-item>
        </el-form>
        <el-table :data="menus">
            <el-table-column prop="_id" label="id" width="220px">
            </el-table-column>
            <el-table-column prop="name" label="菜单名称"> </el-table-column>
            <el-table-column prop="parent" label="层级">
                <template v-slot="{ row: { parent } }">
                    <span v-if="!parent" title="菜单的分类"><el-tag type="warning">分类</el-tag></span>
                    <span v-else-if="parent && !parent.parent" title="菜单的分组，父级为菜单分类"><el-tag type="info">分组</el-tag></span>
                    <span v-else title="真正的菜单选项，父级为菜单分组"><el-tag>菜单</el-tag></span>
                </template>
            </el-table-column>
            <el-table-column prop="parent.name" label="父级菜单"> </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column prop="isShow" label="是否显示">
                <template v-slot="scope">
                    <el-tag :type="scope.row.isShow ? 'success' : 'info'">{{scope.row.isShow ? '显示' : '隐藏'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template v-slot="scope">
                    <el-button
                        v-permission="{action: 'put', effect: 'disabled'}"
                        @click="
                            $router.push(`/menus/edit/${scope.row._id}`)
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
            :total="totalSize">
        </el-pagination>
    </div>
</template>

<script>
export default {
    name: "MenuList",
    data() {
        return {
            menus: [],
            pageSize: 10,
            currentPage: 1,
            totalSize: 0,
            searchKeyword: '',
        }
    },
    methods: {
        async search(e, reset){
            if(!this.searchKeyword) return;
            if(!reset) {this.currentPage = 1;}
            const res = await this.$http.get(`/rest/menus/search?keyword=${this.searchKeyword}&size=${this.pageSize}&page=${this.currentPage}`);
            this.menus = res.data.items;
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
            const res = await this.$http.get(`/rest/menus?size=${this.pageSize}&page=${this.currentPage}`);
            if(res.status === 200) {
                this.menus = res.data.items;
                this.totalSize = res.data.totalCount;
            }
        },
        async remove(row) {
        this.$confirm(`是否确定要删除菜单 "${row.name}"`, '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: "warning"
        }).then(async ()=> {
            let res = await this.$http.delete('/rest/menus/' + row._id);
            if(res.data.success) {
                this.$message({
                    type:'success',
                    message: '删除成功'
                });
                this.fetch();
            }
        })
            
        }
    },
    created() {
        this.fetch();
    },
};
</script>

<style>
</style>