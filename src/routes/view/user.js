const router = require('koa-router')()

const getUserInfo = (ctx) => {
  let data = {
    isLogin: false,
  }
  const userInfo = ctx.session.userInfo
  if (userInfo) {
    data = {
      isLogin: true,
      userName: userInfo.userName,
    }
  }
  return data
}

router.get('/login', async (ctx, next) => {
  await ctx.render('login', getUserInfo(ctx))
})

router.get('/register', async (ctx, next) => {
  await ctx.render('register', getUserInfo(ctx))
})

module.exports = router
