const router = require('koa-router')()
const {
  isExist,
  register,
  login,
  deleteCurUser,
  changeInfo,
  changePassword,
  logout,
} = require('../../controller/user')
const { genValidator } = require('../../middlewares/validator')
const userValidate = require('../../validator/user')
const { isTest } = require('../../utils/env')
const { loginCheck } = require('../../middlewares/loginChecks')

router.prefix('/api/user')

router.post('/register', genValidator(userValidate), async (ctx, next) => {
  const { userName, password, gender } = ctx.request.body
  ctx.body = await register({ userName, password, gender })
})

router.post('/isExist', async (ctx, next) => {
  const { userName } = ctx.request.body
  ctx.body = await isExist(userName)
})

router.post('/login', async (ctx, next) => {
  const { userName, password } = ctx.request.body
  ctx.body = await login(ctx, userName, password)
})

router.post('/delete', async (ctx, next) => {
  if (isTest) {
    const { userName } = ctx.session.userInfo

    ctx.body = await deleteCurUser(userName)
  }
})

router.patch(
  '/changeInfo',
  loginCheck,
  genValidator(userValidate),
  async (ctx, next) => {
    const { picture, nickName, city } = ctx.request.body

    ctx.body = await changeInfo(ctx, { picture, nickName, city })
  }
)

router.patch(
  '/changePassword',
  loginCheck,
  genValidator(userValidate),
  async (ctx, next) => {
    const { newPassword, password } = ctx.request.body
    const { userName } = ctx.session.userInfo

    ctx.body = await changePassword({ userName, password, newPassword })
  }
)

router.post('/logout', async (ctx, next) => {
  ctx.body = await logout(ctx)
})

module.exports = router
