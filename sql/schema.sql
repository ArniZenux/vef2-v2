-- Útfæra schema
CREATE TABLE IF NOT EXISTS vidburdur(
  id serial primary key,
  name varchar(64) not null,
  slug varchar(64) not null unique,
  description varchar(400),
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone not null default current_timestamp
);

CREATE TABLE IF NOT EXISTS skraning(
  id serial primary key,
  name varchar(64) not null,
  comment varchar(64) not null unique,
  event varchar(400),
  created timestamp with time zone not null default current_timestamp,
);