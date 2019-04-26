<template>
  <div class="homePage" v-loading="loading">
    <div class="tabBox">
      <div class="page-container">
        <ul>
          <!-- <li>全球排名</li>
          <li>非洲地区</li>
          <li>阿拉伯地区</li>
          <li>亚洲地区</li>
          <li>澳大利亚/新西兰</li>
          <li>欧洲地区</li>
          <li>拉丁美洲地区</li> -->
        </ul>
        <div class="countrySelectBox">
          <el-select
            v-model="params.country"
            size="mini"
            :placeholder="$t('placeholder.country')"
            clearable
          >
            <el-option
              v-for="item in countryList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="universitySearchBox">
          <el-input
            :placeholder="$t('placeholder.schoolSearch')"
            size="mini"
            v-model="params.name"
          >
            <el-button slot="append" @click="seachButtonClick">{{
              $t("placeholder.searchText")
            }}</el-button>
          </el-input>
        </div>
      </div>
    </div>
    <div class="page-container homeCountBox">
      <div class="rankBox">
        <p class="title" v-if="locale === 'zh'">可自主调参的全球大学排名</p>
        <p class="title" v-else>Up to You Universitiy Rankings</p>
        <p class="directions" v-if="locale === 'zh'">
          2019牛排（最牛世界大学排名）为用户提供了可以分析比较世界大学综合实力，及特定领域发展的可靠工具。牛排囊括了世界90多个国家和地区的将近2000所大学。牛排根据声誉、学术能力、资金、师资力量、校友影响力这五个因素对大学进行了比较和排名。当前五个参数的权重处于默认调参状态，用户可以根据自身需求进行自主调参。
        </p>
        <p class="directions" v-else>
          Niupai provides reliable world university rankings for users to
          understand and compare the comprehensive strength and development in a
          specific field of universities. Niupai considers nearly 2,000
          universities from over 90 countries. Universities are ranked by 5
          indicators, including reputation, academic performance, endowment,
          strength of faculty, and alumni impact. Currently, weights of the 5
          indicators are at the default state, and users can adjust them
          according to personal preferences.
        </p>
        <el-row type="flex">
          <div class="silderBox">
            <ul>
              <li v-for="(item, index) in silderFrom" :key="index">
                <div class="labelBox">
                  <span
                    class="label"
                    v-if="locale === 'zh'"
                    :title="item.label"
                  >
                    {{ item.label }}
                  </span>
                  <span class="label" v-else :title="item.enlabel">
                    {{ item.enlabel }}
                  </span>
                  <span class="weight">{{
                    params.weight[weightList[index]] | weightFilter
                  }}</span>
                </div>
                <el-slider
                  v-model="item.data"
                  :step="5"
                  :format-tooltip="formatTooltip"
                  :disabled="item.disabled"
                ></el-slider>
                <div class="disabledIcon" @click="changeDisabled(index)">
                  <i class="el-icon-success" v-if="!item.disabled"></i>
                  <i class="icon-disabled" v-else></i>
                </div>
              </li>
            </ul>
            <el-button
              type="primary"
              @click="onSubmitSlider"
              :disabled="!cansubmit"
              >{{ $t("placeholder.ConfirmText") }}</el-button
            >
            <el-button @click="resizeSlider">{{
              $t("placeholder.resetText")
            }}</el-button>
            <p class="text" v-if="locale === 'zh'">
              调参说明<br />
              说明1：默认权重由乌镇智库设定，点击重置将恢复默认。<br />
              说明2：当5个因子比例之和等于100%时，按照标准百分百比例计算。当5个因子比例相加不等于100%时，按照对应比例计算。如只选择了声誉20%、学术能力20%时，其他因子占比为0%时，最终权重则为声誉与学术能力各占50%。
            </p>
            <p class="text" v-else>
              Explanation: <br />
              1.The default value of each indicator has been set by Niupai.
              Clicking “Reset” button, then it will back to the default
              value.<br />
              2.When the sum of ratios for all indicators equal 100%, each ratio
              is calculated according to the setting value. When the sum of
              ratios for all indicators do not equal 100%, each ratio is
              calculated according to the corresponding value. For example, if
              you set 20% Reputation and 20% Academic Performance, and set other
              indicators as 0%, then the final weights are 50% Reputation and
              50% Academic Performance.
            </p>
          </div>
          <div class="rankCunt">
            <el-table :data="rankData" style="width: 100%">
              <el-table-column
                prop="xh"
                :label="$t('indexPage.tableIndex')"
                width="65"
              >
              </el-table-column>
              <el-table-column :label="$t('indexPage.universityName')">
                <template slot-scope="scope">
                  <p class="name" @click="nameClick(scope.row)">
                    {{ locale === "zh" ? scope.row.cnName : scope.row.enName }}
                  </p>
                  <img
                    :src="scope.row.image_country"
                    alt=""
                    class="countryImg"
                  />
                  <span class="countryName">{{
                    locale === "zh"
                      ? scope.row.country_cn
                      : scope.row.country_en
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('indexPage.scoreText')" width="60">
                <template slot-scope="scope">
                  <span>{{ scope.row.score | numToFiexd }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-row>
        <el-row type="flex">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="params.pageNow"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="params.pageSize"
            layout="total, prev, pager, next, sizes, jumper"
            :total="total"
          >
          </el-pagination>
        </el-row>
      </div>
      <div class="newsBox">
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCountryList, getRankList } from "@/API/getData";

export default {
  name: "home",
  data() {
    return {
      loading: true,
      countryList: [],
      cansubmit: true,
      silderFrom: [
        {
          data: 30,
          label: "声誉",
          enlabel: "Reputation",
          disabled: false
        },
        {
          data: 25,
          label: "学术能力",
          enlabel: "Academic Performance",
          disabled: false
        },
        {
          data: 15,
          label: "资金",
          enlabel: "Endowment",
          disabled: false
        },
        {
          data: 15,
          label: "师资力量",
          enlabel: "Faculty",
          disabled: false
        },
        {
          data: 15,
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
      params: {
        weight: {
          Reputation: 0.3,
          "Academic Performance": 0.25,
          Endowment: 0.15,
          Faculty: 0.15,
          Alumni: 0.15
        },
        country: "",
        name: "",
        pageSize: 10,
        pageNow: 1
      }
    };
  },
  filters: {
    numToFiexd(val) {
      if (val) {
        return (val - 0).toFixed(2);
      }
    },
    weightFilter(val) {
      return (val * 100).toFixed(1) + "%";
    }
  },
  computed: {
    locale: function() {
      return this.$i18n.locale;
    }
  },
  watch: {
    silderFrom: {
      handler(val) {
        this.cansubmit = false;
        let _weight = this.weightList;
        let total = 0;
        for (let i = 0; i < val.length; i++) {
          if (!val[i].disabled && val[i].data > 0) {
            total += val[i].data;
            this.cansubmit = true;
          }
        }
        for (let i = 0; i < val.length; i++) {
          if (!val[i].disabled && total !== 0) {
            this.params.weight[_weight[i]] = val[i].data / total;
          } else {
            this.params.weight[_weight[i]] = 0;
          }
        }
      },
      deep: true
    },
    locale(newVal) {
      console.log(newVal);
      this.getCountryList();
    }
  },
  mounted() {
    this.getCountryList();
    this.getRankList();
  },
  components: {},
  methods: {
    formatTooltip(val) {
      return `${val}%`;
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getRankList();
    },
    handleCurrentChange(val) {
      this.params.pageNow = val;
      this.getRankList();
    },
    // 权重禁用切换
    changeDisabled(index) {
      this.silderFrom[index].disabled = !this.silderFrom[index].disabled;
    },
    // 确认权重滑动
    onSubmitSlider() {
      this.params = {
        ...this.params,
        ...{
          country: "",
          name: "",
          pageNow: 1,
          language: this.locale
        }
      };
      this.getRankList();
    },
    // 重置权重滑动
    resizeSlider() {
      this.silderFrom = [
        {
          data: 30,
          label: "声誉",
          disabled: false
        },
        {
          data: 25,
          label: "学术能力",
          disabled: false
        },
        {
          data: 15,
          label: "资金",
          disabled: false
        },
        {
          data: 15,
          label: "师资力量",
          disabled: false
        },
        {
          data: 15,
          label: "校友影响力",
          disabled: false
        }
      ];
      this.onSubmitSlider();
    },
    // 搜索按钮点击
    seachButtonClick() {
      this.params.pageNow = 1;
      this.getRankList();
    },
    // 大学名称点击跳转大学详情页
    nameClick(data) {
      console.log(data);
    },
    // 请求国家列表
    getCountryList() {
      let _opt = {
        language: this.locale
      };
      getCountryList(_opt).then(res => {
        if (res.code === 200) {
          this.countryList = res.data.map(item => {
            return {
              label: item,
              value: item
            };
          });
        }
      });
    },
    // 请求排行
    getRankList() {
      let _opt = this.params;
      let rankData = [];
      this.loading = true;
      getRankList(_opt)
        .then(res => {
          if (res.code === 200) {
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
          }
          this.loading = false;
          this.rankData = rankData;
        })
        .catch(rej => {
          this.loading = false;
          console.log(rej);
          this.rankData = rankData;
        });
    }
  }
};
</script>

<style lang="less">
.page-container {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  cursor: default;
}
.homePage {
  min-height: calc(100% - 260px);
  .homeCountBox {
    padding-bottom: 50px;
  }
  .tabBox {
    width: 100%;
    height: 40px;
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    ul {
      flex: 1;
      display: flex;
      li {
        margin-right: 60px;
        line-height: 40px;
        font-size: 14px;
        color: rgb(67, 75, 227);
        cursor: pointer;
      }
    }
    .countrySelectBox {
      width: 80px;
      margin-right: 10px;
    }
    .universitySearchBox {
      width: 210px;
    }
    .el-input {
      top: 6px;
    }
    .el-input__inner,
    .el-input-group__append {
      border-radius: 0;
    }
    .el-input__inner {
      padding-left: 5px;
    }
    .el-input--suffix .el-input__inner {
      padding-right: 20px;
    }
    .el-input__suffix {
      right: 0;
    }
    .el-input-group__append {
      background: #4f63df;
      border-color: #4f63df;
      color: #fff;
      cursor: pointer;
    }
  }
  .rankBox {
    width: 880px;
    padding: 20px;
    .title {
      font-size: 30px;
      color: rgb(0, 0, 0);
      line-height: 66px;
      text-align: left;
    }
    .directions {
      font-size: 12px;
      color: rgb(102, 102, 102);
      line-height: 22px;
      text-align: left;
      margin-bottom: 30px;
    }
    .silderBox {
      width: 350px;
      padding-right: 20px;
      padding-bottom: 40px;
      ul {
        margin-bottom: 50px;
      }
      li {
        position: relative;
        display: flex;
        margin-bottom: 10px;
      }
      .labelBox {
        display: flex;
        flex-direction: column;
        width: 80px;
        text-align: right;
        font-size: 14px;
        color: rgb(0, 0, 0);
      }
      .label {
        display: block;
      }
      .weight {
        display: block;
        text-align: right;
        font-size: 12px;
        color: rgb(0, 0, 0);
        line-height: 20px;
      }
      .el-slider {
        display: flex;
        align-items: center;
        flex: 1;
        margin: 0 20px;
      }
      .disabledIcon {
        position: relative;
        display: flex;
        align-items: center;
        width: 22px;
      }
      .el-icon-success {
        font-size: 22px;
        color: #4f63df;
      }
      .icon-disabled {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        border: 1px solid #cccccc;
      }
      .el-slider__bar {
        background-color: #4f63df;
      }
      .el-slider__button {
        border-color: #4f63df;
      }
      .el-slider__runway.disabled .el-slider__bar {
        background-color: #cccccc;
      }
      .el-slider__runway.disabled .el-slider__button {
        border-color: #cccccc;
      }
      .text {
        margin: 30px 0 15px;
        font-size: 12px;
        color: rgb(204, 204, 204);
        line-height: 22px;
        text-align: justify;
      }
      .el-button {
        border-radius: 0;
        padding: 5px 15px;
        font-size: 12px;
        color: #fff;
        background-color: #4f63df;
        border-color: #4f63df;
        & + .el-button {
          margin-left: 80px;
        }
        &.is-disabled {
          color: rgb(204, 204, 204);
          background: #fff;
          border-color: rgb(204, 204, 204);
        }
      }
    }
    .rankCunt {
      flex: 1;
      padding-left: 80px;
      margin-bottom: 30px;
      .name {
        font-size: 14px;
        color: rgb(79, 99, 223);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
      .el-table,
      .el-table thead {
        color: #000;
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
  .newsBox {
    flex: 1;
    padding: 20px;
    padding-right: 0;
    > div {
      width: 100%;
      height: 100%;
      border: 1px solid #eeeeee;
    }
  }
}
</style>
