const _ = require('lodash');

/* 检测用户名 */
function checkName (name){
    /* 4到16位，字母，数字，下划线，减号 */
    const pattern = /^[a-zA-Z0-9_-]{4,16}$/;
    return pattern.test(name);
}

/* 检测密码 */
function checkPassword (password){
    /* 至少6位，至少1个大写字母，1个小写字母，1个数字，1个特殊符号 */
    const pattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
    return pattern.test(password);
}

function check(data){

    const res = {
        message:'注册成功！',
        status:'success'
    };

    const { username , password } = data;

    if(_.isEmpty(username)){
        res.message = '请输入用户名';
        res.status = 'failed'
        
    }else{

         if(!checkName(username)){
            res.message = '请输入正确的用户名，4到16位，字母，数字，下划线，减号。';
            res.status = 'failed'
         }else{
            if(_.isEmpty(password)){
                res.message = '请输入密码';
                res.status = 'failed'
            }else{
        
                if(!checkPassword(password)){
                    res.message = '输入的密码不符合要求，至少6位，至少1个大写字母，1个小写字母，1个数字，1个特殊符号。';
                    res.status = 'failed'
                }
            }
         }

    }

    return res;

}

module.exports =  (router) => {

    /* 表单提交，get请求 */
    router.get('/banyuan/form/action', async function (ctx, next) {
        
        const query = ctx.request.query;
        
        ctx.response.body = check(query);
    })

    /* 表单提交，post请求 */
    router.post('/banyuan/form/action', async function (ctx, next) {
        
        const query = ctx.request.body;
        ctx.response.body = check(query);
    })

    /* ajax请求测试
     * status：error 返回500
     * status：time 等待5s返回，模拟同步页面卡顿
     * post请求
     */
    router.post('/banyuan/ajax', async function (ctx, next) {
        
        const query = ctx.request.body;
        
        if(query.status === 'error'){
            throw new Error('ajax error!');
        }
        

        if(query.status === 'time'){
            await sleep(5000);
        }

        ctx.response.body = { status: 'success' }
    })
}

/* 等待 */
function sleep(time){
    return new Promise((resolve,reject)=>{

        setInterval(()=>{
            
            resolve();
        },time);
    })
}
