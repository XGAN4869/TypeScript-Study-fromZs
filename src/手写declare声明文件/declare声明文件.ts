//TODO axios 按 ctrl 进入你可以看到 axios 的声明文件，所以你使用 axios 无报错并且写方法有提示
import axios from "axios";
//npm i --save-dev @types/express 安装所有库的声明文件必须要用 @types
//但是一些冷门的库不一定会有人帮你编写，这个时候你需要去手写
import express from 'express'

const app = express();
const router = express.Router()
app.use('/api',router);

router.get('/api',(req:any,res:any)=>{
    res.json({
        code:200,
    })
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})
xxx(1)
a123 = 1
new Vue123()
C.a