FROM ubuntu:20.04
WORKDIR /app
COPY . .

RUN apt update -y
RUN apt upgrade -y
RUN apt install curl -y
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g @angular/cli -y
RUN npm install http-server -g
RUN npm install
RUN ng build
CMD ["http-server", "dist/angular-tour-of-heroes"]

