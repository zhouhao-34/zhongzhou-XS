<!--
 * @Author: DESKTOP-CQREP7P\easy zhou03041516@163.com
 * @Date: 2022-08-09 15:01:57
 * @LastEditors: DESKTOP-CQREP7P\easy zhou03041516@163.com
 * @LastEditTime: 2022-08-09 16:14:42
 * @FilePath: \web\src\views\cache\intercept.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="intercept">
    <div class="form">
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
    </div>

    <div class="add">
      <el-button type="primary" @click="addintercept">新增拦截订单</el-button>
    </div>
    <div class="table" style="height: calc(100% - 120px)">
      <el-table :data="tableData" height="100%" style="width: 100%">
        <el-table-column
          :prop="v.prop"
          :label="v.label"
          v-for="(v, i) in tableHeader"
          :key="i"
          align="center"
          :width="v.width"
        >
          <template slot-scope="scope">
            <span v-if="!v.judge"> {{ scope.row[v.prop] }}</span>
            <span
              v-if="v.judge && scope.row[v.prop] === v.judge.success.val"
              :style="'color:' + v.judge.success.color"
            >
              {{ scope.row[v.prop] }}</span
            >
            <span
              v-if="v.judge && scope.row[v.prop] === v.judge.fail.val"
              :style="'color:' + v.judge.fail.color"
            >
              {{ scope.row[v.prop] }}</span
            >
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <!-- eslint-disable-next-line vue/no-unused-vars -->
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.blocked === '是'"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="updateButton(scope.row)"
            ></el-button>
            <el-button
              :disabled="scope.row.blocked === '是'"
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteButton(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination
      :pageSize="pageSize"
      :total="total"
      :currentPage="currentPage"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Pagination>
    <el-dialog
      :title="dialogtitle"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="500px"
      @close="close('formName')"
    >
      <el-form ref="formName" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="工单号" prop="barCode">
          <div>
            <el-input
              v-if="dialogtitle === '新增拦截订单'"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 2 }"
              v-model="form.barCode"
            >
            </el-input>
            <el-input v-else v-model="form.barCode"> </el-input>
            <div class="Tips">
              添加多个订单号用“,”分割，订单号必须是六位数字
            </div>
          </div>
        </el-form-item>
        <el-form-item label="拦截原因" prop="reason">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 2 }"
            maxlength="50"
            show-word-limit
            v-model="form.reason"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClick('formName')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 分页插件
import Pagination from "../../components/pagination.vue";
export default {
  name: "",
  components: {
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
        { prop: "reason", label: "拦截原因" },
        {
          prop: "blocked",
          label: "是否成功",
          judge: {
            success: {
              val: "是",
              color: "#67C23A",
            },
            fail: {
              val: "否",
              color: "#F56C6C",
            },
          },
        },
        { prop: "interceptTime", label: "拦截时间" },
        { prop: "dataAddTime", label: "数据添加时间" },
        { prop: "dataModifyTime", label: "最后修改时间" },
      ],
      // 每页多少条
      pageSize: 10,
      // 总条数
      total: 100,
      // 当前页
      currentPage: 1,

      dialogtitle: "新增拦截订单",
      dialogFormVisible: false,
      form: { barCode: "", reason: "" },
      rules: {
        barCode: [{ required: true, message: "请输入工单号", trigger: "blur" }],
        reason: [
          { required: true, message: "请输入拦截原因", trigger: "blur" },
        ],
      },
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
    this.$_showLoading();
    this.query();
  },
  methods: {
    async query() {
      // eslint-disable-next-line no-undef
      let res = await frmKuchun.interceptQuery(
        this.pageSize,
        this.currentPage - 1,
        this.formInline.code
      );
      console.log(JSON.parse(res));
      this.tableData = JSON.parse(res).data;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].blocked === 1) {
          this.tableData[i].blocked = "是";
        } else {
          this.tableData[i].blocked = "否";
        }
        this.tableData[i].dataAddTime = this.gettime(
          this.tableData[i].dataAddTime
        );
        this.tableData[i].dataModifyTime = this.gettime(
          this.tableData[i].dataModifyTime
        );
        this.tableData[i].interceptTime = this.gettime(
          this.tableData[i].interceptTime
        );
      }
      this.total = JSON.parse(res).total;
      this.$_hideLoading();
    },
    // 标准时间转时间戳
    gettime(ms) {
      if (ms === null) {
        return "";
      }
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
    addintercept() {
      this.dialogFormVisible = true;
      this.dialogtitle = "新增拦截订单";
    },
    addClick(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.dialogtitle !== "修改拦截订单") {
            this.form.barCode = this.form.barCode
              .replace(/，/g, ",")
              .replace(/\s*/g, "");
            let arr = this.form.barCode.split(",");
            for (let i = 0; i < arr.length; i++) {
              if (arr[i] === "") {
                arr.splice(i, 1);
                i--;
                continue;
              }
              if (isNaN(arr[i]) || arr[i].length !== 6) {
                this.$message({
                  message: "工单号有误请检查后再试",
                  type: "warning",
                });
              }
            }
            // eslint-disable-next-line no-undef
            res = await frmKuchun.addIntercept(arr, this.form.reason);
          } else {
            if (isNaN(this.form.barCode) || this.form.barCode.length !== 6) {
              this.$message({
                message: "工单号有误请检查后再试",
                type: "warning",
              });
            }
            // eslint-disable-next-line no-undef
            res = await frmKuchun.modifyIntercept(
              this.form.id,
              this.form.barCode,
              this.form.reason
            );
          }
          console.log("res: ", res);
          if (res) {
            this.dialogFormVisible = false;
            this.$_showLoading();
            this.query();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateButton(v) {
      this.dialogFormVisible = true;
      this.dialogtitle = "修改拦截订单";
      this.form = JSON.parse(JSON.stringify(v));
    },
    async deleteButton(id) {
      let res = null;
      // eslint-disable-next-line no-undef
      res = await frmKuchun.deleteIntercept(id);
      console.log("res: ", res);
      if (res) {
        this.dialogFormVisible = false;
        this.$_showLoading();
        this.query();
      }
    },
    close(formName) {
      this.$refs[formName].resetFields();
      this.form = {
        barCode: "",
        reason: "",
      };
    },
  },
};
</script>

<style  lang="scss">
.intercept {
  height: 100%;
  position: relative;
  .form {
    .el-form {
      .el-form-item__label {
        font-size: 18px;
        color: #fff;
      }
    }
  }

  .table {
    .el-table,
    .el-table tr,
    .el-table td,
    .el-table th {
      background-color: transparent !important;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
    }
    .el-table tbody tr:hover > td {
      background-color: transparent;
    }
    .el-table--scrollable-y ::-webkit-scrollbar {
      display: none;
    }
  }

  .add {
    position: absolute;
    right: 20px;
    top: 0px;
  }
  .Tips {
    color: #909399;
  }
}
</style>
