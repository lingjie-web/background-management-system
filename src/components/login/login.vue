<template>
  <div class="login">
    <div class="loginForm">
      <el-form ref="loginform"  label-width="80px" :model='loginform'  :rules='rules'>
        <div class="img">
                 <img src="../../assets/img/Snipaste_2020-05-24_13-37-58.png" alt=""></div>
        <div class="input" >
                  <el-form-item label="用户名" prop='username'>
                    <el-input
                      v-model="loginform.username"
                      placeholder="请输入内容"
                      prefix-icon="el-icon-user-solid">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop='password'>
                    <el-input
                      type='password'
                       v-model="loginform.password"
                      placeholder="请输入内容"
                      prefix-icon="iconfont icon-password">
                    </el-input>
                  </el-form-item>
                </div>
                <div class="button">
                  <el-button type="primary" @click="commit">登录</el-button>
                  <el-button type="info" @click="reset">重置</el-button>
                </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from "../../net/axios";
export default {
  name:'login',
  data(){
    return{
      loginform:{
        username:'admin',
        password:'123456'
    },
    rules: {
        username: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ]  ,
         password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]  
    },
    icon:true
    }
  },
  methods:{
    reset(){
      this.$refs.loginform.resetFields()
    },
    commit(){
      if(this.icon){
        this.icon=false
        this.$refs.loginform.validate(valid=>{
        if(valid){
          this.$http.post('login',this.loginform)
          .then(res=>{
            console.log(res);
            res.data.meta.status==200?this.$message.success('登陆成功'):this.$message.error('登录失败')
            window.sessionStorage.setItem('token',res.data.data.token)
            this.$router.push('/home')
          }
          )
        }
      }),
      setTimeout(() => {
        this.icon=true
      }, 2000);
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .login{
    height: 100vh;
    width: 100vw;
    background-color: #909399;
   
  }
  .loginForm{
    width: 500px;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 80px 30px 50px 30px;
    background-color: #fff;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .button{
    float: right;
  }
  .img{
    background-color: #fff;
    width: 100px;
    height: 100px;
    padding: 5px 5px;
    overflow: hidden;
    border-radius: 50%;
    box-shadow: 0 0 10px;
    position: absolute;
    top: -40%;
    left: 50%;
    transform: translate(-50%,50%);
    img{
      width: 100px;
      height: 100px;
    }
  }
</style>
