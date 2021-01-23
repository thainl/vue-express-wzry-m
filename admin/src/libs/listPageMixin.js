import ListPagination from "@/components/ListPagination";
import ListForm from "@/components/ListForm";
import ListOptionsBtn from "@/components/ListOptionsBtn";
import { getResourceList, deleteResourceItem, deleteResources } from "./api";

export default {
    data() {
        return {
            listData: [],
            pageSize: 10,
            currentPage: 1,
            totalSize: 0,
            searchKeyword: "",
            selectedList: [],
            sortStr: /^\w+:[-]?1$/i.test(this.$route.query.sort)
                ? this.$route.query.sort
                : "",
            sortOrder: ["descending", "ascending"],
            isFetching: false,
            isSearching: false,
            modelName: this.$route.path.match(/\/(\w+?)\//i)[1], // 对应操作模型的名称
            listName: "", // 列表名称
        };
    },
    methods: {
        async search() {
            if(!this.searchKeyword) return;
            this.isSearching = true;
            await this.fetch();
            this.isSearching = false;
        },
        clearSearch() {
            this.currentPage = 1;
            this.fetch();
        },
        handleSizeChange(size) {
            this.pageSize = size;
            this.fetch();
        },
        handleCurrPageChange(p) {
            this.currentPage = p;
            this.fetch();
        },
        async fetch() {
            this.isFetching = true;
            const res = await getResourceList(
                this.modelName,
                this.currentPage,
                this.pageSize,
                this.sortStr,
                this.searchKeyword
            );
            if (res.status === 200) {
                this.listData = res.data.items;
                this.totalSize = res.data.totalCount;
            }
            this.isFetching = false;
            this.isSearching = false;
        },
        // 点击删除单个按钮
        handleClickDeleteOne(row) {
            this.handleShowDeleteConfirm(
                `是否确定要删除${this.listName} "${row.name ||
                    row.title ||
                    row.path}"`,
                this.handleDeleteOne.bind(this, row._id)
            );
        },
        // 点击批量删除按钮
        handleClickDeleteMany() {
            const delContent = this.selectedList
                .map((v) => v.name || v.title || v.path)
                .join("、 <br>");
            const delArr = this.selectedList.map((v) => v._id);
            this.handleShowDeleteConfirm(
                `确定批量删除以下${this.listName}？<br><strong>${delContent}</strong>`,
                this.handleDeleteMany.bind(this, delArr)
            );
        },
        // 弹出删除确认框
        handleShowDeleteConfirm(message, confirmCb) {
            this.$confirm(message, "提示", {
                confirmButtonText: "删除",
                cancelButtonText: "取消",
                type: "warning",
                dangerouslyUseHTMLString: true,
            })
                .then(confirmCb)
                .catch(() => {});
        },
        // 删除单个请求
        async handleDeleteOne(id) {
            let res = await deleteResourceItem(this.modelName, id);
            if (res.data.success) {
                this.$message({
                    type: "success",
                    message: "删除成功",
                });
                this.handleAfterDelete(1);
                this.fetch();
            }
        },
        // 批量删除请求
        async handleDeleteMany(arr) {
            let res = await deleteResources(this.modelName, arr);
            if (res.data.success) {
                this.$message({
                    type: "success",
                    message: "批量删除成功",
                });
                this.handleAfterDelete(this.selectedList.length);
                this.fetch();
                this.selectedList = [];
            }
        },
        // 点击check触发
        handleSelectionChange(val) {
            this.selectedList = val;
        },
        // 排序改变触发
        handleSortChange({ prop, order }) {
            const map = { ascending: 1, descending: -1 };
            if (order) {
                this.sortStr = prop + ":" + map[order];
            } else {
                this.sortStr = "";
            }
            this.fetch();
        },
        handleAfterDelete(num) {
            // 如果删除后不能显示一页，则页数-1
            const size = this.totalSize - num;
            if (size && !(size > (this.currentPage - 1) * this.pageSize)) {
                this.currentPage -= 1;
            }
        },
        testPath(path) {
            return new RegExp("/" + this.modelName + "/edit").test(path);
        }
    },
    mounted() {
        const mapObj = {
            ads: "广告位",
            admin_users: "管理员",
            admin_webs: "后台页面",
            api_rights: "接口权限",
            articles: "文章",
            categories: "分类",
            heroes: "英雄",
            items: "物品",
            menus: "菜单",
            roles: "角色",
        };
        if(this.initialConfig) {
            // 如果从编辑页面到列表页，恢复之前的页面配置
            for(let key in this.initialConfig) {
                this[key] = this.initialConfig[key]
            }
        }
        this.fetch();
        this.listName = mapObj[this.modelName];
    },
    components: {
        ListPagination,
        ListForm,
        ListOptionsBtn,
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            let config = localStorage.getItem('list-page-config');
            if(vm.testPath(from.path) && to.path === '/' + vm.modelName + '/list') {
                // 从编辑页到列表页，恢复页面配置
                config && (vm.initialConfig = JSON.parse(config));
            } else {
                config && localStorage.removeItem('list-page-config');
            }
        });
    },
    beforeRouteLeave (to, from, next) {
        if(this.testPath(to.path) && from.path === '/' + this.modelName + '/list') {
            // 从列表页进入编辑页，保存页面配置
            const  { pageSize, currentPage, searchKeyword, sortStr } = this.$data;
            localStorage.setItem('list-page-config', JSON.stringify({pageSize, currentPage, searchKeyword, sortStr}));
        }
        next();
    }
};
