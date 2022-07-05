const fse = require('fs-extra')
const path = require('path')
const { ErrorModel, SuccessModel } = require('../model/ResModel')
const { uploadFileSizeFailInfo } = require('../model/ErrorInfo')

// 存储目录
const DIST_FOLDER_PATH = path.join(__dirname, '../../uploadFiles')

// 文件最大体积 1M
const MAX_SIZE = 1024 * 1024 * 1024

// 是否需要创建目录
fse.pathExists(DIST_FOLDER_PATH).then((exist) => {
  if (!exist) {
    fse.ensureDir(DIST_FOLDER_PATH)
  }
})

/**
 * 保存文件
 * @param {string} name 文件名
 * @param {string} type 文件类型
 * @param {number} size 文件体积大小
 * @param {string} filePath 文件路径
 */
const saveFile = async ({ size, filePath, name, type }) => {
  if (size > MAX_SIZE) {
    await fse.remove(filePath)
    return new ErrorModel(uploadFileSizeFailInfo)
  }

  const fileName = `${Date.now()}.${name}`
  const distFilePath = path.join(DIST_FOLDER_PATH, fileName)
  fse.move(filePath, distFilePath)

  return new SuccessModel({
    url: `/${fileName}`,
  })
}

module.exports = {
  saveFile,
}
