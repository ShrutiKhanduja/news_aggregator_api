const newsRoutes = require('express').Router();
const verifyToken = require('../middleware/authJWT');
const path = require('path');
const fs = require("fs");
const user = require('../models/user');

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
     
    const updateDoc = {
        $set: {
          preferences: req.body.preferences
        },
      };
     
    user.updateOne(
        req.user,
       updateDoc

    ).then((result)=>{
     if(result.modifiedCount>=1){
       
        res.json({"message":"Update successfull","status code":200});
     }
     else{
       
        res.json({"message":"No modifications","status code":200});
     }
    }).catch((err)=>{
       
      res.json({"message":err.message,"status code":500});
      
    });
      
     
  });
  function news(url) {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((response) => {
          const articles = response.data.articles;
          response.data.articles = articles.map((article) => {
           
            return {
              
              ...article,
            };
          });
          return resolve(response.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

 newsRoutes.get('/getNews',verifyToken, async (req, res) => {
    if (!req.user && req.message == null) {
        res.status(403).send({
            message: "Invalid JWT token"
          });
      } else if (!req.user && req.message) {
        res.status(403).send({
          message: req.message
        });
      }
  
   
  
    try {
        let preferences_arr = req.user.preferences;
      
      
        let payload = {
            pageSize: 20,
            apiKey: API_KEY,
            language: "en",
          };
        let promises_arr = [];
  
        preferences_arr.forEach((pref) => {
          payload.category = pref;
          let searchParams = new URLSearchParams(payload);
           
          let promise = news(
            `https://newsapi.org/v2/top-headlines?${searchParams}`
          );
        
          promises_arr.push(promise);
        });
  
        Promise.all(promises_arr)
          .then((values) => {
            return res.status(200).json(values);
          })
          .catch((err) => {
            console.log("Promise error");
            console.log(err);
            return res.status(500).json({ error: err });
          });
      
    } catch (err) {
        console.log(err);
      return res.status(500).json({ error: err });
    }
  });
  

  module.exports=newsRoutes;
