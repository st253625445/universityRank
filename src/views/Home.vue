<template>
  <div class="homePage">
    <div class="page-container tabBox">
      <div class="silderBox">
        <el-table :data="silderFrom" style="width: 100%">
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
              <div
                class="disabledIcon"
                @click="scope.row.disabled = !scope.row.disabled"
              >
                <i class="el-icon-check" v-if="!scope.row.disabled"></i>
                <i class="icon-disabled" v-else></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="rightInputBox">
        <el-row type="flex">
          <p class="continentLabel">
            <span>{{ $t("placeholder.continentSearchTitle") }}</span>
          </p>
          <p class="countryLabel">
            <span>{{ $t("placeholder.countrySearchTitle") }}</span>
          </p>
        </el-row>
        <el-row type="flex">
          <div class="continentSelectBox">
            <el-select
              v-model="params.continent"
              size="mini"
              :placeholder="$t('placeholder.continentSearchText')"
              @clear="continentSelectClear"
              clearable
            >
              <el-option
                v-for="(item, index) in continentList"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="countrySelectBox">
            <el-select
              v-model="params.country"
              size="mini"
              :placeholder="$t('placeholder.countrySearchText')"
              @clear="countrySelectClear"
              clearable
            >
              <el-option
                v-for="(item, index) in countryListShow"
                :key="index"
                :label="item.country_cn || item.country_en"
                :value="item.country_cn || item.country_en"
              >
              </el-option>
            </el-select>
          </div>
        </el-row>
        <p>
          <span>{{ $t("placeholder.subjectSearchTitle") }}</span>
        </p>
        <div class="subjectSearchBox">
          <el-select
            v-model="params.subject"
            size="mini"
            :placeholder="$t('placeholder.subjectSearchText')"
            @clear="subjectSelectClear"
            clearable
          >
            <el-option
              v-for="(item, index) in subjectList"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div class="buttonBox">
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
        </div>
      </div>
    </div>
    <div class="page-container homeCountBox">
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
      <div class="rankCunt" v-loading="loading">
        <el-table :data="rankData" style="width: 100%">
          <el-table-column
            prop="xh"
            :label="$t('indexPage.tableIndex')"
            width="80"
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
import { getCountryList, getRankList } from "@/API/getData";

export default {
  name: "home",
  data() {
    return {
      loading: true,
      continentList: [],
      countryList: [],
      subjectList: [],
      cansubmit: true,
      silderFrom: [
        {
          weight: 30,
          rweight: 0.3,
          label: "声誉",
          enlabel: "Reputation",
          disabled: false
        },
        {
          weight: 25,
          rweight: 0.25,
          label: "学术能力",
          enlabel: "Academic Performance",
          disabled: false
        },
        {
          weight: 15,
          rweight: 0.15,
          label: "资金",
          enlabel: "Endowment",
          disabled: false
        },
        {
          weight: 15,
          rweight: 0.15,
          label: "师资力量",
          enlabel: "Faculty",
          disabled: false
        },
        {
          weight: 15,
          rweight: 0.15,
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
        continent: "",
        country: "",
        subject: "",
        name: "",
        pageSize: 20,
        pageNow: 1
      }
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
    countryListShow: function() {
      if (this.params.continent) {
        return this.countryList.filter(item => {
          return item.continent === this.params.continent;
        });
      } else {
        return this.countryList;
      }
    }
  },
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
      deep: true
    },
    locale(newVal) {
      console.log(newVal);
      // 重置
      this.resizeClick();
      this.loading = true;
      this.getCountryList("change");
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
      this.params.subject = "";
    },
    // 学校名称变化
    schoolInputChange() {
      this.params.pageNow = 1;
      this.getRankList();
    },
    // 搜索按钮点击
    seachButtonClick() {
      this.params.pageNow = 1;
      this.params.name = "";
      this.getRankList();
    },
    // 重置按钮
    resizeClick() {
      this.silderFrom = [
        {
          weight: 30,
          rweight: 0.3,
          label: "声誉",
          enlabel: "Reputation",
          disabled: false
        },
        {
          weight: 25,
          rweight: 0.25,
          label: "学术能力",
          enlabel: "Academic Performance",
          disabled: false
        },
        {
          weight: 15,
          rweight: 0.15,
          label: "资金",
          enlabel: "Endowment",
          disabled: false
        },
        {
          weight: 15,
          rweight: 0.15,
          label: "师资力量",
          enlabel: "Faculty",
          disabled: false
        },
        {
          weight: 15,
          rweight: 0.15,
          label: "校友影响力",
          enlabel: "Alumni",
          disabled: false
        }
      ];
      this.params = {
        weight: {
          Reputation: 0.3,
          "Academic Performance": 0.25,
          Endowment: 0.15,
          Faculty: 0.15,
          Alumni: 0.15
        },
        continent: "",
        country: "",
        subject: "",
        name: "",
        pageSize: 20,
        pageNow: 1
      };
      this.getRankList();
    },
    // 大学名称点击跳转大学详情页
    nameClick(data) {
      console.log(data);
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
      let _opt = {
        language: this.locale,
        ...this.params
      };
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
          if (rankData.length === 0 && _opt.name) {
            this.$message.error("所选国家/区域无此大学");
          }
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
  width: 1440px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  cursor: default;
}
.homePage {
  min-height: calc(100% - 83px);
  .tabBox {
    background-color: rgb(255, 255, 255);
    // border-bottom: 1px solid #ebeef5;
  }
  .silderBox {
    position: relative;
    padding: 20px 0;
    margin-left: 130px;
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
  .rightInputBox {
    display: flex;
    width: 575px;
    padding: 20px 0;
    margin-left: auto;
    padding-right: 115px;
    flex-direction: column;
    text-align: left;
    p {
      line-height: 20px;
      padding-bottom: 6px;
      color: #000;
      font-size: 14px;
      font-weight: 700;
    }
    .continentLabel {
      width: 240px;
      padding-right: 20px;
    }
    .countryLabel {
      width: 220px;
    }
    .el-select {
      width: 100%;
    }
    .continentSelectBox {
      width: 240px;
      margin-bottom: 14px;
      padding-right: 20px;
    }
    .countrySelectBox {
      width: 220px;
      margin-bottom: 14px;
    }
    .buttonBox {
      display: flex;
      height: 30px;
      margin-top: 20px;
      justify-content: flex-end;
      > button {
        width: 100px;
      }
      .el-button--primary {
        background-color: #5167dc;
        border-color: #5167dc;
        &.is-disabled {
          background-color: #c0c4cc;
          border-color: #c0c4cc;
        }
      }
    }
  }
  .homeCountBox {
    padding-bottom: 50px;
    flex-direction: column;
  }
  .universitySearchBox {
    width: 700px;
    padding-top: 20px;
    margin: 0 auto;
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
      // color: #5167dc;
      // cursor: pointer;
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
</style>
