FROM registry.cosmoplat.com/cosmoplat/nginx
MAINTAINER ouyang
ADD index.html /usr/share/nginx/html/index.html
ADD cosmoplat /usr/share/nginx/html/cosmoplat