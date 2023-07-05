const newsRoutes = require('express').Router();
const verifyToken = require('../middleware/authJWT');
const path = require('path');
const fs = require("fs");
const user = require('../models/user');
let url = 'https://api.openaq.org/v2/latest';
const { default: axios } = require("axios");



newsRoutes.get('/preferences', verifyToken, (req, res) => {
    if (!req.user && req.message == null) {
      res.status(403).send({
          message: "Invalid JWT token"
        });
    } else if (!req.user && req.message) {
      res.status(403).send({
        message: req.message
      });
    }
    res.json({"status":200,"preferences":req.user.preferences});
  
  });
  newsRoutes.put('/preferences',verifyToken,(req,res)=>{
    if (!req.user && req.message == null) {
        res.status(403).send({
            message: "Invalid JWT token"
          });
      } else if (!req.user && req.message) {
        res.status(403).send({
          message: req.message
        });
      }
    req.user.preferences=req.body.preferences;
    user.updateOne(
        req.user.id,
       req.user

    ).then((res)=>{
       res.send(200);
    }).catch((err)=>{
      console.log(err);
      res.send(500);
    });
      
     
  });
  function newsPromise(url) {
    return new Promise((resolve, reject) => {
      axios.get(url).then(resp => {
        return resolve(resp.data);
      }).catch(err => {
        return reject(err);
      });
    });
  }
  // understanding async await
// airQuality.get('/', verifyToken,async (req, res) => {
//     let totalResults = [];
//     try {
//         for(let i=0;i<req.user.preferences;i++){
//             let payload = { page: 1 };
//         }
//       let payload = { page: 1 };
//       const searchParams = new URLSearchparams(payload);
//       let resp1 = await newsPromise(`${url}?${searchParams}`);
//       payload.page = payload.page + 1;
//       const searchParams2 = new URLSearchparams(payload);
//       let resp2 = await newsPromise(`${url}?${searchParams2}`);
//       payload.page = payload.page + 1;
//       const searchParams3 = new URLSearchparams(payload);
//       let resp3 = await newsPromise(`${url}?${searchParams3}`);
//       totalResults.push(resp1);
//       totalResults.push(resp2);
//       totalResults.push(resp3);
//       res.status(200).json(totalResults);
//     } catch (err) {
//       res.setHeader('Content-Type', 'application/json');
//       res.status(500).json({ error: err });
//     }
//   });
  

  module.exports=newsRoutes;
