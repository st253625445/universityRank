import request from "@/utils/request";

// 获取国家列表
export function getCountryList(params) {
  return request({
    url: `/rank/getCountryList`,
    method: "post",
    data: params
  });
}
// 获取排行榜
export function getRankList(params) {
  return request({
    url: `/rank/getRankList`,
    method: "post",
    data: params
  });
}
// 获取大学数据
export function getDetailBySch(params) {
  return request({
    url: `/rank/getDetailBySch`,
    method: "post",
    data: params
  });
}
