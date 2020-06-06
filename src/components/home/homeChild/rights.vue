<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col :span="24">
        <el-card shadow="never">
          <template>
            <el-table :data="rights" stripe style="width: 100%">
              <el-table-column type="index">
              </el-table-column>
              <el-table-column prop="authName" label="权限名称" >
              </el-table-column>
              <el-table-column prop="path" label="权限路径">
              </el-table-column>
              <el-table-column label="权限等级">
                <template slot-scope="scope">
                 <el-tag v-if="scope.row.level==0" type="danger">一级</el-tag>
                 <el-tag v-else-if="scope.row.level==1" type="warning">二级</el-tag>
                 <el-tag v-else-if="scope.row.level==2" type='success'>三级</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {  
  name:'rights',
  data(){
    return{
      rights:[]
    }
  },
  created(){
    this.$http.get('rights/list').then(
      res=>{
        this.rights=res.data.data
        if(res.status!==200){
          this.$message.error('请求失败')
        }
      }
    )
  }

}
</script>

<style lang="less" scoped>
  .el-breadcrumb{
    margin-bottom: 20px;
  }
</style>