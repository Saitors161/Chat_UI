import axios from "axios";
export const chat = ()=>({
  data:{
    messages:[]
  }
})

export const getters = {
  getMessages(){
    return chat.data;
  }

}

export const actions = {
  async getMessages(context) {
    window.console.log("try get all messages")
    const res = await axios.get("/api/v1/messages")
    let data = JSON.parse(JSON.stringify(res.data))
    window.console.log("Message got : " + data)
    return data
  },
  async addMessage(context, message){
    window.console.log("try Text add in chat : " + message)
    await axios.post("/api/v1/messages",message)
  },
  // async login(context,username) {
  //   window.console.log("try login")
  //   const res = await axios.post("/api/v1/login/users/" + username)
  //   let data = JSON.parse(JSON.stringify(res.data))
  //   window.console.log("Result login : " + data)
  //   return data
  // },
  async getAllUsersInChat(context) {
    const res = await axios.get("/api/v1/login/users")
    window.console.log("got list login users  : " + res.data)
    let data = JSON.parse(JSON.stringify(res.data))
    window.console.log("got list login users  : " + data)
    return data
  }

}
