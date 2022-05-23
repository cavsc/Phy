package controllers

import (
	"Phy/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SearchRes(c *gin.Context) {
	searchInfo := c.Param("searchInfo")
	sqls := "select * from db_table where UniprotId='" + searchInfo + "'"
	res, err := utils.Query(sqls)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error"})
	}
	c.JSON(http.StatusOK, gin.H{
		"data": res,
	})

}

func Search(c *gin.Context) {
	_, ok := c.GetQuery("searchInfo")
	if !ok {
		c.HTML(http.StatusOK, "user/search.html", gin.H{"title": "Search"})
	} else {
		SearchRes(c)
	}
}
