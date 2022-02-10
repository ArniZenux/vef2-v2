import express from 'express';

import { body, validationResult } from 'express-validator';

import { catchErrors } from '../lib/catch-errors.js';

import { list, insert, update } from '../lib/db_psql.js';

//import {userCheck, vidburdCheck } from '..lib/check.js';

export const indexRouter = express.Router();

async function indexRoute(req, res) {
  const sql_vidburdur = 'SELECT * FROM vidburdur';

  const rows = await list(sql_vidburdur);

  const errors = [];

  res.render('index', {errors, title: 'Viðburðasíðan', events : rows});
}

async function indexSlug(req, res){
  const id = [req.params.id];
  console.log(id); 

  const sql = 'SELECT * FROM vidburdur WHERE vidburdur.id = $1';
  const sql_user = 'SELECT * FROM vidburdur, skraning WHERE vidburdur.id=skraning.event AND vidburdur.id = $1';

  const errors = [];
  const formData = [];

  try {
    const rows = await list(sql, id); 
    const rows_user = await list(sql_user, id); 

    res.render('vidburd', {errors, title: 'Viðburðasíðan', events : rows, users : rows_user, formData });
  }
  catch(e){
    console.error(e); 
  }
}

async function adminLogin(req, res){
  const message = [];
  
  const errors = []; 

  res.render('login', {errors, message, title: 'Innskráningu stjóranda - Umsjón'});
} 

async function adminSlug(req, res){
  const sluq = [req.params.slug];
  console.log(sluq);

  const sql = 'SELECT * FROM vidburdur WHERE vidburdur.slug = $1';
  const errors = [];
  const formData = [];

  try {
    const rows = await list(sql, sluq);

    res.render('update', { errors, title: 'Uppfæra viðburð', events : rows, formData});
  }
  catch(e){
    console.error(e); 
  }
}

async function indexSlugPost(req, res){
  
  const user = [req.body.name, req.body.comment, req.body.id];

  const sql = 'INSERT INTO skraning(name, comment, event) VALUES($1, $2, $3)';

  let success = true; 
  
  try {
    success = insert(sql, user);
  }
  catch(e){
    console.error(e); 
  }

  if(success){
    return res.redirect('/');
  }
}

async function adminPost(req, res){
  const sql_vidburdur = 'SELECT * FROM vidburdur';
  
  const rows = await list(sql_vidburdur);

  const errors = [];
  
  const formData = [];

  res.render('admin', {errors, title: 'Viðburðasíðan - Umsjón', formData, events : rows });
}

async function adminVidburdur(req, res){
  console.log("skrá nýja viðburði"); 
  
  const info = [req.body.name, req.body.name, req.body.comment];
  
  let success = true;   
  
  const sql = 'INSERT INTO vidburdur(name, slug, description) VALUES($1, $2, $3)';

  try {
    success = insert(sql, info);
  }
  catch(e){
    console.error(e); 
  }

  if(success){
    return res.redirect('/');
  }
}

async function adminSlugPost(req, res){

  const info = [req.body.name, req.body.comment, req.body.slug];
  
  let success = true; 
  
  const sql = 'UPDATE vidburdur SET name = $1, description = $2 WHERE vidburdur.slug = $3';
  try {
    success = update(sql, info);
  }
  catch(e){
    console.error(e);
  }

  if(success){
    const sql_vidburdur = 'SELECT * FROM vidburdur';
  
    const rows = await list(sql_vidburdur);

    const errors = [];
  
    const formData = [];
    
    res.render('admin', {errors, title: 'Viðburðasíðan - Umsjón', formData, events : rows });
  }
  else {
    return redirect('/');
  }
}

const nationalIdPattern = '^[0-9]{6}-?[0-9]{4}$';

