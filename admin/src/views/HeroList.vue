<template>
    <div class="hero-list">
        <h2>英雄列表</h2>
        <el-table :data="heros">
            <el-table-column prop="_id" label="id" width="220px">
            </el-table-column>
            <el-table-column prop="name" label="英雄名称"> </el-table-column>
            <el-table-column prop="categories[0].name" label="英雄分类">
                <template v-slot="scope">
                    <span v-for="(item, i) of scope.row.categories" :key="i + item._id">
                        {{item.name}}<span v-if="i < scope.row.categories.length - 1">/</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="英雄头像">
                <template v-slot="scope">
                    <img
                        v-if="scope.row.avatar"
                        id="hero-icon"
                        :src="scope.row.avatar"
                        :alt="scope.row.name"
                    />
                    <template v-else>暂无头像</template>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="210">
                <template v-slot="scope">
                    <el-button
                        @click="$router.push(`/heros/detail/${scope.row._id}`)"
                        size="small"
                        >详情</el-button
                    >
                    <el-button
                        @click="$router.push(`/heros/edit/${scope.row._id}`)"
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
            heros: [],
        };
    },
    methods: {
        async fetch() {
            const res = await this.$http.get("/rest/heros");
            if (res.status === 200) {
                this.heros = res.data;
            }
        },
        async remove(row) {
            this.$confirm(`是否确定要删除英雄 "${row.name}"`, "提示", {
                confirmButtonText: "删除",
                cancelButtonText: "取消",
                type: "warning",
            }).then(async () => {
                let res = await this.$http.delete("/rest/heros/" + row._id);
                if (res.data.success) {
                    this.$message({
                        type: "success",
                        message: "删除成功",
                    });
                    this.fetch();
                }
            }).catch(() => {});
        },
    },
    created() {
        this.fetch();
    },
};
</script>

<style>
#hero-icon {
    width: 50px;
    height: 50px;
}
</style>