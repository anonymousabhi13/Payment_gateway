const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const razorpay = require("razorpay");
app.use(bodyParser.json());

var instance = new razorpay({
  key_id: "KEY_ID",
  key_secret: "KEY_SECRET",
});


app.get("/", (req, res) => {
res.sendFile('index.html', {root: __dirname });

});
app.post("/order/orderId", (req, res) => {
console.log("create order request",req.body);
var options = {
    amount: req.body.amount,   // amount in the smallest currency unit
    currency: "INR",
    receipt: "rcp1",
  };
  instance.orders.create(options, async function (err, order) {
    console.log(order);
    res.send({ orderId: order.id });
  });
})

app.post("/api/payment/verify",(req,res)=>{

    let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
   
     var crypto = require("crypto");
     var expectedSignature = crypto.createHmac('sha256', '<YOUR_API_SECRET>')
                                     .update(body.toString())
                                     .digest('hex');
                                     console.log("sig received " ,req.body.response.razorpay_signature);
                                     console.log("sig generated " ,expectedSignature);
     var response = {"signatureIsValid":"false"}
     if(expectedSignature === req.body.response.razorpay_signature)
      response={"signatureIsValid":"true"}
         res.send(response);
     });
   
   app.listen(3000, () => {
     console.log(`Example app listening at http://localhost:3000`)
   })

app.set("view engine", "ejs");
app.get("/", (req, res) => {
  var title = "Home";
  var subTitle = "This is set to the var named subTitle.";
  res.render("page", { title, subtitle });
});
// app.listen(3000);
console.log("Server has successfully started.");
