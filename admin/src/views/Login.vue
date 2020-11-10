<template>
    <div class="login-page">
        <div class="login-container">
            <el-card header="请先登录" class="login-card">
				<el-form @submit.native.prevent="login" ref="ruleForm" :rules="rules" :model="model">
					<el-form-item label="用户名" prop="name" :error="nameErrorTip">
						<el-input v-model="model.name"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input show-password v-model="model.password"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button class="w-100" native-type="submit" type="primary">登录</el-button>
					</el-form-item>
				</el-form>
			</el-card>
        </div>
    </div>
</template>

<script>
export default {
	name: "Login",
	data() {
		return {
			model: {},
			rules: {
				name: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
				password: [
					{ required: true, message: '密码不能为空', trigger: 'blur' },
					{ min:6, max: 16, message: '密码长度为6~16位', trigger: 'blur' }
				]
			},
			nameErrorTip: ''
		}
	},
	methods: {
		login(){
			this.nameErrorTip = '';
			this.$refs.ruleForm.validate( async valid => {
				if(valid) {
				const res = await this.$http.post('/login', this.model);
				if(res.status === 422) {
					this.nameErrorTip = res.data.msg;
					return;
				}
				// sessionStorage.token = res.data.token;
				sessionStorage.setItem('token', res.data.token)
				this.$router.push('/');
				this.$message({
					type: 'success',
					message: '登录成功'
				})
				}else {
					return false;
				}
			})
			
		}
	},
};
</script>

<style>
.login-card {
    width: 25rem;
    margin: 12rem auto;
}
</style>
