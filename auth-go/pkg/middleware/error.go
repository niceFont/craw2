package middleware

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

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
