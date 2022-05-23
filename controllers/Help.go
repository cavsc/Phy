package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Help(c *gin.Context) {
	c.HTML(http.StatusOK, "user/help.html", gin.H{"title": "Help"})
}
