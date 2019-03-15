<template>
  <div id="Content">
    <div class="conditionarea">用户名称：
      <Input v-model="username" placeholder="请输入员工名称 ..." style="width:120px" class="txtmagrin"/>用户状态：
      <i-switch v-model="valid" size="large" @on-change="queryUser">
        <span slot="open">有效</span>
        <span slot="close">无效</span>
      </i-switch>
      <span :style="{float:'right'}">
        <Button type="primary" icon="ios-search" @click="queryUser">查询</Button>
        <Button type="primary" icon="ios-add" @click="showUserWin('new','')">新增</Button>
        <!-- <Button type="primary" @click="delBatchRole">批量删除</Button> -->
      </span>
    </div>
    <div style="padding:3px 3px;">
      <Table
        border
        :columns="tbUserColumns"
        :data="tbUserData"
        @on-selection-change="mutilSelected"
      ></Table>
      <Page
        :total="pageTotal"
        :current="pageNum"
        :page-size="pageSize"
        show-elevator
        show-sizer
        show-total
        placement="top"
        @on-change="getPageNum"
        @on-page-size-change="getPageSize"
      ></Page>
    </div>
  </div>
</template>

<script>
export default {};
</script>
