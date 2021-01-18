import { getResourceSimpleList } from './api';

export default {
    data() {
        return {
            categories: []
        }
    },
    methods: {
        async fetchCategories() {
            const res = await getResourceSimpleList('categories');
            this.categories = res.data;
        },
    },
    created() {
        this.fetchCategories();
    },
};