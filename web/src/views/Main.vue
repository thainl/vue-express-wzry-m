<template>
    <div class="main">
        <TopBar />
		<MainNav />
		<router-view/>
    </div>
</template>

<script>
    import TopBar from '../components/TopBar';
    import MainNav from '../components/MainNav';
    export default {
        name: 'Main',
        components: {
            TopBar,
            MainNav,
        }
    }
</script>

<style lang="scss">
.main {
    padding-top: 45px;
}
</style>