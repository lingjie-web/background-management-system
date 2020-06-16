<template>
  <div>
     <el-alert
    title="添加商品信息"
    type="info"
    center :closable='false'
    show-icon>
  </el-alert>
  <el-card >
    <el-steps :active="parseInt(activeName)" align-center>
      <el-step title="基本信息" ></el-step>
      <el-step title="商品参数" ></el-step>
      <el-step title="商品内容" ></el-step>
      <el-step title="商品图片" ></el-step>
      <el-step title="商品内容" ></el-step>
    </el-steps>
    <el-form :model="shopParams"  ref="ruleForm" :rules='rules' label-width="100px" class="demo-ruleForm">
    <el-tabs tab-position="left"  :before-leave='tabsLeave' v-model='activeName'>
      <el-tab-pane label="基本信息" name='1'>
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="shopParams.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model.number="shopParams.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model.number="shopParams.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model.number="shopParams.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader v-model="CategoryValue" :options="shopCategory" :props="props" @change='CategoryValueChange'>
            </el-cascader>
          </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="2">
        <div v-show="item.checkbox" v-for="(item,index) in manyParamsList" :key="index">
          <p>{{item.attr_name}}</p>
          <el-checkbox-group v-model="item.attr_vals" >
            <el-checkbox :label="val" border v-for="val in item.checkbox" :key="val.index"></el-checkbox>
          </el-checkbox-group>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name='3'>
        <div  v-for="(item,index) in onlyParamsList" :key="index">
          <p>{{item.attr_name}}</p>
          <el-input v-model="item.attr_vals"></el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="4">
        <el-upload
          class="upload-demo"
          action="http://119.23.53.78:8888/api/private/v1/upload/"
          :on-success='success'
          :on-preview='toBigPic'
          :on-remove="uploadRemove"
          :headers='header'
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name='5'>
          <quill-editor v-model='shopParams.goods_introduce'></quill-editor>
          <el-button type="primary" class="submit" @click="submitGoods">提交商品</el-button>
      </el-tab-pane>
    </el-tabs>
    </el-form>
  </el-card>
  
  <!-- 图片预览 -->
  <el-dialog
    title="提示"
    close-on-click-modal
    :visible.sync="shopPicture"
    width="50%">
    <img :src='bigPicUrl' class="img">
  </el-dialog>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components:{
     quillEditor,
  },
  data(){
    return{
      // 控制动态参数和静态商品不会多次加载的属性
      x:1,y:1,

      shopParams:{
          goods_name:"",
          goods_price:0,
          goods_number:0,
          goods_weight:0,
          goods_introduce:"",
          attrs:[],
          pics:[]
      },
      CategoryValue:[],
      props:{ expandTrigger: 'hover',
              label:'cat_name',
              value:'cat_id'
               },
      activeName:'1',
      shopCategory:[],
      rules:{     
        goods_price:[{required:true,message:'请输入内容',trigger:'blur'},
          {type: 'number',message:'价格必须是数字',trigger:'blur'},
          ],
        goods_weight:[{required:true,message:'请输入内容',trigger:'blur'},
          {type: 'number',message:'重量必须是数字',trigger:'blur'},
          ],
        goods_number:[{required:true,message:'请输入内容',trigger:'blur'},
          {type: 'number',message:'数量必须是数字',trigger:'blur'},
          ],
        goods_name:[{required:true,message:'请输入内容',trigger:'blur'}],
      },
      manyParamsList:[],
      shopManyParams:[],
      onlyParamsList:[],
      bigPicUrl:'',
      shopPicture:false,
      header:{
        Authorization:sessionStorage.getItem('token')
      }
    }
  },
  methods:{
    getShopCategory(){
      this.$http.get('categories').then(res=>{
        this.shopCategory=res.data.data
      })
    },
    async handleChange(){
      let shopId = this.CategoryValue[this.CategoryValue.length-1]
      this.shopParams.goods_cat=this.CategoryValue.join(',')
      const {data:res}=await this.$http.get(`categories/${shopId}/attributes`,{params:{sel:'many'}})
      res.data.forEach(item=>{
        item.attr_vals=item.attr_vals?item.attr_vals.split(' '):''
        item.checkbox=item.attr_vals
      })
      this.manyParamsList=res.data
      console.log(res);
    },
    tabsLeave(){
      return this.CategoryValue.length!==0
    },
    success(res){
      if(res.meta.status===200){this.shopParams.pics.push(res.data.tmp_path)
      this.bigPicUrl=res.data.url
      console.log(res);
      this.bigPicUrl=this.bigPicUrl.substr(17)
      this.bigPicUrl='http://119.23.53.78:'+this.bigPicUrl
      }
      else{this.$message.error('上传失败')}
    },
    toBigPic(){
      this.shopPicture=true
    },
    uploadRemove(){
      this.shopParams.pics.pop()
    },
    ParamsListForEach(arr){
       arr.forEach(item=>{
            let x = {};
            x.attr_id=item.attr_id;
            x.attr_value=item.attr_vals;
            this.shopParams.attrs.push(x)
          })
    },
    submitGoods(){
      this.$refs.ruleForm.validate(val=>{
        if(val){
         this.ParamsListForEach(this.onlyParamsList)
         this.ParamsListForEach(this.manyParamsList)
          console.log(this.shopParams)
          this.$http.post('goods',this.shopParams).then(res=>{
            console.log(res);
            
          })
        }else{
          this.$message.error('表单校验失败')
        }
      })
    },
    async CategoryValueChange(){
       this.handleChange(),
       this.y=0
        let shopId = this.CategoryValue[this.CategoryValue.length-1]
        this.shopParams.goods_cat=this.CategoryValue.join(',')
        const {data:res}=await this.$http.get(`categories/${shopId}/attributes`,{params:{sel:'only'}})
        this.onlyParamsList=res.data
    }
  },
  created(){
    this.getShopCategory()
  }
}
</script>

<style lang="less" scoped>
  .img{
    width: 100%;
  }

</style>