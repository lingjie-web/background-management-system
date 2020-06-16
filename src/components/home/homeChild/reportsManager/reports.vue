<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card >
       <div id="myChart" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      type:'type/1',
      options:{
        title:{
          text:'用户来源'
        },
        tooltip:{
          trigger:'axis',
          axisPointer:{
            type:'cross',
            label:{
              backgroundColor:'#E9EEF3'
            }
          }
        },
        grid:{
          left:'3%',
          right:'4%',
          bottom:'3%',
          containLabel:true
        },
        xAxis:[
          {
            boundaryGap:false
          }
        ],
        yAxis:[
          {
            type:'value'
          }
        ]
      }
    }
  },
  created(){
    this.getEchartList()
  },
  mounted(){
   this.SetEchart()
  },
   methods: {
      getEchartList(){
        
      },
      SetEchart(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        
        this.$http.get(`reports/${this.type}`).then(res=>{
        let option=res.data.data
        let options1 = this.$lodash.merge(option,this.options)
        myChart.setOption(options1)
        })
        
      }
    }
}
</script>

<style lang="less" scoped>
  
</style>