if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');   //배포판에서 쓰는설정
} else {
    module.exports = require('./dev');      //로컬에서 쓰는설정
}