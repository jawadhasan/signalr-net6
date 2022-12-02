# SignalR .NET6 Basic Setup

## FrontEnd
This project contains Web Client (HTML/JS/CSS)

## nodeSignalR
Nodejs client demo

## SignalRBasicSetup
SignalR HUB (Server/WebAPI)



# Instructions

- Online Demo at https://signalrchat.awsclouddemos.com/

## Docker - From DockerHUB

- docker pull jawadhasanshani/signalrbasicsetup
- docker run -d --rm --name signalrbasicsetup -p 5000:5000 jawadhasanshani/signalrbasicsetup

## Docker - to run locally

- docker image build -t signalrbasicsetup .
- #docker run -d --rm --name signalrbasicsetup -p 5000:5000 signalrbasicsetup

## FrontEnd
- update SignalR-ConnectionURL in index.js to point to backend.
- npm install
- npm run dev

[Production]
- npm run build (to build artifacts-->dist folder)


##AWS Deployment


- lightsail container-service to host .NET backend (docker container)

prompt>>aws lightsail push-container-image --region eu-central-1 --service-name container-service-1 --label signalrbasicsetup --image signalrbasicsetup

- S3 for static content (frontend)

from dist folder>> aws s3 sync . s3://signalrchat.awsclouddemos.com --acl public-read