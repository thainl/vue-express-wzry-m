<template>
    <span class="score-badge-com" :style="{'background-position': `${x/fontsizeBase}rem ${y/fontsizeBase}rem`}">
    </span>
</template>

<script>
export default {
    name: 'ScoreBadge',
    props: {
        type: {
            type: String,
            validator(val) {
                return ['survive','attack', 'skills','difficult'].indexOf(val) !== -1;
            }
        },
        score: {
            type: Number,
            validator(val) {
                return val >= 1 && val <= 10;
            }
        }
    },
    data() {
        return {
            arr: ['survive','attack', 'skills','difficult'],
            fontsizeBase: 25,
        }
    },
    computed: {
        x() {
            let i = this.arr.indexOf(this.type);
            return this.getPos(i);
        },
        y() {
            return this.getPos(this.score - 1);
        }
    },
    methods: {
        getPos(index) {
            if(index === 0) {
                return 0;
            }
            return -index * 20 - Math.floor(index / 2);
        }
    },
}
</script>

<style lang="scss">
.score-badge-com {
    display: inline-block;
    height: 19px;
    width: 19px;
    background-image: url('../assets/img/hero-attrsp.png');
    background-repeat: no-repeat;
    background-size: 200px;
    background-position: 0 0;
}
</style>