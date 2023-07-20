FROM nginx
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./dist /dist
RUN chown -R nginx:nginx /dist
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]