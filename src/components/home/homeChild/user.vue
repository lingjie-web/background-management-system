<template>
<div class="user">
  <div class="nav">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="table"><div>
      <el-input v-model="user.query" class="input"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search"></el-button>
      <el-button type="primary" @click="addDialog1" class="submit">添加用户</el-button>
    </div>
    <el-table
     border stripe
    :data="userList"
    style="width: 100%">
     <el-table-column type=index>
    </el-table-column>
    <el-table-column prop="username" label="姓名" width="180"></el-table-column>
    <el-table-column  prop="email" label="邮箱"></el-table-column>
    <el-table-column prop="mobile" label="手机"></el-table-column>
    <el-table-column prop="role_name" label="权限"></el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scop">
        <el-tooltip :content="userList.mg_state?'在线':'离开'" placement="top">
          <el-switch
            v-model='scop.row.mg_state'
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="操作" class="elBtnGro" width='210px'>
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" content="编辑" placement="top" >
          <el-button type="primary" icon="el-icon-edit" @click="editUser1(scope.row.id)"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
          <el-button type="warning" icon="el-icon-s-check" @click="showDestRole(scope.row)"></el-button>delete
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除"  placement="top">
          <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)" ></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
  <!-- 添加用户 -->
    <el-dialog
      title=" 用户信息"
      :visible.sync="addDialog"
      width="50%">
          <el-form :model="addUser" :rules="addUserRules" ref="addUser" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addUser.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addUser.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addUser.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="addUser.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialog = false">取 消</el-button>
            <el-button type="primary"  @click="addUserAxios">确 定</el-button>
          </span>
    </el-dialog>
  <!-- 编辑用户 -->
   <el-dialog
      title=" 编辑用户"
      :visible.sync="editDialog"
      width="50%">
          <el-form :model="editUser" :rules="addUserRules" ref="editUser" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="editUser.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editUser.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="editUser.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialog = false">取 消</el-button>
            <el-button type="primary"  @click="editUserAxios">确 定</el-button>
          </span>
  </el-dialog>
  <!-- 分配角色 -->
  <el-dialog
    title="分配角色"
    :visible.sync="destRole"
    width="50%" >
      <p>用户名：{{userRoleEdit.username}}</p>
      <p>角色名：{{userRoleEdit.role_name}}</p>
      <p>请分配角色： 
        <el-select v-model="userRole" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="destRole = false">取 消</el-button>
        <el-button type="primary" @click="putUserRole(userRoleEdit.id)">确 定</el-button>
      </span>
</el-dialog>

  
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handlecurrentChange"
      :current-page="user.pagenum"
      :page-sizes="[ 2, 4,6,8]"
      :page-size="user.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
  </div>
  </div>
</template>

<script>
export default {
  name:'user',
  data(){
    let checkEmail = (rule,value,callback)=>{
      const regEmail=/^([a-zA-Z0-9_-])+@([A-Za-z0-9_-])+(\.[A-Za-z0-9_-])+/
      if(!regEmail.test(value)){return callback(new  Error('请输入正确的邮箱'))
      }
      return callback()
    };
    let checkMobile=(rule,value,cb)=>{
      const regMobile=/^1[3456789]\d{9}$/
      if(!regMobile.test(value)){return cb(new Error('请输入正确的手机号'))
      }return cb()
    }
    return{
      user:{
        query:'',
        pagenum:1,
        pagesize:4,
        },
      userList:[],
      total:null,
      addDialog:false,
      editDialog:false,
      destRole:false,
      roleList:[],
      userRole:{},
      addUser:{
        username:'1243',
        password:'123132',
        email:'13@1.c',
        mobile:'15112312313',
      },
      editUser:{},
      userRoleEdit:{},
      addUserRules:{
        username:[{ required: true, message: '请输入用户名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password:[{ required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }],
        email:
        [{ required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }],
        mobile:
        [{ required: true, message: '请输入手机号码', trigger: 'blur' },
        {validator:checkMobile,trigger:'blur'}]
      },
    }
  },
  created(){
    this.axios()
  },
  methods:{
    addDialog1(){
      this.addDialog=true
    },
    async editUser1(id){
      this.editDialog=true
     const{data:res}=await this.$http.get('users/'+id)
     console.log(res);
     if(res.meta.status===200){
       this.editUser=res.data
       this.$message.success('请编辑')
       }else{
         this.$message.error('请求用户信息失败')
       }
    },

    deleteUser(id){
       this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
         const{data:res}=await this.$http.delete('users/'+id)
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
    // 分配角色
    async showDestRole(row){
      this.destRole=true
      console.log(row);
      const {data:res}=await this.$http.get('roles')
      console.log(res.data);
      if(res.meta.status==200){
        this.roleList=res.data
      }
      this.userRoleEdit=row
    },
    // 提交角色分配
    putUserRole(id){
      this.$http.put(`users/${id}/role`,{rid:this.userRole+''}).then(res=>{
        this.destRole=false
                  console.log(res);
        if(res.data.meta.status==200){
           this.axios() 
           this.userRole=''
        this.$message.success('分配成功')}else{
        this.$message.error('分配失败')}
      })
    },
    // 提交数据
    addUserAxios(){
        this.$refs.addUser.validate(async vaild => {
          if(vaild){
            const{data:res}=await this.$http.post('users',this.addUser)

          if(res.meta.status===201){
            this.axios()
          this.$refs.addUser.resetFields(),
          this.$message.success('添加成功')
          }else{
            this.$message.error('用户名已存在')
          }
          }
      })
      this.addDialog = false
    },
    editUserAxios(){
        this.$refs.editUser.validate(async vaild=>{
            if(vaild){
              const{data:res}=await this.$http.put('users/'+this.editUser.id,
                {email:this.editUser.email,
                mobile:this.editUser.mobile
                })
              if(res.meta.status===200){
                   this.axios()
                   this.$message.success('修改成功')
                   this.$refs.editUser.resetFields()
                   this.editDialog = false
                 }else{
                      this.$message.error('请求用户信息失败')
                }
            }
        })
    },
    
    axios(){
       this.$http.get('users',{
        params:this.user
      }).then(res=>{
        this.userList=res.data.data.users
        this.total=res.data.data.total
      })
    },

    search(){
      this.axios()
    },
    handleSizeChange(pageSize){
      this.user.pagesize=pageSize,
      this.axios()
    },
    handlecurrentChange(current){
      this.user.pagenum=current,
      this.axios()
    }

  }
}
</script>

<style scoped>

.nav{
  margin-bottom: 15px;
}
.submit{
  float: right;
}
.input{
  width: 40%;
  margin-right: 20px;
  margin-bottom: 20px;
}
.table{
  padding: 20px 20px;
  background-color: #fff;
}
.elBtnGro{
  display: flex;
}
.elBtnGro .el-button{
    width: 25%;
  }
</style>