const userMiddleware = [
  body('name')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),
  body('name')
    .isLength({ max: 64 })
    .withMessage('Nafn má að hámarki vera 64 stafir'),
  body('comment')
    .isLength({ min: 1 })
    .withMessage('Vantar athugasemd'),
  body('comment')
    .isLength({ max: 400 })
    .withMessage('Athugasemd má að hámarki vera 400 stafir'),
];

const adgangMiddleware = [
  body('username')
    .isLength({ min: 1 })
    .withMessage('Notandi má ekki vera tómt'),
  body('username')
    .isLength({ max: 64 })
    .withMessage('Notandi má að hámarki vera 64 stafir'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Vantar lyklaorð'),
  body('password')
    .isLength({ max: 256 })
    .withMessage('Hámark 256 stafir'),
];

const vidburdMiddleware = [
  body('name')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),
  body('name')
    .isLength({ max: 64 })
    .withMessage('Nafn má að hámarki vera 64 stafir'),
  body('comment')
    .isLength({ min: 1 })
    .withMessage('Vantar lýsing'),
  body('comment')
    .isLength({ max: 400 })
    .withMessage('Hámarki vera 400 stafir'),
];

async function vidburdCheck(req, res, next) {
  const { name, comment } = req.body;

  const formData = {name, comment};

  const validation = validationResult(req);

  const sql_vidburdur = 'SELECT * FROM vidburdur';
  const rows = await list(sql_vidburdur);

  if (!validation.isEmpty()) {
    return  res.render('admin', {errors : validation.errors, title: 'Viðburðasíðan - Umsjón', formData, events : rows });
  }

  return next();
}

async function adgangCheck(req, res, next) {
  const { username, password } = req.body;

  const formData = {username, password};

  const validation = validationResult(req);

  const message = [];

  if (!validation.isEmpty()) {
    return  res.render('login', {errors : validation.errors, message, title: 'Innskráningu stjóranda - Umsjón', formData});
  }

  return next();
}

async function userCheck(req, res, next) {
  const { name, comment } = req.body;

  const formData = {name, comment};

  const validation = validationResult(req);

  const id = [req.body.id];
  console.log(id); 

  const sql = 'SELECT * FROM vidburdur WHERE vidburdur.id = $1';
  const sql_user = 'SELECT * FROM vidburdur, skraning WHERE vidburdur.id=skraning.event AND vidburdur.id = $1';

  const rows = await list(sql, id); 
  const rows_user = await list(sql_user, id); 
    
  if (!validation.isEmpty()) {
    return res.render('vidburd', {errors: validation.errors, title: 'Viðburðasíðan', events : rows, users : rows_user, formData });
  }
  
  return next();
}

async function updateCheck(req, res, next) {
  const { name, slug, comment } = req.body;
  
  const slg = [req.body.slug];

  const formData = {name, slug, comment};

  const validation = validationResult(req);

  console.log(slug); 

  const sql = 'SELECT * FROM vidburdur WHERE vidburdur.slug = $1';

  const rows = await list(sql, slg); 
    
  if (!validation.isEmpty()) {
    return res.render('update', {errors: validation.errors, title: 'Uppfæra viðburð', events : rows, formData});
  }

  return next();
}

/**********/
//   GET   /
/**********/
indexRouter.get('/', catchErrors(indexRoute));
indexRouter.get('/:id', catchErrors(indexSlug));
indexRouter.get('/admin/login', catchErrors(adminLogin));
indexRouter.get('/admin/:slug', catchErrors(adminSlug));
indexRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

/**********/
//  POST   /
/**********/
indexRouter.post('/admin', vidburdMiddleware, catchErrors(vidburdCheck), catchErrors(adminVidburdur));
indexRouter.post('/admin/login', adgangMiddleware, catchErrors(adgangCheck), catchErrors(adminPost));
indexRouter.post('/admin/:slug', vidburdMiddleware, catchErrors(updateCheck), catchErrors(adminSlugPost));
indexRouter.post('/:slug', userMiddleware, catchErrors(userCheck),catchErrors(indexSlugPost));