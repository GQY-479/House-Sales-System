/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

// database
const db = require('../db/index')

// 加密 bcryptjs
const bcrypt = require('bcryptjs')

// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')

// 导入全局的配置文件
const config = require('../config')

/**
 * Handles user registration.
 *
 * @param {Object} req - The request object. This should contain the following properties:
 *   - {string} username - The username of the user being registered.
 *   - {string} password - The password of the user being registered.
 *   - {string} email - The email address of the user being registered.
 *   - {string} name - The name of the user being registered. This property is only required if the user is an agent.
 *   - {string} phone - The phone number of the user being registered. This property is only required if the user is an agent.
 *   - {string} userType - The type of user being registered. Must be either "customer" or "agent".
 *   - {string} [company] - The company name of the user being registered. This property is only required if the user is an agent.
 *   - {string} [introduction] - A brief introduction to the user being registered. This property is only required if the user is an agent.
 *
 * @param {Object} res - The response object.
 *
 * @returns {Object} The response object with a message and status code.
 */

exports.regUser = (req, res) => {
    const userinfo = req.body
    // console.log('Received userinfo:', userinfo);
    // Check if all required fields are provided
    if (!userinfo.username || !userinfo.password || !userinfo.email) {
        return res.cc('All fields are required!')
    }

    // Check if username is already taken
    const sql = 'SELECT * FROM User WHERE username = ?'

    db.query(sql, [userinfo.username], function (err, results) {
        if (err) {
            console.log('Error in checking username:', err)
            return res.cc('Error in checking username: ' + err)
        }

        if (results.length > 0) {
            return res.cc('用户名已被占用')
        }

        // TODO: 用户名可用

        // Encrypt the user's password
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        // Insert client information into the ClientInfo table
        const insertClientInfoSql = 'INSERT INTO ClientInfo (name, phone, email) VALUES (?, ?, ?)'

        db.query(insertClientInfoSql, [userinfo.name, userinfo.phone, userinfo.email], function (err, results) {
            if (err) {
                console.log('Error in inserting client info:', err)
                return res.cc('Error in inserting client info: ' + err)
            }

            // Get the id of the newly inserted client information
            const client_info_id = results.insertId

            // Insert the new user into the User table
            const insertUserSql = 'INSERT INTO User (username, password) VALUES (?, ?)'

            db.query(insertUserSql, [userinfo.username, userinfo.password], function (err, results) {
                if (err) {
                    console.log('Error in inserting user:', err)
                    return res.cc('Error in inserting user: ' + err)
                }

                // Get the id of the newly inserted user
                const user_id = results.insertId

                const insertUserRoleSql = 'INSERT INTO UserRole (user_id, role_name) VALUES (?, ?)'

                db.query(insertUserRoleSql, [user_id, userinfo.userType], function (err, results) {
                    if (err) {
                        console.log('Error in inserting user role:', err)
                        return res.cc('Error in inserting user role: ' + err)
                    }

                    if (userinfo.userType === 'customer') {
                        // Create a new record in the appropriate role table (e.g., Customer) and link it to the user and client information
                        const insertRoleSql = 'INSERT INTO Customer (user_id, client_info_id) VALUES (?, ?)'

                        db.query(insertRoleSql, [user_id, client_info_id], function (err, results) {
                            if (err) {
                                console.log('Error in inserting role:', err)
                                return res.cc('Error in inserting role: ' + err)
                            }

                            if (results.affectedRows !== 1) {
                                return res.cc('注册用户失败，请稍后再试!')
                            }

                            // 注册成功
                            res.cc('注册成功！', 0)
                        })
                    }
                    else if (userinfo.userType === 'agent') {
                        // Create a new record in the appropriate role table (e.g., Customer) and link it to the user and client information
                        const insertRoleSql = 'INSERT INTO Agent (user_id, name, phone, email, company, introduction) VALUES (?, ?, ?, ?, ?, ?)'


                        db.query(insertRoleSql, [user_id, userinfo.name, userinfo.phone, userinfo.email, userinfo.company, userinfo.introduction], function (err, results) {
                            if (err) {
                                console.log('Error in inserting role:', err)
                                return res.cc('Error in inserting role: ' + err)
                            }

                            if (results.affectedRows !== 1) {
                                return res.cc('注册用户失败，请稍后再试!')
                            }

                            // 注册成功
                            res.cc('注册成功！', 0)
                        })
                    }

                })
            })
        })
    })
}



// 登录的处理函数
/**
 * Logs in a user and generates a JSON Web Token (JWT) for authentication.
 * @param {Object} req - The HTTP request object
 *   - {string} username - The username of the user being registered.
 *   - {string} password - The password of the user being registered.
 *   - {string} userType - The type of user being registered. Must be either "customer" or "agent".
 * @param {Object} res - The HTTP response object
 * @returns {Object} - The HTTP response object containing a JWT and user role
 */

exports.login = (req, res) => {
    const userinfo = req.body

    const sql = 'select * from User where username = ?'

    db.query(sql, userinfo.username, function (err, results) {
        // sql语句执行失败
        if (err) return res.cc(err)
        // success to perform the SQL statement
        if (results.length !== 1) return res.cc('Invalid Username!')

        // TODO:

        // compare passwords
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) {
            return res.cc('登录失败！')
        }

        // 通过 ES6 的高级语法，快速剔除 密码 和 头像 的值, 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
        const user = { ...results[0], password: '' }
        // Query the UserRole table to check the user's role
        const userRoleSql = 'SELECT role_name FROM UserRole WHERE user_id = ?'

        db.query(userRoleSql, [results[0].id], function (err, results) {
            if (err) {
                console.log('Error in checking user role:', err)
                return res.cc('Error in checking user role: ' + err)
            }

            // store all role_name in an array
            const role = results.map(item => item.role_name)
            console.log('role:', role)
            // if userinfo.userType is not in the role array, then the user is not allowed to login
            if (!role.includes(userinfo.userType)) {
                
                return res.cc(`You're not a ${userinfo.userType}!`)
            }

            // add role into user object
            user.role = role
            console.log('user:', user)
            
            const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h' }) // token 有效期为 10 个小时
            // console.log('Bearer ' + tokenStr)

            res.send({
                status: 0,
                message: '登陆成功',
                token: tokenStr,
                role: role
            })
        })
    })
}
