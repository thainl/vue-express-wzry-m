<template>
    <div class="article-detail">
        <div class="head d-flex jc-between">
            <span class="back-btn" @click="$router.back(-1)"></span>
            <h3 class="title flex-1 text-ellipsis fs-md">{{ model.title }}</h3>
            <span class="date">{{ model.createdAt | formatDate }}</span>
        </div>
        <div class="body">
            <div class="content" v-if="model.body" v-html="model.body"></div>
            <div class="no-content text-center text-grey" v-else>暂无内容</div>
        </div>
        <div class="footer">
            <div class="related-title">相关资讯</div>
            <div class="related-news">
                <ul>
                    <li class="d-flex jc-between fs-lg" v-for="(item, i) of model.related" :key="'relnew'+i"><router-link class="link text-ellipsis" :to="`/articles/${item._id}`">{{item.title}}</router-link><span class="date">{{item.createdAt|formatDate}}</span></li>
                </ul>
            </div>
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
    watch: {
        // 当id发生改变时出现获取数据，两种写法
        // id: 'fetch',
        id() {
            this.fetch();
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
    padding-bottom: 44px;
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
            margin: 0 15px 0 8px;
        }
        .date {
            color: #9fa0a0;
        }
    }
    .body {
        min-height: 60vh;
        .content {
            font-size: 16px;
            padding: 0 19px;
            margin-bottom: 20px;
            p {
                line-height: 1.5;
                margin-bottom: 10px;
                font-size: 16px;
            }
            img {
                width: 100%;
                height: auto;
            }
            iframe {
                width: 100%;
                height: 100%;
            }
            h1, h2, h3, h4, h5, h6 {
                line-height: 1.8;
            }
            h1 {
                font-size: 1.5em;
            }
            h2 {
                font-size: 1.2em;
            }
            h3 {
                font-size: 1.1em;
            }
            h4 {
                font-size: 1em;
            }
            h5 {
                font-size: 0.83em;
            }
            h6 {
                font-size: 0.67em;
            }

        }
    }
    .footer {
        .related-title {
            height: 38px;
            margin-left: 20px;
            margin-bottom: 5px;
            padding-left: 29px;
            background-image: url('../assets/img/lin.png');
            background-repeat: no-repeat;
            background-position: 0 center;
            line-height: 38px;
            font-size: 14px;
            color: #4394e4;
            font-weight: 700;
        }
        .related-news {
            padding-left: 19px;
            padding-right: 8px;
            ul{
                li {
                    margin-bottom: 3px;
                    .link {
                        width: 75%;
                    }
                    .date {
                        color: #9fa0a0;
                    }
                }
            }
        }
    }
}
</style>