<template>
    <div class="hero-detail-page bg-white">
        <TopBar type="heroDetail" />
        <div class="hero-banner">
            <img
                class="banner-img"
                :src="model.banner"
                v-if="model.banner"
                alt=""
            />
            <div class="hero-attr">
                <p class="hero-title">{{ model.title }}</p>
                <h3 class="hero-name">{{ model.name }}</h3>
                <p class="hero-category">
                    {{ model.categories.map((v) => v.name).join("/") }}
                </p>
                <div class="banner-bottom d-flex jc-between">
                    <p class="scores d-flex">
                        <span
                            v-for="(val, key, i) in model.scores"
                            :key="'scs' + i"
                            class="score-item"
                            >{{ scoreArr[i]
                            }}<ScoreBadge
                                class="score-icon"
                                :type="`${key}`"
                                :score="val"
                        /></span>
                    </p>
                    <router-link class="skins-link" :to="'/skin-carousel/'+id"
                        >皮肤：{{
                            model.skins ? model.skins.length : ""
                        }}&nbsp;<span class="arrow-right fs-xl"
                            >&gt;</span
                        ></router-link
                    >
                </div>
            </div>
        </div>
        <div class="hero-content">
            <ul class="hero-content-nav d-flex jc-around fs-md">
                <li
                    @click="$refs.tabSwiper.swiper.slideTo(0)"
                    :class="{ active: navIndex == 0 }"
                >
                    英雄初识
                </li>
                <li
                    @click="$refs.tabSwiper.swiper.slideTo(1)"
                    :class="{ active: navIndex == 1 }"
                >
                    进阶攻略
                </li>
            </ul>
            <div class="hero-content-tab">
                <swiper
                    :options="{ autoHeight: false }"
                    ref="tabSwiper"
                    @slide-change="() => (navIndex = $refs.tabSwiper.swiper.realIndex)">
                    <swiper-slide>
                        <div class="hero-basic">
                            <div class="hero-intro d-flex jc-between">
                                <router-link to="#" class="loud-link text-dark-1 fs-md"><i class="icon-vedio"></i>英雄介绍视频</router-link>
                                <router-link :to="'/hero-one-img/'+model.heroId" class="loud-link text-dark-1 fs-md"><i class="icon-img"></i>一图识英雄</router-link>
                            </div>
                            <div class="hero-skill border-bottom">
                                <ul class="skill-icon-list d-flex jc-around">
                                    <li v-for="(item, i) of model.skills" :key="item._id" @click="skillIndex = i" :class="{active: skillIndex == i}">
                                        <img :src="item.icon" alt="">
                                    </li>
                                </ul>
                                <div class="skill-title d-flex">
                                    <h4 class="skill-name text-dark-1">{{currSkill.name}}</h4>
                                    <span class="skill-value" v-if="currSkill.consume">(冷却值：{{currSkill.cooldowns.join('/')}} 消耗：{{currSkill.consume}})</span>
                                </div>
                                <div class="skill-desc fs-md text-dark-1">{{currSkill.description}}</div>
                                <div class="prompt">小提示：{{currSkill.tips}}</div>
                            </div>
                            <div class="hero-recommended-skill panel">
                                <HeroPanel title="加点建议" icon="skill">
                                    <div class="re-skill-list d-flex">
                                        <div class="skill-item d-flex flex-column skill-1">
                                            <span class="title">主升</span>
                                            <img :src="recommendedSkill1.icon" alt="">
                                            <span class="name">{{recommendedSkill1.name}}</span>
                                        </div>
                                        <div class="skill-item d-flex flex-column skill-2">
                                            <span class="title">副升</span>
                                            <img :src="recommendedSkill2.icon" alt="">
                                            <span class="name">{{recommendedSkill2.name}}</span>
                                        </div>
                                        <div class="skill-item summoner-skill">
                                            <span class="title">召唤师技能</span>
                                            <div class="summoner-skill-list d-flex">
                                                <div class="summoner-item" v-for="item of model.recommendedSummoners" :key="item._id">
                                                    <img :src="item.icon" alt="">
                                                    <span class="name">{{item.name}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </HeroPanel>
                                <HeroPanel title="出装推荐" icon="item">
                                    <div class="recommended-items">
                                        <div class="items1" v-if="model.recommendedItem1">    
                                            <h4 class="title">顺风出装</h4>
                                            <ul class="item-list d-flex jc-around">
                                                <li v-for="item of model.recommendedItem1.items" :key="item._id">
                                                    <img :src="item.icon" alt="">
                                                    <span class="name">{{item.name}}</span>
                                                </li>
                                            </ul>
                                            <p class="prompt">小提示：{{model.recommendedItem1.tips}}</p>
                                        </div>
                                        <div class="items2" v-if="model.recommendedItem2">    
                                            <h4 class="title">逆风出装</h4>
                                            <ul class="item-list d-flex jc-around">
                                                <li v-for="item of model.recommendedItem2.items" :key="item._id">
                                                    <img :src="item.icon" alt="">
                                                    <span class="name">{{item.name}}</span>
                                                </li>
                                            </ul>
                                            <p class="prompt">小提示：{{model.recommendedItem2.tips}}</p>
                                        </div>
                                    </div>
                                </HeroPanel>
                            </div>
                            <div class="hero-ming panel">
                                <HeroPanel title="铭文推荐" icon="ming">
                                    <ul class="ming-list d-flex">
                                        <li v-for="item of model.recommendedMings" :key="item._id">
                                            <img :src="item.icon" alt="">
                                            <p class="name">{{item.name}}</p>
                                            <div class="effect" v-html="item.effect"></div>
                                        </li>
                                    </ul>
                                </HeroPanel>
                            </div>
                            <div class="hero-tips panel">
                                <HeroPanel title="使用技巧" icon="usage">
                                    <p class="tips-txt">{{model.usageTips}}</p>
                                </HeroPanel>
                            </div>
                            <div class="hero-tips panel">
                                <HeroPanel title="对抗技巧" icon="battle">
                                    <p class="tips-txt">{{model.battleTips}}</p>
                                </HeroPanel>
                            </div>
                            <div class="hero-tips panel">
                                <HeroPanel title="团战思路" icon="team">
                                    <p class="tips-txt">{{model.teamTips}}</p>
                                </HeroPanel>
                            </div>
                            <div class="hero-related panel">
                                <HeroPanel title="英雄关系" icon="related">
                                    <div class="related-item border-b">
                                        <h4 class="title">最佳搭档</h4>
                                        <ul class="related-heroes">
                                            <li class="d-flex" v-for="item of model.partners" :key="item._id">
                                                <router-link :to="'/heroes/'+item.hero._id"><img :src="item.hero.avatar" alt=""></router-link>
                                                <p class="desc">{{item.description}}</p>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="related-item border-b">
                                        <h4 class="title">被谁克制</h4>
                                        <ul class="related-heroes">
                                            <li class="d-flex" v-for="item of model.reRestraints" :key="item._id">
                                                <router-link :to="'/heroes/'+item.hero._id"><img :src="item.hero.avatar" alt=""></router-link>
                                                <p class="desc">{{item.description}}</p>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="related-item">
                                        <h4 class="title">克制谁</h4>
                                        <ul class="related-heroes">
                                            <li class="d-flex" v-for="item of model.restraints" :key="item._id">
                                                <router-link :to="'/heroes/'+item.hero._id"><img :src="item.hero.avatar" alt=""></router-link>
                                                <p class="desc">{{item.description}}</p>
                                            </li>
                                        </ul>
                                    </div>
                                </HeroPanel>
                            </div>
                        </div>
                    </swiper-slide>
                    <swiper-slide>
                        <div class="hero-advanced">
                            <p class="text-grey text-center">暂无攻略</p>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
    </div>
</template>

<script>
import TopBar from "../components/TopBar";
import ScoreBadge from "../components/ScoreBadge";
import HeroPanel from '../components/HeroPanel';
export default {
    name: "HeroDetail",
    props: {
        id: { require: true },
    },
    data() {
        return {
            model: {
                categories: [],
                skills: []
            },
            scoreArr: ["难度", "技能", "攻击", "生存"],
            navIndex: 0,
            skillIndex: 0,
        };
    },
    computed: {
        currSkill() {
            if(this.model.skills.length > 0) {
                return this.model.skills[this.skillIndex];
            }else {
                return {
                    cooldowns: []
                }
            }
        },
        recommendedSkill1() {
            if(this.model.skills.length > 0) {
                return this.model.skills.filter(s=> s._id == this.model.recommendedSkill1)[0];
            }else {
                return {}
            }
        },
        recommendedSkill2() {
            if(this.model.skills.length > 0) {
                return this.model.skills.filter(s=> s._id == this.model.recommendedSkill2)[0];
            }else {
                return {}
            }
        },

    },
    watch: {
        id() {
            this.fetch();
        }
    },
    methods: {
        async fetch() {
            const res = await this.$http.get("/heroes/" + this.id);
            this.model = res.data;
        },
    },
    created() {
        this.fetch();
    },
    components: {
        ScoreBadge,
        TopBar,
        HeroPanel,
    },
};
</script>

<style lang="scss">
.hero-detail-page {
    padding-top: 45px;
    .hero-banner {
        position: relative;
        width: 100%;
        height: 190px;
        background-color: #d59b40;
        .banner-img {
            display: block;
            width: 100%;
            height: 100%;
        }
        .hero-attr {
            position: absolute;
            left: 0;
            top: 0px;
            width: 100%;
            height: 100%;
            padding: 102px 15px 0;
            color: #fff;
            background: url("../assets/img/bt.png");
            background-size: contain;
            > p {
                opacity: 0;
                animation: txtshow 1s forwards;
            }
            .hero-title {
                height: 18px;
            }
            .hero-name {
                font-size: 17px;
                font-weight: bold;
                margin-top: -1px;
                opacity: 0;
                animation: txtshow 1s forwards;
                animation-delay: 0.2s;
            }
            .hero-category {
                margin-top: -3px;
                animation-delay: 0.4s;
            }
            .banner-bottom {
                .scores {
                    .score-item {
                        opacity: 0;
                        animation: txtshow 0.5s 0.5s forwards;
                        &:nth-of-type(2) {
                            animation-delay: 0.7s;
                        }
                        &:nth-of-type(3) {
                            animation-delay: 0.9s;
                        }
                        &:nth-of-type(4) {
                            animation-delay: 1.1s;
                        }
                    }
                    .score-icon {
                        margin: 0 5px 0 2px;
                        transform: scale(0.7);
                        vertical-align: middle;
                    }
                }
                .skins-link {
                    color: #b6afa8;
                    margin-top: -4px;
                    .arrow-right {
                        font-family: cursive;
                        vertical-align: -1px;
                    }
                }
            }
        }
    }
    .hero-content {
        .hero-content-nav {
            padding-top: 12px;
            padding-bottom: 6px;
            margin: 0 12px;
            border-bottom: 1px solid #d4d9de;
            > li {
                height: 20px;
                border-bottom: 2px solid transparent;
                &.active {
                    color: #d59b40;
                    border-color: #d59b40;
                }
            }
        }
        .hero-content-tab {
            min-height: calc(100vh - 277px);
            .hero-advanced {
                min-height: 391px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
}
.hero-detail-page .hero-content-tab .hero-basic .hero-intro {
    padding: 9px 12px 13px;
    .loud-link {
        height: 39px;
        width: 172px;
        line-height: 37px;
        background-color: #fcfcfc;
        border: 1px solid #eceef0;
        border-radius: 5px;
        >i {
            display: inline-block;
            height: 20px;
            width: 20px;
            background-repeat: no-repeat;
            background-size: contain;
            vertical-align: -5px;
            background-position: center;
            &.icon-vedio {
                background-image: url('../assets/img/icon_06.png');
                margin-left: 33px;
                margin-right: 8px;
            }
            &.icon-img {
                background-image: url('../assets/img/icon_07.png');
                background-size: 19px 19px;
                margin-left: 29px;
                margin-right: 18px;
            }
        }
    }
}
.hero-detail-page .hero-content-tab .hero-basic .hero-skill {
    margin: 15px 12px 0;
    .skill-icon-list {
        li {
            width: 60px;
            height: 60px;
            border-radius: 29px;
            border: 2px solid  transparent;
            box-sizing: content-box;
            &.active {
                background-color: #d59b40;
            }
            img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
            }
        }
    }
    .skill-title {
        margin-top: 21px;
        .skill-name {
            font-size: 15px;
            font-weight: bold;
            margin-right: 19px;
        }
        .skill-value {
            color: #7a7a80;
            line-height: 20px;
        }
    }
    .skill-desc {
        margin-top: 17px;
        margin-bottom: 10px;
        line-height: 20px;
    }
}
.hero-content-tab .panel {
    border-top: 9.5px solid #ededed;
    border-bottom: 1px solid #d4d9de;
}
.hero-detail-page .hero-content-tab .hero-basic .hero-recommended-skill {
    border-top-width: 11px;
    .skill-item {
        margin-left: 40px;
        text-align: center;
        .title {
            display: block;
            font-size: 15px;
            line-height: 15px;
            margin-bottom: 12px;
        }
        .name {
            display: block;
            height: 9px;
            line-height: 9px;
            padding: 10px 0 12.5px;
            box-sizing: content-box;
        }
        img {
            display: block;
            width: 60px;
            height: 60px;
            border-radius: 50%;
        }
        &.skill-1 {
            margin-left: 8px;
        }
        &.summoner-skill {
            .summoner-item {
                &:nth-child(1) {
                    margin-right: 10px;
                }
            }
        }
    }
}
.hero-detail-page .hero-content-tab .hero-basic .recommended-items {
    .items1 {
        border-bottom: 1px solid #d4d9de;
        margin-bottom: 13px;
    }
    .title {
        height: 14px;
        line-height: 14px;
        font-size: 15px;
        margin-bottom: 12.5px;
    }
    .item-list {
        >li {
            img{
                display: block;
                width: 46.5px;
                height: 46.5px;
                border-radius: 50%;
            }
            .name {
                display: block;
                text-align: center;
                margin: 8px 0 3px;
                height: 13px;
                line-height: 13px;
            }
        }
    }
}
.hero-detail-page .hero-content-tab .hero-basic .hero-ming {
    .ming-list {
        >li {
            width: 33.333%;
            margin-bottom: 13.5px;
            img{
                width: 33.5px;
                height: 39.5px;
            }
            .name {
                font-size: 15px;
                height: 15px;
                line-height: 15px;
                margin-left: 10.5px;
            }
            .effect {
                margin-left: 10.5px;
            }
        }
    }
}
.hero-detail-page .hero-content-tab .hero-basic .hero-tips {
    .tips-txt {
        color: #343440;
        font-size: 13px;
        line-height: 20px;
        margin-bottom: 5.5px;
    }
}
.hero-detail-page .hero-content-tab .hero-basic .hero-related {
    .related-item {
        &.border-b {
            border-bottom: 1px solid #d4d9de;
            margin-bottom: 10px;
        }
        .title {
            font-size: 15px;
            height: 14px;
            line-height: 14px;
            margin-bottom: 12.5px;
        }
        .related-heroes {
            >li {
                margin-bottom: 15px;
                justify-content: space-between;
                img {
                    display: block;
                    height: 48px;
                    width: 48px;
                }
                .desc {
                    padding-top: 2.5px;
                    width: 293px;
                    font-size: 13px;
                    line-height: 20px;
                    color: #343440;
                }
            }
        }
    }
}
@keyframes txtshow {
    from {
        opacity: 0;
        transform: translateX(-100px);
    }

    to {
        opacity: 1;
        transform: none;
    }
}
.hero-detail-page .swiper-slide{height:1px}
.hero-detail-page .swiper-slide-active { height:auto}
</style>