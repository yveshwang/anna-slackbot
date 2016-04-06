FROM node:5.10
# replace this with your application's default port
COPY . /src
ENV slack_token "anna_slack_token"
ENV dockerhub_path "anna_dockerhub_path"
ENV express_port 3000
ENV slack_webhook_path "anna_slackwebhook_path"
EXPOSE 3000
CMD ["node", "/src/app.js"]
