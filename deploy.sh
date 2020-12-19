docker build -t hieple/multi-client:latest -t hieple/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t hieple/multi-server:latest -t hieple/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t hieple/multi-worker:latest -t hieple/multi-worker:$SHA -f ./worker/Dockerfile ./worker

docker push hieple/multi-client:latest
docker push hieple/multi-server:latest
docker push hieple/multi-worker:latest

kubectl apply -f k8s