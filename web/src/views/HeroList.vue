<template>
    <div class="hero-list-page">
        <ListCard class="list-card-heroes" :hideHead="true" paddingXSize="small" :list="heroes">
            英雄列表
            <template #swiperItem="{ category }">
                <div class="hero-item-wrapper d-flex flex-wrap">
                    <HeroesListCardItem v-for="(item, i) of category.list" :key="'heri'+i" :item="item" />
                </div>
            </template>
        </ListCard>
    </div>
</template>

<script>
import ListCard from '../components/ListCard';
import HeroesListCardItem from '../components/HeroesListCardItem';
export default {
    name: 'HeroList',
    data() {
        return {
            heroList: []
        }
    },
    components: {
        ListCard,
        HeroesListCardItem
    },
    computed: {
        heroes() {
            let all = new Set();
            this.heroList.slice(1).forEach(item => {
                item.list.forEach(v=>{
                    all.add(JSON.stringify(v));
                })
            })
            all = [...all].map(v=>JSON.parse(v));
            let obj = {
                name: '全部',
                list: all
            }
            return [obj, ...this.heroList.slice(1)];
        }
    },
    methods: {
        async fetch() {
            let res = await this.$http.get('/heroes/list-simple');
            this.heroList = res.data;
        }
    },
    created() {
        this.fetch();
    },

}
</script>

<style lang="scss">
.hero-list-page .list-card-heroes {
    margin-top: 0;
    background: transparent;
    .card-body {
        padding-top: 15px;
        .heroes-list-card-item {
            margin: 0 8px;
        }
    }
    
}
</style>