import axios from 'axios'
export default {
     data(){
         return {
             names:""
         }
     },
     created: function () {
        this.hello()
      },
      methods: {
        hello: function () {
           this.names = "123456789"
        }
      }
}