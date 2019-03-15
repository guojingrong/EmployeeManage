<template>
  <div id="Content">
    <div class="conditionarea">用户账号：
      <Input v-model="username" placeholder="请输入员工账号 ..." style="width:120px" class="txtmagrin" />用户状态：
      <i-switch v-model="valid" size="large" @on-change="queryUser">
        <span slot="open">启用</span>
        <span slot="close">停用</span>
      </i-switch>
      <span :style="{float:'right'}">
        <Button type="primary" icon="ios-search" @click="queryUser">查询</Button>
        <Button type="primary" icon="ios-add" @click="showNewUserWin('new','')">新增</Button>
        <!-- <Button type="primary" @click="delBatchRole">批量删除</Button> -->
      </span>
    </div>
    <div style="padding:3px 3px;">
      <Table border :columns="tbUserColumns" :data="tbUserData" @on-selection-change="mutilSelected"></Table>
      <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total placement="top"
        @on-change="getPageNum" @on-page-size-change="getPageSize"></Page>
    </div>
    <div>
      <!-- 新增用户 -->
      <Modal title="新增用户" v-model="isUserWinHidden" :mask-closable="false">
        <div slot="header" :style="{'font-size':'14px'}">
          <Icon type="ios-person" size="24"></Icon>
          <span>新增用户</span>
        </div>
        <Form ref="addForm" :model="form" :rules="rules" @keydown.enter.native="newUser">
          <FormItem prop="name" label="用户姓名：">
            <Input v-model="form.name" placeholder="请输入..." style="width: 300px">
            </Input>
          </FormItem>
          <FormItem prop="account" label="用户账号：">
            <Input v-model="form.account" placeholder="请输入..." style="width: 300px">
            </Input>
          </FormItem>
          <FormItem prop="password" label="用户密码：">
            <Input type="password" v-model="form.password" placeholder="请输入..." style="width: 300px">
            </Input>
          </FormItem>
          <FormItem prop="mobile" label="用户手机：">
            <Input v-model="form.mobile" placeholder="请输入..." style="width: 300px">
            </Input>
          </FormItem>
          <FormItem prop="isuse" label="是否启用：">
            <i-switch v-model="form.isuse" size="large">
              <span slot="open">启用</span>
              <span slot="close">停用</span>
            </i-switch>
            </Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" @click="isUserWinHidden=false">取消</Button>
          <Button type="primary" @click="newUser">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "User",
    data() {
      return {
        //查询员工
        username: "",
        usertype: "",
        valid: true,
        pageTotal: 0, //总页数
        pageNum: 1, //页码
        pageSize: 10, //每页条数

        //表单
        form: {
          name: "",
          account: "",
          password: "",
          mobile: "",
          isuse: true
        },
        rules: {
          name: [{
            required: true,
            message: "用户姓名不能为空",
            trigger: "blur"
          }],
          account: [{
            required: true,
            message: "用户账号不能为空",
            trigger: "blur"
          }],
          password: [{
            required: true,
            message: "角色编码不能为空",
            trigger: "blur"
          }],
          mobile: [{
            required: true,
            message: "手机号码不能为空",
            trigger: "blur"
          }]
        },

        //特殊变量
        MUTIL_SELECT: [],

        isUserWinHidden: false,

        tbUserColumns: [{
            title: "用户名称",
            key: "name",
            align: "center",
            width:120,
            render: (h, params) => {
              return h(
                "div", {
                  style: {
                    "text-align": "center"
                  }
                },
                params.row.name
              );
            }
          },
          {
            title: "账号",
            key: "account",
            align: "center",
            width: 120,
          },
          {
            title: "手机号",
            key: "mobile",
            align: "center",
            width: 120,
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            width: 80,
            render: (h, params) => {
              let str = "";
              if (params.row.status == 1) {
                str = "有效";
              } else {
                str = "无效";
              }
              return h("div", {}, str);
            }
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            render: (h, params) => {
              return h("div",[
                h(
                  "Button", {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {}
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button", {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {}
                    }
                  },
                  "删除"
                )
              ]);
            }
          }
        ],
        tbUserData: []
      };
    },
    created() {
      this.queryUser();
    },
    methods: {
      getPageNum(curpage) {
        this.pageNum = curpage;
        this.queryUser();
      },
      getPageSize(size) {
        this.pageSize = size;
        this.queryUser();
      },
      mutilSelected() {
        this.MUTIL_SELECT.splice(0, this.MUTIL_SELECT.length);
        for (var i = 0; i < row.length; i++) {
          this.MUTIL_SELECT.push(row[i].uu_id);
        }
        console.log(this.MUTIL_SELECT);
      },
      //查询员工
      queryUser() {
        // debugger
        var data = {
          account: this.username,
          status: this.valid == true ? 1 : 0
        };
        var url = this.$config.url.local + "/account/selectbypage";
        axios
          .post(url, data)
          .then(res => {
            console.log(res.data);
            this.pageTotal = res.data.total;
            this.tbUserData = res.data.rows;
            this.username = "";
          })
          .catch(ex => {
            console.log(ex);
          });
      },
      showNewUserWin(arg, id) {
        if (arg == "new") {
          this.isUserWinHidden = true;
        } else {

        }
      },
      newUser() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            var data = {
              name: this.form.name,
              account: this.form.account,
              pass: this.form.password,
              mobile: this.form.mobile,
              status: this.form.isuse == true ? 1 : 0,
            };
            var url = this.$config.url.local + "/account/regist";
            axios.post(url, data)
              .then(res => {
                // console.log(res)
                if (res.data.code == 200) {
                  this.$Message.info({
                    content: "用户添加成功"
                  });
                  this.isUserWinHidden = false;
                  this.queryUser();
                }
              })
          }
        })
      }
    }
  };
</script>