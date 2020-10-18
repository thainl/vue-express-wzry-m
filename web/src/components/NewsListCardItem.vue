<template>
    <div class="news-list-card-item d-flex jc-between">
        <span class="category-tag fs-sm" :class="{hot: item.categoryName == '热门', news: item.categoryName == '新闻', notice: item.categoryName == '公告', activity: item.categoryName == '活动', match: item.categoryName == '赛事', }">{{ item.categoryName }}</span>
        <p class="title flex-1 text-ellipsis fs-lg"><router-link :to="`/articles/${ item._id }`">{{ item.title }}</router-link></p>
        <span class="date">{{ item.createdAt | formatDate }}</span>
    </div>
</template>

<script>
    import dayjs from 'dayjs';
    export default {
        name: 'NewsListCardItem',
        props: {
            item: Object
        },
        filters: {
            formatDate(val) {
                return dayjs(val).format('MM/DD');
            }
        }
    }
</script>

<style lang="scss">
.news-list-card-item {
    height: 19px;
    line-height: 19px;
    margin-bottom: 15px;
    .category-tag {
        color: #ff3636;
        padding: 1px 2px;
        margin-left: 1px;
        margin-right: 4px;
        border-radius: 2.5px;
        border: 1px solid #ff3636;
        line-height: 16px;
        &.hot {
            color:  #ff3636;
            border-color: #ff3636;
        }
        &.news {
            color: #1e96ab;
            border-color: #1e96ab;
        }
        &.notice {
            color: #f09a37;
            border-color: #f09a37;
        }
        &.activity {
            color: #ff3636;
            border-color: #ff3636;
        }
        &.match {
            color:#4d9cff;
            border-color:#4d9cff;
        }

    }
    .title {
        margin-right: 5px;
        line-height: 20px;
    }
    .date {
        color: #999;
    }
}
</style>