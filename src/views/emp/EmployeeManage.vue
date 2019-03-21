<style>
  .ivu-table td {
    height: 30px;
}
.ivu-table-cell {
    padding-left: 5px; 
    padding-right: 5px;
}
.ivu-table-column-center{
  line-height: 35px;
}
</style>
<template>
  <div>
    <div id="Content">
      <div class="conditionarea">
        <label for="">关键字：</label>
        <Input v-model="key" placeholder="请输入姓名,账号,手机 ..." style="width:200px" class="txtmagrin" />
        <label for="">员工状态：</label>
        <i-switch v-model="valid" size="large">
          <span slot="open">有效</span>
          <span slot="close">无效</span>
        </i-switch>
        <span :style="{float:'right'}">
          <Button type="primary" icon="ios-search" @click="queryEmployee(true)">查询</Button>
          <Button type="primary" icon="ios-add" @click="showNewEmpWin('new','')">新增</Button>
          <Button type="primary" icon="ios-cloud-download-outline" @click="exportData">导出数据</Button>
          <!-- <Button type="primary" @click="delBatchRole">批量删除</Button> -->
        </span>
      </div>
      <div style="padding:3px 3px;">
        <Table border ref="empTable" :loading="loading" :columns="tbEmployeeColumns" :data="tbEmployeeData" :style="{width:'100%'}"
          @on-selection-change="mutilSelected"></Table>
        <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total placement="top"
          @on-change="getPageNum" @on-page-size-change="getPageSize"></Page>
      </div>
    </div>

    <div>
      <Drawer v-model="isEmpHidden" width="550" placement="left" :mask-closable="true">
        <p slot="header">
          <Icon type="md-person-add" size="18" />
          <span style="padding-left:3px;">{{title}}</span>
        </p>
        <div>
          <Form ref="addForm" :model="form" :rules="rules" @keydown.enter.native="newEmp">
            <div id="info">
              <FormItem prop="code" label="员工编号：" style="margin-bottom:0px;margin-top:5px;">
                <Input v-model="form.code" id="code" style="width: 260px" />
              </FormItem>
              <FormItem prop="name" label="员工姓名：" style="margin-bottom:0px;margin-top:5px;">
                <Input v-model="form.name" placeholder="请输入员工姓名..." style="width: 260px" />
              </FormItem>
              <FormItem prop="account" label="员工账号：" style="margin-bottom:0px;margin-top:5px;">
                <Input v-model="form.account" id="account" placeholder="请输入员工账号..." style="width: 260px" />
              </FormItem>
            </div>
            <div id="photo">
              <img :src="imagePath" width="100%" height="100%" />
              <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleUploadSuccess"
                :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize"
                :before-upload="handleUploadBefore" type="drag" :action="actionPath" class="upload">
                <div style="width: 20px;height:20px;line-height: 20px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
            </div>
            <div class="other">
              <div class="half">
                <FormItem prop="birth" label="出生日期：" style="margin-bottom:0px;margin-top:0px;">
                  <DatePicker type="date" v-model="form.birth" placeholder="请选择出生日期..." style="width: 130px"></DatePicker>
                </FormItem>
              </div>
            </div>
            <div class="other">
              <div class="half">
                <FormItem prop="phone" label="联系方式：" style="margin-bottom:0px;margin-top:0px;">
                  <Input v-model="form.phone" placeholder="请输入联系方式..." style="width: 130px" />
                </FormItem>
              </div>
              <div class="half">
                <FormItem prop="sex" label="员工性别：" style="margin-bottom:0px;margin-top:0px;">
                  <RadioGroup v-model="form.sex">
                    <Radio label="0">女</Radio>
                    <Radio label="1">男</Radio>
                  </RadioGroup>
                </FormItem>
              </div>
            </div>
            <div style="width:100%">
              <FormItem prop="address" label="家庭住址：" style="margin-bottom:0px;margin-top:5px;">
                <Input v-model="form.address" placeholder="请输入家庭住址..." style="width: 400px" />
              </FormItem>
              <FormItem prop="remark" label="履历介绍：" style="margin-bottom:0px;margin-top:5px;">
                <Input type="textarea" v-model="form.remark" placeholder="请输入履历介绍..." :rows="8" :cols="100" />
              </FormItem>
            </div>
          </Form>
        </div>
        <div class="footer">
          <Button type="text" @click="isEmpHidden=false">取消</Button>
          <Button type="primary" @click="newEmp">确定</Button>
        </div>
      </Drawer>
    </div>
  </div>
