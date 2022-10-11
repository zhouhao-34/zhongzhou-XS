<!--
 * @Author: your name
 * @Date: 2022-01-13 17:09:57
 * @LastEditTime: 2022-08-12 16:47:27
 * @LastEditors: DESKTOP-CQREP7P\easy zhou03041516@163.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \webdemo\src\views\cache\workOrderRecord.vue
-->
<template>
  <div class="workOrderRecord">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="工单查询">
        <el-input
          v-model="formInline.code"
          placeholder="请输入要查询的工单"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="button">
      <el-button type="primary" @click="exportData">数据导出</el-button>
    </div>
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
      tableData: [
        {
          jt: "329183",
          shijian: "13:10",
          tiqi: "2022-1-14",
          jieguo: "上线",
          beizhu: "01",
          fasong: "成功",
        },
      ],
      // 表格表头
      tableHeader: [
        { prop: "barCode", label: "工单号" },
        { prop: "shijian", label: "扫描时间" },
        { prop: "tiqi", label: "扫描日期" },
        { prop: "classStatus", label: "判断结果" },
        { prop: "proStatus", label: "备注" },
        { prop: "ddshijian", label: "等待时间(min)" },
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
    this.query();
  },
  methods: {
    async query() {
      // eslint-disable-next-line no-undef
      let res = await frmKuchun.workOrderQuery(
        this.pageSize,
        this.currentPage - 1,
        this.formInline.code
      );
      console.log(JSON.parse(res));
      this.tableData = JSON.parse(res).data;
      for (let i = 0; i < this.tableData.length; i++) {
        let time = new Date().getTime();
        console.log("time: ", time);
        var time1 = new Date(this.tableData[i].createTime.split("T")).getTime();
        this.tableData[i].ddshijian = ((time - time1) / 60000).toFixed(0);
        let arr = this.tableData[i].createTime.split("T");
        this.tableData[i].tiqi = arr[0];
        this.tableData[i].shijian = arr[1].split(".")[0];
      }

      this.total = JSON.parse(res).total;
      this.$_hideLoading();
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
    async exportData() {
      // eslint-disable-next-line no-undef
      let res = await frmKuchun.exportData(this.formInline.code);
      console.log("res: ", res);
    },
  },
};
</script>

<style lang="scss">
.workOrderRecord {
  height: 100%;
  position: relative;
  .el-form {
    .el-form-item__label {
      font-size: 18px;
      color: #fff;
    }
  }
  .button {
    position: absolute;
    right: 20px;
    top: 0px;
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
}
</style>
