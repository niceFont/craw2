package utils

import (
	"crypto/sha1"
	"encoding/base64"
	"math/rand"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func ComparePasswords(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func GenerateHash() (string, error) {
	hasher := sha1.New()
	bytes := make([]byte, 32)
	rand.Read(bytes)
	_, err := hasher.Write(bytes)
	if err != nil {
		return "", err
	}
	final := base64.URLEncoding.EncodeToString(hasher.Sum(nil))
	return final, err
}
