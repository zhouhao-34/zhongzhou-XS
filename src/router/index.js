/*
 * @Author: your name
 * @Date: 2022-01-11 11:19:49
 * @LastEditTime: 2022-03-14 09:21:56
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \webdemo\src\router\index.js
 */
import Vue from "vue";
import VueRouter from "vue-router";
import cache from "../views/cache";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "cache",
    component: cache,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
