<!--
 * @Author: DESKTOP-CQREP7P\easy zhou03041516@163.com
 * @Date: 2022-07-08 15:39:26
 * @LastEditors: DESKTOP-CQREP7P\easy zhou03041516@163.com
 * @LastEditTime: 2022-08-10 17:50:23
 * @FilePath: \web\src\views\cache\journal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="journal">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="日志查询">
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
        { prop: "barCode", label: "工单号" },
        { prop: "scanStatus", label: "扫描状态" },
        { prop: "shaoMaCode", label: "扫码枪编号" },
        { prop: "createTime", label: "扫描时间" },
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
    this.query();
  },
  methods: {
    async query() {
      // eslint-disable-next-line no-undef
      let res = await frmKuchun.journalQuery(
        this.pageSize,
        this.currentPage - 1,
        this.formInline.code
      );
      console.log(JSON.parse(res));
      let obj = JSON.parse(res);
      for (let i = 0; i < obj.data.length; i++) {
        obj.data[i].createTime = this.gettime(obj.data[i].createTime);
      }
      this.total = obj.total;
      this.tableData = obj.data;
      this.$_hideLoading();
    },
    // 标准时间转时间戳
    gettime(ms) {
      //2020-06-01T04:24:43.230Z
      // 把时间的中的T和Z 替换成空字符串
      let date = ms.replace("T", " ");
      let data = date.replace("Z", "");
      // 声明一个变量赋值给：日期时间字符串，并返回 1970/1/1 午夜距离该日期时间的毫秒数
      let datime = this.timestampToTime(Date.parse(data));

      return datime;
    },
    // 时间格式化
    timestampToTime(timestamp) {
      var date = new Date(timestamp);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
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

<style  lang="scss">
.journal {
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
