import { createStore } from "../vuex4"

const store = createStore({
  state: {
    count: 0
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