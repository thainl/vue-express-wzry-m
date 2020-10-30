<template>
    <div class="hero-one-img-page">
        <TopBar type="heroDetail" />
        <img :src="`https://game.gtimg.cn/images/yxzj/m/m201706/images/heropicdetail/${id}.jpg`">
    </div>
</template>

<script>
import TopBar from '../components/TopBar';
export default {
    name: 'HeroOneImg',
    props: {
        id: {
            require: true
        }
    },
    components: {
        TopBar
    }
}
</script>

<style lang="scss">
.hero-one-img-page {
    padding-top: 45px;
    img{
        display: block;
        width: 100%;
    }
}
</style>