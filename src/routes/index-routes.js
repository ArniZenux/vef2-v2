import express from 'express';

import { catchErrors } from '../lib/catch-errors.js';

import { list, insert, update } from '../lib/db_psql.js';

export const indexRouter = express.Router();

async function indexRoute(req, res) {
  const sql_vidburdur = 'SELECT * FROM vidburdur';

  const rows = await list(sql_vidburdur);

  const errors = [];

  res.render('index', {errors, title: 'Viðburðasíðan', events : rows});
}

async function indexSlug(req, res){
  console.log("hello arni");
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

async function adminRoute(req, res){
  console.log("hvar ertu ? ");
  const errors = [];

  const events = []; 

  const formData = [];

  res.render('admin', {errors, title: 'Viðburðasíðan - Umsjón', events, formData });
}

async function adminLogin(req, res){
  const message = [];
  console.log("login aðgang");

  res.render('login', {message, title: 'Innskráningu stjóranda - Umsjón'});
} 

async function adminSlug(req, res){
  console.log("update");

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
  console.log("balbalablab");
    
  const user = [req.body.username];
  const pass = [req.body.password];

  const sql_vidburdur = 'SELECT * FROM vidburdur';
  
  const rows = await list(sql_vidburdur);

  const errors = [];
  
  const formData = [];

  res.render('admin', {errors, title: 'Viðburðasíðan - Umsjón', formData, events : rows });
}

async function adminVidburdur(req, res){
  console.log("skrá nýja viðburði"); 
  
  const info = [req.body.name, 'df-df', req.body.comment];
  
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


/**********/
//   GET   /
/**********/
indexRouter.get('/', catchErrors(indexRoute));
indexRouter.get('/:id', catchErrors(indexSlug));
indexRouter.get('/admin/login', catchErrors(adminLogin));
indexRouter.get('/admin/:slug', catchErrors(adminSlug));

/**********/
//  POST   /
/**********/
indexRouter.post('/admin', catchErrors(adminVidburdur));
indexRouter.post('/admin/login', catchErrors(adminPost));
indexRouter.post('/admin/:slug', catchErrors(adminSlugPost));
indexRouter.post('/:slug', catchErrors(indexSlugPost));
