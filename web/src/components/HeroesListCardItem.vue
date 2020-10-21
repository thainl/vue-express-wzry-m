<template>
    <div class="heroes-list-card-item">
        <router-link to="/">
            <img :src="item.avatar" alt="">
            <span class="name text-center fs-sm">{{ item.name }}</span>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: 'HeroesListCardItem',
        props: {
            item: Object
        }
    }
</script>

<style lang="scss">
.heroes-list-card-item {
    width: 58px;
    height: 87px;
    margin: 0 7px;
    // margin-right: 0.5rem;
    // &:nth-of-type(5n) {
    //     margin-right: 0;
    // }
    // &:nth-of-type(5n+1) {
    //     margin-left: 0.02rem;
    // }
    img {
        display: block;
        width: 98%;
        border-radius: 2px;
    }
    .name {
        display: block;
        font-weight: 500;
        line-height: 18px;
        margin-top: 6px;
    }
}
</style>