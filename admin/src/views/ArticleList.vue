<template>
    <div class="article-list">
        <h2>文章列表</h2>
        <el-form @submit.native.prevent="search">
            <el-form-item class="el-form-search-item">
                <el-input clearable v-model="searchKeyword" @clear="clearSearch" placeholder="搜索标题或内容" prefix-icon="el-icon-search" ></el-input>
                <el-button native-type="submit" v-permission="{action: 'search', effect: 'disabled'}" type="primary">搜索</el-button>
                <el-button title="刷新" @click="searchKeyword ? search() : fetch()" icon="el-icon-refresh-left"></el-button>
            </el-form-item>
        </el-form>
        <el-table :data="articles">
            <el-table-column prop="_id" label="id" width="220px">
            </el-table-column>
            <el-table-column
                width="150px"
                label="文章分类">
                <template v-slot="scope">
                    <span>{{scope.row.categories.map(v => v.name).join('/')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="文章名称"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template v-slot="scope">
                    <el-button
                        v-permission="{action: 'put', effect: 'disabled'}"
                        @click="
                            $router.push(`/articles/edit/${scope.row._id}`)
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
    name: "ArticleList",
    data() {
        return {
            articles: [],
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
            const res = await this.$http.get(`/rest/articles/search?keyword=${this.searchKeyword}&size=${this.pageSize}&page=${this.currentPage}`);
            this.articles = res.data.items;
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
            const res = await this.$http.get(`/rest/articles?size=${this.pageSize}&page=${this.currentPage}`);
            if(res.status === 200) {
                this.articles = res.data.items;
                this.totalSize = res.data.totalCount;
            }
        },
        async remove(row) {
        this.$confirm(`是否确定要删除文章 《${row.title}》`, '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: "warning"
        }).then(async ()=> {
            let res = await this.$http.delete('/rest/articles/' + row._id);
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