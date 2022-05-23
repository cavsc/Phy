package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func About(c *gin.Context) {
	c.HTML(http.StatusOK, "user/about.html", gin.H{"title": "About"})
}
