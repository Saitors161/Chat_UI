<template>
  <main>
    <div id="loginForm">
      <input id="username" class="input" type="text" placeholder="Ваше имя">
      <b-btn class="btn" type="submit" @click="login">Войти</b-btn>
    </div>

    <div id="divListUsers" class="message border rounded container" style="overflow-y: scroll; height:100px;">
    </div>

    <div id="divChatArea">
      <br>
      <div id="divMessages" class="message border rounded container" style="overflow-y: scroll; height:300px;">
      </div>
      <br>
      <div id="divActive" class="message border rounded container">
        <div id="activeMessage">
          <b-textarea id="textArea" placeholder="Enter something...">Area</b-textarea>
          <br>
          <b-btn id="button" variant="success" @click="addMessage">Send</b-btn>
        </div>
      </div>
    </div>

  </main>
</template>


<style>
#divMessages {
  position: center;
}

body {
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #000;
  background-color: #f8f8f8;
}

* {
  box-sizing: border-box;
}

#loginForm {
  max-width: 320px;
  padding: 15px;
  margin: 20px auto;
}

.input {
  display: block;
  width: 100%;
  padding: 8px 10px;
  margin-bottom: 10px;

  border: 1px solid #ccc;

  font-family: inherit;
  font-size: 16px;
}

.btn {
  display: block;
  width: 100%;
  padding: 8px 10px;

  border: 0;
  background-color: #22a519;
  cursor: pointer;

  font-family: inherit;
  font-size: 16px;
  color: #fff;
}

.btn:hover {
  background-color: #14a20a;
}
</style>

<script>

import {mapGetters, mapActions} from "vuex";

let userLocal = {
  name: ""
}
export default {

  components: {},
  computed: mapGetters({
    chat: "chat/getMessages",
    user: "user/getUserData"
  }),
  mounted() {
    this.socket = new WebSocket("ws://localhost:8011/websocket")
    this.socket.onopen = () => {
      window.console.log("Socket opened")
    }
    this.socket.onmessage = (msg, ctx) => {
      let array = JSON.parse(String(msg.data));
      window.console.log(" get message from socket!!! " + array + new Date().getMinutes().toString())
      if ( array[0]==="usersList#"){
        array.shift()
        window.console.log("socket got userslist#")
        this.updateListUsers(array)
      }else {
        array.shift()
        this.updateChat(array)
        window.console.log("oops" + array[0].userChatName.toString())
      }

    }
  },
  methods: {

    addMessage(context) {
      window.console.log(" try post message ")
      let textArea = document.getElementById("textArea");
      window.console.log("current data localUser " + userLocal.name)
      if (textArea.value !== "" && userLocal.name.length > 1) {
        let message = {
          text: textArea.value,
          userChatName: userLocal.name
        }
        window.console.log(message.userChatName + " try send message " + message.text)
        this.$store.dispatch("chat/addMessage", message)
        textArea.value = ""
      }
    },

    async updateChat(arrayMessages="") {
      if(arrayMessages===""){
        arrayMessages = await this.$store.dispatch("chat/getMessages")
      }
      let messageArea = document.querySelector("#divMessages")
      if (messageArea !== null) {
        messageArea.innerHTML = '<div class="msg"></div><hr>'
        window.console.log(arrayMessages)
        if (arrayMessages !== undefined) {
          arrayMessages.forEach(el => {
            window.console.log("arrayMessages element " + el)
            messageArea.innerHTML += '<div class="msg">' + el.userChatName.bold() + '<br>' + el.text + '</div> <hr>'
          })
          document.getElementById("divMessages").scrollTop = document.getElementById("divMessages").scrollHeight;
        }
      }
    },

    async login(context) {
      let username = document.getElementById("username");
      if (username.value !== "") {
        window.console.log("current username in FormLogin " + username.innerText)
        let userData = await this.$store.dispatch("user/checkUser", username.value)
        window.console.log("data after check " + userData.name)
        if (userData.name === null) {
          window.console.log("try create user" + username.name)
          userData = await this.$store.dispatch("user/createUser", username.value)
          window.console.log("name after create user " + userData.name)
        }
        window.console.log("put user data in userLocal " + userData.name)
        userLocal.name = userData.name
        let formLogin = document.getElementById("loginForm")
        formLogin.innerHTML = ''
        this.socket.send("login#" + userLocal.name);
        await this.updateListUsers()
        await this.updateChat()
      }
    },

    async updateListUsers(arrayUsers="") {
      if(arrayUsers===""){
        window.console.log("array is empty string")
        arrayUsers = await this.$store.dispatch("chat/getAllUsersInChat")
        window.console.log("array from payload after load!!" + arrayUsers)
      }
      if(arrayUsers===[]){
        window.console.log("array is empty")
      }else{
        window.console.log("array is " + arrayUsers)
      }
      let listUsersArea = document.querySelector("#divListUsers")
      if (listUsersArea !== null) {
        listUsersArea.innerHTML = '<div class="msg"></div><hr>'
        window.console.log("array user = " +  arrayUsers)
        arrayUsers.forEach(function (item, index, array) {
          window.console.log("add user on form "+item)
          listUsersArea.innerHTML += '<div class="msg">' + item + '<br></div> <hr>'
        });
      }
    }
  }
}

</script>

