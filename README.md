# README

## Overview

This Rails-React application allows a user to upload a PDF version of their
investor pitch deck and converts the slides into PNG images (one image per
page).

## System Dependencies

* Ruby 3.0.1 ([installing with rvm](https://rvm.io/rvm/install))
* [Postgres 9.6+](https://www.postgresql.org/download/)
* NodeJS 14 ([installing with nvm](https://github.com/nvm-sh/nvm))

## Setup

### Without Docker

```
./bin/setup
bundle exec rspec
```

### With Docker

This application can also be run with
[Docker Compose](https://docs.docker.com/compose/install/).

```
docker compose build
docker compose run rails bash --login -c "bin/setup"
```

### Postgres Setup

This application assumes the following defaults for Postgres:

```
username: postgres
password: password
```

If you already have a user and password configured for your own Postgres
installation, you can override the defaults by creating a
`.env.local` file and providing your own environment variables:

```
DB_USER=<your username>
DB_PASS=<your password>
```

If you need to add a user to your Postgres installation you can run the
following commands:

```
$ psql
> CREATE USER postgres WITH PASSWORD 'password';
> ALTER USER postgres createdb;
> ALTER USER postgres with SUPERUSER;
```

## Running Locally

I prefer to use [overmind](https://github.com/DarthSim/overmind) for local
development although [foreman](https://github.com/ddollar/foreman) should work
well enough.

```
overmind s -f Procfile.dev
```

or

```
foreman start -f Procfile.dev
```
