# escape=`

#Base Image from Microsoft
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

#Enviornment Variables
ENV ASPNETCORE_URLS="http://*:5000"
ENV ASPNETCORE_ENVIRONMENT="Development"

#set up a directory in container
WORKDIR /scr

#copy sourceCode to /src folder on container
COPY SignalRBasicSetup.WebAPI/ .

#restore nuget packages -- #RUN: Used to execute a command during the build process of the docker image
RUN dotnet restore

#Build the app
RUN dotnet build

#Expose Port
EXPOSE 5000

#Run the app
ENTRYPOINT [ "dotnet", "run" ]

#docker image build -t signalrbasicsetup .
#docker run -d --rm --name signalrbasicsetup -p 5000:5000 signalrbasicsetup


##Retag and push to dockerhub
#docker tag signalrbasicsetup jawadhasanshani/signalrbasicsetup
#docker push jawadhasanshani/signalrbasicsetup

#docker image build -t jawadhasanshani/signalrbasicsetup:v2


#aws lightsail push-container-image --region eu-central-1 --service-name signalrbasicsetup --label signalrbasicsetup --image signalrbasicsetup