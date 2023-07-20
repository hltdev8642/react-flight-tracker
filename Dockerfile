FROM nginx
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./dist /dist
RUN chown -R nginx:nginx /dist
EXPOSE 8080
LABEL org.opencontainers.image.source=https://gitlab.com/dev6645326/react-flight-tracker
CMD ["nginx", "-g", "daemon off;"]