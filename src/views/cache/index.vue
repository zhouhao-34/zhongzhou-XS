<!--
 * @Author: your name
 * @Date: 2022-01-11 13:52:01
 * @LastEditTime: 2022-08-09 15:03:03
 * @LastEditors: DESKTOP-CQREP7P\easy zhou03041516@163.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \webdemo\src\views\cache\index.vue
-->
<template>
  <div class="cache">
    <div class="cache-head">缓存区</div>
    <div class="cache-content">
      <div class="left">
        <div
          v-for="(v, i) in menuList"
          :key="i"
          class="cacheMenu"
          :class="memuSelect === v.id ? 'cacheMenuSelect' : ''"
          @click="menuClick(v.id)"
        >
          <div class="img">
            <img :src="v.img" alt="" />
          </div>
          <div>{{ v.name }}</div>
        </div>
      </div>
      <div class="right">
        <cacheList ref="cacheList" v-if="memuSelect === '1'"></cacheList>
        <workOrderRecord
          ref="workOrderRecord"
          v-if="memuSelect === '2'"
        ></workOrderRecord>
        <journal v-if="memuSelect === '5'"></journal>
        <intercept v-if="memuSelect === '4'"></intercept>
      </div>
    </div>
    <SpringFrame
      :bool="springFrameBoool"
      :text="springFrameText"
      :cancelShow="cancelShow"
      @cancel="springFrameCancel"
      @determine="springFrameDetermine"
    ></SpringFrame>
  </div>
</template>

<script>
//缓存线清单
import cacheList from "./cacheList.vue";
//工单记录
import workOrderRecord from "./workOrderRecord.vue";
// 日志查询
import journal from "./journal.vue";
// 拦截
import intercept from "./intercept.vue";
export default {
  name: "",
  components: { cacheList, workOrderRecord, journal, intercept },
  props: {
    // ***: {
    //   type: ***,
    //   default: ***
    // }
  },
  data() {
    return {
      // 菜单列表
      menuList: [
        {
          name: "缓存线清单",
          img: require("../../assets/缓存区分析.png"),
          id: "1",
        },
        {
          name: "工单记录",
          img: require("../../assets/工单记录.png"),
          id: "2",
        },
        {
          name: "清料",
          img: require("../../assets/清空.png"),
          id: "3",
        },
        {
          name: "拦截",
          img: require("../../assets/拦截订单.png"),
          id: "4",
        },
        {
          name: "日志查询",
          img: require("../../assets/rizhi.png"),
          id: "5",
        },
      ],
      // 选中的菜单
      memuSelect: "1",
      // 弹窗开关
      springFrameBoool: false,
      // 取消按钮是否显示
      cancelShow: true,
      //弹窗文字
      springFrameText: "",
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
  mounted() {},
  methods: {
    menuClick(id) {
      if (id !== "3") {
        this.memuSelect = id;
      }
      if (id === "3") {
        this.cancelShow = true;
        this.springFrameBoool = true;
        this.springFrameText = "是否执行清料操作";
      }
    },
    // 弹窗取消
    springFrameCancel() {
      this.springFrameBoool = false;
      this.$message({
        message: "取消操作",
        type: "warning",
      });
    },
    // 弹窗确定
    async springFrameDetermine() {
      // eslint-disable-next-line no-undef
      let res = await frmKuchun.qingliao();
      console.log(JSON.parse(res), "清库");
      if (res) {
        this.springFrameBoool = false;
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.$refs.cacheList.query();
        this.$refs.workOrderRecord.query();
      } else {
        this.springFrameBoool = false;
        this.$message.error("操作失败");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.cache {
  height: 100%;
  .cache-head {
    height: 60px;
    color: #fff;
    font-size: 32px;
    font-weight: 600;
    text-align: center;
    line-height: 60px;
    border-bottom: 1px solid #e4e7ed;
    box-sizing: border-box;
  }
  .cache-content {
    height: calc(100% - 60px);
    padding: 20px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    .left {
      width: 150px;
      height: 100%;
      border: 5px solid #e4e7ed;
      border-radius: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 0px;
      .cacheMenu {
        background: #fff;
        width: 100px;
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        cursor: pointer;
        margin-bottom: 20px;
        img {
          width: 40px;
          height: 40px;
        }
      }
      .cacheMenuSelect {
        border: 5px solid #409eff;
        box-sizing: border-box;
      }
    }
    .right {
      width: calc(100% - 200px);
      height: 100%;
      border: 5px solid #e4e7ed;
      border-radius: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: 30px 20px;
    }
  }
}
</style>
