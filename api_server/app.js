const express = require('express')
const app = express()

const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

app.use(express.urlencoded({extended:false}))
app.use(express.json())


// 响应数据的中间件
app.use(function (req, res, next) {
    // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
    res.cc = function(err, status = 1){
        res.send({
            status, 
            // 状态描述，判断 err 是 错误对象 还是 字符串
            message: err instanceof Error ? err.message : err, 
        })
    }
 
    next()
})


// 解析 token 的中间件
const config = require('./config')
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
// about latest version of 'express-jwt' https://blog.csdn.net/qq_52855464/article/details/126162519
app.use(expressJWT.expressjwt({secret: config.jwtSecretKey, algorithms: ["HS256"]}).unless({path:[/^\/api\//]}))


// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

// Import and register property router module
const propertyRouter = require('./router/property')
app.use('/property', propertyRouter)

const joi = require('joi')

// 错误中间件
app.use(function(err, req, res, next){
    console.error(err);
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)

    if (err.name ==='UnauthorizedError') return res.cc('Authentication Failed!')
    // Unknown Err
    res.cc(err)
})

app.listen(3007, function(){
    console.log('api server running at http://127.0.0.1:3007')
})