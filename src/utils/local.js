export default {
  saveLocal(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  },
  getLocal(key) {
    // 本地存储取出来的字段是string 所以这里需要转成JSON对象
    return JSON.parse(window.sessionStorage.getItem(key));
  },
  removeLocal(key) {
    window.sessionStorage.removeItem(key);
  },
  clear() {
    window.sessionStorage.clear();
  },
};
