CREATE TABLE IF NOT EXISTS vidburdur(
  id serial primary key,
  name varchar(64) not null,
  slug varchar(64) not null,
  description varchar(400),
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone not null default current_timestamp
);

CREATE TABLE IF NOT EXISTS skraning(
  id serial primary key,
  name varchar(64) not null,
  comment varchar(64),
  created timestamp with time zone not null default current_timestamp,
  event integer not null, 
  constraint event
    foreign key(event) 
      references vidburdur(id) 
);

CREATE TABLE IF NOT EXISTS users (
  id serial primary key,
  username character varying(64) NOT NULL,
  password character varying(256) NOT NULL
);

-- Lykilorð: "123"
INSERT INTO users (username, password) VALUES ('admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii');