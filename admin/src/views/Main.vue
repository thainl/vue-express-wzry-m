<template>
    <el-container style="height: 100vh">
        <el-aside width="200px">
            <el-menu :default-active="$route.path" :router="true"  unique-opened>
                <!-- <el-submenu index="11">
                    <template slot="title"
                        ><i class="el-icon-message"></i>内容管理</template
                    >
                    <el-menu-item-group>
                        <template slot="title">物品</template>
                        <el-menu-item index="/items/create"><i class="el-icon-circle-plus-outline" />新建物品</el-menu-item>
                        <el-menu-item index="/items/list"><i class="el-icon-s-grid" />物品列表</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group>
                        <template slot="title">英雄</template>
                        <el-menu-item index="/heroes/create">新建英雄</el-menu-item>
                        <el-menu-item index="/heroes/list">英雄列表</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="12">
                    <template slot="title"
                        ><i class="el-icon-odometer"></i>运营管理</template
                    >
                    <el-menu-item-group>
                        <template slot="title">文章</template>
                        <el-menu-item index="/articles/create">新建文章</el-menu-item>
                        <el-menu-item index="/articles/list">文章列表</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group>
                        <template slot="title">广告位</template>
                        <el-menu-item index="/ads/create">新建广告位</el-menu-item>
                        <el-menu-item index="/ads/list">广告位列表</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="13">
                    <template slot="title"
                        ><i class="el-icon-reading"></i>界面管理</template
                    >
                    <el-menu-item-group>
                        <template slot="title">菜单</template>
                        <el-menu-item index="/menus/create">新建菜单</el-menu-item>
                        <el-menu-item index="/menus/list">菜单列表</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group>
                        <template slot="title">后台页面</template>
                        <el-menu-item index="/admin_webs/create">新建后台页面</el-menu-item>
                        <el-menu-item index="/admin_webs/list">后台页面列表</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="14">
                    <template slot="title"
                        ><i class="el-icon-connection"></i>权限管理</template
                    >
                    <el-menu-item-group>
                        <template slot="title">接口权限</template>
                        <el-menu-item index="/api_rights/create">新建接口权限</el-menu-item>
                        <el-menu-item index="/api_rights/list">接口权限列表</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group>
                        <template slot="title">角色</template>
                        <el-menu-item index="/roles/create">新建角色</el-menu-item>
                        <el-menu-item index="/roles/list">角色列表</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="15">
                    <template slot="title"
                        ><i class="el-icon-setting"></i>系统设置</template
                    >
                    <el-menu-item-group>
                        <template slot="title">分类</template>
                        <el-menu-item index="/categories/create">新建分类</el-menu-item>
                        <el-menu-item index="/categories/list">分类列表</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group>
                        <template slot="title">管理员</template>
                        <el-menu-item index="/admin_users/create">新建管理员</el-menu-item>
                        <el-menu-item index="/admin_users/list">管理员列表</el-menu-item>
                    </el-menu-item-group>
                </el-submenu> -->
                <el-submenu v-for="(cate, i) of menuData" :key="cate._id" :index="i+1 + ''">
                    <template slot="title"
                        ><i :class="cate.icon"></i>{{cate.name}}</template
                    >
                    <el-menu-item-group v-for="group of cate.children" :key="group._id">
                        <template slot="title"><i :class="group.icon" />{{group.name}}</template>
                        <template v-for="item of group.children">
                            <el-menu-item v-if="item.menu.isShow" :key="item.menu._id" :index="item.path"><i :class="item.menu.icon" />{{item.menu.name}}</el-menu-item>
                        </template>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-aside>

        <el-container>
            <el-header style="text-align: right; font-size: 12px">
                <el-dropdown>
                    <i class="el-icon-switch-button" style="margin-right: 15px;cursor: pointer"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="exit">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span>{{user.name || '未登录'}}</span>
            </el-header>

            <el-main>
                <router-view  :key="$route.path" />
            </el-main>
        </el-container>
    </el-container>
</template>

<style>
.el-header {
    background-color: #b3c0d1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
}
.el-menu-item-group__title {
    color: #606266;
    background: #f4f4f5;
}
</style>

<script>
import { makeWebTree } from '@/assets/js/utils.js';
import { initDynamicRoutes } from '@/router/index.js';
export default {
    name: 'Main',
    data() {
        return {
            user: {}
        };
    },
    computed: {
        menuData() {
            let res = [];
            if(this.user.adminWebs && this.user.adminWebs.length > 0) {
                let arr = this.user.adminWebs.map(v => v.web);
                res = makeWebTree(arr);
            }
            return res;
        }
    },
    methods: {
        exit() {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('adminWebs');
            this.$message({
                type: 'success',
                message: '退出成功'
            });
            this.$router.push('/login');
        },
        async getUserInfo() {
            const res = await this.$http.get('/userinfo');
            this.user = res.data;
            sessionStorage.setItem('adminWebs', JSON.stringify(res.data.adminWebs));
            initDynamicRoutes();
        }
    },
    created() {
        this.getUserInfo();
    },
};
</script>