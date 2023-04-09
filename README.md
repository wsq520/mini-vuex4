# mini-vuex4
简单实现vuex4状态管理库
>>>>>>> refs/remotes/origin/master

# module结构如下：
 root = {
  _raw: rootModule,
  state: rootModule.state,
  _children: {
    aCount: {
      _raw: aModule,
      state: aModule.state,
      _children: {
        cCount: {
          _raw: cModule,
          state: cModule.state,
          _children: {}
        }
      } 
    },
    bCount: {
      _raw: aModule,
      state: aModule.state,
      _children: {
       
      } 
    }
  }
 }
