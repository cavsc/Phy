package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Download(c *gin.Context) {
	c.HTML(http.StatusOK, "user/download.html", gin.H{"title": "Download"})
}
