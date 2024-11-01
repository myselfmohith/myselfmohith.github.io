# Demo Page for Maga Siyaman

##### This will be page description
###### key1 key2 key2



What is the NGinx 'directive not allowed here' error? I am trying to use NGinx for the first time, and within a Docker container, and I am using example configurations from other websites that seem to be correct configurations, but I get this error, no matter how I configure the nginx.conf file, and I don't know why.

### Section 2

```
2018/03/10 20:52:20 [emerg] 1#1: "user" directive is not allowed 
  here in /etc/nginx/conf.d/nginx.conf:6

nginx: [emerg] "user" directive is not allowed here 
  in /etc/nginx/conf.d/nginx.conf:6
```


The problem is that the template, at least in this official NGINX Docker image, is not meant to be a full config. It's included at the http block at /etc/nginx/nginx.conf file in the image: