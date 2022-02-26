const useError = (res, headers) => {
  const errorMsg = {
    status: false,
    message: '資料格式錯誤'
  }

  res.writeHead(400, headers)
  res.write(JSON.stringify(errorMsg))
}

module.exports = useError