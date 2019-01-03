const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    datas: { //列表数据
      type: Object,
      value: null
    }
  },
  data: {
    statusBarHeight: '',
  },
  attached: function() {
   
  },
  methods: {
  }
})