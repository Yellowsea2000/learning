import util from '../../../../utils/util';
import {getAdmJobRecords,getContractInfo, getContractTemplateByFactory, getJobType } from '../../../../utils/api';


Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

    // templateList:[], //所有的合同模板
    //picker的索引
    contractIndex:0,//合同模板索引
    contractYearIndex:0, //合同年限索引
    jobTypeIndex:0, //岗位类别索引
    probationIndex:0, //试用期索引


    contractTemplateVariableList:[],

    templateArr:[], //当前合同模板
    contractYear:[],//合同年限
    jobType:[], //岗位类别
    probation:[], //试用期
    hourlySalary:'', //工价
    
    date:util.getNowFormatDate(), //生效日期
    submitData:{
      templateId:'',
      contractVariableValueDTOList:[]
    }
  },

  computed:{
    // jobType() {
    //   this.data.templateList.forEach(item =>{
    //     console.log('a')
    //     let index = this.data.contractIndex;
    //     let templateArr = this.data.templateArr;
    //     if (templateArr.length && item.code === templateArr[index]){
    //       console.log(item.code)
    //     }
    //   })
    // }
  },

  attached() {
    this.init();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel() {
      this.triggerEvent('closeModal')
    },
    submit() {
      let value = this.data.hourlySalary * 1;
      if(value < 15 || value > 21) {
        wx.showToast({
          title: "工价只能15到21之间",
          icon: 'none',
          duration: 2000
        });
        return;
      }
        this.formatData();
        this.triggerEvent('submit',this.data.submitData);
        
    },

    //处理发送的数据
    formatData() {

      this.data.submitData.templateId = this.data.templateArr[this.data.contractIndex].value;
      this.data.submitData.title = this.data.templateArr[this.data.contractIndex].label;
      let obj_jobType = {code:'contractJobType', value:this.data.jobType[this.data.jobTypeIndex].name};
      let obj_probation = {code:'workMonth', value:this.data.probation[this.data.probationIndex].name};
      let obj_contractYear = {code:'contractYear', value:this.data.contractYear[this.data.contractYearIndex].code};
      let obj_hourPrice = {code:'hourlySalary', value:this.data.hourlySalary}
      let dateArr = this.dateFormat();
      this.data.submitData.contractVariableValueDTOList = [obj_jobType, obj_probation, obj_contractYear, obj_hourPrice, ...dateArr];
    },

    //处理生效日期
    dateFormat() {
      let date = this.data.date.split('-');
      let yearBegin = date[0];
      let monthBegin = date[1];
      let dayBegin = date[2];
      let arr = [
        {code:'yearBegin', value:yearBegin},
        {code:'monthBegin', value:monthBegin},
        {code:'dayBegin', value:dayBegin}
      ];
      return arr;
    },

    //初始化数据
  init() {
    
    this.getCotractTempData(); //获取合同模板数据
    // this.getSelectData('contractJobType');//岗位类别
    this.getJobTypeData();//岗位类别
    this.getSelectData('workMonth'); //试用期
    this.getSelectData('contractYear'); //试用期
  
  },

  //获取试用期数据
  // getProbationData () {
  //   getContractInfo(this.data.jobType[this.data.jobTypeIndex]).then(res =>{
  //     if(res.data.length) {
  //        res.data.forEach(item =>{
  //          let obj = {};
  //          obj.value = item.code;
  //          obj.label = item.name;
  //          this.data.probation.push(obj);
  //        });
         
  //        this.setData({
  //          probation:this.data.probation
  //        });
  //        console.log(this.data.probation)
  //     }
  //   });
  // },

  //获取模板数据
  getCotractTempData (){
    let that = this;
    getContractTemplateByFactory().then(res => {
      let that = this;
      this.setData({
        templateList:res.data
      });
   
      res.data && res.data.forEach(function(item) {
        let obj = {};
        obj.label = item.name;
        obj.value = item.id;
        that.data.templateArr.push(obj);
      });
      console.log(this.data.templateArr)
      this.setData({
        templateArr:this.data.templateArr
      });
     
    });
  },

  //获取岗位类别
  getJobTypeData() {
    getJobType().then(res =>{
      this.setData({
        jobType:res.data
      })
    })
  },
   
    //获取部分下拉框的值
    getSelectData(type) {
      //岗位类别
      if(type === 'contractJobType') {
        // getContractInfo(type).then(res =>{
        //   this.setData({
        //     jobType:res.data
        //   });
        // })

        console.log('jobtype')
      } 
      
      //试用期
      else if(type === 'workMonth') {
        getContractInfo(type).then(res =>{
          this.setData({
            probation:res.data
          });
        });
      } //合同年限
      else if (type === 'contractYear') {
        getContractInfo(type).then(res =>{
          this.setData({
            contractYear:res.data
          });
        });
      }
      
    },

    bindPickerChange(e) {
      let type = e.target.dataset.type;
      switch(type) {
        case 'contract':
        this.setData({
          contractIndex:e.detail.value
        });
        break;

        case 'year':
        this.setData({
          contractYearIndex:e.detail.value
        });
  
        break;

        case 'efectiveTime':
        this.setData({
          date:e.detail.value
        });
        break;

        case 'jobType':
        this.setData({
          jobTypeIndex:e.detail.value
        });
        break;

        case 'probation':
        this.setData({
          probationIndex:e.detail.value
        });
        break;

      }
      
      
    },
    getHourPrice(e) {
      let value = e.detail.value;
      this.setData({
        hourlySalary:value
      });
    }
  }
})
