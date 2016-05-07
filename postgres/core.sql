CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE users (
  id serial primary key,
  created_on timestamp not null default now(),
  email citext unique not null,
  email_verified boolean not null default false,
  user_terms_accepted_on timestamp,
  password text,
  first_name citext,
  last_name citext,
  phone_number citext,
  auth_method citext,
  auth_data json,
  reset_password_token text unique,
  email_verify_token text unique,
  reset_password_token_expires timestamp,
  note citext
);