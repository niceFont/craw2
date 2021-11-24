package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nicefont/api/pkg/model"
	"github.com/nicefont/api/pkg/validation"
)

type User struct {
	userModel *model.User
}

type LoginReq struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

func (uc User) Login(ctx *gin.Context) {
	var body LoginReq

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	validate := validation.GetValidator()
	if err := validate.Struct(body); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}
	err := uc.userModel.Login(ctx, body)
	if err != nil {
		ctx.AbortWithError(err.GetStatus(), err)
		return
	}

	ctx.Status(204)
}
func (uc User) Register(ctx *gin.Context) {

}
func (uc User) Me(ctx *gin.Context) {
	err, sess := uc.userModel.GetSession(ctx)

	if err != nil {
		ctx.AbortWithError(err.GetStatus(), err)
		return
	}

	ctx.JSON(http.StatusOK, sess)
}
