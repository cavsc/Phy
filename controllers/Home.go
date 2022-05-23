package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Home(c *gin.Context) {
	//返回html
	// tmpl,err := template.ParseFiles('views/temp')
	c.HTML(http.StatusOK, "user/home.html", gin.H{"title": "Home"})
}
