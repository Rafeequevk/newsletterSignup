const express = require("express");
const bodyParser = require("body-parser")
const request = require("request");
const https = require("https");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function (req, res) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    console.log(lname, fname, email);

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fname,
                LNAME: lname
            }
        }]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us3.api.mailchimp.com/3.0/lists/139762cf27"

    const options = {
        method: "POST",
        auth: "Rafeeq:d85bbe9c1e6a9c664c3749da70404918-us3"

    }

    const request = https.request(url, options, function (respons) {  

        if (respons.statusCode === 200) {
            res.sendFile(__dirname+"/success.html");
        } else {
            res.sendFile(__dirname+"/failure.html");
        }

        
        
        respons.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});


app.post("/failure", function(req,res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, function () {
    console.log("server started port 3000");
});
