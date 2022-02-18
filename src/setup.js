import { promises } from 'fs';
import { query, end } from './lib/db_psql.js';

const schemaFile = './sql/schema.sql';
const insertFile = './sql/insert.sql';
const dropfile = './sql/drop.sql';

/**
 *   CREATE, INSERT and DROP.
 */
async function makeAll() {

  const schemadata = await promises.readFile(schemaFile);
  const insertdata = await promises.readFile(insertFile); 
  const dropData = await promises.readFile(dropfile);
    
  try {
    const result = await query(dropData.toString('utf-8'));
    console.info('Table dropped');
  }

  catch(e){
    console.error('Error droping: ', e);
  }

  try {
    const result = await query(schemadata.toString('utf-8'));
    console.info('Schema created');
  }

  catch(e){
    console.error('Error creating: ', e);
  }

  try {
    const result = await query(insertdata.toString('utf-8'));
    console.info('Inserted file');
  }
  catch(e){
    console.error('Error inserting: ', e);
  }

  await end();
  
  console.info('All files are inserted');
}

makeAll().catch((err) => {
  console.error('Error inserting schema', err);
});
