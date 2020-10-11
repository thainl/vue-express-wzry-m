<template>
    <div class="category-list">
        <h2>分类列表</h2>
        <el-table :data="categories">
            <el-table-column prop="_id" label="id" width="220px">
            </el-table-column>
            <el-table-column prop="parent.name" label="父级分类"> </el-table-column>
            <el-table-column prop="name" label="分类名称"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template v-slot="scope">
                    <el-button
                        @click="
                            $router.push(`/categories/edit/${scope.row._id}`)
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
    name: "CategoryList",
    data() {
        return {
            categories: []
        }
    },
    methods: {
        async fetch() {
            const res = await this.$http.get('/rest/categories');
            if(res.status === 200) {
                this.categories = res.data;
            }
        },
        async remove(row) {
        this.$confirm(`是否确定要删除分类 "${row.name}"`, '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: "warning"
        }).then(async ()=> {
            let res = await this.$http.delete('/rest/categories/' + row._id);
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

<style scoped>
</style>