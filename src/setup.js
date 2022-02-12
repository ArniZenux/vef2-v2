import { promises } from 'fs';
import { query, end } from './lib/db_psql.js';

const schemaFile = './sql/schema.sql';

async function create() {
  let client; 

  const data = await promises.readFile(schemaFile);
  
  try {
    const result = await query(data.toString('utf-8'));
  }

  catch(e){
    console.error('Error inserting: ', e);
  }

  finally{
    client.release(); 
  }
  
  await end();
  
  console.info('Schema data created');
}

create().catch((err) => {
  console.error('Error creating schema', err);
});
