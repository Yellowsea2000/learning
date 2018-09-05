<template>
  <div class="hello">
    <h2>vue四级联动</h2>
    <div>
       省分：
       <select v-model='provinceModel'>
          <option v-for="(item,key) in provinceOpt" :value="item" :key="key">{{item}}</option>
       </select>
       城市：
       <select v-model='cityModel'>
          <option v-for="(item,key) in cityOpt" :value="item" :key="key">{{item}}</option>
       </select>

       区：
       <select v-model='areaModel'>
          <option v-for="(item,key) in areaOpt" :value="item" :key="key">{{item}}</option>
       </select>

       街道：
       <select v-model='roadModel'>
          <option v-for="(item,key) in roadOpt" :value="item" :key="key">{{item}}</option>
       </select>
    </div>
  </div>
</template>

<script>

/* eslint-disable */

// import jsonData from './data.js';

const jsonData = [
  {
    province:'湖南', 
          city:[
                {name:'常德',
                  area:[
                    {areaName:'武陵区',road:['芙蓉路','皂果路']},
                    {areaName:'鼎城区',road:['大湖路','小圆盘']}
                    ]
                },
                {name:'长沙',
                  area:[
                    {areaName:'芙蓉区',road:['芙蓉路','皂果路']},
                    {areaName:'雨花区',road:['大湖路','小圆盘']}
                    ]
                }
          ]
  },
  {
    province:'广东', 
          city:[
                {name:'深圳',
                  area:[
                    {areaName:'宝安区',road:['后瑞','西乡']},
                    {areaName:'南山区',road:['西丽','桃园']}
                    ]
                },
                {name:'广州',
                  area:[
                    {areaName:'天河区',road:['芙蓉路','皂果路']},
                    {areaName:'雨花区',road:['大湖路','小圆盘']}
                    ]
                }
          ]
  }
]
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'memda',
      selectData:jsonData,
      provinceModel:'',//一级的model
      cityModel:'',//二级的model
      areaModel:'',//三级级的model
      roadModel:'' //四级级的model
    }
  },
  computed:{

    //一级选项
    provinceOpt () {
      let arr = [];
      this.selectData.forEach(function (item) {
        arr.push(item.province);
      });
      return arr;
    },

    //二级选项
    cityOpt () {
      let arr = [];
      let vm = this;
      this.selectData.forEach(function (item) {
        if (item.province === vm.provinceModel) {
          item.city.forEach(function (cityName) {
            arr.push(cityName.name);
          })
        }
      });
      vm.cityModel = arr[0];
      return arr;
    },

    //三级选项
    areaOpt () {
      let arr = [];
      let vm = this;
      this.selectData.forEach(function (item) {
        if (item.province === vm.provinceModel) {
          item.city.forEach(function (cityName) {
            if (cityName.name === vm.cityModel) {
              cityName.area.forEach(function (areas) {
                  arr.push(areas.areaName);
              })
            }
          })
        }
      });
      vm.areaModel = arr[0];
      return arr;
    },

    //四级的选项
    roadOpt () {
      let arr = [];
      let vm = this;
      this.selectData.forEach(function (item) {
        if (item.province === vm.provinceModel) {
          item.city.forEach(function (cityName) {
            if (cityName.name === vm.cityModel) {
              cityName.area.forEach(function (areas) {
                  if (areas.areaName === vm.areaModel) {
                    areas.road.forEach(function (item) {
                      arr.push(item);
                    })
                  }
              })
            }
          })
        }
      });
      vm.roadModel = arr[0];
      return arr;
    },
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
