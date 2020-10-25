<template>
    <el-container style="height: 100vh">
        <el-aside width="200px">
            <el-menu :default-active="$route.path" :router="true"  unique-opened>
                <el-submenu index="1">
                    <template slot="title"
                        ><i class="el-icon-message"></i>内容管理</template
                    >
                    <el-menu-item-group>
                        <template slot="title">物品</template>
                        <el-menu-item index="/items/create">新建物品</el-menu-item>
                        <el-menu-item index="/items/list">物品列表</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group>
                        <template slot="title">英雄</template>
                        <el-menu-item index="/heroes/create">新建英雄</el-menu-item>
                        <el-menu-item index="/heroes/list">英雄列表</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="2">
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
                <el-submenu index="3">
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
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title"
                        ><i class="el-icon-connection"></i>权限管理</template
                    >
                    <el-menu-item-group>
                        <template slot="title">API接口</template>
                        <el-menu-item index="/api_urls/create">新建API接口</el-menu-item>
                        <el-menu-item index="/api_urls/list">API接口列表</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group>
                        <template slot="title">后台权限</template>
                        <el-menu-item index="/server_rights/create">新建后台权限</el-menu-item>
                        <el-menu-item index="/server_rights/list">后台权限列表</el-menu-item>
                        <el-menu-item index="/test">test</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group>
                        <template slot="title">角色</template>
                        <el-menu-item index="/roles/create">新建角色</el-menu-item>
                        <el-menu-item index="/roles/list">角色列表</el-menu-item>
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
</style>

<script>
export default {
    data() {
        return {
            user: {}
        };
    },
    methods: {
        exit() {
            localStorage.removeItem('token');
            this.$message({
                type: 'success',
                message: '退出成功'
            });
            this.$router.push('/login');
        }
    },
    async created() {
        const res = await this.$http.get('/userinfo');
        this.user = res.data;
    },
};
</script>