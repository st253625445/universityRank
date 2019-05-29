<template>
  <div class="homePage" v-loading="loading">
    <div class="page-container tabBox">
      <div class="silderBox">
        <el-table :data="silderFrom" style="width: 100%">
          <el-table-column
            :label="locale === 'zh' ? '参数' : 'Parameter'"
            align="right"
          >
            <template slot-scope="scope">
              <span>{{
                locale === "zh" ? scope.row.label : scope.row.enlabel
              }}</span>
            </template>
          </el-table-column>
          <el-table-column>
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
            :label="locale === 'zh' ? '权重' : 'Weight'"
            width="70"
          >
            <template slot-scope="scope">
              <span>{{ (scope.row.weight / 100) | weightFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column width="150">
            <template slot="header">
              <span>
                {{ locale === "zh" ? "相对权重 " : "Relative Weight " }}
              </span>
              <i
                class="el-icon-warning-outline"
                @mouseover="showTooltipFn"
                @mouseout="hideTooltipFn"
              ></i>
            </template>
            <template slot-scope="scope">
              <span>{{ scope.row.rweight | weightFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column width="40">
            <template slot-scope="scope">
              <div
                class="disabledIcon"
                @click="scope.row.disabled = !scope.row.disabled"
              >
                <i class="el-icon-success" v-if="!scope.row.disabled"></i>
                <i class="icon-disabled" v-else></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="tooltipBox" v-if="locale === 'zh' && showTooltip">
          <p>
            说明1：默认权重由乌镇智库设定，点击重置将恢复默认。
          </p>
          <p>
            说明2：当5个因子比例之和等于100%时，按照标准百分百比例计算。当5个因子比例相加不等于100%时，按照对应比例计算。如只选择了声誉20%、学术能力20%时，其他因子占比为0%时，最终权重则为声誉与学术能力各占50%。
          </p>
        </div>
        <div class="tooltipBox en" v-if="locale === 'en' && showTooltip">
          <p>Explanation:</p>
          <p>
            1. The default value of each indicator has been set by Niupai.
            Clicking “Reset” button, then it will back to the default value.
          </p>
          <p>
            2. When the sum of ratios for all indicators equal 100%, each ratio
            is calculated according to the setting value. When the sum of ratios
            for all indicators do not equal 100%, each ratio is calculated
            according to the corresponding value. For example, if you set 20%
            Reputation and 20% Academic Performance, and set other indicators as
            0%, then the final weights are 50% Reputation and 50% Academic
            Performance.
          </p>
        </div>
      </div>
      <div class="rightInputBox">
        <p>
          <span>{{ $t("placeholder.countrySearchTitle") }}</span>
        </p>
        <div class="countrySelectBox">
          <el-select
            v-model="params.country"
            size="mini"
            :placeholder="$t('placeholder.countrySearchText')"
            @clear="countrySelectClear"
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
        <p>
          <span>{{ $t("placeholder.schoolSearchTitle") }}</span>
        </p>
        <div class="universitySearchBox">
          <el-input
            :placeholder="$t('placeholder.schoolSearchText')"
            size="mini"
            v-model="params.name"
          >
          </el-input>
        </div>
        <div class="buttonBox">
          <el-button
            type="primary"
            @click="seachButtonClick"
            size="mini"
            :disabled="!cansubmit"
            >{{ $t("placeholder.ConfirmText") }}</el-button
          >
          <el-button @click="resizeClick" size="mini">{{
            $t("placeholder.resetText")
          }}</el-button>
        </div>
      </div>
    </div>
    <div class="page-container homeCountBox">
      <div class="rankCunt">
        <el-table :data="rankData" style="width: 100%">
          <el-table-column :label="$t('indexPage.tableIndex')" width="65">
            <template slot-scope="scope">
              <span>
                {{ scope.$index + (params.pageNow - 1) * params.pageSize + 1 }}
              </span>
            </template>
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
          <el-table-column :label="$t('indexPage.scoreText')" width="60">
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
        :page-sizes="[20, 50, 100]"
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
      countryList: [],
      cansubmit: true,
      showTooltip: false,
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
        country: "",
        name: "",
        pageSize: 20,
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
      this.params.country = "";
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
    showTooltipFn() {
      this.showTooltip = true;
    },
    hideTooltipFn() {
      this.showTooltip = false;
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
    // 国家选择清空
    countrySelectClear() {
      this.params.country = "";
    },
    // 搜索按钮点击
    seachButtonClick() {
      this.params.pageNow = 1;
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
        country: "",
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
            this.countryList = res.data.map(item => {
              return {
                label: item,
                value: item
              };
            });
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
  .tabBox {
    background-color: rgb(255, 255, 255);
    border-bottom: 1px solid #ebeef5;
  }
  .silderBox {
    position: relative;
    width: 700px;
    padding: 20px;
    .rweightSpan {
      position: relative;
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
    .tooltipBox {
      position: absolute;
      width: 500px;
      top: 20px;
      left: 610px;
      padding: 20px;
      font-size: 14px;
      line-height: 20px;
      color: #606266;
      text-align: justify;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      background-color: #fff;
      -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      z-index: 3000;
      p {
        padding: 5px 0;
      }
      &.en {
        left: 630px;
      }
    }
  }
  .rightInputBox {
    display: flex;
    width: 500px;
    padding: 20px 100px;
    flex-direction: column;
    text-align: left;
    p {
      padding: 10px 0;
    }
    .countrySelectBox {
      > .el-select {
        width: 100%;
      }
    }
    .buttonBox {
      display: flex;
      height: 30px;
      margin-top: 40px;
      justify-content: flex-end;
      > button {
        width: 100px;
      }
    }
  }
  .homeCountBox {
    padding-bottom: 50px;
    flex-direction: column;
  }
  .rankCunt {
    width: 100%;
    padding: 40px 150px 0;
    margin-bottom: 30px;
    .name {
      font-size: 14px;
      padding: 5px 0;
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
</style>
