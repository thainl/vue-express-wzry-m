<template>
    <div class="admin-user-list">
        <h2>管理员列表</h2>
        <el-table :data="adminUsers">
            <el-table-column prop="_id" label="id" width="220px">
            </el-table-column>
            <el-table-column prop="name" label="用户名"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template v-slot="scope">
                    <el-button
                        @click="
                            $router.push(`/admin_users/edit/${scope.row._id}`)
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
    name: "AdminUserList",
    data() {
        return {
            adminUsers: []
        }
    },
    methods: {
        async fetch() {
            const res = await this.$http.get('/rest/admin_users');
            if(res.status === 200) {
                this.adminUsers = res.data;
            }
        },
        async remove(row) {
        this.$confirm(`是否确定要删除管理员 "${row.name}"`, '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: "warning"
        }).then(async ()=> {
            let res = await this.$http.delete('/rest/admin_users/' + row._id);
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

<style scoped>
</style>