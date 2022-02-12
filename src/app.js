import dotenv from 'dotenv';
import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { indexRouter } from './routes/index-routes.js';

dotenv.config();

const { 
  HOST: hostname = '127.0.0.1',
  PORT: port = 3000, 
} = process.env;

const app = express();

app.use(express.urlencoded({ extended: true }));

const path = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(path, '../public')));
app.set('views', join(path, '../views'));
app.set('view engine', 'ejs');

function isInvalid(field, errors = []) {
  return Boolean(errors.find((i) => i && i.param === field));
}

app.locals.isInvalid = isInvalid;

app.use('/', indexRouter);

/**
 * Handler error 
 */
function notFounderHandler(req, res){
  const title = 'Síða fannst ekki';
  res.status(404).render('error', { title });
}

function errorHandler(err, req, res){
  console.error(err);
  const title = 'Villa kom upp';
  res.status(500).render('error', { title });
}

app.use(notFounderHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});
