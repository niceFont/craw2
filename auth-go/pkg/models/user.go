package models

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/nicefont/auth-go/pkg/database"
	"github.com/nicefont/auth-go/pkg/utils"
	"github.com/nicefont/auth-go/pkg/validation"
)

var rctx = context.Background()

type LoginReq struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type RegisterReq struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
}

type Session struct {
	Username string `json:"Username"`
	Email    string `json:"Password"`
	Id       string `json:"Id"`
}

func Register(ctx *gin.Context) {
	var body RegisterReq
	id, err := uuid.New().MarshalBinary()
	if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, errors.New("bad request"))
		return
	}

	validate := validation.GetValidator()
	if err := validate.Struct(body); err != nil {
		validation.RespondWithErr(ctx, err)
		return
	}

	hash, err := utils.HashPassword(body.Password)
	if err != nil {
		fmt.Println(err)
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	stmt, err := database.Conn.Prepare("INSERT INTO users(id, username, email, password) VALUES(?, ?, ?, ?);")
	if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	_, err = stmt.Exec(id, body.Username, body.Email, hash)
	if err != nil {
		fmt.Println(err)
		if strings.Contains(err.Error(), "Duplicate entry") {
			ctx.AbortWithError(http.StatusConflict, errors.New("already exists"))
		} else {
			ctx.AbortWithError(http.StatusInternalServerError, err)
		}
		return
	}

	ctx.Status(204)
}

func Login(ctx *gin.Context) {
	var body LoginReq

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, errors.New("bad request"))
		return
	}

	validate := validation.GetValidator()
	if err := validate.Struct(body); err != nil {
		validation.RespondWithErr(ctx, err)
		return
	}

	var id, hash, username, email string
	err := database.Conn.QueryRow("SELECT BIN_TO_UUID(id), email, username, password FROM users WHERE username=?", body.Username).Scan(&id, &email, &username, &hash)

	switch {
	case err == sql.ErrNoRows:
		ctx.AbortWithError(http.StatusUnauthorized, errors.New("unauthorized"))
		return
	case err != nil:
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	if same := utils.ComparePasswords(body.Password, hash); !same {
		ctx.AbortWithError(http.StatusUnauthorized, errors.New("unauthorized"))
		return
	}
	slg, err := utils.GenerateHash()
	if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	payload, err := json.Marshal(&Session{
		Username: username,
		Email:    email,
		Id:       id,
	})

	if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	if err := database.RedisClient.SetEX(rctx, slg, payload, 5*time.Minute).Err(); err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.SetCookie("slg", slg, 3600, "/", "localhost", false, true)

	ctx.Status(204)
}

func Me(ctx *gin.Context) {
	cookie, err := ctx.Cookie("slg")

	if err != nil {
		ctx.Error(err)
		return
	}

	fmt.Println(cookie)
	payload, err := database.RedisClient.Get(rctx, cookie).Result()
	if err != nil {
		fmt.Println(err.Error())
		if strings.Contains(err.Error(), "redis: nil") {
			ctx.AbortWithError(http.StatusUnauthorized, errors.New("unauthorized"))
		} else {
			ctx.AbortWithError(http.StatusInternalServerError, err)

		}
		return
	}
	sess := Session{}
	err = json.Unmarshal([]byte(payload), &sess)
	if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	ctx.JSON(http.StatusOK, sess)
}
