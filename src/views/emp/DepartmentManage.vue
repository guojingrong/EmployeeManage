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
    <div id="Content">
        <div class="conditionarea">
            <label>部门编号：</label>
            <Input v-model="deptcode" placeholder="请输入部门编号 ..." style="width:120px" class="txtmagrin" />
            <label>部门状态：</label>
            <i-switch v-model="valid" size="large" @on-change="queryDept">
                <span slot="open">启用</span>
                <span slot="close">停用</span>
            </i-switch>
            <span :style="{float:'right'}">
                <Button type="primary" icon="ios-search" @click="queryDept(true)">查询</Button>
                <Button type="primary" icon="ios-add" @click="showNewDeptWin('new','')">新增</Button>
                <!-- <Button type="primary" @click="delBatchRole">批量删除</Button> -->
            </span>
        </div>
        <div style="padding:3px 3px;">
            <Table border :columns="tbDeptColumns" :data="tbDeptData" @on-selection-change="mutilSelected"></Table>
            <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total
                placement="top" @on-change="getPageNum" @on-page-size-change="getPageSize"></Page>
        </div>
        <div>
            <!-- 分配员工 -->
            <!-- <Modal v-model="isConfigEmpHidden" :mask-closable="false">
            </Modal> -->
            <Drawer title="资源配置" v-model="isConfigEmpHidden" width="550" placement="left" :mask-closable="true">
                <p slot="header">
                    <!-- <Icon type="ios-construct" size="18" /> -->
                    <Icon type="md-contacts" size="18" />
                    <span style="padding-left:3px;">资源配置</span>
                </p>
                <div>
                    <label for="">选择职位：</label>
                    <Select v-model="position" style="width:200px">
                        <Option v-for="item in positionList" :value="item.positionCode" :key="item.positionCode">{{
                            item.positionName }}</Option>
                    </Select>
                </div>
                <div class="mkspace">
                    <div>
                        <label for="">选择员工：</label>
                        <Input search v-model="key" @on-search="queryEmp" placeholder="请输入姓名,账号,手机 ..." style="width:200px"
                            class="txtmagrin" />
                    </div>
                    <div style="padding-top:10px;padding-left: 58px;">
                        <Transfer :titles="emptitles" :data="empdata" :target-keys="emptargetkeys" :render-format="empRenderFormat"
                            @on-change="empHandleChange" :list-style="emplistStyle"></Transfer>
                    </div>
                    <div class="footer">
                        <Button type="text" @click="isConfigEmpHidden=false">取消</Button>
                        <Button type="primary" @click="configEmp">确定</Button>
                    </div>
                </div>
            </Drawer>
        </div>
        <div>
            <!-- 岗位配置 -->
            <Drawer title="岗位配置" v-model="isConfigPosHidden" width="550" placement="left" :mask-closable="true">
                <p slot="header">
                    <Icon type="ios-construct" size="18" />
                    <span style="padding-left:3px;">岗位配置</span>
                </p>
                <div class="mkspace">
                    <div>
                        <label for="">选择岗位：</label>
                        <Input search v-model="poskey" @on-search="queryPos" placeholder="请输入岗位编号，名称 ..." style="width:200px"
                            class="txtmagrin" />
                    </div>
                    <div style="padding-top:10px;padding-left: 58px;">
                        <Transfer :titles="postitles" :data="posdata" :target-keys="postargetkeys" :render-format="posRenderFormat"
                            @on-change="posHandleChange" :list-style="poslistStyle"></Transfer>
                    </div>
                    <div class="footer">
                        <Button type="text" @click="isConfigPosHidden=false">取消</Button>
                        <Button type="primary" @click="configPos">确定</Button>
                    </div>
                </div>
            </Drawer>
        </div>
    </div>
</template>

