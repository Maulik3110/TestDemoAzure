var express = require('express');
var router = express.Router();
var rp = require('request-promise');

var accesstoken ="";
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',data : global });
});



router.post('/setjson', function(req, res, next) {
console.log('json',req.body);
let inputjson = req.body.keyjson;
console.log('parsed',JSON.parse(inputjson))
res.render('index', { title: 'Express',data : global });

})

router.get('/test',function(req,res,next){
  var options = {
    method: 'GET',
    uri: "http://dummy.restapiexample.com/api/v1/employees",
   
    json: true // Automatically parses the JSON string in the response
  };
  rp(options)
      .then(function (parsedBody) {
          // POST succeeded...
        res.send(parsedBody);
      })
      .catch(function (err) {
        console.log('err',err)
  
          // POST failed...
      });
  
})
router.post('/setvalue', function(req, res, next) {
  console.log('input',req.body);
 
  global.subscriptionId = req.body.subscriptionid;
  global.rg = req.body.rg;
  global.appname = req.body.appname;
  global.tenantid = req.body.tenantid;
  global.client_id = req.body.client_id;
console.log('global',global);
  res.render('index', { title: 'Express',data : global });
});
router.get('/login', function(req, res, next) {
let tenantid = "0227f82b-a40f-42a2-a04b-e2813a470b16";
let url = `https://login.microsoftonline.com/${tenantid}/oauth2/token`;

var options = {
  method: 'POST',
  uri: url,
  form: {
    grant_type: 'client_credentials',
    client_id: 'fa02dc84-bceb-401d-81ed-ff71b3c833b9',
    client_secret:'B~T-7ggXNzKqurFpV7wqtL2oo~MivzfgT7',
    resource:'https://management.azure.com/'
  },
  
  json: true // Automatically parses the JSON string in the response
};
rp(options)
    .then(function (parsedBody) {
        // POST succeeded...
        console.log('parsedbody',parsedBody);
        global.accesstoken =parsedBody.access_token;
        accesstoken =parsedBody.access_token;
        res.render('index', { title: JSON.stringify(parsedBody),data:global });
    })
    .catch(function (err) {
      console.log('err',err)

        // POST failed...
    });
})

router.post('/update', function(req, res, next) {
  let subscriptionId = '11f7dd46-478c-4c7f-9687-fb9080b8ff86'
  let inputjson = req.body.keyjson;
  console.log('parsed---------------------------------',JSON.parse(inputjson))
  let parsedjson = JSON.parse(inputjson);
  console.log('update------------------------------------')
let url = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/maulik106rg/providers/Microsoft.Web/sites/Mauliktestwebapp/config/appsettings?api-version=2019-08-01`;
var options = {
  method: 'PUT',
  uri: url,
  body: {
      "properties": parsedjson
  
},
  headers: {
      'Authorization': 'Bearer '+global.accesstoken},
  json: true // Automatically parses the JSON string in the response
};
rp(options)
    .then(function (parsedBody) {
        // POST succeeded...
        console.log('parsedbody',parsedBody)
        global.parsebody =parsedBody;
        var arr= [];
        for (const [ key, value ] of Object.entries(parsedBody.properties)) {
          // do something with `key` and `value`
          arr.push({
            key:key,
            value:value
          })
          console.log('key',key);
          console.log('val',value)
        
        }
             
        res.render('index', { title: JSON.stringify(parsedBody.properties),data:global,exval:JSON.stringify(global.parsebody.properties),keyval:arr });
    })
    .catch(function (err) {
      console.log('err',err)

        // POST failed...
    });
});

router.get('/list', function(req, res, next) {

let subscriptionId = '11f7dd46-478c-4c7f-9687-fb9080b8ff86';
console.log("Acc",global.accesstoken);
  let url =`https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/maulik106rg/providers/Microsoft.Web/sites/Mauliktestwebapp/config/appsettings/list?api-version=2019-08-01`
  var options = {
    method: 'POST',
    uri: url,
    body: {
      
  },
    headers: {
        'Authorization': 'Bearer '+global.accesstoken
    },
    json: true // Automatically parses the JSON string in the response
};

rp(options)
    .then(function (parsedBody) {
        // POST succeeded...
        console.log('parsedbody',parsedBody)
        global.parsebody = parsedBody;
console.log('globall',global);
var arr= [];
for (const [ key, value ] of Object.entries(parsedBody.properties)) {
  // do something with `key` and `value`
  arr.push({
    key:key,
    value:value
  })
  console.log('key',key);
  console.log('val',value)

}
        res.render('index', { title: JSON.stringify(parsedBody.properties),data:global,exval:JSON.stringify(global.parsebody.properties),keyval:arr });
    })
    .catch(function (err) {
      console.log('err',err)

        // POST failed...
    });
});


module.exports = router;
