# Pitch Deck Uploader

[![JS tests](https://github.com/jdlubrano/pitch-deck-uploader/actions/workflows/js_test.yml/badge.svg)](https://github.com/jdlubrano/pitch-deck-uploader/actions/workflows/js_test.yml)
[![RSpec](https://github.com/jdlubrano/pitch-deck-uploader/actions/workflows/rspec.yml/badge.svg)](https://github.com/jdlubrano/pitch-deck-uploader/actions/workflows/rspec.yml)

## Overview

This Rails-React application allows a user to upload a PDF version of their
investor pitch deck and converts the slides into PNG images (one image per
page).

* [Usage Guide](https://github.com/jdlubrano/pitch-deck-uploader/wiki/Usage-Guide-Walkthrough)
* [Architecture Notes](https://github.com/jdlubrano/pitch-deck-uploader/wiki/Architecture-Notes)

## System Dependencies

* Ruby 3.0.1 ([installing with rvm](https://rvm.io/rvm/install))
* [Postgres 9.6+](https://www.postgresql.org/download/)
* NodeJS 14 ([installing with nvm](https://github.com/nvm-sh/nvm))
* ImageMagick (see below)

### Installing ImageMagick

On Ubuntu

```
apt-get update
apt-get install imagemagick ghostscript
```

On Mac (OSX)

```
brew install imagemagick ghostscript
```

## Setup

```
# Set up environment
nvm use
./bin/setup

# Run tests to verify setup
bundle exec rspec
yarn test
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
