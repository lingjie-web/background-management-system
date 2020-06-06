<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col :span="24">
        <el-card shadow="never">
          <el-button type="primary" class="submit" @click=" addDialog1">添加用户</el-button>
          <el-table :data="roles" border style="width: 100%" stripe> 
              <el-table-column type="expand" >
                <template slot-scope="scope">
                  <el-row v-for="(childrens,index) in scope.row.children" :class="{'border':index==0}" :key="index"  class="left">
                    <el-col :span='5'>
                     <el-Tag type="danger" closable @close='deleteRight(childrens.id,scope.row)'>{{childrens.authName}} </el-Tag>
                     <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span='19' >
                      <el-row  v-for="(children,indey) in childrens.children" :key="indey" :class="{'border':indey!==0}" class="center">
                          <el-col :span='8' >
                            <el-Tag type="warning" closable @close='deleteRight(children.id,scope.row)'>{{children.authName}} </el-Tag>
                            <i class="el-icon-caret-right"></i>
                          </el-col>
                          <el-col :span="16" class="right" >
                              <el-Tag closable 
                              @close='deleteRight(children1.id,scope.row)' 
                              v-for="children1 in children.children" :key="children1.id" 
                              type="success">
                                {{children1.authName}} 
                              </el-Tag> 
                          </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column> 
              <el-table-column type="index" ></el-table-column> 
              <el-table-column prop="roleName" label="角色名称"  > </el-table-column>
              <el-table-column  prop="roleDesc"  label="角色描述"  ></el-table-column>
              <el-table-column  label="角色操作" width="230px">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top" >
                    <el-button size='mini' type="primary" icon="el-icon-edit" @click="editUser1(scope.row.id)"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="分配权限" placement="top" >
                    <el-button size='mini' type="warning" icon="el-icon-s-check" @click="showEditDialog(scope.row)">分配权限</el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除"  placement="top">
                    <el-button size='mini' type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)" ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <!-- 添加用户 -->
    <!-- 分配权限 -->
    <el-dialog
      title="提示"
      :visible.sync="editRights"
      width="50%">
        <el-tree :data="rightList" 
        ref="elTree" :props="defaultProps" 
        show-checkbox node-key="id" default-expand-all :default-checked-keys="roleRight"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRights = false">取 消</el-button>
        <el-button type="primary" @click="submitEditRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script scoped>
export default {
  name:'usersList',
  data(){return{
    roles:[],
    editUser:{},
    addDialog:false,
    adduser:{},
    addUserRules:{},
    editRights:false,
    rightList:[],
    roleRight:[],
    roleActiveId:null,
    defaultProps:{
      label:'authName',
      children: 'children',
 
    }
  }},
  created(){
    this.getroles()
  },
  methods:{
    async getroles(){
      const{data:res}=await this.$http.get('/roles')
      console.log(res);
      if(res.meta.status===200){
          this.roles=res.data
      }else{
        this.$message.error('请求数据失败')
      }
    },
    // 添加用户
     addDialog1(){
      this.addDialog=true
    },
     // 编辑用户
    async editUser1(id){
      this.editDialog=true
      const{data:res}=await this.$http.get('roles/'+id)
      console.log(res);
       if(res.meta.status===200){
         this.editUser=res.data
         this.$message.success('请编辑')
       }else{
         this.$message.error('请求用户信息失败')
       }
    },
    // 删除用户
    deleteUser(id){
       this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
         const{data:res}=await this.$http.delete('roles/'+id)
             if(res.meta.status===200){
               this.user.pagenum=1
             this.$http.get('users',{
               params:
               { query:'',
                 pagenum:1,
                 pagesize:2,}
             }).then(res=>{
                  console.log(res);
                  this.userList=res.data.data.users
                  this.total=res.data.data.total})
             this.$message({
            type: 'success',message: '删除成功!' })
           }else{this.$message.error('删除失败')}
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },

     deleteRight(rightId,role){
       this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
         const{data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          console.log(res);
             if(res.meta.status===200){
              role.children=res.data
           }else{this.$message.error('删除失败')}
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
     },
    
    showEditDialog(roleActive){
       this.$http.get('rights/tree').then(
        res=>{
          this.rightList=res.data.data
          if(res.status!==200){
          this.$message.error('请求失败')
          }
         }
      ),
      this.getRight(roleActive)
      this.roleActiveId=roleActive.id
      this.editRights=true
    },
    getRight(node){
       if(!node.children){
         this.roleRight=[]
         this.roleRight.push(node.id)
       }else{
         node.children.forEach(item=>{
           this.getRight(item)
         })
       }
    },
    submitEditRights(){
      let right = this.$refs.elTree.getCheckedKeys()
      this.$refs.elTree.getHalfCheckedKeys().forEach(item=>{
        right.push(item)
      })
      const rids =right.join(',')
      this.$http.post(`roles/${this.roleActiveId}/rights`,{rids:rids}).then(res=>{
        console.log(res);
        this.editRights=false
      })

    }
  }
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin:7px;
  }
  .el-row {
   display: flex;
   align-items: center;
  }
  .left{
    border-bottom:1px solid #eee;
  }
  .border{
    border-top:1px solid #eee;
  }
</style>