<script>
    import axios from "axios"
    export default {
        name: "Department",
        data() {
            return {
                //资源配置窗口参数
                isConfigEmpHidden: false,
                positionList: [],
                emptitles: ["员工选择项", "员工已选择"],
                position: "",
                emplistStyle: {
                    height: '380px'
                },
                empdata: [],
                emptargetkeys: [],
                key: "",

                //岗位配置窗口参数
                isConfigPosHidden: false,
                postitles: ["岗位选择项", "岗位已选择"],
                postargetkeys: [],
                posdata: [],
                poskey: "",
                poslistStyle: {
                    height: '400px'
                },


                //查询部门
                deptname: "",
                deptcode: "",
                valid: true,
                pageTotal: 0, //总页数
                pageNum: 1, //页码
                pageSize: 10, //每页条数

                MUTIL_SELECT: [],


                tbDeptColumns: [{
                        title: "部门编号",
                        key: "deptCode",
                        align: "center",
                        width: 120,
                        render: (h, params) => {
                            return h(
                                "div", {
                                    // style: {
                                    //     "text-align": "left"
                                    // }
                                },
                                params.row.deptCode
                            );
                        }
                    },
                    {
                        title: "部门名称",
                        key: "deptName",
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
                        // width: 100,
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
                                            click: () => {
                                                this.deletDept(params.row.id);
                                            }
                                        }
                                    },
                                    "删除"
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
                                                this.isConfigPosHidden = true;
                                                this.queryPos();
                                            }
                                        }
                                    },
                                    "岗位配置"
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
                                                this.isConfigEmpHidden = true;
                                                this.emptargetkeys = []; //先将目标清空
                                                this.queryPosition(params.row.deptCode);
                                                this.queryEmp();
                                            }
                                        }
                                    },
                                    "资源配置"
                                ),
                                
                            ]);
                        }
                    }
                ],
                tbDeptData: []
            }
        },
        created() {
            this.queryDept();
        },
        methods: {
            showNewDeptWin(arg, id) {
                this.isDeptHidden = true;
            },
            getPageNum(curpage) {
                this.pageNum = curpage;
                this.queryDept(false);
            },
            getPageSize(size) {
                this.pageSize = size;
                this.queryDept(false);
            },
            mutilSelected() {
                this.MUTIL_SELECT.splice(0, this.MUTIL_SELECT.length);
                for (var i = 0; i < row.length; i++) {
                    this.MUTIL_SELECT.push(row[i].uu_id);
                }
                console.log(this.MUTIL_SELECT);
            },
            queryDept(v) {
                if (v) this.pageNum = 1;
                var data = {
                    deptCode: this.deptcode,
                    status: this.valid == true ? 1 : 0,
                    index: this.pageNum,
                    size: this.pageSize
                };
                // console.log(data)
                axios({
                    method: "post",
                    url: this.$config.url.server + "/depart/pagelist?r=" + new Date().getTime(),
                    data: data,
                    headers: {
                        Authorization: "Bearer " + this.$config .token,
                        "Content-Type": "application/json"
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.data.success) {
                        this.pageTotal = res.data.data.total;
                        this.tbDeptData = res.data.data.list;
                    } else {
                        this.$Notice.error(res.data.errMsg);
                    }

                })
            },
            queryPosition(code) {
                axios({
                    method: "get",
                    url: this.$config.url.server + "/depart/position/" + code + "?r=" + new Date().getTime(),
                    headers: {
                        Authorization: "Bearer " + this.$config .token,
                        "Content-Type": "application/json"
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.data.success) {
                        if (res.data.data[0] != null)
                            this.positionList = res.data.data;
                        else
                            this.positionList = [];
                        this.position = "";
                    } else {
                        this.$Notice.error(res.data.errMsg);
                    }

                })
            },
            queryPos() {
                axios({
                    method: "get",
                    url: this.$config.url.server + "/depart/position?key=" + this.poskey ,//+ "?r=" + new Date().getTime(),
                    headers: {
                        Authorization: "Bearer " + this.$config .token,
                        "Content-Type": "application/json"
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.data.success) {
                        var pos = [];
                        var arr = res.data.data;
                        arr.forEach(t => {
                            pos.push({
                                key: t.positionCode,
                                label: t.positionName
                            });
                        });
                        this.posdata=pos;
                        this.poskey="";
                    } else {
                        this.$Notice.error(res.data.errMsg);
                    }

                })
            },
            queryEmp() {
                var data = {
                    key: this.key,
                    status: 1,
                    index: 1,
                    size: 200
                };
                axios({
                        method: "post",
                        url: this.$config.url.server + "/emp/pagelist?r=" + new Date().getTime(),
                        data: data,
                        headers: {
                            Authorization: "Bearer " + this.$config .token,
                            "Content-Type": "application/json"
                        }
                    })
                    .then(res => {
                        // console.log(res)
                        if (res.data.success) {
                            var pos = [];
                            var arr = res.data.data.list;
                            arr.forEach(t => {
                                pos.push({
                                    key: t.code,
                                    label: t.name
                                });
                            });
                            this.empdata = pos;
                            this.key = "";
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
            deletDept(id) {
                let config = {
                    title: "提示",
                    content: "你是否删除该条数据?",
                    okText: "确定",
                    cancelText: "取消",
                    onOk: () => {
                        var url = this.$config.url.server + "/depart/remove/" + id + "?r=" + new Date()
                            .getTime();
                        axios({
                            method: "get",
                            url: url,
                            headers: {
                                Authorization: "Bearer " + this.$config .token,
                                // "Content-Type": "application/json"
                            }
                        }).then(res => {
                            console.log(res)
                            if (res.data.success) {
                                this.$Message.success("删除成功");
                                this.queryDept();
                            } else {
                                this.$Notice.error(res.data.errMsg);
                            }

                        })
                    },
                    // onCancel: true
                };
                this.$Modal.confirm(config);

            },
            empRenderFormat(item) {
                return item.label + "[" + item.key + "]";
            },
            empHandleChange(targetKeys, direction, moveKeys) {
                // console.log(targetKeys)
                // console.log(direction)
                // console.log(moveKeys)
                this.emptargetkeys = targetKeys;
            },
            configEmp() {
                console.log(this.targetkeys)
            },
            posHandleChange(targetKeys, direction, moveKeys) {
                this.postargetkeys = targetKeys;
            },
            posRenderFormat(item) {
                return item.label;
            },
            configPos() {

            }
        }
    }
</script>