</template>
<script>
  import axios from "axios"
  export default {
    name: "Employee",
    data() {
      return {
        title: "", //弹出框标题
        EMP_ID: "", //员工ID 编辑时有值

        actionPath: this.$config.url.server + "/files/upload", //上传action
        imagePath: "/images/employee.png",
        isEmpHidden: false,
        styles: {
          height: 'calc(100% - 20px)',
          overflow: 'auto',
          paddingBottom: '50px',
          position: 'static'
        },

        loading: true,

        //查询员工
        valid: true,
        key: "",
        pageTotal: 0, //总页数
        pageNum: 1, //页码
        pageSize: 10, //每页条数

        form: {
          code: "",
          name: "",
          account: "",
          sex: "1",
          birth: "",
          phone: "",
          address: "",
          remark: ""
        },
        rules: {
          code: [{
            required: true,
            message: "员工编号不能为空",
            trigger: "blur"
          }],
          name: [{
            required: true,
            message: "员工姓名不能为空",
            trigger: "blur"
          }],
          account: [{
            required: true,
            message: "员工账号不能为空",
            trigger: "blur"
          }],
          phone: [{
              required: true,
              message: "联系方式不能为空",
              trigger: "blur"
            },
            // {
            //   type: 'mobile',
            //   message: 'Incorrect email format',
            //   trigger: 'blur'
            // }
          ],
          address: [{
            required: true,
            message: "家庭住址不能为空",
            trigger: "blur"
          }],
          birth: [{
            required: true,
            type: 'date',
            message: "出生日期不能为空",
            trigger: "change"
          }],
        },
        //默认照片
        defaultList: [],

        //员工类别
        empltypeList: [{
            id: 1,
            name: "普通"
          },
          {
            id: 2,
            name: "管理"
          }
        ],

        //特殊变量
        MUTIL_SELECT: [],

        tbEmployeeColumns: [{
            type: 'selection',
            align: 'center',
            width: 50
          }, {
            title: "编号",
            key: "code",
            align: 'center',
            width: 80
          },
          {
            title: "姓名",
            key: "name",
            align: 'center',
            width: 100
          },
          {
            title: "账号",
            key: "account",
            align: 'center',
            width: 100
          },
          {
            title: "性别",
            key: "sex",
            align: 'center',
            width: 80,
            render: (h, params) => {
              return h("div", {}, params.row.sex == 1 ? "男" : "女");
            }
          },
          {
            title: "出生日期",
            key: "birth",
            align: 'center',
            tooltip: true,
            width: 120,
            render: (h, params) => {
              return h("Tooltip", {
                props: {
                  placement: 'right'
                }
              }, [
                this.$config.timestampformat("yyyy-MM-dd", params.row.birth),
                h('span', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal',
                    wordBreak: 'break-all'
                  }
                }, params.row.age + "岁")
              ])
            }
          },
          {
            title: "手机",
            key: "mobile",
            align: 'center',
            width: 120
          },
          {
            title: "地址",
            key: "address",
            align: 'center',
            ellipsis: true,
            tooltip: true,
            width: 200,
            render: (h, params) => {
              return h("div", {
                style: {
                  "text-align": "left"
                }
              }, [
                h("Tooltip", {
                  props: {
                    placement: 'top'
                  }
                }, [
                  params.row.address,
                  h('span', {
                    slot: 'content',
                    style: {
                      whiteSpace: 'normal',
                      wordBreak: 'break-all'
                    }
                  }, params.row.address)
                ])
              ])
            }
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            render: (h, params) => {
              return h("div", [
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
                      click: () => {
                        this.showNewEmpWin('edit', params.row.id);
                      }
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
                      click: () => {

                      }
                    }
                  },
                  "删除"
                ),
                
              ]);
            }
          }
        ],
        tbEmployeeData: []
      };
    },
    created() {
      this.queryEmployee(true);
    },
    methods: {
      showNewEmpWin(arg, id) {
        this.EMP_ID = ""; //将员工ID置空
        this.imagePath = "/images/employee.png"; //默认图片
        this.isEmpHidden = true;
        if (arg == "new") {
          this.title = "新增员工";
          this.generateCode();
          $("#account input").attr("readonly", false);
          $("#code input").attr("readonly", true);
          this.$refs.addForm.resetFields();
        } else {
          this.title = "编辑员工";
          $("#account input").attr("readonly", true);
          this.initEdit(id);
        }
      },
      initEdit(id) {
        axios({
            method: "get",
            url: this.$config.url.server + "/emp/getby/" + id + "?r=" + new Date().getTime(),
            headers: {
              Authorization: "Bearer " + this.$config.token,
              "Content-Type": "application/json"
            }
          })
          .then(res => {
            if (res.data.success) {
              var emp = res.data.data;
              console.log(emp);
              this.EMP_ID = emp.id;
              this.form.code = emp.code;
              this.form.name = emp.name;
              this.form.account = emp.account;
              this.form.sex = emp.sex + "";
              this.form.age = emp.age;
              this.form.address = emp.address;
              this.form.phone = emp.mobile;
              this.form.birth = this.$config.dateformat("yyyy-MM-dd", emp.birth);
              this.form.photo = emp.photo;
              this.form.remark = emp.remark;
              this.imagePath = this.form.photo == "" ? "/images/employee.png" : this.$config.url.server + this.form.photo;
            } else {
              this.$Notice.error({
                title: "错误提示",
                desc: res.data.errMsg
              });
            }
          })
      },
      getPageNum(curpage) {
        this.pageNum = curpage;
        this.queryEmployee(false);
      },
      getPageSize(size) {
        this.pageSize = size;
        this.queryEmployee(false);
      },
      mutilSelected(row) {
        this.MUTIL_SELECT.splice(0, this.MUTIL_SELECT.length);
        for (var i = 0; i < row.length; i++) {
          this.MUTIL_SELECT.push(row[i].code);
        }
        // console.log(this.MUTIL_SELECT);
      },
      //查询员工
      queryEmployee(v) {
        // debugger
        if (v) this.pageNum = 1;
        var data = {
          key: this.key,
          status: this.valid == true ? 1 : 0,
          index: this.pageNum,
          size: this.pageSize
        };
        axios({
            method: "post",
            url: this.$config.url.server + "/emp/pagelist" ,//+ new Date().getTime(),
            data: data,
            headers: {
              Authorization: "Bearer " + this.$config.token,
              "Content-Type": "application/json"
            }
          })
          .then(result => {
            // console.log(result)
            if (result.data.success) {
              this.pageTotal = result.data.data.total;
              this.tbEmployeeData = result.data.data.list;
              this.loading = false;
            } else {
              this.$Notice.error({
                title: "错误提示",
                desc: res.data.errMsg
              });
            }
          })
          .catch(ex => {
            console.log(ex);
          });
      },
      newEmp() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            var data = {
              id: this.EMP_ID,
              code: this.form.code,
              name: this.form.name,
              account: this.form.account,
              sex: this.form.sex,
              age: this.handleAge(this.form.birth),
              address: this.form.address,
              mobile: this.form.phone,
              birth: this.$config.dateformat("yyyy-MM-dd", this.form.birth),
              photo: this.form.photo,
              remark: this.form.remark
            };
            // console.log(data);
            if (this.EMP_ID == "") {
              //Add
              axios({
                  method: "post",
                  url: this.$config.url.server + "/emp/insert",
                  data: data,
                  headers: {
                    Authorization: "Bearer " + this.$config.token,
                    "Content-Type": "application/json"
                  }
                })
                .then(res => {
                  console.log(res)
                  if (res.data.success) {
                    let config = {
                      title: "提示",
                      content: "新增员工成功！你是否继续新增?",
                      okText: "继续",
                      cancelText: "取消",
                      onOk: () => {
                        this.$refs.addForm.resetFields();
                        this.EMP_ID = ""; //将员工ID置空
                        this.imagePath = "/images/employee.png"; //默认图片
                        this.generateCode();
                      },
                      onCancel: () => {
                        this.isEmpHidden = false;
                      }
                    };
                    this.$Modal.confirm(config);

                  } else {
                    this.$Notice.error({
                      title: "错误提示",
                      desc: res.data.errMsg
                    });
                  }
                })
            } else {
              //Edit
              axios({
                  method: "post",
                  url: this.$config.url.server + "/emp/modify",
                  data: data,
                  headers: {
                    Authorization: "Bearer " + this.$config.token,
                    "Content-Type": "application/json"
                  }
                })
                .then(res => {
                  if (res.data.success) {
                    this.isEmpHidden = false;
                    this.$Notice.success({
                      title: "成功提示",
                      desc: "员工信息修改成功！"
                    });
                  } else {
                    this.$Notice.error({
                      title: "错误提示",
                      desc: res.data.errMsg
                    });
                  }
                })
            }
            //继续与否都要刷新列表
            this.queryEmployee(true);
          }
        })
      },
      handleUploadSuccess(res, file) {
        // console.log(res)
        this.form.photo = "/files" + res;
        this.imagePath = this.$config.url.server + this.form.photo;
      },
      handleUploadBefore() {
        //如果upload 设置属性multiple  可以多选 
        //上传前判断上传文件个数限制
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '提示',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        });
      },
      handleAge() {
        var d = this.$config.dateformat("yyyy-MM-dd", this.form.birth);
        var age = this.$config.getAge(d);
        return age;
      },
      generateCode() {
        axios({
            method: "get",
            url: this.$config.url.server + "/emp/code?r=" + new Date().getTime(),
            headers: {
              Authorization: "Bearer " + this.$config.token,
              "Content-Type": "application/json"
            }
          })
          .then(res => {
            console.log(res)
            this.form.code = res.data.data;
          })
      },
      exportData(){
        this.$refs.empTable.exportCsv({
          filename:"员工列表"
        });
      }
    }
  };
</script>