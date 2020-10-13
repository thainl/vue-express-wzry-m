export default {
    methods: {
        checkImg(url) {
            // 检查图片是否正常显示
            let img = new Image();
            img.src = url;
            if (img.sizes > 0 || (img.width > 0 && img.height > 0)) {
                return true;
            } else {
                return false;
            }
        },
        validatePic(rule, val, cb) {
            const res = this.checkImg(val);
            if (res === false && val) {
                cb(new Error("图片显示错误，请检查图片地址"));
            } else {
                cb();
            }
        },
    },
};