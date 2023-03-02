create database bankofamerica;

create table bankmanager (
id serial primary key not null,
name text not null,
agency integer not null,
password text not null
);

select * from deposit;

create table bankuser(
id serial primary key not null,
name text not null,
cpf varchar(11),
birth_date date,
cellphone integer,
email text not null unique,
password text not null
);

alter table bankuser add column balance integer;

create table deposit(
deposit_date date,
account_number integer references bankuser(id),
value integer not null
);

create table transfer(
account_destination integer references bankuser(id),
account_origin integer references bankuser(id),
value integer not null
);

alter table deposit add column id serial primary key;

alter table transfer add column id serial primary key;

create table withdraw(
id serial primary key,
account_origin integer references bankuser(id),
value integer not null
);