import express from 'express';

import { catchErrors } from '../lib/catch-errors.js';
import { list } from '../lib/db_psql.js';

export const indexRouter = express.Router();

async function indexRoute(req, res) {
  //const events = await listEvents();

  const events = []; 

  res.render('index', {
    title: 'Viðburðasíðan',
    events,
  });
}

async function indexSlug(){

}

async function adminRoute(){

}

async function adminLogin(){

}

async function adminSlug(){

}

async function indexSlugPost(){

}

async function adminPost(){

}

async function adminSlugPost(){

}

/**********/
//   GET   /
/**********/
indexRouter.get('/', catchErrors(indexRoute));
indexRouter.get('/:slug', catchErrors(indexSlug));
indexRouter.get('/admin', catchErrors(adminRoute));
indexRouter.get('/admin/login', catchErrors(adminLogin));
indexRouter.get('/admin/:slug', catchErrors(adminSlug));

/**********/
//  POST   /
/**********/
indexRouter.post('/:slug', catchErrors(indexSlugPost));
indexRouter.post('/admin', catchErrors(adminPost));
indexRouter.post('/admin/:slug', catchErrors(adminSlugPost));
