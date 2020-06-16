<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-input
        placeholder="请输入搜索内容"
        v-model="search">
        <i slot="prefix" ></i>
      </el-input>
      <el-button type="info" icon="el-icon-search"></el-button>
      <el-table :data="OrdersList.goods" border stripe style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column label='订单编号' prop="order_number">
        </el-table-column>
        <el-table-column label='订单价格' >
          <template slot-scope="scope">
            ￥：{{scope.row.order_price}}元
          </template>
        </el-table-column>
        <el-table-column label='是否付款'>
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay==1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label='是否发货' prop="is_send">
        </el-table-column>
        <el-table-column label='下单时间' width="145">
          <template slot-scope="scope">
            {{scope.row.create_time|dateFil}}
          </template>
        </el-table-column>
        <el-table-column label='操作' width="145">
          <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top" >
                <el-button type="primary" icon="el-icon-edit" @click="showAddressDig1(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="地址"  placement="top">
                <el-button type="danger" icon="el-icon-map-location" @click="showExpressInfo1(scope.row)" ></el-button>
              </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[6, 8, 10, 12]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="OrdersList.total">
      </el-pagination>
          <!-- 编辑地址 -->
      <el-dialog
       title="发货地址"
       :visible.sync="showAddressDig"
       width="50%">
        <el-form ref="form" :model="addressForm" label-width="80px" :rules='rules'>
          <el-form-item label="请选择" prop="cascader" width="80%">
            <el-cascader
              v-model="addressForm.cascader"
              :options="cityData3"
              :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="input">
             <el-input v-model="addressForm.input"></el-input>
          </el-form-item>
        </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="showAddressDig = false">取 消</el-button>
         <el-button type="primary" @click="submitAddForm">确 定</el-button>
       </span>
      </el-dialog>
    <!-- 快递信息表单 -->
    <el-dialog
       title="发货地址"
       :visible.sync="showExpressInfo"
       width="50%">
       <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="(activity, index) in kuaidi"
              :key="index"
              :color="activity.color"
              :icon="activity.icon"
              :size="activity.size"
              :timestamp="activity.time">
              {{activity.context}}
            </el-timeline-item>
          </el-timeline>
        <span slot="footer" class="dialog-footer">
          
         <el-button @click="showExpressInfo = false">关闭</el-button>
       </span>
    </el-dialog>
    </el-card>

  </div>
</template>

<script>
import {cityData3} from '../../../../assets/js/city.data-3'
export default {
  
  data(){
    return{
      OrdersList:{},
      search:'',
      cityData3,
      kuaidi:
        [
          {'time':'2020-06-10 09:39:03',
          'ftime':'2020-06-10 09:39:03',
          'context':'已签收，感谢使用顺丰，期待再次为您服务',
          'color': '#0bbd87',
          'icon':'el-icon-check',
          'size': 'large'
          },
          {'time':'2020-06-10 08:19:06',
          'ftime':'2020-06-10 09:19:06',
          'context':'[合肥市]合肥蜀山区育新小区营业点派收员 顺丰速运 95338正在为您派件',
          'icon':'el-icon-s-custom',
          'size': 'large'
          },
          {'time':'2020-06-10 04:47:03',
          'ftime':'2020-06-10 04:39:03',
          'context':'快件到达[合肥蜀山区育新小区营业点]',
          'icon':'el-icon-truck',
          'size': 'large'
          },
          {'time':'2020-06-09 17:39:53',
          'ftime':'2020-06-09 17:39:53',
          'context':'快件发出'
          },
          {'time':'2020-06-09 14:18:03',
          'ftime':'2020-06-09 14:18:03',
          'context':'已接受快递 顺丰速运 95338'
          }
        ],
      props:{
        value:'value',
        label:'text',
        expandTrigger:'hover'
      },
      addressActive:[],
      params:{
        pagenum:1,
        pagesize:8
      },
      showAddressDig:false,
      showExpressInfo:false,
      addressForm:{
        input:'',
        cascader:[]
      },
      rules:{
        input:[{required:true,message:"地址不能为空",trigger:'blur'}],
        cascader:[{required:true,message:"详细地址需要填写",trigger:'blur'}]
      }
    }
  },
 
  methods:{
    async getOrdersList(){
      const{data:res}=await this.$http.get('orders',{params:this.params})
      this.OrdersList=res.data
      console.log(res);
    },
    handleCurrentChange(res){
      this.params.pagenum=res,
      this.getOrdersList()
    },
    handleSizeChange(res){
      this.params.pagesize=res,
      this.getOrdersList()
    },
    showAddressDig1(){
      this.showAddressDig=true
    },
    submitAddForm(){
      this.$refs.form.validate(val=>{
        if(!val)this.$message.error('提交失败')
        this.$message.success('提交')
      })
    },
    showExpressInfo1(){
      this.showExpressInfo=true,
      this.$http.get('/kuaidi/804909574412544590').then(res=>{console.log(res);}
      )
    }
  },
  created(){
    this.getOrdersList()
  }
}
</script>

<style lang="less" scoped>
  .el-input{
    width: 300px !important;
  }
  .el-dialog__footer{
    text-align:left !important;
  }
</style>