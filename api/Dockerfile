FROM golang:1.17 as base

RUN mkdir -p $$GOPATH/bin && \
    go get github.com/pilu/fresh

COPY . /app

WORKDIR /app

RUN go get -d -v ./...

WORKDIR /app/cmd/server

EXPOSE 8080

FROM base as prod
CMD [ "go", "run", "/app/cmd/server/main.go"]

FROM base as dev
CMD [ "fresh" ]