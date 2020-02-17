<template>
   <div class='rating-select'>
     <div class="rating-type border-1px">
       <span @click="select(2, $event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span> </span>
       <span @click="select(0, $event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
       <span @click="select(1, $event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
     </div>
     <div class="switch" @click="toggleContent"  :class="{'on':onlyContent}">
       <span class="icon-check_circle"></span>
       <span class="text">只看有内容的评价</span>
     </div>
   </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

const EVENT_SELECT = 'select'

export default {
// import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    ratings: {
      type: Array,
      default: () => ([])
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default: () => ({
        all: '全部',
        positive: '满意',
        negative: '不满意'
      })
    }
  },
  data() {
    // 这里存放数据
    return {

    }
  },
  // 监听属性 类似于data概念
  computed: {
    positives() {
      return this.ratings.filter(rating => rating.rateType === POSITIVE)
    },
    negatives() {
      return this.ratings.filter(rating => rating.rateType === NEGATIVE)
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    select(type, event) {
      if (!event._constructed) {
        return
      }
      this.$emit(EVENT_SELECT, type)
    },
    toggleContent(event) {
      if (!event._constructed) {
        return
      }
      this.$emit('toggle')
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {

  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='stylus' scoped>
  @import "~@/common/stylus/mixin.styl";
  .rating-select
    .rating-type
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size 0
      .block
        display inline-block
        padding 8px 12px
        margin-right 10px
        line-height 16px
        border-radius 1px
        font-size 12px
        color: rgb(77, 85, 93)
        &.active
          color #fff
        .count
          margin-left 2px
          font-size 8px
        &.positive
          background: rgba(0, 160, 220, 0.2)
          &.active
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: rgb(77, 85, 93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      color: rgb(147, 153, 159)
      font-size: 0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        display: inline-block
        vertical-align: top
        font-size: 12px
</style>
