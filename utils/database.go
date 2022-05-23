package utils

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

var db *sql.DB
var Db *sqlx.DB

func initDB() (err error) {
	db, err := sqlx.Connect("mysql", "root:123456@tcp(127.0.0.1:3306)/GeneBank")
	err2 := db.Ping()
	if err2 != nil {
		fmt.Println(err2)
		return err2
	}
	db.SetMaxOpenConns(20)
	db.SetMaxIdleConns(20)
	Db = db
	return nil
}

type dataStruct struct {
	Id          int    `json:"id" db:"id"`
	UniprotId   string `json:"uniprotId" db:"uniprotId"`
	Site        int    `json:"site" db:"site"`
	Genename    string `json:"genename" db:"genename"`
	Proteinname string `json:"proteinname" db:"proteinname"`
	Seq         string `json:"seq" db:"seq"`
	Func        string `json:"func" db:"func"`
}

func Query(querystr string) (res []dataStruct, err error) {
	err = initDB()
	if err != nil {
		return res, err
	}
	var datastruct []dataStruct
	err2 := Db.Select(&datastruct, querystr)
	if err2 != nil {
		return datastruct, err
	}
	return datastruct, err
}

func QueryCount(querystr string) (count int, err error) {
	err = initDB()
	if err != nil {
		return 0, err
	}
	err2 := Db.Get(&count, querystr)
	fmt.Println(count)
	if err2 != nil {
		return 0, err
	}
	return count, err
}
