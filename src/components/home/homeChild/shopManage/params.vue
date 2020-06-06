<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三类分类添加参数"
        type="warning">
      </el-alert>
      <span>请选择分类:</span>
      <el-cascader
        v-model="activeShopList"
        :options="shopList" 
        :props="props"
        @change="activeShopChange">
      </el-cascader>
        <el-tabs v-model="activeName" @tab-click="handleClick" >
        <el-tab-pane name="first" :disabled='isActiveShop'>
          <span slot="label" class="span"><i class="el-icon-view"></i>动态参数</span>
          用户管
        </el-tab-pane>
        <el-tab-pane  name="second">
          <span slot="label" class="span"><i class="el-icon-s-grid"></i>静态参数</span>
          配置管理
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      props:{label:'cat_name',value:'cat_id',expandTrigger: 'hover',emitPath:false },
      shopList:[],
      activeShopList:0,
    }
  },
  methods:{
    async getshopListHttp(){
      const{data:res}=await this.$http.get('categories')
      if(res.meta.status===200){
        this.shopList=res.data
      }
    },
    activeShopChange(){
      
    },
     async handleClick(tab, event) {
        let active=''
        if(tab.name=='first'){
          active='many'
        }else{active='only'}
        const{data:res}=await this.$http.get(`categories/${this.activeShopList}/attributes`,{params:{sel:active}})
        console.log(res);
      }
  },
  created(){
    this.getshopListHttp()
  },
  computed:{
    isActiveShop(){
      return !this.activeShopList
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb{
  margin-bottom: 20px;
}
.el-cascader{
  margin:20px 10px;
}
.el-tab-pane .span{
  margin-right: 5px;
}
</style>