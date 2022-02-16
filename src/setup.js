import { promises } from 'fs';
import { query, end } from './lib/db_psql.js';

const schemaFile = './sql/schema.sql';
const insertFile = './sql/insert.sql';
const dropfile = './sql/drop.sql';

/**
 *   CREATE 
 */
async function create() {
  let client; 

  const data = await promises.readFile(schemaFile);
  
  try {
    const result = await query(data.toString('utf-8'));
    console.info('Schema created');
  }

  catch(e){
    console.error('Error creating: ', e);
  }

  //await end();
  
}


/**
 *  INSERT
 */
async function insert() {
  let client; 

  const data = await promises.readFile(insertFile); 
  
  try {
    const result = await query(data.toString('utf-8'));
  }

  catch(e){
    console.error('Error inserting: ', e);
  }

  await end();
  
  console.info('File inserted');
}

/**
 *   DROP 
 */
async function eyda() {
  let client; 

  const eydaData = await promises.readFile(dropfile);
  
  try {
    const result = await query(eydaData.toString('utf-8'));
  }

  catch(e){
    console.error('Error droping: ', e);
  }

  await end();
  
  console.info('All tables dropped');
}

/*
eyda().catch((err) => {
  console.error('Error drop file', err);
});

create().catch((err) => {
  console.error('Error inserting schema', err);
});

insert().catch((err) => {
  console.error('Error inserting file', err);
});
/*