const express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;



app.get('/', (req, res) => {
    res.json('message is ok ')
})

app.listen(PORT, () => {
  console.log(`message server is runnig ${PORT}`);
});
