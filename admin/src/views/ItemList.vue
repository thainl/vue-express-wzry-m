<template>
    <div class="item-list">
        <h2>物品列表</h2>
        <el-table :data="items">
            <el-table-column prop="_id" label="id" width="220px">
            </el-table-column>
            <el-table-column prop="name" label="物品名称"> </el-table-column>
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
                        @click="
                            $router.push(`/items/edit/${scope.row._id}`)
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
    name: "ItemList",
    data() {
        return {
            items: []
        }
    },
    methods: {
        async fetch() {
            const res = await this.$http.get('/rest/items');
            if(res.status === 200) {
                this.items = res.data;
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