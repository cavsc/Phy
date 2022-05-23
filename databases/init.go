package main

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

//数据库配置
const (
	userName = "root"
	password = "123456"
	ip       = "127.0.0.1"
	port     = "3306"
	dbName   = "GeneBank"
)

//Db数据库连接池
var DB *sql.DB

type Pro struct {
	proteinId string
	site      int
}

//注意方法名大写，就是public
func InitDB() {
	//构建连接："用户名:密码@tcp(IP:端口)/数据库?charset=utf8"
	path := strings.Join([]string{userName, ":", password, "@tcp(", ip, ":", port, ")/", dbName, "?charset=utf8"}, "")
	//打开数据库,前者是驱动名，所以要导入： _ "github.com/go-sql-driver/mysql"
	DB, _ = sql.Open("mysql", path)
	//设置数据库最大连接数
	DB.SetConnMaxLifetime(100)
	//设置上数据库最大闲置连接数
	DB.SetMaxIdleConns(10)
	//验证连接
	if err := DB.Ping(); err != nil {
		fmt.Println("open database fail")
		return
	}
	fmt.Println("connnect success")
}

//查询操作
// func Query() {
// 	var user User
// 	rows, e := DB.Query("select * from user where id in (1,2,3)")
// 	if e == nil {
// 		errors.New("query incur error")
// 	}
// 	for rows.Next() {
// 		e := rows.Scan(user.sex, user.phone, user.name, user.id, user.age)
// 		if e != nil {
// 			fmt.Println(json.Marshal(user))
// 		}
// 	}
// 	rows.Close()
// 	DB.QueryRow("select * from user where id=1").Scan(user.age, user.id, user.name, user.phone, user.sex)

// 	stmt, e := DB.Prepare("select * from user where id=?")
// 	query, e := stmt.Query(1)
// 	query.Scan()
// }

// func DeleteUser(user User) bool {
// 	//开启事务
// 	tx, err := DB.Begin()
// 	if err != nil {
// 		fmt.Println("tx fail")
// 	}
// 	//准备sql语句
// 	stmt, err := tx.Prepare("DELETE FROM user WHERE id = ?")
// 	if err != nil {
// 		fmt.Println("Prepare fail")
// 		return false
// 	}
// 	//设置参数以及执行sql语句
// 	res, err := stmt.Exec(user.id)
// 	if err != nil {
// 		fmt.Println("Exec fail")
// 		return false
// 	}
// 	//提交事务
// 	tx.Commit()
// 	//获得上一个insert的id
// 	fmt.Println(res.LastInsertId())
// 	return true
// }

func Insert(protein Pro) bool {
	//开启事务
	tx, err := DB.Begin()
	if err != nil {
		fmt.Println("tx fail")
		return false
	}
	//准备sql语句
	stmt, err := tx.Prepare("INSERT INTO proteins (`proteinId`, `site`) VALUES (?, ?)")
	if err != nil {
		fmt.Println("Prepare fail")
		return false
	}
	//将参数传递到sql语句中并且执行
	res, err := stmt.Exec(protein.proteinId, protein.site)
	if err != nil {
		fmt.Println("Exec fail")
		return false
	}
	//将事务提交
	tx.Commit()
	//获得上一个插入自增的id
	fmt.Println(res.LastInsertId())
	return true
}

func GetFileAndDirs(dirPth string) {
	dir, err := ioutil.ReadDir(dirPth)
	if err != nil {
		fmt.Printf("open dir error")
		return
	}
	for _, fi := range dir {
		// filePath := dirPth + "/" + fi.Name()
		pro_site := strings.Split(fi.Name(), ".")[0]
		proteinId := strings.Split(pro_site, "#")[0]

		site := strings.Split(pro_site, "#")[1]
		var pro Pro
		pro.proteinId = proteinId
		pro.site, _ = strconv.Atoi(site)
		// println(site)
		Insert(pro)
		// file, err := os.Open(filePath)
		// if err != nil {
		// 	fmt.Println("open file error")
		// }
		// defer file.Close()
		// reader := bufio.NewReader(file)
		// for {
		// 	str, err := reader.ReadString('\n')
		// 	if err == io.EOF {
		// 		break
		// 	}
		// 	fmt.Println(str)

		// }
	}
}

func main() {
	InitDB()
	// creatTable()
	GetFileAndDirs("../data")
	defer DB.Close()
}
