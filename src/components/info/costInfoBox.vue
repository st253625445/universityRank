<template>
  <el-col :span="8" class="toolItem costInfoBox">
    <div class="toolTitle">{{ $t("infoPage.costInfoTitle") }}</div>
    <div class="toolItemCount">
      <div class="costItemBox">
        <div class="label">
          <img src="../../assets/img/icon/costIcon1.png" alt="" />
          <span>{{ $t("costInfo.label1") }}</span>
        </div>
        <div class="count">
          <div class="countItem">
            <span class="countLabel">{{ $t("costInfo.item1_label1") }}</span>
            <span class="countValue yellowText">{{
              costData.Tuition_and_fees
            }}</span>
          </div>
          <div class="countItem">
            <span class="countLabel">{{ $t("costInfo.item1_label2") }}</span>
            <span class="countValue yellowText">{{
              costData.Room_and_board
            }}</span>
          </div>
        </div>
      </div>
      <div class="costItemBox">
        <div class="label">
          <img src="../../assets/img/icon/costIcon2.png" alt="" />
          <span>{{ $t("costInfo.label2") }}</span>
        </div>
        <div class="count">
          <div class="countItem">
            <span class="countLabel">{{ $t("costInfo.item2_label1") }}</span>
            <span class="countValue">{{ costData.NUMBER_RECEIVING_AID }}</span>
          </div>
          <div class="countItem">
            <span class="countLabel">{{ $t("costInfo.item2_label2") }}</span>
            <span class="countValue">{{ costData.PERCENT_RECEIVING_AID }}</span>
          </div>
          <div class="countItem">
            <span class="countLabel">{{ $t("costInfo.item2_label3") }}</span>
            <span class="countValue">{{
              costData.TOTAL_AMOUNT_OF_AID_RECEIVED
            }}</span>
          </div>
          <div class="countItem">
            <span class="countLabel">{{ $t("costInfo.item2_label4") }}</span>
            <span class="countValue">{{
              costData.AVERAGE_AMOUNT_OF_AID_RECEIVED
            }}</span>
          </div>
        </div>
      </div>
      <div class="costItemBox">
        <div class="label">
          <img src="../../assets/img/icon/costIcon3.png" alt="" />
          <span>{{ $t("costInfo.label3") }}</span>
        </div>
        <div class="count">
          <div class="countItem">
            <span class="countLabel">{{ $t("costInfo.item3_label1") }}</span>
            <span class="countValue">{{ costData.earlyCareerMedianPay }}</span>
          </div>
          <div class="countItem">
            <span class="countLabel">{{ $t("costInfo.item3_label2") }}</span>
            <span class="countValue">{{ costData.midCareerMedianPay }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-col>
</template>

<script>
export default {
  name: "costInfoBox",
  props: ["costData"],
  data: function() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less">
.costInfoBox {
  .costItemBox {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 20px;
    color: #101010;
    > .label {
      display: flex;
      width: 90px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 30px;
      > img {
        width: 32px;
        height: 32px;
      }
    }
    > .count {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px solid #bbbbbb;
    }
    .countItem {
      min-width: 35%;
      margin-right: 5%;
      display: flex;
      flex-direction: column;
      text-align: left;
    }
    .countValue {
      font-size: 20px;
      line-height: 29px;
    }
    &:nth-child(1) {
      .countValue {
        color: #ff9500;
      }
    }
    &:nth-child(2) {
      .countValue {
        color: #007aff;
      }
    }
    &:nth-child(3) {
      .countValue {
        color: #4cd964;
      }
    }
  }
}
</style>
