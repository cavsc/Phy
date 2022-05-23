package controllers

import (
	"Phy/utils"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InitBrowse(c *gin.Context) {
	index := c.Query("uniprotId")
	site := c.Query("site")
	sqls := "select * from db_table where UniProtId='" + index + "' and site='" + site + "'"
	res, err := utils.Query(sqls)
	// _, res = utils.queryshit(sql)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error"})
	} else {
		data, _ := json.Marshal(res)
		c.JSON(http.StatusOK, gin.H{"data": data})
	}
}

func Browse(c *gin.Context) {
	//返回html
	_, ok := c.GetQuery("uniprotId")
	if !ok {
		c.HTML(http.StatusOK, "user/browse.html", gin.H{"title": "browse"})
	} else {
		InitBrowse(c)
	}
}
