FROM golang:latest

# Set go bin which doesn't appear to be set already.
ENV GOBIN /go/bin

# build directories
RUN mkdir /app
RUN mkdir /go/src/app
ADD goWsRelay/ /go/src/app
WORKDIR /go/src/app

# Go dep!
RUN go get -u github.com/golang/dep/...
RUN dep ensure

# Build my app
RUN go build -o /app/main .

EXPOSE 12345

CMD ["/app/main"]