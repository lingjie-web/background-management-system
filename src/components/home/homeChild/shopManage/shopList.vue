<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card >
      <el-input
        class="input"
        placeholder="请输入内容"
        v-model="shop.query">
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="search"></el-button>
      <el-button type="primary"  @click="addShop" class="addBtn">添加商品</el-button>
       <el-table
          border stripe
          :data="shopList.goods"
          style="width: 100%">
          <el-table-column type=index>
          </el-table-column>
          <el-table-column prop="goods_name" label="商品名" width="180"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="180"></el-table-column>
          <el-table-column label="创建时间" width="180">
            <template slot-scope="scope">
               {{scope.row.add_time|dateFil}}
            </template>
          </el-table-column>
          <el-table-column  label="操作" width="180">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top" >
                <el-button type="primary" icon="el-icon-edit" @click="editShop(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除"  placement="top">
                <el-button type="danger" icon="el-icon-delete" @click="deleteShop(scope.row.id)" ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
       </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="shop.pagenum"
          :page-sizes="[6,8,10,12]"
          :page-size="shop.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="shopList.total">
        </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {  
  data(){
    return{
      shop:{
        query:'',
        pagenum:1,
        pagesize:8,
        },
      shopList:[]
    }
  },
  methods:{
    async getShopList(){
      const{data:res}=await this.$http.get('goods',{params:this.shop})
      console.log(res);
      if(res.meta.status===200)this.shopList=res.data
    },
    search(){
        this.getShopList().then(()=>{this.shop.query=''})
    },
    editShop(){
      console.log('edit');
    },
    deleteShop(){
      console.log('delete');
    },
    handleSizeChange(res){
      this.shop.pagesize=res
      this.getShopList()
    },
    handleCurrentChange(res){
      this.shop.pagenum=res
      this.getShopList()
    },
    addShop(){
      this.$router.push('/addShop')
    }
  },
  created(){
    this.getShopList()
  }
}
</script>

<style scoped>
  .el-input{
    width:40%;
    padding-right: 20px;
  }
  .addBtn{
    float: right;
  }
</style>