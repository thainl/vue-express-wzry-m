<template>
    <div>
        <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[1, 2, 3]"
            :default-checked-keys="[]"
            :props="defaultProps"
            @check="checkChange"
            ref="tree"
        >
        </el-tree>
    </div>
</template>

<script>
export default {
    name: "Test",
    data() {
        return {
            data: [
                {
                    id: 1,
                    label: "内容管理",
                    children: [
                        {
                            id: 4,
                            label: "英雄管理",
                            children: [
                                {
                                    id: 9,
                                    label: "英雄列表界面",
                                    children: [
                                        {
                                            id: 19,
                                            label: '添加'
                                        },
                                        {
                                            id: 20,
                                            label: '删除'
                                        },
                                    ]
                                },
                                {
                                    id: 10,
                                    label: "英雄编辑界面",
                                },
                                {
                                    id: 11,
                                    label: "英雄添加界面",
                                },
                            ],
                        },
                        {
                            id: 15,
                            label: "物品管理",
                            children: [
                                {
                                    id: 16,
                                    label: "物品列表界面",
                                },
                                {
                                    id: 17,
                                    label: "物品编辑界面",
                                },
                                {
                                    id: 18,
                                    label: "物品添加界面",
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 2,
                    label: "营运管理",
                    children: [
                        {
                            id: 5,
                            label: "文章管理",
                            children: [
                                {
                                    id: 12,
                                    label: "文章列表界面",
                                },
                                {
                                    id: 13,
                                    label: "文章编辑界面",
                                },
                                {
                                    id: 14,
                                    label: "文章添加界面",
                                },
                            ],
                        },
                        {
                            id: 6,
                            label: "二级 2-2",
                        },
                    ],
                },
                {
                    id: 3,
                    label: "一级 3",
                    children: [
                        {
                            id: 7,
                            label: "二级 3-1",
                        },
                        {
                            id: 8,
                            label: "二级 3-2",
                        },
                    ],
                },
            ],
            defaultProps: {
                children: "children",
                label: "label",
            },
        };
    },
    methods: {
        checkChange() {
            console.log(this.$refs.tree.getNode([2, 3]))
        }
    },
};
</script>

<style lang="scss">
</style>