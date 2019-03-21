<style scoped>
.layout {
  /* border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden; */
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
<template>
  <div class="layout">
    <Layout>
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
        <!-- 默认打开 active-name="1-1" :open-names="['1']" -->
        <Menu
          theme="dark"
          width="auto"
          :class="menuitemClasses"
          
        >
          <div class="pic">
            <img src="/images/logo.png" width="50px" height="50px" title="员工管理系统">
          </div>
          <Submenu name="1">
            <template slot="title">
              <Icon type="ios-paper"/>人事管理
            </template>
            <MenuItem name="1-1" to="/emp">员工管理</MenuItem>
            <MenuItem name="1-2" to="/dept">部门管理</MenuItem>
            <MenuItem name="1-3">考勤管理</MenuItem>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
              <Icon type="ios-people"/>系统管理
            </template>
            <MenuItem name="2-1" to="/user">用户管理</MenuItem>
            <MenuItem name="2-2" to="/menu">菜单管理</MenuItem>
          </Submenu>
          <Submenu name="3">
            <template slot="title">
              <Icon type="ios-stats"/>统计分析
            </template>
            <MenuItem name="3-1" to="/age">年龄段分析</MenuItem>
            <MenuItem name="3-2">薪资分析</MenuItem>
            <MenuItem name="3-3">考勤分析</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{padding: 0}" class="layout-header-bar">
          <Icon
            @click.native="collapsedSider"
            :class="rotateIcon"
            :style="{margin: '0 20px'}"
            type="md-menu"
            size="24"
          ></Icon>
          <span class="icon_float_right">
            <!-- <img
              src="/images/employee.ico"
              width="16px"
              height="16px"
              style="vertical-align: middle;"
            >
            -->
            <Dropdown @on-click="clickItem">
              <a href="javascript:void(0)">
                {{account}}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="modify">修改密码</DropdownItem>
                <DropdownItem name="logout">注销系统</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </span>
        </Header>
        <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
          <router-view></router-view>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  data() {
    return {

      activeMenu:"1-1",
      
      isCollapsed: false,
      account: sessionStorage.getItem("account")
    };
  },
  mounted(){
    // this.menuList();
  },
  created() {},
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  methods: {
    menuList(){
      let path = this.$route.matched[1].path // 获取到地址拦上#号后面的url地址
      console.log(path)
      if (path.indexOf('emp') != -1) { 
          this.activeMenu = '1-1';
          this.openName=this.openNames[this.index];
        }else if(path.indexOf('dept') != -1){
          this.activeMenu = '1-2';
          this.openName=this.openNames[this.index];
        }
        else if(path.indexOf('user') != -1){
          this.activeMenu = '2-1';
          this.index=1;
          this.openName=this.openNames[this.index];
        }
        else if(path.indexOf('menu') != -1){
          this.activeMenu = '2-2';
          this.index=1;
          this.openName=this.openNames[this.index];
        }
    },
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    clickItem(name) {
      console.log(name);
      switch (name) {
        case "modify":
          break;
        case "logout":
          this.$router.push({name:"login"});
          break;
      }
    }
  }
};
</script>
