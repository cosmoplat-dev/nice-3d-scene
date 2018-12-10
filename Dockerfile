FROM registry.cosmoplat.com/cosmoplat/nginx

MAINTAINER liuan@haier.com

RUN rm -rf /usr/share/nginx/html/*

ADD . /usr/share/nginx/html/

