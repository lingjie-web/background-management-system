<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card >
      <el-button type="primary" class="submit" @click="showAdddig">添加商品</el-button>
      <ZkTable class="ZkTable"
        ref="table" 
        index-text="#"
        border :selection-type='false' show-index   :expand-type=false
        :data="goodsList"
        :columns="columns">
          <template slot='deleted' slot-scope="scope">
            <i class="el-icon-success" style="color:lightgreen" v-if="!scope.row.cat_deleted"></i>
            <i class="el-icon-error" style="color:red" v-else></i>
          </template>
           <template slot='level' slot-scope="scope">
             <el-tag type='danger' v-if="scope.row.cat_level===0">一级</el-tag>
             <el-tag type='warning' v-else-if="scope.row.cat_level===1">二级</el-tag>
             <el-tag v-else-if="scope.row.cat_level===2">三级</el-tag>
           </template>
           <template slot="active">
              <el-button type="primary" icon="el-icon-edit" size='small'>编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size='small'>删除</el-button>
           </template>
      </ZkTable>
      <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page='params.pagenum'
            :page-sizes="[4,6, 8, 10, 12]"
            :page-size="4"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
      </el-pagination>
    <!-- 添加分类 -->
    <el-dialog  title="添加分类" :visible.sync="showAddGoods" width="50%" >
      <el-form label-width="100px" :model="addGoodForm" ref="casc" :rules='rules'>
        <el-form-item label="商品名称" prop='name'>
          <el-input v-model="addGoodForm.cat_name" ></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selcetPid" 
            :options="addGoodList" @change='selectChange'
            :props="props">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddGoods = false">取 消</el-button>
        <el-button type="primary" @click="submitGoodForm" >确 定</el-button>
      </span>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
import ZkTable from 'vue-table-with-tree-grid'
export default {
  name:'shopList',
  data(){return{
      rules:{
        name:[{required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
      },
      params:{ type:[3],pagenum:1,pagesize:4},
      total:0,
      goodsList:[],
      addGoodList:[],
      columns:[
          { label:'分类名称',
            prop:'cat_name'
          },
          { label:'是否有效',
          type: 'template',
          template: 'deleted',
          },
          {label:'排序',
          type:'template',
          template:'level'
          },
          {label:'操作',
          type:'template',
          template:'active',
          minWidth:'200px'
          }
      ],
      showAddGoods:false,
      props:{
        expandTrigger:'hover',
        label:'cat_name',
        value:'cat_id',
        checkStrictly:true
      },
      selcetPid:null,
      addGoodForm:{
        cat_name:'',
        cat_pid:0,
        cat_level:0
      }
      
    }
  },
  components:{
    ZkTable
  },
  methods:{
    async getGoods(){
      const {data:res}=await this.$http.get('categories',{params:this.params})
      console.log(res);
      if(res.meta.status===200){
        this.goodsList=res.data.result
        this.total=res.data.total
        console.log(this.goodsList);
      }else{
        this.$message.error('请求商品数据失败')
      }
    },
    handleCurrentChange(val){
      this.params.pagenum=val,
      this.getGoods()
    },
    handleSizeChange(val){
      this.params.pagesize=val,
      this.getGoods()
    },
    showAdddig(){
      this.showAddGoods=true,
      this.$http.get('categories',{params:{type:[2]}}).then(res=>{
        
        if(res.data.meta.status===200){
          this.addGoodList=res.data.data
        }
        console.log(this.addGoodList);
      })
    },
     submitGoodForm(){
      this.$refs.casc.validate(async valid=>{if(valid){
        const{data:res}=await this.$http.post('categories',this.addGoodForm)
        console.log(res);
        if(res.meta.status===201){
          this.$message.success('添加成功'),
          this.showAddGoods = false,
          this.getGoods()
          this.$refs.casc.resetField()
        }else{
          this.$message.error('添加失败')
        }
      }
      }
      )
    },
    selectChange(){
      if(this.selcetPid.length===0){
        this.addGoodForm.cat_level=0
      }else if(this.selcetPid.length===1){
        this.addGoodForm.cat_pid=this.selcetPid[0]
        this.addGoodForm.cat_level=1
      }else{
        this.addGoodForm.cat_level=2
        this.addGoodForm.cat_pid=this.selcetPid[1]
      }
    }
  },
  created(){
    this.getGoods()
  }
}
</script>

<style lang="less" scoped>
.ZkTable {
  margin-top: 20px;
}
.el-breadcrumb{
  margin-bottom: 20px;
}
.el-pagination{
  margin-top: 20px;
}
</style>