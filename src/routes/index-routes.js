import express from 'express';
import { body } from 'express-validator';
import { catchErrors } from '../lib/catch-errors.js';
import { list, insert, update } from '../lib/db_psql.js';
import { userCheck, vidburdCheck, adgangCheck , updateCheck } from '../lib/check.js';

export const indexRouter = express.Router();

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

/**     
 *  GET 
 */
async function indexRoute(req, res) {
  const sqlVidburdur = 'SELECT * FROM vidburdur';

  const rows = await list(sqlVidburdur);

  const errors = [];

  res.render('index', {errors, title: 'Viðburðasíðan', events : rows});
}

/**     
 *  GET 
 */
async function indexSlug(req, res){
  const title = 'Viðburðasíðan';

  const slug = [req.params.slug];
 
  const sql = `
    SELECT * FROM 
      vidburdur 
    WHERE 
      vidburdur.slug = $1;
    `;

  const sqlUser = `
    SELECT * FROM 
      vidburdur, skraning 
    WHERE 
      vidburdur.id=skraning.event 
    AND 
      vidburdur.slug = $1;
    `;

  const errors = [];
  const formData = [];

  try {
    const rows = await list(sql, slug); 
    const rowsUser = await list(sqlUser, slug); 

    res.render('vidburd', {errors, title, events : rows, users : rowsUser, formData });
  }
  catch(e){
    console.error(e); 
  }
}

/**     
 *  GET 
 */
async function adminLogin(req, res){
  const message = [];

  const errors = []; 

  res.render('login', {errors, message, title: 'Innskráningu stjóranda - Umsjón'});
} 

/**     
 *  GET 
 */
async function adminSlug(req, res){
  const sluq = [req.params.slug];

  const sql = `
    SELECT 
      *
    FROM 
      vidburdur 
    WHERE 
      vidburdur.slug = $1;
  `;

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

/**     
 *  GET 
 */
async function adminGet(req, res){
  const title = 'Viðburðasíðan - Umsjón';

  const sqlVidburdur = `
    SELECT * FROM 
      vidburdur;
    `;
  
  const rows = await list(sqlVidburdur);

  const errors = [];
  
  const formData = [];

  res.render('admin', {errors, title, formData, events : rows });
}

/**
 *  POST  
 */
async function adminPost(req, res){
  const title = 'Viðburðasíðan - Umsjón';

  const sqlVidburdur = `
    SELECT * FROM 
      vidburdur;
    `;
  
  const rows = await list(sqlVidburdur);

  const errors = [];
  
  const formData = [];

  res.render('admin', {errors, title, formData, events : rows });
}

/**
 *  POST  
 */
async function indexSlugPost(req, res){
  
  const user = [req.body.name, req.body.comment, req.body.id];

  const sql = `
    INSERT INTO 
      skraning(name, comment, event) 
    VALUES($1, $2, $3);
  `;

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

  return success;
}

/**
 *  POST  
 */
async function adminVidburdurPost(req, res){
  const info = [req.body.name, req.body.name, req.body.comment];
  
  let success = true;   
  
  const sql = `
    INSERT INTO 
      vidburdur(name, slug, description) 
    VALUES($1, $2, $3);
  `;

  try {
    success = insert(sql, info);
  }
  catch(e){
    console.error(e); 
  }

  if(success){
    return res.redirect('/');
  }

  return success;
}

/**
 *  POST  
 */
async function adminSlugPost(req, res){
  const title = 'Viðburðasíðan - Umsjón';

  const info = [req.body.name, req.body.comment, req.body.slug];
  
  let success = true; 
  
  const sql = `
    UPDATE 
      vidburdur 
    SET 
      name = $1, description = $2 
    WHERE 
      vidburdur.slug = $3;
  `;
  
  try {
    success = update(sql, info);
  }
  catch(e){
    console.error(e);
  }

  if(success){
    const sqlVidburdur = `
      SELECT * FROM 
        vidburdur;
      `;
  
    const rows = await list(sqlVidburdur);

    const errors = [];
  
    const formData = [];
    
    res.render('admin', {errors, title , formData, events : rows });
  }
  else {
    return res.redirect('/');
  }

  return success; 
}

/**
 *  GET  
 */
indexRouter.get('/', catchErrors(indexRoute));
indexRouter.get('/:slug', catchErrors(indexSlug));
indexRouter.get('/admin', catchErrors(adminGet));
indexRouter.get('/admin/login', catchErrors(adminLogin));
indexRouter.get('/admin/:slug', catchErrors(adminSlug));
indexRouter.get('/admin/logout', (req, res) => { 
  req.logout(); 
  res.redirect('/'); 
});

/**
 *  POST  
 */
indexRouter.post('/admin', 
    vidburdMiddleware, 
    catchErrors(vidburdCheck), 
    catchErrors(adminVidburdurPost));

indexRouter.post('/admin/login', 
    adgangMiddleware, 
    catchErrors(adgangCheck), 
    catchErrors(adminPost));

indexRouter.post('/admin/:slug', 
  vidburdMiddleware, 
  catchErrors(updateCheck), 
  catchErrors(adminSlugPost));

indexRouter.post('/:slug', 
  userMiddleware, 
  catchErrors(userCheck),
  catchErrors(indexSlugPost));