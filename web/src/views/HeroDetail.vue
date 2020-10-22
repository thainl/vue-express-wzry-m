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
                    <router-link class="skins-link" to="##"
                        >皮肤：{{ model.skins ? model.skins.length : '' }}&nbsp;<span
                            class="arrow-right fs-xl"
                            >&gt;</span
                        ></router-link
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TopBar from "../components/TopBar";
import ScoreBadge from "../components/ScoreBadge";
export default {
    name: "HeroDetail",
    props: {
        id: { require: true },
    },
    data() {
        return {
            model: {
                categories: [],
            },
            scoreArr: ["难度", "技能", "攻击", "生存"],
        };
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
    },
};
</script>

<style lang="scss">
.hero-detail-page {
    padding-top: 45px;
    .hero-banner {
        position: relative;
        width: 100%;
        height: 191px;
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
</style>