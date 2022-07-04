const { getUserInfo, createUser, deleteUser } = require('../services/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const {
  registerUserNameNotExistInfo,
  registerUserNameExistInfo,
  registerFailInfo,
  loginFailInfo,
  deleteUserFailInfo,
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

module.exports = {
  isExist,
  register,
  login,
  deleteCurUser,
}
