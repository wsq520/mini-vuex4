// import { createStore } from "../vuex4"
import { createStore } from "vuex"

// store初始化成功后会执行该插件
function customPlugin(store) {
  let local = localStorage.getItem('VUEX:STATE')
  if(local) {
    store.replaceState(JSON.parse(local))
  }
  // 每次执行完mutation会执行
  store.subscribe((mutation, state) => {
    console.log(mutation, state)
    localStorage.setItem('VUEX:STATE', JSON.stringify(state))
  })
}

const store = createStore({
  // 插件会按照注册顺序依次执行而且会将store传给插件
  plugins: [
    customPlugin
  ],
  strict: true, // 是否开启严格模式(开启之后 状态只能通过 mutation 来修改)
  state: {
    count: 0
  },
  getters: {
    double(state) {
      return state.count * 2
    }
  },
  mutations: {
    add(state, payload) {
      state.count += payload
    }
  },
  actions: {
    addOne({ state }, payload) {
      console.log(state)
      state.count += payload
    }
  },
  modules: {
    aCount: {
      state: {
        count: 0
      },
      modules: {
        cCount: {
          state: {
            count: 2
          },
          mutations: {
            addOne(state, payload) {
              state.count += payload
            }
          }
        }
      }
    },
    bCount: {
      state: {
        count: 1
      }
    }
  }
})

export default store