<template>
  <div class="selectBox weightBox">
    <el-row class="topLabel">
      <span class="labelName">{{
        locale === "zh" ? "参数" : "Parameter"
      }}</span>
      <span class="labelWeight">{{
        locale === "zh" ? "权重 " : "Weight "
      }}</span>
      <span class="labelValue">{{ locale === "zh" ? "数值" : "Value" }}</span>
    </el-row>
    <el-row class="weightUl">
      <el-row
        class="weightItem"
        v-for="(item, index) in weightData"
        :key="index"
        v-show="weightParams[item.enlabel] !== 0"
      >
        <span class="weightName">
          {{ locale === "zh" ? item.label : item.enlabel }}
        </span>
        <span class="weight">{{ item.weight }}</span>
        <div class="weightChangeBox">
          <van-stepper
            v-model="item.value"
            step="5"
            min="0"
            max="100"
            @change="changeWeightValue"
          />
        </div>
      </el-row>
    </el-row>
    <el-row class="buttonBox">
      <el-button type="primary" @click="resizeWeight">{{
        $t("placeholder.resetText")
      }}</el-button>
      <el-button type="primary" @click="returnWeight">{{
        $t("placeholder.ConfirmText")
      }}</el-button>
    </el-row>
  </div>
</template>
<script>
import { Stepper } from "vant";
export default {
  props: ["weightParams"],
  data() {
    return {
      weightData: [
        {
          weight: 0,
          value: 0,
          label: "声誉",
          enlabel: "Reputation"
        },
        {
          weight: 0,
          value: 0,
          label: "学术能力",
          enlabel: "Academic Performance"
        },
        {
          weight: 0,
          value: 0,
          label: "资金",
          enlabel: "Endowment"
        },
        {
          weight: 0,
          value: 0,
          label: "师资力量",
          enlabel: "Faculty"
        },
        {
          weight: 0,
          value: 0,
          label: "校友影响力",
          enlabel: "Alumni"
        }
      ]
    };
  },
  components: { [Stepper.name]: Stepper },
  computed: {
    locale: function() {
      return this.$i18n.locale;
    }
  },
  watch: {
    weightParams: {
      handler(nVal) {
        console.log(nVal);
        this.setDefaultWeightData();
      }
    }
  },
  methods: {
    setDefaultWeightData() {
      let _params = this.weightParams;
      for (let i = 0; i < this.weightData.length; i++) {
        for (let key in _params) {
          if (this.weightData[i].enlabel === key) {
            this.weightData[i].weight = `${((_params[key] - 0) * 100).toFixed(
              2
            )}%`;
            this.weightData[i].value = (_params[key] - 0) * 100;
            break;
          }
        }
      }
    },
    resizeWeight() {
      this.setDefaultWeightData();
    },
    // type:1为减 2为加
    changeWeightValue() {
      this.changeWeight();
    },
    // value 改变计算weight
    changeWeight() {
      let _total = 0;
      this.weightData.forEach(item => {
        _total += item.value - 0;
      });
      this.weightData.forEach(item => {
        item.weight = `${(((item.value - 0) / _total) * 100).toFixed(2)}%`;
      });
    },
    returnWeight() {
      let _return = {};
      this.weightData.forEach(item => {
        _return[item.enlabel] = item.weight.replace("%", "") / 100;
      });
      console.log(_return);
      this.$emit("changeWeight", _return);
    }
  }
};
</script>

<style lang="less">
.topLabel {
  display: flex;
  width: 100%;
  padding: 0 4vw;
  border-bottom: 0.2667vw solid #bbbbbb;
  background: #fff;
  .labelName {
    flex: 1;
    text-align: left;
  }
  .labelWeight {
    width: 21.3333vw;
    text-align: left;
  }
  .labelValue {
    width: 26.6667vw;
  }
}
.weightUl {
  width: 100%;
  padding: 0 4vw;
  background: #fff;
  margin-bottom: 2.6667vw;
  .weightItem {
    display: flex;
    border-bottom: 0.2667vw solid #bbbbbb;
    &:last-child {
      border-bottom: none;
    }
  }
  .weightName {
    flex: 1;
    text-align: left;
  }
  .weight {
    width: 21.3333vw;
    text-align: left;
  }
  .weightChangeBox {
    display: flex;
    width: 26.6667vw;
    .van-stepper {
      button {
        background-color: #fff;
      }
    }
    .van-stepper__input {
      background: #fff;
      font-size: 3.7333vw;
      line-height: 10.6667vw;
      width: 8.5333vw;
      height: 100%;
      margin: 0 0.5333vw;
    }
  }
}
.buttonBox {
  padding: 0 4vw;
  .el-button--primary {
    background: #5167dc;
    border: none;
    padding: 0;
    line-height: 8vw;
    width: 42.6667vw;
    &:active,
    &:focus,
    &:hover {
      background: #5167dc;
      border: none;
    }
    &:first-child {
      float: left;
    }
    &:last-child {
      float: right;
    }
  }
}
</style>
