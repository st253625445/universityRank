<template>
  <div class="homePage">
    <div class="topSelect">
      <el-row class="selectBox" type="flex">
        <img src="../assets/img/huakuai.svg" alt="" @click="popShow = true" />
        <span>{{ $t("placeholder.countrySearchTitle") }}</span>
        <div class="regionInput">
          <span @click="popRegionShow = true">
            {{ region }}
          </span>
        </div>
        <span>{{ $t("placeholder.subjectSearchTitle") }}</span>
        <div class="subjectSelect">
          <el-cascader
            v-model="subjectSelect"
            :options="subjectListShow"
            size="mini"
            :placeholder="$t('placeholder.subjectSearchText')"
            :show-all-levels="false"
            @clear="subjectSelectClear"
            clearable
          ></el-cascader>
        </div>
        <el-button type="primary" @click="resizeClick" size="mini">{{
          $t("placeholder.resetText")
        }}</el-button>
        <el-button
          type="primary"
          @click="seachButtonClick"
          size="mini"
          :disabled="!cansubmit"
          >{{ $t("placeholder.ConfirmText") }}</el-button
        >
      </el-row>
      <div class="universitySearchBox">
        <el-input
          :placeholder="$t('placeholder.schoolSearchText')"
          size="mini"
          v-model="params.name"
          @input="schoolInputChange"
          clearable
        >
        </el-input>
      </div>
      <transition name="el-zoom-in-top">
        <div class="popSliderBox" v-show="popShow" v-clickoutside="popOutClick">
          <el-table :data="silderFromShow" style="width: 100%">
            <el-table-column
              :label="locale === 'zh' ? '参数' : 'Parameter'"
              align="right"
              :width="locale === 'zh' ? 120 : 170"
            >
              <template slot-scope="scope">
                <span>{{
                  locale === "zh" ? scope.row.label : scope.row.enlabel
                }}</span>
              </template>
            </el-table-column>
            <el-table-column width="280">
              <template slot-scope="scope">
                <el-slider
                  v-model="scope.row.weight"
                  :step="5"
                  :format-tooltip="formatTooltip"
                  :disabled="scope.row.disabled"
                ></el-slider>
              </template>
            </el-table-column>
            <el-table-column
              :label="locale === 'zh' ? '数值' : 'Value'"
              width="70"
            >
              <template slot-scope="scope">
                <span :class="{ grayText: scope.row.disabled }">
                  {{ scope.row.weight }}
                </span>
              </template>
            </el-table-column>
            <el-table-column width="70">
              <template slot="header">
                <span>
                  {{ locale === "zh" ? "权重 " : "Weight " }}
                </span>
              </template>
              <template slot-scope="scope">
                <span :class="{ grayText: scope.row.disabled }">
                  {{ scope.row.rweight | weightFilter }}
                </span>
              </template>
            </el-table-column>
            <el-table-column width="40">
              <template slot-scope="scope">
                <div class="disabledIcon" @click="changeDisabled(scope.row)">
                  <i class="el-icon-check" v-if="!scope.row.disabled"></i>
                  <i class="icon-disabled" v-else></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </transition>
      <transition name="el-zoom-in-top">
        <div
          class="popRegionBox"
          v-show="popRegionShow"
          v-clickoutside="popRegionOutClick"
        >
          <MobileRegion
            :continentList="continentList"
            :countryList="countryList"
            @changeRegion="changeRegion"
          />
        </div>
      </transition>
    </div>
    <div class="page-container homeCountBox">
      <div class="rankCunt" v-loading="loading">
        <el-table :data="rankData" style="width: 100%">
          <el-table-column
            prop="xh"
            :label="$t('indexPage.tableIndex')"
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="xh_g"
            :label="$t('indexPage.globalXhText')"
            width="80"
            v-if="requireParams.country || requireParams.continent"
          >
          </el-table-column>
          <el-table-column :label="$t('indexPage.universityName')">
            <template slot-scope="scope">
              <p class="name" @click="nameClick(scope.row)">
                {{ locale === "zh" ? scope.row.cnName : scope.row.enName }}
              </p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('placeholder.countrySearchTitle')">
            <template slot-scope="scope">
              <img :src="scope.row.image_country" alt="" class="countryImg" />
              <span class="countryName">{{
                locale === "zh" ? scope.row.country_cn : scope.row.country_en
              }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('indexPage.scoreText')" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.score | numToFiexd }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pageNow"
        :page-sizes="[20, 25, 30, 50]"
        :page-size="params.pageSize"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Clickoutside from "element-ui/src/utils/clickoutside";
import { getCountryList, getRankList } from "@/API/getData";
import MobileRegion from "@/components/mobileRegion";

export default {
  name: "home",
  data() {
    return {
      loading: true,
      popShow: false,
      popRegionShow: false,
      continentList: [],
      countryList: [],
      regionList: [],
      subjectList: [],
      cansubmit: true,
      silderFrom: [
        {
          weight: 0,
          rweight: 0,
          label: "声誉",
          enlabel: "Reputation",
          disabled: false
        },
        {
          weight: 0,
          rweight: 0,
          label: "学术能力",
          enlabel: "Academic Performance",
          disabled: false
        },
        {
          weight: 0,
          rweight: 0,
          label: "资金",
          enlabel: "Endowment",
          disabled: false
        },
        {
          weight: 0,
          rweight: 0,
          label: "师资力量",
          enlabel: "Faculty",
          disabled: false
        },
        {
          weight: 0,
          rweight: 0,
          label: "校友影响力",
          enlabel: "Alumni",
          disabled: false
        }
      ],
      rankData: [],
      total: 0,
      weightList: [
        "Reputation",
        "Academic Performance",
        "Endowment",
        "Faculty",
        "Alumni"
      ],
      language: "zh",
      region: "",
      params: {
        weight: {
          Reputation: 0,
          "Academic Performance": 0,
          Endowment: 0,
          Faculty: 0,
          Alumni: 0
        },
        continent: "",
        country: "",
        subject: "",
        name: "",
        pageSize: 20,
        pageNow: 1
      },
      subjectSelect: [],
      requireParams: {}
    };
  },
  filters: {
    numToFiexd(val) {
      return (val - 0).toFixed(2);
    },
    weightFilter(val) {
      return (val * 100).toFixed(1) + "%";
    }
  },
  computed: {
    locale: function() {
      return this.$i18n.locale;
    },
    silderFromShow: function() {
      let _subject = this.subjectSelect;
      let _return = [];
      let _fn = data => {
        for (let i = 0; i < this.silderFrom.length; i++) {
          let _silder = this.silderFrom[i];
          _silder.disabled = false;
          for (let key in data) {
            if (_silder.enlabel === key) {
              _silder.weight = data[key];
              _return.push(_silder);
              break;
            } else {
              _silder.weight = 0;
            }
          }
        }
      };
      if (_subject.length) {
        let _parameters = this.subjectList[1][_subject[0]].filter(item => {
          return item.value === _subject[1];
        })[0].parameters;
        _fn(_parameters);
      } else {
        if (this.subjectList.length > 0) {
          let _parameters = this.subjectList[0].parameters;
          _fn(_parameters);
        } else {
          _return = this.silderFrom;
        }
      }
      return _return;
    },
    subjectListShow: function() {
      let _data = this.subjectList[1];
      let _return = [];
      for (let key in _data) {
        _return.push({
          value: key,
          label: key,
          children: _data[key]
        });
      }
      for (let item of _return) {
        for (let item2 of item.children) {
          item2["label"] = item2.value;
        }
      }
      return _return;
    }
  },
  directives: { Clickoutside },
  watch: {
    silderFrom: {
      handler(val) {
        this.cansubmit = false;
        let _weight = this.weightList;
        let total = 0;
        for (let i = 0; i < val.length; i++) {
          if (!val[i].disabled && val[i].weight > 0) {
            total += val[i].weight;
            this.cansubmit = true;
          }
        }
        for (let i = 0; i < val.length; i++) {
          if (!val[i].disabled && total !== 0) {
            val[i].rweight = val[i].weight / total;
            this.params.weight[_weight[i]] = val[i].weight / total;
          } else {
            val[i].rweight = 0;
            this.params.weight[_weight[i]] = 0;
          }
        }
      },
      deep: true,
      immediate: true
    },
    subjectSelect: {
      handler(val) {
        if (val.length) {
          this.params.subject = val[1];
        } else {
          this.params.subject = "";
        }
      }
    },
    locale(newVal) {
      console.log(newVal);
      this.region = this.locale === "zh" ? "所有" : "All";
      this.loading = true;
      this.getCountryList("change");
    }
  },
  mounted() {
    this.region = this.locale
      ? this.locale === "zh"
        ? "所有"
        : "All"
      : "所有";
    this.getCountryList();
  },
  components: { MobileRegion },
  methods: {
    formatTooltip(val) {
      return `${val}%`;
    },
    handleSizeChange(val) {
      this.params.pageSize = this.requireParams.pageSize = val;
      this.params.pageNow = this.requireParams.pageNow = 1;
      this.getRankList();
    },
    handleCurrentChange(val) {
      this.params.pageNow = this.requireParams.pageNow = val;
      this.getRankList();
    },
    // 权重禁用切换
    changeDisabled(data) {
      let _enlabel = data.enlabel;
      for (let i = 0; i < this.silderFrom.length; i++) {
        if (_enlabel === this.silderFrom[i].enlabel) {
          this.silderFrom[i].disabled = !this.silderFrom[i].disabled;
          break;
        } else {
          continue;
        }
      }
    },
    //regionChange
    changeRegion(data) {
      this.popRegionShow = false;
      this.region = data;
      let _all = ["全球", "Global"];
      if (data) {
        this.params.country = _all.indexOf(data) !== -1 ? "" : data;
      } else {
        this.params.country = "";
      }
      this.params.continent = "";
    },
    // 大洲选择清空
    continentSelectClear() {
      this.params.continent = "";
    },
    // 国家选择清空
    countrySelectClear() {
      this.params.country = "";
    },
    // 学科选择清空
    subjectSelectClear() {
      this.subjectSelect = [];
    },
    // 学校名称变化
    schoolInputChange() {
      this.params.pageNow = this.requireParams.pageNow = 1;
      this.requireParams.name = this.params.name;
      this.getRankList();
    },
    // popOutClick
    popOutClick() {
      this.popShow = false;
    },
    popRegionOutClick() {
      this.popRegionShow = false;
    },
    // 搜索按钮点击
    seachButtonClick() {
      this.params.pageNow = 1;
      this.params.name = "";
      this.requireParams = { ...{}, ...this.params };
      this.getRankList();
    },
    // 重置按钮
    resizeClick() {
      this.params = {
        weight: {
          Reputation: 0,
          "Academic Performance": 0,
          Endowment: 0,
          Faculty: 0,
          Alumni: 0
        },
        continent: "",
        country: "",
        subject: "",
        name: "",
        pageSize: 20,
        pageNow: 1
      };
      this.subjectSelect = [];
      this.region = this.locale === "zh" ? "所有" : "All";
      this.silderFrom[0].disabled = true;
      for (let i = 0; i < this.silderFrom.length; i++) {
        this.silderFrom[i].disabled = false;
        this.silderFrom[i].weight = this.subjectList[0].parameters[
          this.silderFrom[i].enlabel
        ];
      }
      this.requireParams = {};
      this.$nextTick(() => {
        this.getRankList();
      });
    },
    // 大学名称点击跳转大学详情页
    nameClick(data) {
      console.log(data);
      let routeData = this.$router.resolve({
        path: "/info",
        query: {
          cnName: data.cnName,
          enName: data.enName
        }
      });
      window.open(routeData.href, "_blank");
    },
    // 请求国家列表
    getCountryList(isChange) {
      let _opt = {
        language: this.locale
      };
      getCountryList(_opt)
        .then(res => {
          if (res.code === 200) {
            this.continentList = res.data.continentList;
            this.countryList = res.data.countryList;
            this.subjectList = res.data.subjectList;
            this.regionList = [];
            this.continentList.forEach(item => {
              this.regionList.push({
                value: item,
                label: item,
                children: []
              });
            });
            this.countryList.forEach(item => {
              for (let i = 0; i < this.regionList.length; i++) {
                if (item.continent === this.regionList[i].label) {
                  this.regionList[i].children.push({
                    value: item.country_cn || item.country_en,
                    label: item.country_cn || item.country_en
                  });
                  break;
                } else {
                  continue;
                }
              }
            });
            // 记录是否是国内IP
            if (res.data.ischinese) {
              localStorage.setItem("ischinese", res.data.ischinese);
            }
            // 重置筛选
            this.resizeClick();
          }
          if (isChange) {
            this.loading = false;
          }
        })
        .catch(rej => {
          console.log(rej);
          this.loading = false;
          this.$message.error("国家列表请求失败，无法正常使用排名！");
        });
    },
    // 请求排行
    getRankList() {
      if (JSON.stringify(this.requireParams) == "{}") {
        this.requireParams = { ...{}, ...this.params };
      }
      let _opt = {
        language: this.locale,
        ...this.requireParams
      };
      let rankData = [];
      this.loading = true;
      getRankList(_opt)
        .then(res => {
          this.total = res.data.pageInfo.total;
          for (let key in res.data.info) {
            let _item = {
              enName: key,
              ...res.data.info[key]
            };
            rankData.push(_item);
          }
          rankData.sort((a, b) => {
            let _xh1 = a.xh;
            let _xh2 = b.xh;
            if (_xh1 > _xh2) {
              return 1;
            } else if (_xh1 < _xh2) {
              return -1;
            } else {
              return 0;
            }
          });
          this.loading = false;
          this.rankData = rankData;
        })
        .catch(rej => {
          this.loading = false;
          console.log(rej);
          this.total = 0;
          this.rankData = rankData;
        });
    }
  }
};
</script>

<style lang="less">
.page-container {
  height: 100%;
  margin: 0 auto;
  display: flex;
  cursor: default;
}
.homePage {
  min-height: calc(100% - 83px);
  .homeCountBox {
    padding-bottom: 50px;
    flex-direction: column;
  }
  .topSelect {
    position: relative;
    width: 700px;
    padding-top: 20px;
    margin: 0 auto;
    line-height: 20px;
    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      cursor: pointer;
    }
    .regionSelect,
    .subjectSelect {
      height: 20px;
      padding: 0 10px;
      flex: 1;
    }
    .el-cascader--mini {
      width: 100%;
      line-height: 20px;
    }
  }
  .selectBox {
    span {
      font-size: 12px;
    }
    .regionInput {
      width: 240px;
      font-size: 12px;
      padding: 0 10px;
      > span {
        width: 100%;
        height: 20px;
        display: inline-block;
        line-height: 18px;
        padding: 0 15px;
        text-align: left;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
      }
    }
    .el-select {
      width: 100%;
    }
    .el-input--mini {
      .el-input__inner,
      .el-input__icon {
        height: 20px;
        line-height: 20px;
      }
    }
    .el-button--mini {
      padding: 3px 15px;
      background-color: #5167dc;
      border-color: #5167dc;
    }
  }
  .universitySearchBox {
    width: 100%;
    padding-top: 20px;
  }
  .popSliderBox {
    position: absolute;
    left: 0;
    top: 50px;
    padding: 10px 20px;
    background: #fff;
    border: 1px solid #5167dc;
    z-index: 1000;
    .rweightSpan {
      position: relative;
    }
    .grayText {
      color: rgb(209, 209, 209);
    }
    .el-table thead {
      color: #000;
    }
    .disabledIcon {
      position: relative;
      display: flex;
      align-items: center;
      width: 22px;
    }
    .el-icon-check {
      width: 20px;
      height: 20px;
      line-height: 20px;
      font-size: 17px;
      color: #fff;
      background: #5167dc;
      border-radius: 2px;
    }
    .icon-disabled {
      width: 20px;
      height: 20px;
      border-radius: 2px;
      border: 1px solid #cccccc;
    }
    .el-slider__bar {
      background-color: #5167dc;
    }
    .el-slider__button {
      border-color: #5167dc;
    }
    .el-slider__runway {
      margin: 12px 0;
      background-color: transparent;
      border: 1px solid #5167dc;
      &.disabled {
        border-color: #cccccc;
      }
      .el-slider__bar {
        height: 4px;
      }
    }
    .el-slider__button-wrapper {
      width: 30px;
      height: 30px;
      top: -12px;
    }
    .el-slider__runway.disabled .el-slider__bar {
      background-color: #cccccc;
    }
    .el-slider__runway.disabled .el-slider__button {
      border-color: #cccccc;
    }
    .el-table td,
    .el-table th.is-leaf {
      padding: 0;
      border: none;
      text-align: center;
      &.el-table_1_column_1 {
        text-align: right;
      }
    }
    .el-table::before {
      height: 0;
    }
  }
  .popRegionBox {
    position: absolute;
    width: 100%;
    left: 0;
    top: 50px;
    padding: 10px 20px;
    background: #fff;
    border: 1px solid #5167dc;
    z-index: 1000;
    .regionSelectBox {
      p {
        text-align: left;
        font-size: 12px;
        color: #888888;
      }
    }
    .selectGloup {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }
    .selectItem {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 90px;
      margin-right: 6px;
      color: #101010;
      line-height: 20px;
      text-align: center;
      border: 1px solid #bbb;
      margin-bottom: 6px;
      font-size: 12px;
      line-height: 18px;
      cursor: pointer;
      &.active {
        border-color: #5167dc;
        background-color: #5167dc;
        color: #fff;
      }
    }
    .el-collapse-item__header {
      height: 30px;
      line-height: 30px;
    }
  }
  .rankCunt {
    width: 700px;
    padding-top: 20px;
    margin: 0 auto;
    margin-bottom: 30px;
    .name {
      font-size: 14px;
      padding: 10px 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #5167dc;
      cursor: pointer;
    }
    .countryImg {
      width: 18px;
      height: 10px;
      margin-right: 5px;
    }
    .countryName {
      font-size: 12px;
      color: rgb(153, 153, 153);
    }
    .el-table td {
      padding: 0;
    }
    .el-table th {
      padding: 5px 0;
      border-bottom: none;
    }
    .el-table thead {
      color: #5167dc;
    }
    .el-table_1_column_1 {
      text-align: center;
    }
  }
  .el-pagination {
    width: 100%;
    text-align: center;
  }
}
.el-pagination {
  font-weight: normal;
}
</style>
