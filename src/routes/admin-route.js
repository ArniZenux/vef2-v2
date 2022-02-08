import express from 'express';

import { catchErrors } from '../lib/catch-errors.js';
import { list } from '../lib/db_psql.js';

export const adminRouter = express.Router();

async function adminRoute(){

  const errors = [];

  const events = []; 

  res.render('admin', {errors, title: 'Viðburðasíðan', events});
}

adminRouter.get('/', catchErrors(adminRoute));
