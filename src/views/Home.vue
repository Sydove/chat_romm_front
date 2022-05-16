<template>
  <div class="home">
    <el-row>
      <el-col :span="5" class="userCol">
        <div class="leftUser">
          <div class="userInfo">
            <el-avatar size="medium" :src="avatar" shape="square"></el-avatar>
            <div class="userMessage">
              <p class="userName">{{ currentUser.username }}</p>
            </div>
          </div>
          <div class="actions">
            <span
              v-for="(item, index) in actions"
              :key="index"
              class="iconfont"
              :class="`icon-${item.icon}`"
              @click="toggle(index)"
            ></span>
          </div>
        </div>
        <div class="userList">
          <div
            class="users"
            :class="{ active: activeIndex === index }"
            v-for="(item, index) in userList"
            :key="index"
            @click="setLine(index)"
          >
            <el-avatar size="large" :src="avatar" shape="square"></el-avatar>
            <div class="userMessage">
              <p class="userName">{{ item.username }}</p>
            </div>
          </div>
        </div></el-col
      >
      <el-col :span="19"
        ><div class="messageBox" v-if="currentReceive">
          <div class="currentReceiveInfo">
            <p class="receiveName">{{ currentReceive.username }}</p>
          </div>
          <div class="messageList">
            <div
              class="listBox"
              v-for="(item, index) in messageList"
              :key="index"
            >
              <div
                class="directionBox myMessage"
                v-if="item.user_id == currentUser.user_id"
              >
                <div class="message">
                  {{ item.content }}
                </div>
              </div>
              <div class="directionBox receiveMessage" v-else>
                <div class="message">
                  {{ item.content }}
                </div>
              </div>
            </div>
          </div>
          <div class="messageSend">
            <div class="sendArea">
              <el-input
                type="textarea"
                placeholder=""
                v-model="text"
                :autosize="{ minRows: 4, maxRows: 6 }"
                @keydown.native="inputEnter"
              >
              </el-input>
            </div>
            <div class="sender">
              <el-button type="primary" class="sendBtn" @click="sendMessage"
                >发送</el-button
              >
            </div>
          </div>
        </div></el-col
      >
    </el-row>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import { userList, userDetail } from "@/api/api";
import local from "@/utils/local";
export default {
  name: "",
  data() {
    return {
      avatar:
        "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      userList: [],
      activeIndex: "",
      actionIndex: "",
      currentUser: "",
      actions: [{ name: "chat", icon: "chatActive" }],
      text: "",
      socket: "",
      messageList: [],
      total: 0,
    };
  },
  computed: {
    currentReceive() {
      return this.userList[this.activeIndex];
    },
  },
  methods: {
    // 切换功能页
    toggle(index) {
      let actions = document.querySelectorAll(".iconfont");
      actions[index].classList.add("active");
    },
    getMessageList() {
      let params = {
        receive_user_id: this.currentReceive.user_id,
        page: 1,
        page_size: 100,
      };
      this.socket.emit("message_list", params, (res) => {
        console.log("res", res);
        let { results, total } = res;
        this.total = total;
        this.messageList = results;
      });
    },
    setLine(index) {
      this.activeIndex = index;
      this.messageList = [];
      this.getMessageList();
    },
    userDetail() {
      userDetail().then((res) => {
        let { code } = res;
        if (code == 200) {
          let { data } = res;
          this.currentUser = JSON.parse(data);
        }
      });
    },
    getUserLst() {
      userList().then((res) => {
        let { code } = res;
        if (code == 200) {
          let { data } = res;
          this.userList = JSON.parse(data);
        }
      });
    },
    initSocket() {
      this.socket = io(process.env.VUE_APP_BASE_API + "/chats", {
        withCredentials: true,
        transports: ["websocket"],
        auth: {
          token: local.getLocal("token"),
        },
        autoConnect: true,
      });
      this.socket.on("messageReveive", (res, add_message) => {
        console.log("res", res);
        this.messageList.push({
          user_id: res.sender,
          content: res.message,
        });
        add_message({
          sender_id: res.sender,
          receiver_id: this.currentUser.user_id,
          content: res.message,
        });
        // this.socket.send("RNM消息已接收");
      });
      this.socket.on("missedMessage", (res) => {
        console.log("missed", res);
      });
    },
    inputEnter(event) {
      if (event.keyCode == 13) {
        this.sendMessage();
        event.preventDefault();
      }
    },
    // 发送消息
    sendMessage() {
      let params = {
        receive_user_id: this.currentReceive.user_id,
        message: this.text,
      };
      this.socket.emit("send_message", params, (res) => {
        if (res == "success") {
          this.messageList.push({
            user_id: this.currentUser.user_id,
            content: this.text,
          });
          this.text = "";
        }
      });
    },
  },
  watch: {
    messageList(val) {
      // console.log("list", val);
    },
  },
  created() {
    this.userDetail();
    this.getUserLst();
  },
  mounted() {
    this.initSocket();
  },
};
</script>

<style scoped lang="less">
.home {
  height: 100vh;
}
.el-row {
  height: 100%;
  .el-col {
    height: 100%;
  }
}

.userCol {
  height: 100%;
  display: flex;
  background-color: #2e2e2e;
  .leftUser {
    .userInfo {
      flex: 1;
      padding: 10px;
      padding-top: 30px;

      text-align: center;
      .userName {
        color: #fff;
        font-size: 14px;
        line-height: 30px;
      }
    }
    .actions {
      text-align: center;
      span {
        font-size: 24px;
        color: #fff;
        cursor: pointer;
        &.active {
          color: #07c160;
        }
      }
    }
  }
  .userList {
    flex: 4;
    background-color: #e8e7e6;
    height: 100%;
  }
  .users {
    display: flex;
    padding: 10px;
    &.active {
      background-color: #c5c5c5;
    }
    &:hover {
      background-color: #dbdad9;
    }
    .userMessage {
      display: flex;
      margin-left: 14px;
      height: 60px;
      .userName {
        font-weight: 500;
        color: #333;
        font-size: 18px;
      }
    }
  }
}

.messageBox {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  height: 100%;
  .currentReceiveInfo {
    padding-left: 20px;
    line-height: 60px;
    border-bottom: 1px solid #dbdad9;
  }
  .messageList {
    border-bottom: 1px solid #dbdad9;
    padding: 20px;
    flex: 1;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      width: 12px;
    }
    .message {
      max-width: 45%;
      word-wrap: break-word;
      display: inline-block;
      line-height: 30px;
      background-color: #07c160;
      padding: 12px 10px;
      margin: 10px 0;
      color: #333;
      border-radius: 6px;
      text-align: right;
      color: #000;
      text-align: left;
    }
    .myMessage {
      text-align: right;
    }
    .receiveMessage {
      text-align: left;
      .message {
        background-color: #fff;
      }
    }
  }
  .messageSend {
    height: 200px;
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    .sendArea {
      flex: 1;
      ::v-deep.el-textarea {
        .el-textarea__inner {
          background-color: #f5f5f5;
          border: none;
        }
      }
    }
    .sender {
      height: 40px;
      text-align: right;
      .sendBtn {
        background-color: #07c160;
        border-color: transparent;
      }
    }
  }
}
</style>
