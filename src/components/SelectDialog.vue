<template>
  <div>
    <table :class="tb">
      <tr>
        <th>{{s_title}}</th>
        <th
          rowspan="2"
          :class="center"
        >
          <Button
            type="text"
            @click="toDesc"
          >
            <Icon
              type="md-arrow-round-forward"
              size="30"
            />
          </Button>
          <Button
            type="text"
            @click="toSource"
          >
            <Icon
              type="md-arrow-round-back"
              size="30"
            />
          </Button>
        </th>
        <th>{{d_title}}</th>
      </tr>
      <tr>
        <td :class="higth">
          <ul
            id="ztreeSource"
            class="ztree"
          ></ul>
        </td>
        <td :class="higth">
          <ul
            id="ztreeDesc"
            class="ztree"
          ></ul>
        </td>
      </tr>
    </table>
  </div>
</template>


<script>
// 外部静态文件
// import "ztree/js/jquery-1.4.4.min";
import "ztree/css/zTreeStyle/zTreeStyle.css";
import "ztree/js/jquery.ztree.all";
export default {
  name: "selectDialog",
  props: {
    s_title: String, //源标题
    d_title: String, //目标标题
    source: Array //源数据源
  },
  data() {
    return {
      //style
      tb: "tb",
      higth: "higth",
      center: "center",

      // ztree 配置
      ztreeSource: {
        setting: {
          check: {
            enable: true
          },
          view: {
            showLine: false,
            showIcon: false,
            txtSelectedEnable: true
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {
            onClick: function(event, treeId, treeNode) {
              var treeSource = $.fn.zTree.getZTreeObj("ztreeSource");
              treeSource.checkNode(treeNode, !treeNode.checked, false);
            }
          }
        }
      },
      ztreeDesc: {
        setting: {
          check: {
            enable: true
          },
          view: {
            showLine: false,
            showIcon: false,
            txtSelectedEnable: true
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {
            onClick: function(event, treeId, treeNode) {
              var treeDesc = $.fn.zTree.getZTreeObj("ztreeDesc");
              treeDesc.checkNode(treeNode, !treeNode.checked, false);
            }
          }
        }
      },

      zSource: this.source,
      zDesc: []
    };
  },
  mounted() {
    $.fn.zTree
      .init($("#ztreeSource"), this.ztreeSource.setting, this.zSource)
      .expandAll(true);
    $.fn.zTree
      .init($("#ztreeDesc"), this.ztreeDesc.setting, this.zDesc)
      .expandAll(true);
  },
  methods: {
    toDesc: function() {
      // debugger
      //源移除节点
      var treeSource = $.fn.zTree.getZTreeObj("ztreeSource");
      var SourceNodes = treeSource.getCheckedNodes(true);
      if (SourceNodes.length == 0) {
        this.$Message.warning("选择项为空");
      }

      for (var i = 0; i < SourceNodes.length; i++) {
        var node = SourceNodes[i];
        //移除tree选择的节点
        treeSource.removeNode(node);
        var index = this.getIndex(this.zSource, node);
        this.zSource.splice(index, 1);
        this.zDesc.push({
          id: node.id,
          name: node.name
        });
      }

      $.fn.zTree
        .init($("#ztreeDesc"), this.ztreeDesc.setting, this.zDesc)
        .expandAll(true);
    },
    toSource: function() {
      // debugger
      //目标移除节点
      var treeDesc = $.fn.zTree.getZTreeObj("ztreeDesc");
      var DescNodes = treeDesc.getCheckedNodes(true);
      if (DescNodes.length == 0) {
        this.$Message.warning("没有选择项");
      }

      for (var i = 0; i < DescNodes.length; i++) {
        var node = DescNodes[i];
        //移除tree选择的节点
        treeDesc.removeNode(node);
        var index = this.getIndex(this.zDesc, node);
        this.zDesc.splice(index, 1);
        this.zSource.push({
          id: node.id,
          name: node.name
        });
      }

      $.fn.zTree
        .init($("#ztreeSource"), this.ztreeSource.setting, this.zSource)
        .expandAll(true);
    },
    getIndex(array, node) {
      var index = 0;
      for (var i = 0; i < array.length; i++) {
        var t = array[i];
        if (t.id == node.id) {
          index = i;
          break;
        }
      }
      return index;
    },
    loading() {
      $.fn.zTree
        .init($("#ztreeSource"), this.ztreeSource.setting, this.zSource)
        .expandAll(true);
    }
  }
};
</script>