const {
  getUserInfo,
  createUser,
  deleteUser,
  updateUser,
} = require('../services/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const {
  registerUserNameNotExistInfo,
  registerUserNameExistInfo,
  registerFailInfo,
  loginFailInfo,
  deleteUserFailInfo,
  changeInfoFailInfo,
  changePasswordFailInfo,
} = require('../model/ErrorInfo')
const doCrypto = require('../utils/cryp')

/**
 * 是否存在用户
 * @param {string} userName 用户名
 * @returns
 */
const isExist = async (userName) => {
  const userInfo = await getUserInfo(userName)

  if (userInfo) {
    return new SuccessModel(userInfo)
  } else {
    return new ErrorModel(registerUserNameNotExistInfo)
  }
}

/**
 * 注册
 * @param {string} userName 用户名
 * @param {string} password 密码
 * @param {number} gender 性别（1 男，2 女，3 保密）
 */
const register = async ({ userName, password, gender }) => {
  const userInfo = await getUserInfo(userName)

  if (userInfo) {
    return new ErrorModel(registerUserNameExistInfo)
  }

  try {
    await createUser({ userName, password: doCrypto(password), gender })
    return new SuccessModel()
  } catch (error) {
    console.error(error.message, error.stack)
    return new ErrorModel(registerFailInfo)
  }
}

/**
 * 登录
 * @param {Object} ctx koa2 ctx
 * @param {string} userName 用户名
 * @param {string} password 密码
 */
const login = async (ctx, userName, password) => {
  const userInfo = await getUserInfo(userName, doCrypto(password))

  if (!userInfo) return new ErrorModel(loginFailInfo)

  !ctx.session.userInfo && (ctx.session.userInfo = userInfo)

  return new SuccessModel()
}

/**
 * 删除当前用户
 * @param {string} userName 用户名
 */
const deleteCurUser = async (userName) => {
  const result = await deleteUser(userName)

  if (!result) return new ErrorModel(deleteUserFailInfo)

  return new SuccessModel()
}

/**
 * 修改个人信息
 * @param {Object} ctx ctx
 * @param {string} nickName 昵称
 * @param {string} city 城市
 * @param {string} picture 头像
 */
const changeInfo = async (ctx, { nickName, city, picture }) => {
  const { userName } = ctx.session.userInfo
  !nickName && (nickName = userName)
  const result = await updateUser(
    {
      newNickName: nickName,
      newPicture: picture,
      newCity: city,
    },
    { userName }
  )

  if (!result) return new ErrorModel(changeInfoFailInfo)

  ctx.session.userInfo = { ...ctx.session.userInfo, nickName, city, picture }
  return new SuccessModel()
}

/**
 * 修改密码
 * @param {string} userName 用户名
 * @param {string} password 当前密码
 * @param {string} newPassword 新密码
 */
const changePassword = async ({ userName, password, newPassword }) => {
  const result = await updateUser(
    { newPassword: doCrypto(newPassword) },
    { userName, password: doCrypto(password) }
  )

  if (!result) return new ErrorModel(changePasswordFailInfo)

  return new SuccessModel()
}

/**
 * 退出登录
 * @param {Object} ctx ctx
 */
const logout = async (ctx) => {
  delete ctx.session.userInfo

  return new SuccessModel()
}

module.exports = {
  isExist,
  register,
  login,
  deleteCurUser,
  changeInfo,
  changePassword,
  logout,
}
