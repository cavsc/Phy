package routers

import (
	"Phy/controllers"

	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	router := gin.Default()
	router.LoadHTMLGlob("views/**/*")

	//注册：
	router.GET("/", controllers.Home)
	router.GET("/browse", controllers.Browse)
	// router.GET("/browse/:uniprotId", controllers.InitBrowse) 这是api参数,比如/browse/uniprotid这样子的
	router.GET("/search", controllers.Search)
	// router.GET("/search/:searchInfo", controllers.SearchRes)
	router.POST("/result", controllers.Result)
	router.GET("/about", controllers.About)
	router.GET("/help", controllers.Help)
	router.GET("/download", controllers.Download)
	router.GET("/citation", controllers.Citation)
	return router
}
