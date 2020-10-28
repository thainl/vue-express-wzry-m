<template>
    <div class="item-list">
        <h2>物品列表</h2>
        <el-form @submit.native.prevent="search">
            <el-form-item class="el-form-search-item">
                <el-input clearable v-model="searchKeyword" @clear="clearSearch" placeholder="搜索名称" prefix-icon="el-icon-search" ></el-input>
                <el-button native-type="submit" v-permission="{action: 'search', effect: 'disabled'}" type="primary">搜索</el-button>
                <el-button title="刷新" @click="searchKeyword ? search() : fetch()" icon="el-icon-refresh-left"></el-button>
            </el-form-item>
        </el-form>
        <el-table :data="items">
            <el-table-column prop="_id" label="id" width="220px">
            </el-table-column>
            <el-table-column prop="name" label="物品名称"> </el-table-column>
            <el-table-column prop="category.name" label="分类"> </el-table-column>
            <el-table-column
                label="物品图标">
                <template v-slot="scope">
                    <img v-if="scope.row.icon" id="item-icon" :src="scope.row.icon" :alt="scope.row.name">
                    <template v-else>暂无头像</template>
                </template>
                </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template v-slot="scope">
                    <el-button
                        v-permission="{action: 'put', effect: 'disabled'}"
                        @click="
                            $router.push(`/items/edit/${scope.row._id}`)
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
    name: "ItemList",
    data() {
        return {
            items: [],
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
            const res = await this.$http.get(`/rest/items/search?keyword=${this.searchKeyword}&size=${this.pageSize}&page=${this.currentPage}`);
            this.items = res.data.items;
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
            const res = await this.$http.get(`/rest/items?size=${this.pageSize}&page=${this.currentPage}`);
            if(res.status === 200) {
                this.items = res.data.items;
                this.totalSize = res.data.totalCount;
            }
        },
        async remove(row) {
        this.$confirm(`是否确定要删除物品 "${row.name}"`, '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: "warning"
        }).then(async ()=> {
            let res = await this.$http.delete('/rest/items/' + row._id);
            if(res.data.success) {
                this.$message({
                    type:'success',
                    message: '删除成功'
                });
                this.fetch();
            }
        }).catch(() => {});
            
        }
    },
    created() {
        this.fetch();
    },
};
</script>

<style>
#item-icon {
    width: 50px;
    height: 50px;
}
</style>