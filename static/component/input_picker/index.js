Component({
  properties:{
    value:{
      type:String,
      value:''
    },
    objSet:{
      type:Object,
      value:null
    }
  },
  data:{},
  attached:function (options){
  },
  methods:{
    _onChange:function(e){
      var value = e.detail
      this.triggerEvent('onChange',value);
    },
    _bindPickerChange:function(e){
      var value = e.detail
      this.triggerEvent('bindPickerChange', value);
    }
  }
})