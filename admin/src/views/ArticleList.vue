<template>
    <div class="article-list">
        <h2>文章列表</h2>
        <el-table :data="articles">
            <el-table-column prop="_id" label="id" width="220px">
            </el-table-column>
            <el-table-column
                label="文章分类">
                <template v-slot="scope">
                    <span v-for="(item, i) of scope.row.categories" :key="i + item._id">
                        {{item.name}}<span v-if="i < scope.row.categories.length - 1">/</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="文章名称"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template v-slot="scope">
                    <el-button
                        @click="
                            $router.push(`/articles/edit/${scope.row._id}`)
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
    </div>
</template>

<script>
export default {
    name: "ArticleList",
    data() {
        return {
            articles: []
        }
    },
    methods: {
        async fetch() {
            const res = await this.$http.get('/rest/articles');
            if(res.status === 200) {
                this.articles = res.data;
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