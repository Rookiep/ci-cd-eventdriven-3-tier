FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy frontend app
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

EXPOSE 80