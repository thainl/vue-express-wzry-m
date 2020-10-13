<template>
    <div class="ad-list">
        <h2>广告位列表</h2>
        <el-table :data="ads">
            <el-table-column prop="_id" label="id" width="220px">
            </el-table-column>
            <el-table-column prop="name" label="广告位名称"> </el-table-column>
            <el-table-column
                label="广告数量">
                <template v-slot="scope">
                    {{scope.row.items.length}}
                </template>
                </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template v-slot="scope">
                    <el-button
                        @click="
                            $router.push(`/ads/edit/${scope.row._id}`)
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
    name: "AdList",
    data() {
        return {
            ads: []
        }
    },
    methods: {
        async fetch() {
            const res = await this.$http.get('/rest/ads');
            if(res.status === 200) {
                this.ads = res.data;
            }
        },
        async remove(row) {
        this.$confirm(`是否确定要删除广告位 "${row.name}"`, '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: "warning"
        }).then(async ()=> {
            let res = await this.$http.delete('/rest/ads/' + row._id);
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