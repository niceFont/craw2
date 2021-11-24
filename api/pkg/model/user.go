package model

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
	"github.com/nicefont/api/pkg/controller"
	"github.com/nicefont/api/pkg/middleware"
	"github.com/nicefont/auth-go/pkg/database"
	"github.com/nicefont/auth-go/pkg/middleware"
	"github.com/nicefont/auth-go/pkg/utils"
	"github.com/nicefont/auth-go/pkg/validation"
)

type User struct {
}

var rctx = context.Background()

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

func (u User) CreateUser(ctx *gin.Context) {
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

func (u User) Login(ctx *gin.Context, body controller.LoginReq) middleware.WrappedError {

	var id, hash, username, email string
	err := database.Conn.QueryRow("SELECT BIN_TO_UUID(id), email, username, password FROM users WHERE username=?", body.Username).Scan(&id, &email, &username, &hash)

	switch {
	case err == sql.ErrNoRows:
		return middleware.WrapClientError(err, http.StatusUnauthorized)
	case err != nil:
		return middleware.WrapAppError(err)
	}

	if same := utils.ComparePasswords(body.Password, hash); !same {
		return middleware.WrapClientError(err, http.StatusUnauthorized)
	}
	slg, err := utils.GenerateHash()
	if err != nil {
		return middleware.WrapAppError(err)
	}

	payload, err := json.Marshal(&Session{
		Username: username,
		Email:    email,
		Id:       id,
	})

	if err != nil {
		return middleware.WrapAppError(err)
	}

	if err := database.RedisClient.SetEX(rctx, slg, payload, 5*time.Minute).Err(); err != nil {
		return middleware.WrapAppError(err)
	}

	ctx.SetCookie("slg", slg, 3600, "/", "localhost", false, true)

	return nil
}

func (u User) GetSession(ctx *gin.Context) (middleware.WrappedError, *Session) {
	cookie, err := ctx.Cookie("slg")

	if err != nil {
		return middleware.WrapClientError(err, http.StatusUnauthorized), nil
	}

	payload, err := database.RedisClient.Get(rctx, cookie).Result()
	if err != nil {
		fmt.Println(err.Error())
		if strings.Contains(err.Error(), "redis: nil") {
			return middleware.WrapClientError(err, http.StatusUnauthorized), nil
		}
		return middleware.WrapAppError(err), nil
	}
	sess := Session{}
	err = json.Unmarshal([]byte(payload), &sess)
	if err != nil {
		return middleware.WrapAppError(err), nil
	}
	return nil, &sess
}
