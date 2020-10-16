<template>
    <div class="hero-edit">
        <h2>
            {{ disableForm ? "查看" : _id ? "编辑" : "新建" }}英雄
            <el-button
                @click="$router.push(`/heros/edit/${_id}`)"
                v-if="disableForm"
                title="编辑英雄"
                type="primary"
                size="mini"
                icon="el-icon-edit"
                circle
            ></el-button>
        </h2>
        <el-form
            :disabled="disableForm"
            @submit.native.prevent="save"
            ref="ruleForm"
            :model="model"
            :rules="rules"
            label-width="120px"
        >
            <el-tabs value="basic" type="border-card">
                <el-tab-pane name="basic" label="基础信息">
                    <el-form-item
                        label="名称"
                        prop="name"
                        :error="nameErrorTip"
                    >
                        <el-input
                            placeholder="输入英雄名称"
                            v-model="model.name"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="分类" prop="categories">
                        <el-select
                            v-model="model.categories"
                            multiple
                            placeholder="选择英雄分类"
                        >
                            <el-option
                                v-for="item in categories"
                                :key="item._id"
                                :label="item.name"
                                :value="item._id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数值" prop="scores">
                        <div class="score-item">
                            难度：
                            <el-rate
                                v-model="model.scores.difficult"
                                :max="10"
                                :texts="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                                show-text
                            >
                            </el-rate>
                        </div>
                        <div class="score-item">
                            技能：
                            <el-rate
                                v-model="model.scores.skills"
                                :max="10"
                                :texts="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                                show-text
                            >
                            </el-rate>
                        </div>
                        <div class="score-item">
                            攻击：
                            <el-rate
                                v-model="model.scores.attack"
                                :max="10"
                                :texts="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                                show-text
                            >
                            </el-rate>
                        </div>
                        <div class="score-item">
                            生存：
                            <el-rate
                                v-model="model.scores.survive"
                                :max="10"
                                :texts="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                                show-text
                            >
                            </el-rate>
                        </div>
                    </el-form-item>
                    <el-form-item label="头像" prop="avatar">
                        <div class="form-img-item">
                            <el-upload
                                class="icon-uploader"
                                :action="uploadUrl"
                                :headers="getAuthHeaders()"
                                :show-file-list="false"
                                :on-success="handleIconSuccess"
                                title="点击选择图片上传"
                            >
                                <img
                                    v-if="model.avatar"
                                    :src="model.avatar"
                                    class="icon"
                                />
                                <i
                                    v-else
                                    class="el-icon-plus avatar-uploader-icon"
                                ></i>
                            </el-upload>
                            <el-input
                                placeholder="输入图片url地址或者点击上传按钮上传图片"
                                v-model="model.avatar"
                            ></el-input>
                        </div>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane name="skill" label="技能">
                    <section
                        class="section-item"
                        v-for="(item, i) of model.skills"
                        :key="'sk' + i"
                    >
                        <h4>
                            <span>技能{{ i + 1 }}：</span>
                            <span v-show="!disableForm">
                                <el-button
                                    icon="el-icon-plus"
                                    size="mini"
                                    circle
                                    title="在前面添加一项"
                                    @click="
                                        model.skills.splice(
                                            i,
                                            1,
                                            { cooldowns: [0], consume: 0 },
                                            item
                                        )
                                    "
                                ></el-button
                                ><el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    circle
                                    title="删除"
                                    @click="removeSkill(item, i)"
                                ></el-button
                            ></span>
                        </h4>
                        <el-form-item
                            label="名称"
                            :prop="`skills.${i}.name`"
                            :rules="[
                                {
                                    required: true,
                                    message: '技能名称不能为空',
                                    trigger: 'blur',
                                },
                            ]"
                        >
                            <el-input v-model="item.name"></el-input>
                        </el-form-item>
                        <el-form-item
                            label="图标"
                            :prop="`skills.${i}.icon`"
                            :rules="[
                                {
                                    required: true,
                                    message: '技能图标不能为空',
                                    trigger: 'blur',
                                },
                                {
                                    validator: validatePic,
                                    trigger: 'blur',
                                },
                            ]"
                        >
                            <div class="form-img-item">
                                <el-upload
                                    class="icon-uploader"
                                    :action="uploadUrl"
                                    :headers="getAuthHeaders()"
                                    :show-file-list="false"
                                    accept=".png,.jpg,.jpeg,.gif,.webp"
                                    :on-success="(res) => $set(item, 'icon', res.url)"
                                    title="点击选择图片上传"
                                >
                                    <img
                                        v-if="item.icon"
                                        :src="item.icon"
                                        class="icon"
                                    />
                                    <i
                                        v-else
                                        class="el-icon-plus avatar-uploader-icon"
                                    ></i>
                                </el-upload>
                                <el-input v-model="item.icon"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="冷却"
                            :prop="`skills.${i}.cooldowns`"
                        >
                            <div class="skill-cooldown-list">
                                <div
                                    class="skill-cooldown-item"
                                    v-for="(cd, j) of item.cooldowns"
                                    :key="'cd' + j"
                                >
                                    <el-input-number
                                        size="small"
                                        v-model.number="item.cooldowns[j]"
                                        :precision="1"
                                        :step="0.1"
                                        :min="0"
                                        :max="200"
                                    ></el-input-number>
                                    <i
                                        class="el-icon-circle-plus-outline"
                                        v-show="
                                            item.cooldowns.length < 6 &&
                                            !disableForm
                                        "
                                        title="在前面添加一个"
                                        @click="
                                            item.cooldowns.splice(
                                                j,
                                                1,
                                                0,
                                                item.cooldowns[j]
                                            )
                                        "
                                    ></i>
                                    <i
                                        class="el-icon-circle-close"
                                        v-show="
                                            !disableForm &&
                                            item.cooldowns.length > 1
                                        "
                                        title="删除"
                                        @click="item.cooldowns.splice(j, 1)"
                                    ></i>
                                </div>
                                <div
                                    class="add-cooldown-btn"
                                    v-show="
                                        item.cooldowns.length < 6 &&
                                        !disableForm
                                    "
                                >
                                    <el-button
                                        icon="el-icon-plus"
                                        size="small"
                                        circle
                                        title="添加冷却"
                                        @click="item.cooldowns.push(0)"
                                    ></el-button>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="消耗"
                            :prop="`skills.${i}.consume`"
                        >
                            <div class="skill-cooldown-list">
                                <div class="skill-cooldown-item">
                                    <el-input-number
                                        size="small"
                                        v-model="item.consume"
                                        :step="5"
                                        :min="0"
                                        :max="1000"
                                    ></el-input-number>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="描述"
                            :prop="`skills.${i}.description`"
                        >
                            <el-input
                                type="textarea"
                                v-model="item.description"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="提示" :prop="`skills.${i}.tips`">
                            <el-input
                                type="textarea"
                                v-model="item.tips"
                            ></el-input>
                        </el-form-item>
                    </section>
                    <div class="add-section" v-show="!disableForm">
                        <el-button
                            @click="
                                model.skills.push({
                                    cooldowns: [0],
                                    consume: 0,
                                })
                            "
                            ><i class="el-icon-plus"></i> 添加技能</el-button
                        >
                    </div>
                </el-tab-pane>
                <el-tab-pane name="usage" label="使用建议">
                    <el-form-item label="顺风出装">
                        <el-select
                            v-model="model.recommendedItem1.items"
                            class="recommend-items"
                            :multiple-limit="6"
                            filterable
                            multiple
                            placeholder="选择出装"
                        >
                            <el-option
                                v-for="item in items"
                                :key="item._id"
                                :label="item.name"
                                :value="item._id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="顺风出装提示">
                        <el-input
                            type="textarea"
                            v-model="model.recommendedItem1.tips"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="逆风出装">
                        <el-select
                            v-model="model.recommendedItem2.items"
                            class="recommend-items"
                            :multiple-limit="6"
                            filterable
                            multiple
                            placeholder="选择出装"
                        >
                            <el-option
                                v-for="item in items"
                                :key="item._id"
                                :label="item.name"
                                :value="item._id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="逆风出装提示">
                        <el-input
                            type="textarea"
                            v-model="model.recommendedItem2.tips"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="使用技巧">
                        <el-input
                            type="textarea"
                            v-model="model.usageTips"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="对抗技巧">
                        <el-input
                            type="textarea"
                            v-model="model.battleTips"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="团战思路">
                        <el-input
                            type="textarea"
                            v-model="model.teamTips"
                        ></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane name="relation" label="关系">
                    <div class="relation-item">
                        <h3>最佳搭档</h3>
                        <section
                            class="section-item"
                            v-for="(item, i) of model.partners"
                            :key="'pn' + i"
                        >
                            <h4>
                                <span>搭档{{ i + 1 }}：</span>
                                <span v-show="!disableForm">
                                    <el-button
                                        icon="el-icon-plus"
                                        size="mini"
                                        circle
                                        title="在前面添加一项"
                                        @click="
                                            model.partners.splice(
                                                i,
                                                1,
                                                {},
                                                item
                                            )
                                        "
                                    ></el-button
                                    ><el-button
                                        type="danger"
                                        icon="el-icon-delete"
                                        size="mini"
                                        circle
                                        title="删除"
                                        @click="removePartner(item, i)"
                                    ></el-button
                                ></span>
                            </h4>
                            <el-form-item
                                label="英雄"
                                :prop="`partners.${i}.hero`"
                                :rules="[
                                    {
                                        required: true,
                                        message: '英雄不能为空',
                                        trigger: 'change',
                                    },
                                    {
                                        validator: validateSelectedPartner,
                                        trigger: 'change',
                                    },
                                ]"
                            >
                                <el-select
                                    v-model="item.hero"
                                    filterable
                                    placeholder="选择搭档的英雄"
                                >
                                    <el-option
                                        v-for="item in partners"
                                        :key="'partn' + item._id"
                                        :label="item.name"
                                        :value="item._id"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="描述"
                                :prop="`partners.${i}.description`"
                                :rules="[
                                    { required: true, message: '描述不能为空' },
                                ]"
                            >
                                <el-input
                                    type="textarea"
                                    v-model="item.description"
                                ></el-input>
                            </el-form-item>
                        </section>
                        <div class="add-section" v-show="!disableForm">
                            <el-button @click="model.partners.push({})"
                                ><i class="el-icon-plus"></i>
                                添加搭档</el-button
                            >
                        </div>
                    </div>
                    <div class="relation-item">
                        <h3>克制谁</h3>
                        <section
                            class="section-item"
                            v-for="(item, i) of model.restraints"
                            :key="'kzsec' + i"
                        >
                            <h4>
                                <span>英雄{{ i + 1 }}：</span>
                                <span v-show="!disableForm">
                                    <el-button
                                        icon="el-icon-plus"
                                        size="mini"
                                        circle
                                        title="在前面添加一项"
                                        @click="
                                            model.restraints.splice(
                                                i,
                                                1,
                                                {},
                                                item
                                            )
                                        "
                                    ></el-button
                                    ><el-button
                                        type="danger"
                                        icon="el-icon-delete"
                                        size="mini"
                                        circle
                                        title="删除"
                                        @click="removeRestraint(item, i)"
                                    ></el-button
                                ></span>
                            </h4>
                            <el-form-item
                                label="英雄"
                                :prop="`restraints.${i}.hero`"
                                :rules="[
                                    {
                                        required: true,
                                        message: '英雄不能为空',
                                        trigger: 'change',
                                    },
                                    {
                                        validator: validateSelectedRestraint,
                                        trigger: 'change',
                                    },
                                ]"
                            >
                                <el-select
                                    v-model="item.hero"
                                    filterable
                                    placeholder="选择克制的英雄"
                                >
                                    <el-option
                                        v-for="item in partners"
                                        :key="'kzds' + item._id"
                                        :label="item.name"
                                        :value="item._id"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="描述"
                                :prop="`restraints.${i}.description`"
                                :rules="[
                                    { required: true, message: '描述不能为空' },
                                ]"
                            >
                                <el-input
                                    type="textarea"
                                    v-model="item.description"
                                ></el-input>
                            </el-form-item>
                        </section>
                        <div class="add-section" v-show="!disableForm">
                            <el-button @click="model.restraints.push({})"
                                ><i class="el-icon-plus"></i>
                                添加克制的英雄</el-button
                            >
                        </div>
                    </div>
                    <div class="relation-item">
                        <h3>被谁克制</h3>
                        <section
                            class="section-item"
                            v-for="(item, i) of model.reRestraints"
                            :key="'bkzsec' + i"
                        >
                            <h4>
                                <span>英雄{{ i + 1 }}：</span>
                                <span v-show="!disableForm">
                                    <el-button
                                        icon="el-icon-plus"
                                        size="mini"
                                        circle
                                        title="在前面添加一项"
                                        @click="
                                            model.reRestraints.splice(
                                                i,
                                                1,
                                                {},
                                                item
                                            )
                                        "
                                    ></el-button
                                    ><el-button
                                        type="danger"
                                        icon="el-icon-delete"
                                        size="mini"
                                        circle
                                        title="删除"
                                        @click="removeReRestraint(item, i)"
                                    ></el-button
                                ></span>
                            </h4>
                            <el-form-item
                                label="英雄"
                                :prop="`reRestraints.${i}.hero`"
                                :rules="[
                                    {
                                        required: true,
                                        message: '英雄不能为空',
                                        trigger: 'change',
                                    },
                                    {
                                        validator: validateSelectedReRestraint,
                                        trigger: 'change',
                                    },
                                ]"
                            >
                                <el-select
                                    v-model="item.hero"
                                    filterable
                                    placeholder="选择被哪个英雄克制"
                                >
                                    <el-option
                                        v-for="item in reRestraints"
                                        :key="'bkzsdi' + item._id"
                                        :label="item.name"
                                        :value="item._id"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="描述"
                                :prop="`reRestraints.${i}.description`"
                                :rules="[
                                    { required: true, message: '描述不能为空' },
                                ]"
                            >
                                <el-input
                                    type="textarea"
                                    v-model="item.description"
                                ></el-input>
                            </el-form-item>
                        </section>
                        <div class="add-section" v-show="!disableForm">
                            <el-button @click="model.reRestraints.push({})"
                                ><i class="el-icon-plus"></i>
                                添加被克制的英雄</el-button
                            >
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane name="skin" label="皮肤">
                    <section
                        class="section-item"
                        v-for="(item, i) of model.skins"
                        :key="'skin' + i"
                    >
                        <h4>
                            <span>皮肤{{ i + 1 }}：</span>
                            <span v-show="!disableForm">
                                <el-button
                                    icon="el-icon-plus"
                                    size="mini"
                                    circle
                                    title="在前面添加一项"
                                    @click="model.skins.splice(i, 1, {}, item)"
                                ></el-button
                                ><el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    circle
                                    title="删除"
                                    @click="removeSkin(item, i)"
                                ></el-button
                            ></span>
                        </h4>
                        <el-form-item
                            label="名称"
                            :prop="`skins.${i}.name`"
                            :rules="[
                                {
                                    required: true,
                                    message: '皮肤名称不能为空',
                                    trigger: 'blur',
                                },
                            ]"
                        >
                            <el-input v-model="item.name"></el-input>
                        </el-form-item>
                        <el-form-item label="描述">
                            <el-input type="textarea" v-model="item.description"></el-input>
                        </el-form-item>
                        <el-form-item
                            label="图片"
                            :prop="`skins.${i}.img`"
                            :rules="[
                                {
                                    required: true,
                                    message: '皮肤图片不能为空',
                                    trigger: 'blur',
                                },
                                {
                                    validator: validatePic,
                                    trigger: 'blur',
                                },
                            ]"
                            ><el-input v-model="item.img"></el-input
                        ></el-form-item>
                        <el-form-item class="skin-img-item">
                            <el-upload
                                class="icon-uploader"
                                :action="uploadUrl"
                                :headers="getAuthHeaders()"
                                :show-file-list="false"
                                accept=".png,.jpg,.jpeg,.gif,.webp"
                                :on-success="(res) => $set(item, 'img', res.url)"
                                title="点击选择图片上传"
                            >
                                <img
                                    v-if="item.img"
                                    :src="item.img"
                                    class="icon"
                                />
                                <i
                                    v-else
                                    class="el-icon-plus avatar-uploader-icon"
                                ></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item
                            label="封面"
                            :prop="`skins.${i}.banner`"
                            :rules="[
                                {
                                    required: true,
                                    message: '皮肤封面不能为空',
                                    trigger: 'blur',
                                },
                                {
                                    validator: validatePic,
                                    trigger: 'blur',
                                },
                            ]"
                            ><el-input v-model="item.banner"></el-input
                        ></el-form-item>
                        <el-form-item class="skin-banner-item">
                            <el-upload
                                class="icon-uploader"
                                :action="uploadUrl"
                                :headers="getAuthHeaders()"
                                :show-file-list="false"
                                accept=".png,.jpg,.jpeg,.gif,.webp"
                                :on-success="(res) => $set(item, 'banner', res.url)"
                                title="点击选择图片上传"
                            >
                                <img
                                    v-if="item.banner"
                                    :src="item.banner"
                                    class="icon"
                                />
                                <i
                                    v-else
                                    class="el-icon-plus avatar-uploader-icon"
                                ></i>
                            </el-upload>
                        </el-form-item>
                    </section>
                    <div class="add-section" v-show="!disableForm">
                        <el-button @click="model.skins.push({})"
                            ><i class="el-icon-plus"></i> 添加皮肤</el-button
                        >
                    </div>
                </el-tab-pane>
            </el-tabs>

            <div class="submit-item">
                <el-button
                    class="submit-btn"
                    v-if="!disableForm"
                    type="primary"
                    native-type="submit"
                    >{{ _id ? "保存" : "新建" }}</el-button
                >
            </div>
        </el-form>
    </div>
