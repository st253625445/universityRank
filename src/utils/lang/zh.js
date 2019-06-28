import zhLocale from "element-ui/lib/locale/lang/zh-CN"; //引入element语言包
const zh = {
  message: {
    title: "你可排 - 世界大学排名",
    footerText: "乌镇智库技术支持"
  },
  placeholder: {
    continentSearchTitle: "大洲",
    continentSearchText: "所有",
    countrySearchTitle: "地区",
    countrySearchText: "所有",
    subjectSearchTitle: "学科",
    subjectSearchText: "综合",
    schoolSearchTitle: "学校名称",
    schoolSearchText: "输入学校名称快速定位",
    resetText: "重置",
    ConfirmText: "确认"
  },
  indexPage: {
    tableIndex: "排名",
    universityName: "大学",
    scoreText: "得分"
  },
  ...zhLocale
};

export default zh;
