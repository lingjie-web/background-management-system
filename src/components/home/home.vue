<template>
  <div id="home"> 
    <el-container class="container">
      <el-header >
        <div>
          <h1>后台管理系统</h1>
          <el-button type='info' @click="backout">退出</el-button>
        </div>
      </el-header>
      
      <el-container >
        
          <el-aside ref='aside' :width='!isCollapse?"250px":""' >
            <div class="coll" @click="active">|||</div>
              <el-menu :collapse='isCollapse'
              router	 
              :collapse-transition='false'
                class="el-menu-vertical-demo"
                background-color="#666666"
                text-color="#fff">
                <el-submenu class="submenu"  
                  v-for="(item,index) in this.manus" :key="index" :index='item.id+""'>
                  <template slot="title">
                    <i :class='icon[index]' class="el-icon-location"></i>
                    <span>{{item.authName}}</span>
                  </template>
                    <el-menu-item 
                      
                      v-for="cli in item.children" 
                      :key="cli.index" 
                      :index="(cli.path+'')"
                      @click="manusAct">
                      <span>{{cli.authName}}</span>
                      </el-menu-item>
                </el-submenu>
              </el-menu>
            </el-aside>
          
          <el-container>
            <el-main><router-view></router-view></el-main>
            
          </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name:'home',
  data(){
    return{
      manus:[],
      isCollapse: false,
      icon:[
      'iconfont icon-UserSettings',
      'iconfont icon-quanxian',
      'iconfont icon-shangpin1',
      'iconfont icon-dingdan',
      'iconfont icon-data'
]
    }
  },
  created(){
    this.getAsideManus()
  },
  methods:{
    backout(){
      sessionStorage.removeItem('token')
      this.$router.replace('/login')
    },
    async getAsideManus(){
      const{data:res} = await this.$http.get('menus')
      if(res.meta.status!==200){this.$message.error(res.meta.msg)}
      console.log(res);
      this.manus=res.data
    },
    active(){
      this.isCollapse=!this.isCollapse
    },
    manusAct(){
        
        
    }
  },
}
</script>

<style lang="less" scoped>
.el-menu {
    border-right: solid 1px #666666
}
#home{
  height: 100vh;
  width: 100%;
}
.coll{
  height: 30px;
  line-height: 25px;
  width: 100%;
  text-align: center;
  color: #fff;
}

.container{
  height: 100%;

}
.el-main{
  
  height: 100%;
  width: 100%;
  background-color: #ddd;

}
.el-header, .el-footer {
    background-color: #333333;
    color: #333;
    line-height: 40px;
    padding: 10px 20px;
    color: #fff;
    >div{
      display:flex;
      justify-content: space-between;
      h1{
        margin: 0;
      }
    }
  }
  
  .el-aside {
    background-color: #666666;
    color: #333
  }
  
 
</style>

