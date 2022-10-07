import axios from "axios";
export const user = ()=>({
  data:{
    id:0,
    name:"",
    uuid:""
  }
})

export const getters = {
  getUserData(){
    return user.data;
  }

}

export const actions = {
  async createUser(context,username) {
    window.console.log("try get user : " + username)
    const res = await axios.post("/api/v1/users/"+username)
    let data = JSON.parse(JSON.stringify(res.data))
    window.console.log("Message got : " + data)
    return data
  },

  async checkUser(context,username) {
    const res = await axios.get("/api/v1/users/"+username)
    let data = JSON.parse(JSON.stringify(res.data))
    window.console.log("user is correct : " + data.toString())
    return data
  }
}
