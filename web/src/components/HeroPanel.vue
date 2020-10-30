<template>
    <div class="hero-panel">
        <h3 class="hero-panel-title" :style="{'background-image': `url(${iconPath})`}">{{title}}</h3>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'HeroPanel',
        props: {
            title: String,
            icon: {
                type: String,
                default: 'skill',
                validator(val) {
                    return ['skill', 'item', 'ming', 'usage', 'battle', 'team', 'related'].indexOf(val) !== -1
                }
            }
        },
        data() {
            return {
                iconMapping: {
                    skill: '16',
                    item: '11',
                    ming: '12',
                    usage: '13',
                    battle: '14',
                    team: '15',
                    related: '08'
                }
            }
        },
        computed: {
            iconPath() {
                return require (`../assets/img/icon_${this.iconMapping[this.icon]}.png`)
            }
        },
    }
</script>

<style lang="scss">
.hero-panel {
    margin: 15px 12px 0;
    .hero-panel-title {
        font-size: 16px;
        height: 17px;
        line-height: 17px;
        box-sizing: content-box;
        color: #000;
        padding-left: 19.5px;
        padding-bottom: 12.5px;
        background-repeat: no-repeat;
        background-position: 0 1px;
        background-size: 13px 13px;
        font-weight: 700;
    }
}
</style>