</template>

<script>
import validatorMixin from '@/assets/js/validatorMixin.js';
export default {
    name: "HeroEdit",
    mixins: [validatorMixin],
    props: {
        id: String,
    },
    data() {
        return {
            disableForm: false, // 是否禁用表单
            categories: [], // 分类列表
            items: [], // 准备列表
            heros: [], // 英雄列表
            model: {
                name: "",
                avatar: "",
                scores: {
                    difficult: 1,
                    skills: 1,
                    attack: 1,
                    survive: 1,
                },
                recommendedItem1: {},
                recommendedItem2: {},
                skills: [],
                partners: [],
                restraints: [],
                reRestraints: [],
                skins: [],
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur",
                    },
                ],
                avatar: [{ validator: this.validatePic, trigger: "blur" }],
            },
            nameErrorTip: "",
        };
    },
    computed: {
        _id() {
            if (this.$route.path == "/rest/heros/create") {
                return undefined;
            } else {
                return this.id;
            }
        },
        partners() {
            // 搭档的英雄应该排除自己
            return this.heros.filter((hero) => hero.name !== this.model.name);
        },
        restraints() {
            // 克制的英雄列表应该排除被克制的英雄
            if (this.model.reRestraints.length <= 0) {
                return this.partners;
            }
            return this.herosFilter(this.partners, this.model.reRestraints);
        },
        reRestraints() {
            // 被克制的英雄列表应该排除克制的英雄
            if (this.model.restraints.length <= 0) {
                return this.partners;
            }
            return this.herosFilter(this.partners, this.model.restraints);
        },
    },
    methods: {
        save() {
            this.nameErrorTip = "";
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    let res;
                    if (this._id) {
                        res = await this.$http.put(
                            "/rest/heros/" + this._id,
                            this.model
                        );
                    } else {
                        res = await this.$http.post("/rest/heros", this.model);
                    }
                    if (res.status === 200) {
                        if (res.data.errno === 1) {
                            // 用户名已存在
                            this.nameErrorTip = res.data.msg;
                            return;
                        }
                        this.$message({
                            type: "success",
                            message: this._id ? "修改成功" : "新建成功",
                        });
                        this.$router.push("/heros/list");
                    }
                } else {
                    this.$message({
                        type: "error",
                        message: "表单存在错误，请检查",
                        offset: 220,
                    });
                    return false;
                }
            });
        },
        textToHtml(str) {
            if (str) {
                let res = str.replace(/\n/g, "<br/>");
                return `<p>${res}</p>`;
            }
            return str;
        },
        textToHtml2(str) {
            if (str) {
                let arr = str.split(/\n/);
                return arr.reduce((res, item) => {
                    res += `<p>${item}</p>`;
                    return res;
                }, "");
            }
            return str;
        },
        herosFilter(all, arr1) {
            // 全部英雄    已选被克制英雄或已选克制英雄
            let arr = JSON.parse(JSON.stringify(all));
            arr.map((hero) => {
                arr1.map((item) => {
                    if (hero._id == item.hero) {
                        hero.isRepeat = true; // 在数组对象上标记重复，最后过滤
                    }
                });
            });
            return arr.filter((item) => !item.isRepeat);
        },
        removeSkill(skill, index) {
            if (skill.name || skill.icon || skill.description || skill.tips) {
                this.removeConfirm(this.model.skills, index, "技能");
            } else {
                this.model.skills.splice(index, 1);
            }
        },
        removePartner(partner, index) {
            if (partner.hero || partner.description) {
                this.removeConfirm(this.model.partners, index, "搭档");
            } else {
                this.model.partners.splice(index, 1);
            }
        },
        removeRestraint(hero, index) {
            if (hero.hero || hero.description) {
                this.removeConfirm(this.model.restraints, index, "克制的英雄");
            } else {
                this.model.restraints.splice(index, 1);
            }
        },
        removeReRestraint(hero, index) {
            if (hero.hero || hero.description) {
                this.removeConfirm(
                    this.model.reRestraints,
                    index,
                    "被克制的英雄"
                );
            } else {
                this.model.reRestraints.splice(index, 1);
            }
        },
        removeSkin(skin, index) {
            if( skin.name || skin.description || skin.img || skin.banner) {
                this.removeConfirm(this.model.skins, index, '皮肤');
            }else {
                this.model.skins.splice(index, 1);
            }
        },
        removeConfirm(arr, index, name = "") {
            // 确定删除表单项提示框
            this.$confirm(`是否确定要删除 ${name + (index + 1)} ？`, "提示", {
                confirmButtonText: "删除",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    arr.splice(index, 1);
                })
                .catch(() => {});
        },
        validateSelectedPartner(rule, val, cb) {
            this.validateSelectedHero(rule, val, cb, this.model.partners);
        },
        validateSelectedRestraint(rule, val, cb) {
            this.validateSelectedHero(rule, val, cb, this.model.restraints);
        },
        validateSelectedReRestraint(rule, val, cb) {
            this.validateSelectedHero(rule, val, cb, this.model.reRestraints);
        },
        validateSelectedHero(rule, val, cb, arr) {
            // 验证是否重复选英雄
            const res = arr.filter((item) => item.hero == val);
            if (res.length > 1) {
                cb(new Error("英雄已被选，不要重复选择"));
            } else {
                cb();
            }
        },
        async fetch() {
            // 获取当前英雄信息
            const res = await this.$http.get("/rest/heros/" + this._id);
            // 对象合并，防止实例里的model的属性与获取到的属性不一致
            this.model = Object.assign({}, this.model, res.data);
        },
        async fetchCategories() {
            // 获取分类列表
            const res = await this.$http.get("/rest/categories/");
            this.categories = res.data;
        },
        async fetchItems() {
            // 获取装备列表
            const res = await this.$http.get("/rest/items/");
            this.items = res.data;
        },
        async fetchHeros() {
            // 获取英雄列表
            const res = await this.$http.get("/rest/heros/");
            this.heros = res.data;
        },
        handleIconSuccess(res) {
            if (res.url) {
                this.model.avatar = res.url;
            }
        },
    },
    created() {
        this._id && this.fetch();
        this.fetchCategories();
        this.fetchItems();
        this.fetchHeros();
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.$refs.ruleForm.clearValidate(); // 清除表单验证错误
            if (to.path == "/heros/detail/" + to.params.id) {
                vm.disableForm = true;
            } else {
                vm.disableForm = false;
            }
        });
    },
};
</script>

