package middleware

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type WrappedError interface {
	GetStatus() int
	Error() string
}

type ClientError struct {
	Status int
	Err    error
}

type ApplicationError struct {
	Status int
	Err    error
}

func (c ClientError) GetStatus() int {
	return c.Status
}

func (c ClientError) Error() string {
	return c.Err.Error()
}
func (a ApplicationError) Error() string {
	return a.Err.Error()
}
func (a ApplicationError) GetStatus() int {
	return a.Status
}

func WrapClientError(e error, status int) ClientError {
	return ClientError{
		Status: status,
		Err:    e,
	}
}

func WrapAppError(e error) ApplicationError {
	return ApplicationError{
		Status: http.StatusInternalServerError,
		Err:    e,
	}
}

func Error() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Next()

		err := ctx.Errors.Last()

		if err == nil {
			return
		}
		fmt.Println(ctx.Writer.Header().Get("Status"))
		fmt.Println(ctx.Writer.Status())
	}
}
