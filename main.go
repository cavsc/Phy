package main

import (
	"Phy/routers"
	"io"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	gin.DisableConsoleColor()
	file, _ := os.Create("access.log")
	gin.DefaultWriter = io.MultiWriter(file)
	router := routers.InitRouter()
	//静态资源
	router.Static("/static", "./static")
	router.Run(":8081")
}
