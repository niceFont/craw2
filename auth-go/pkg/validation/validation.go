package validation

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func GetValidator() *validator.Validate {
	validate = validator.New()

	return validate
}

func RespondWithErr(ctx *gin.Context, err error) {
	for _, err := range err.(validator.ValidationErrors) {

		fmt.Println(err.Namespace())
		fmt.Println(err.Field())
		fmt.Println(err.StructNamespace())
		fmt.Println(err.StructField())
		fmt.Println(err.Tag())
		fmt.Println(err.ActualTag())
		fmt.Println(err.Kind())
		fmt.Println(err.Type())
		fmt.Println(err.Value())
		fmt.Println(err.Param())
		fmt.Println()
	}
	ctx.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request"})
}
