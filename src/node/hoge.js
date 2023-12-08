// express applicationを作成する
const express = require('express');
const app = express();
const port = 3000;

// callback関数を使用して第一引数のパスにルーティング
app.get('/', (req, res) =>{
    res.send('やっほ');
});

// port で指定したポート番号でクライアントからのリクエストを待つ
app.listen(port, () =>{
    console.log(`Express app listening at http://localhost:${port}`);
});