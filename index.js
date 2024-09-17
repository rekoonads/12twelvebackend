const express = require('express');
const app = express();
app.listen(3002,()=>{console.log("running on 3002")});

app.get('/',(req,res)=>{
    res.json({res:"data"});
})