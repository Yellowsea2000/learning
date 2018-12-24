<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
     <video src="https://rst-prd-oss.oss-cn-shenzhen.aliyuncs.com/rst-business/vedio/bv1.mp4"></video>

  </div>
</template>

<script>

/* eslint-disable */

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'test'
    }
  },
  methods:{
    
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
