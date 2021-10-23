package database

import (
	"database/sql"
	"fmt"
	"sync"

	_ "github.com/go-sql-driver/mysql"
)

const (
	username = "root"
	password = "12345"
	hostname = "127.0.0.1:3306"
	dbname   = "craw"
)

var Conn *sql.DB

func ConnectDB(wg *sync.WaitGroup) {
	defer wg.Done()
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8", username, password, hostname, dbname)
	var err error
	Conn, err = sql.Open("mysql", dsn)
	if err != nil {
		panic(err)
	}
}
