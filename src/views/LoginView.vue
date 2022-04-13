<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="width:400px;margin:0 auto;">
    <div>模拟登陆，id=admin/admin, user/user通过，不用登陆也能看</div>
    <el-form-item label="用户名" prop="pass">
      <el-input type="text" v-model="ruleForm.id" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="checkPass">
      <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">清除登陆信息</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          id: '',
          password: '',
        },
        rules: {
        }
      };
    },
    methods: {
      submitForm(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log($API);
            $API.user.login(that.id, that.password).then((resp)=>{
              localStorage.setItem('user', JSON.stringify(resp.data));//将登陆信息保存下来
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        localStorage.clear();
      }
    }
  }
</script>