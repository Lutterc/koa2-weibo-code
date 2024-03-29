const router = require('koa-router')()

// 故意制造一个错误
router.get('/get-an-error', async (ctx, next) => {
  throw Error()
  ctx.body = {
    msg: 'xxx',
  }
})

router.get('/error', async (ctx, next) => {
  await ctx.render('error')
})

router.get('*', async (ctx, next) => {
  await ctx.render('404')
})

module.exports = router
