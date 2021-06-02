FROM ruby:3.0.1

WORKDIR /app
VOLUME /app/log

SHELL ["/bin/bash", "--login", "-c"]

RUN apt-get update && apt-get install -y curl postgresql-client
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

COPY .nvmrc /app/

RUN nvm install `cat .nvmrc`
RUN nvm use

# Install Yarn
RUN  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
     echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
     apt-get update && \
     apt-get install --no-install-recommends yarn

COPY Gemfile Gemfile.lock /app/

RUN bundle install --jobs 4 --retry 2

COPY . /app

EXPOSE 3000

CMD ["bundle exec", "rails", "server", "-b", "0.0.0.0"]
