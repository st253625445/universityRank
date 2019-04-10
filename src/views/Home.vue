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
            placeholder="选择国家"
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
            placeholder="请输入学校名称"
            size="mini"
            v-model="params.name"
          >
            <el-button slot="append" @click="seachButtonClick">搜索</el-button>
          </el-input>
        </div>
      </div>
    </div>
    <div class="page-container homeCountBox">
      <div class="rankBox">
        <p class="title">全球 最好的大学排行</p>
        <p class="directions">
          包含一些权威发布的大学排行，如“世界大学学术排名（ARWU）”会发布的历年年度最好大学排名榜单、201xTIMES全球大学排名、世界大学排名中心(Center
          for World University Rankings
          即CWUR)发布2018-2019世界各大高校排名情况等。包含一些权威发布的大学排行，如“世界大学学术排名(ARWU)”会发布的历年年度最好大学排名榜单、201xTIMES全球大学排名、世界大学排名中心（Center
          for World University Rankings
          即CWUR）发布2018-2019世界各大高校排名情况等。
        </p>
        <el-row type="flex">
          <div class="silderBox">
            <ul>
              <li v-for="(item, index) in silderFrom" :key="index">
                <span class="label">{{ item.label }}</span>
                <el-slider
                  v-model="item.data"
                  :show-tooltip="false"
                  :disabled="item.disabled"
                ></el-slider>
                <div class="disabledIcon" @click="changeDisabled(index)">
                  <i class="el-icon-circle-check" v-if="!item.disabled"></i>
                  <i class="icon-disabled" v-else></i>
                </div>
              </li>
            </ul>
            <p class="text">
              提示：当5个因子比例之和等于100%时，按照标准百分百比例计算。当5个因子比例相加不等于100%时，按照对应比例计算。如只选择了声誉20%、学术能力20%，其他因子占比为0时，最终计算则为声誉与学术能力各占50%。
            </p>
            <el-button type="primary" @click="onSubmitSlider">确认</el-button>
            <el-button @click="resizeSlider">重置</el-button>
          </div>
          <div class="rankCunt">
            <el-table :data="rankData" style="width: 100%">
              <el-table-column prop="xh" label="序号" width="65">
              </el-table-column>
              <el-table-column label="大学名称">
                <template slot-scope="scope">
                  <p class="name" @click="nameClick(scope.row.cnName)">
                    {{ scope.row.cnName }}
                  </p>
                  <img
                    :src="scope.row.image_country"
                    alt=""
                    class="countryImg"
                  />
                  <span class="countryName">{{ scope.row.country_cn }}</span>
                </template>
              </el-table-column>
              <el-table-column label="总分" width="50">
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
      silderFrom: [
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
      ],
      rankData: [],
      total: 0,
      params: {
        language: "zh",
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
        return (val - 0).toFixed(1);
      }
    }
  },
  mounted() {
    this.getCountryList();
    this.getRankList();
  },
  components: {},
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getRankList();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.params.pageNow = val;
      this.getRankList();
      console.log(`当前页: ${val}`);
    },
    // 权重禁用切换
    changeDisabled(index) {
      this.silderFrom[index].disabled = !this.silderFrom[index].disabled;
    },
    // 确认权重滑动
    onSubmitSlider() {
      let _weight = [
        "Reputation",
        "Academic Performance",
        "Endowment",
        "Faculty",
        "Alumni"
      ];
      let total = 0;
      for (let i = 0; i < this.silderFrom.length; i++) {
        if (!this.silderFrom[i].disabled) {
          total += this.silderFrom[i].data;
        }
      }

      for (let i = 0; i < this.silderFrom.length; i++) {
        if (!this.silderFrom[i].disabled) {
          this.params.weight[_weight[i]] = this.silderFrom[i].data / total;
        } else {
          this.params.weight[_weight[i]] = 0;
        }
      }
      this.params = {
        ...this.params,
        ...{
          country: "",
          name: "",
          pageNow: 1
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
    nameClick(name) {
      console.log(name);
      // let _query = {
      //   name: name,
      //   language: "zh"
      // };
      // let routeData = this.$router.resolve({
      //   path: "/info",
      //   query: _query
      // });
      // window.open(routeData.href, "_blank");
    },
    // 请求国家列表
    getCountryList() {
      let _opt = {
        language: "zh"
      };
      getCountryList(_opt).then(res => {
        console.log(res);
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
              rankData.push(res.data.info[key]);
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
      li {
        display: flex;
        margin-bottom: 12px;
      }
      .label {
        display: block;
        width: 72px;
        text-align: right;
        font-size: 14px;
        color: rgb(0, 0, 0);
        line-height: 38px;
      }
      .el-slider {
        flex: 1;
        margin: 0 20px;
      }
      .disabledIcon {
        position: relative;
        width: 22px;
        height: 38px;
        i {
          position: absolute;
          top: 8px;
          left: 0;
        }
      }
      .el-icon-circle-check {
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
        margin: 15px 0 30px;
        font-size: 12px;
        color: rgb(204, 204, 204);
        line-height: 22px;
        text-align: left;
      }
      .el-button {
        border-radius: 0;
        padding: 5px 15px;
        font-size: 12px;
        color: rgb(204, 204, 204);
        border-color: rgb(204, 204, 204);
        & + .el-button {
          margin-left: 80px;
        }
      }
      .el-button--primary {
        color: #fff;
        background-color: #4f63df;
        border-color: #4f63df;
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
