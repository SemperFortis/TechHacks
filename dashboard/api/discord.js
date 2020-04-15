require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const btoa = require('btoa');
const {
  catchAsync
} = require('../utils/utils.js');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent(process.env.redirect);
express().set('view engine', 'ejs');


router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=660225335916232764&redirect_uri=${redirect}&response_type=code&scope=identify%20guilds`);
});

router.get('/callback', catchAsync(async (req, res) => {
  if (!req.query.code) throw new Error('NoCodeProvided');
  const code = req.query.code;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
    },
  });
  const json = await response.json();
  
  res.cookie('access_token', json.access_token);
  res.cookie('token_type', json.token_type);

  res.redirect(`/`);
}));

module.exports = router;