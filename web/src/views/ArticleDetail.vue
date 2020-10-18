<template>
    <div class="article-detail">
        <div class="head d-flex jc-between">
            <span class="back-btn" @click="$router.back(-1)"></span>
            <h3 class="title flex-1 text-ellipsis fs-md">{{ model.title }}</h3>
            <span class="date">{{ model.createdAt | formatDate }}</span>
        </div>
        <div class="body">
            <div class="content" v-if="model.body" v-html="model.body"></div>
            <div class="no-content text-center text-light" v-else>暂无内容</div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
export default {
    name: "ArticleDetail",
    props: {
        id: String,
    },
    data() {
        return {
            model: {}
        }
    },
    filters: {
        formatDate(val) {
            return dayjs(val).format('YYYY-MM-DD');
        }
    },
    methods: {
        async fetch() {
            const res = await this.$http.get('/articles/' + this.id);
            this.model = res.data;
        }
    },
    created() {
        this.fetch();
    },
};
</script>

<style lang="scss">
.article-detail {
    .head {
        padding: 0 6px;
        height: 37px;
        line-height: 37px;
        border-bottom: 1px solid #d4d4d5;
        margin-bottom: 10px;
        .back-btn {
            height: 37px;
            width: 9px;
            background: url('../assets/img/backBg.png') center 10px no-repeat;
            background-size: 100%;
        }
        .title {
            color: #4394e4;
            font-weight: bold;
            margin: 0 3px 0 8px;
        }
        .date {
            color: #9fa0a0;
        }
    }
}
</style>