<style>
.form-img-item {
    display: flex;
}
.form-img-item .el-input {
    margin-top: 30px;
    margin-left: 10px;
}
.form-img-item .icon-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.form-img-item .icon-uploader .el-upload:hover {
    border-color: #409eff;
}
.form-img-item .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 70px;
    height: 70px;
    line-height: 70px;
    text-align: center;
}
.form-img-item .icon-uploader .icon {
    width: 70px;
    height: 70px;
    display: block;
}

.hero-edit > h2 .el-button {
    vertical-align: bottom;
    margin-left: 5px;
}
.hero-edit .el-input.is-disabled .el-input__inner {
    color: inherit;
}
.hero-edit .el-textarea.is-disabled .el-textarea__inner {
    color: inherit;
}

.hero-edit .score-item {
    margin-left: 20px;
    display: flex;
}
.hero-edit .score-item .el-rate {
    margin-top: 10px;
    line-height: 5px;
}
.hero-edit .el-select {
    display: block;
}

.hero-edit .el-select .el-tag.el-tag--info {
    color: #000;
    font-size: 14px;
}
.hero-edit .submit-btn {
    margin-top: 15px;
    display: block;
    width: 100%;
}
.hero-edit .skill-cooldown-list {
    display: flex;
}
.hero-edit .skill-cooldown-list .skill-cooldown-item {
    margin-right: 20px;
    position: relative;
    z-index: 5;
}
.hero-edit .skill-cooldown-list .skill-cooldown-item > i {
    position: absolute;
    z-index: 5;
    top: -6px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 50%;
}
.hero-edit .skill-cooldown-list .skill-cooldown-item > i.el-icon-circle-close {
    right: -6px;
    color: #f56c6c;
}
.hero-edit
    .skill-cooldown-list
    .skill-cooldown-item
    > i.el-icon-circle-close:hover {
    color: #fff;
    background: #f56c6c;
}
.hero-edit
    .skill-cooldown-list
    .skill-cooldown-item
    > i.el-icon-circle-plus-outline {
    left: -6px;
    color: #409eff;
}
.hero-edit
    .skill-cooldown-list
    .skill-cooldown-item
    > i.el-icon-circle-plus-outline:hover {
    color: #fff;
    background: #409eff;
}
.hero-edit .skill-cooldown-list .skill-cooldown-item .el-input-number--small {
    width: 110px;
}
.hero-edit
    .skill-cooldown-list
    .skill-cooldown-item
    .el-input-number--small
    .el-input-number__decrease,
.el-input-number--small .el-input-number__increase {
    width: 28px;
}
.hero-edit
    .skill-cooldown-list
    .skill-cooldown-item
    .el-input-number--small
    .el-input__inner {
    padding-left: 28px;
    padding-right: 28px;
}
.hero-edit .relation-item {
    border-bottom: 1px solid #ddd;
    padding-bottom: 15px;
}
.hero-edit .relation-item:last-of-type {
    border-bottom: 1px solid transparent;
}
.hero-edit .relation-item .section-item {
    border-bottom: none;
    margin-bottom: 25px;
}
.icon-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.icon-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.icon-uploader .icon {
    width: 178px;
    height: 178px;
    display: block;
}
.hero-edit .skin-img-item .icon-uploader .icon {
    height: 350px;
    width: auto;
}
.hero-edit .skin-banner-item .icon-uploader .icon {
    height: 250px;
    width: auto;
}
</style>