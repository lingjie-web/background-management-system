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
      <!-- 级联选择器 -->
      <el-cascader
        v-model="activeShopList" clearable
        :options="shopList" 
        :props="props"
        @change="activeShopChange">
      </el-cascader>
        <el-tabs  @tab-click="handleClick" v-model="activeTab">
        <el-tab-pane name="first" :disabled='isActiveShop' >
            <span slot="label" class="span"><i class="el-icon-view"></i>动态参数</span>
            <el-button type="primary" class="submit" @click="showAdddigMany" :disabled='isActiveShop'>添加动态参数</el-button>
            <el-table
              :data="manyDataList" border
              stripe
              style="width: 100%">
              <el-table-column type="expand">
                <!-- 动态增删商品参数项 -->
                <template slot-scope="scope">
                  <el-tag :key="index" v-for="(tag,index) in scope.row.attr_vals"
                    closable @close='deleteTag(scope.row,index)'
                    :disable-transitions="false">
                    {{tag}}
                  </el-tag>
                  <el-input
                      class="input-new-tag"
                     v-if='scope.row.inputVisible'
                      v-model="scope.row.inputValue"
                      ref="activeinput"
                      @blur='blurParamsInput(scope.row)'
                      size="small">
                    </el-input>
                    <el-button v-if="!scope.row.inputVisible" class="button-new-tag" size="small" 
                    @click="showParamsInput(scope.row)" >+ New Tag</el-button>  
                </template>
              </el-table-column>
              <el-table-column type='index'>
              </el-table-column>
              <el-table-column
                prop="attr_name"
                label="参数名称"
                width="380">
              </el-table-column>
              <el-table-column label="操作" width="180">
                <el-button type="primary" icon="el-icon-edit" size='small'>编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size='small'>删除</el-button>
              </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane  name="second" :disabled='isActiveShop'>
          <span slot="label" class="span"><i class="el-icon-s-grid"></i>静态参数</span>
            <el-button type="primary" class="submit" @click="showAdddigOnly">添加静态参数</el-button>
            <el-table
              :data="onlyDataList"
              stripe border 
              style="width: 100%">
               <el-table-column type="expand">
                <!-- 动态增删商品参数项 -->
                <template slot-scope="scope">
                  <el-tag :key="index" v-for="(tag,index) in scope.row.attr_vals"
                    closable @close='deleteTag(scope.row,index)'
                    :disable-transitions="false">
                    {{tag}}
                  </el-tag>
                  <el-input
                      class="input-new-tag"
                     v-if='scope.row.inputVisible'
                      v-model="scope.row.inputValue"
                      ref="activeinput"
                      @blur='blurParamsInput(scope.row)'
                      size="small">
                    </el-input>
                    <el-button v-if="!scope.row.inputVisible" class="button-new-tag" size="small" 
                    @click="showParamsInput(scope.row)" >+ New Tag</el-button>  
                </template>
              </el-table-column>
              <el-table-column type='index'>
              </el-table-column>
              <el-table-column
                prop="attr_name"
                label="参数名称"
               width="380">
              </el-table-column>
              <el-table-column label="操作" width="180">
                <el-button type="primary" icon="el-icon-edit" size='small'>编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size='small'>删除</el-button>
              </el-table-column>
            </el-table>
        </el-tab-pane>
        <!-- 添加参数 -->
        <el-dialog
          title="添加参数"
          :visible.sync="showAdddig"
          width="50%"
          @close='addDigClose'>
          <span>请输入{{isDialogName}}:</span>
          <el-input v-model="paramsName" placeholder="请输入内容" ></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showAdddig = false">取 消</el-button>
            <el-button type="primary" @click="submitAddParams">确 定</el-button>
          </span>
        </el-dialog>
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
      manyDataList:[],
      onlyDataList:[],
      activeTab:'first',
      showAdddig:false,
      dialogName:'',
      paramsName:'',
    }
  },
  methods:{
    async getshopListHttp(){
      const{data:res}=await this.$http.get('categories')
      if(res.meta.status===200){
        this.shopList=res.data
      }
    },
    // 获取初始数据
    async activeShopChange(){
      if(this.activeShopList){
        const{data:res}=await this.$http.get(`categories/${this.activeShopList}/attributes`,{params:{sel:'many'}})
        if(res.meta.status===200){
        res.data.forEach(item=>{
          item.inputVisible=false
          item.inputValue=''
          item.attr_vals?item.attr_vals=item.attr_vals.split(' '):''}
        )
        this.manyDataList=res.data
        }else{this.$message.error('更新失败')}
         this.$http.get(`categories/${this.activeShopList}/attributes`,{params:{sel:'only'}}).then(res=>{
        if(res.data.meta.status===200){this.onlyDataList=res.data.data}else{this.$message.error('更新失败')}})
      }else{
        this.manyDataList=[],
        this.onlyDataList=[]
      }
    },
     async handleClick(tab) {
        let active=''
        if(tab.name=='first'){
          active='many'
        }else{active='only'}
        const{data:res}=await this.$http.get(`categories/${this.activeShopList}/attributes`,{params:{sel:active}})
        if(active==='many'){
          res.data.forEach(item=>{
          item.inputVisible=false
          item.inputValue=''
          item.attr_vals?item.attr_vals=item.attr_vals.split(' '):''}
        )
        this.manyDataList=res.data
        }
        else{res.data.forEach(item=>{
          item.inputVisible=false
          item.inputValue=''
          item.attr_vals?item.attr_vals=item.attr_vals.split(' '):''}
        )
          this.onlyDataList=res.data}
      },

      // 添加参数
      showAdddigMany(){
        this.showAdddig=true,
        this.dialogName='many'
      },
      showAdddigOnly(){
        this.showAdddig=true,
        this.dialogName='only'
      },
      async submitAddParams(){
        if(!this.paramsName){this.$message.error('请输入参数名')}
        else{console.log(this.dialogName);
          const{data:res}=await this.$http.post(`categories/${this.activeShopList}/attributes`,{attr_name:this.paramsName,attr_sel:this.dialogName})
          console.log(res);
          if(res.meta.status===201){
            this.$message.success('添加成功')
            this.activeShopChange()
            this.showAdddig=false
            return false
          }this.$message.error('添加失败')
        }
      },
      addDigClose(){
        this.paramsName=''
      },
      // 动态增减Tag
      showParamsInput(row){
        row.inputVisible=true,
        this.$nextTick(()=>{
          this.$refs.activeinput.$refs.input.focus()
        })
      },
      async blurParamsInput(row){
        if(!row.inputValue){this.$message.error('请先输入参数名');return false}
        row.inputVisible=false
        !row.attr_vals?row.attr_vals=[]:''
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue=''
        const{data:res}=await this.$http.put(`categories/${this.activeShopList}/attributes/${row.attr_id}`,
          {attr_vals:row.attr_vals.join(' '),
          attr_sel:row.attr_sel,
          attr_name:row.attr_name})
          if(!res.meta.status===200)this.$message.error('添加失败')
          
      },
      deleteTag(row,index){
        row.attr_vals.splice(index,1)
        this.$http.put(`categories/${this.activeShopList}/attributes/${row.attr_id}`,
        {attr_vals:row.attr_vals.join(' '),
          attr_sel:row.attr_sel,
          attr_name:row.attr_name})
      }
  },
  created(){
    this.getshopListHttp()
  },
  computed:{
    isActiveShop(){
      return !this.activeShopList
    },
    isDialogName(){
       if(this.dialogName=='many'){return '动态参数'}else{
         return'静态参数'
       }
    }
  }
}
</script>

<style lang="less" scoped>
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
.el-breadcrumb{
  margin-bottom: 20px;
}
.el-cascader{
  margin:20px 10px;
}
.el-tab-pane .span{
  margin-right: 5px;
}.el-table{
  margin-top: 20px;
}
.el-dialog>.el-input{
  width: 70%;
  margin-left: 10px;
}
</style>