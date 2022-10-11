<!--
 * @Author: your name
 * @Date: 2022-01-13 15:39:31
 * @LastEditTime: 2022-08-09 15:05:05
 * @LastEditors: DESKTOP-CQREP7P\easy zhou03041516@163.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \webdemo\src\views\cache\cacheList.vue
-->
<template>
  <div class="cacheList">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="订单查询">
        <el-input
          v-model="formInline.code"
          placeholder="请输入要查询的工单"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
      </el-form-item>
    </el-form>
    <Table
      style="height: calc(100% - 120px)"
      :tableData="tableData"
      :tableHeader="tableHeader"
    ></Table>
    <Pagination
      :pageSize="pageSize"
      :total="total"
      :currentPage="currentPage"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Pagination>
  </div>
</template>

<script>
// 表格插件
import Table from "../../components/table.vue";
// 分页插件
import Pagination from "../../components/pagination.vue";
export default {
  name: "",
  components: {
    Table,
    Pagination,
  },
  props: {
    // ***: {
    //   type: ***,
    //   default: ***
    // }
  },
  data() {
    return {
      // 查询数据
      formInline: {
        code: "",
      },
      // 表格数据
      tableData: [],
      // 表格表头
      tableHeader: [
        { prop: "barCode", label: "订单号" },
        // { prop: "2", label: "客户" },
        { prop: "waitingTime", label: "等待时间(min)" },
        { prop: "classStatus", label: "等待原因" },
        {
          prop: "cangku",
          label: "镜架是否备好",
          judge: {
            success: { val: "是", color: "#67C23A" },
            fail: {
              val: "否",
              color: "#F56C6C",
            },
          },
        },
      ],
      // 每页多少条
      pageSize: 10,
      // 总条数
      total: 100,
      // 当前页
      currentPage: 1,
    };
  },
  watch: {
    //***: {
    //immediate: false,
    // handler: function(v) {
    //console.log(v);
    //}
    //}
  },
  created() {},
  mounted() {
    window.vue = this;
    this.$_showLoading();
    setTimeout(() => {
      this.query();
    }, 1000);
  },
  methods: {
    async query() {
      // eslint-disable-next-line no-undef
      let res = await frmKuchun.queryDataList(
        this.pageSize,
        this.currentPage - 1,
        this.formInline.code
      );
      console.log(JSON.parse(res));
      this.tableData = JSON.parse(res).data;
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].waitingTime = this.timeFn(
          this.tableData[i].createTime
        );
        this.tableData[i].cangku =
          this.tableData[i].cangku === "" || this.tableData[i].cangku === null
            ? "否"
            : "是";
      }
      this.total = JSON.parse(res).total;
      this.$_hideLoading();
    },
    // 计算两个时间差 value 开始时间
    timeFn(value) {
      value = this.gettime(value);
      var dateEnd = Date.parse(new Date()); //计算当前时间戳 (毫秒级)
      var dateDiff = dateEnd - value; //时间差的毫秒数
      return Math.round(dateDiff / 60000);
    },
    // 标准时间转时间戳
    gettime(ms) {
      //2020-06-01T04:24:43.230Z
      // 把时间的中的T和Z 替换成空字符串
      let date = ms.replace("T", " ");
      let data = date.replace("Z", "");
      // 声明一个变量赋值给：日期时间字符串，并返回 1970/1/1 午夜距离该日期时间的毫秒数
      let datime = Date.parse(data);
      return datime;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 0;
      this.$_showLoading();
      this.query();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$_showLoading();
      this.query();
    },
  },
};
</script>

<style lang="scss">
.cacheList {
  height: 100%;
  .el-form {
    .el-form-item__label {
      font-size: 18px;
      color: #fff;
    }
  }
  .table {
    .el-table,
    .el-table tr,
    .el-table td,
    .el-table th {
      background-color: transparent;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
    }
    .el-table tbody tr:hover > td {
      background-color: transparent;
    }
  }
  .pagination {
    text-align: right;
    .el-pagination__total,
    .el-pagination__jump {
      color: #fff;
    }
  }
}
</style>
