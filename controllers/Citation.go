package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Citation(c *gin.Context) {
	c.HTML(http.StatusOK, "user/citation.html", gin.H{"title": "Citation"})
}
