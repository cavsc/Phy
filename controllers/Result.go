package controllers

import (
	"Phy/utils"
	"bufio"
	"fmt"
	"io"
	"math"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/fatih/structs"
	"github.com/gin-gonic/gin"
)

func typeof(v interface{}) string {
	return fmt.Sprintf("%T", v)
}

func buttonInfo(pageNumber int) (html string) {
	if pageNumber > 5 {
		html += "<li class='page-item disabled'><span class='page-link'>&lt;</span></li>"
		html += "<li class='page-item active'><span class='page-link'>1</span></li>"
		html += "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='2'>2</a></li>"
		html += "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='3'>3</a></li>"
		html += "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='4'>4</a></li>"
		html += "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='5'>5</a></li>"
		if pageNumber > 10 {
			html += "<li class='page-item disabled'><span class='page-link'>...</span></li>"
			html += "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='" + string(pageNumber-4) + "'>" + string(pageNumber-4) + "</a></li>"
			html += "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='" + string(pageNumber-3) + "'>" + string(pageNumber-3) + "</a></li>"
			html += "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='" + string(pageNumber-2) + "'>" + string(pageNumber-2) + "</a></li>"
			html += "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='" + string(pageNumber-1) + "'>" + string(pageNumber-1) + "</a></li>"
			html += "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='" + string(pageNumber) + "'>" + string(pageNumber) + "</a></li>"
		} else {
			html += "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='" + string(pageNumber) + "'>" + string(pageNumber) + "</a></li>"
		}
		html += "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='2'>&gt;</a></li>"
	} else if pageNumber == 1 {
		html += "<li class='page-item disabled'><span class='page-link'>&lt;</span></li><li class='page-item active'><span class='page-link'>1</span></li><li class='page-item'><span class='page-link'>&gt;</span></li>"
	} else {
		html += "<li class='page-item disabled'><span class='page-link'>&lt;</span></li>"
		html += "<li class='page-item active'><span class='page-link'>1</span></li>"
		for i := 2; i <= pageNumber; i++ {
			html += "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='" + strconv.Itoa(i) + "'>" + strconv.Itoa(i) + "</a></li>"
		}
		html += "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='2'>&gt;</a></li>"
	}
	return html
}

func resFile(c *gin.Context) {
	rawdata := c.PostForm("rawdata")
	var data map[string]interface{}
	data = make(map[string]interface{})
	rawdata_split := strings.Split(rawdata, "|")
	proteinId := rawdata_split[0]
	site := rawdata_split[1]
	id := rawdata_split[2]
	filePath := "data/" + proteinId + "#" + site + ".txt"
	fmt.Println(filePath)
	file, err := os.Open(filePath)
	if err != nil {
		fmt.Println("open file error")
	}
	defer file.Close()
	reader := bufio.NewReader(file)

	var scores map[string][]interface{}
	var exp map[string][]interface{}
	var expre map[string][]interface{}
	var cptac map[string][]interface{}
	var qptm map[string][]interface{}

	scores = make(map[string][]interface{})
	qptm = make(map[string][]interface{})
	expre = make(map[string][]interface{})
	cptac = make(map[string][]interface{})
	exp = make(map[string][]interface{})
	for {
		str, err := reader.ReadString('\n')
		if err == io.EOF {
			break
		}
		str = strings.Trim(str, "\n")
		// str = strings.Trim(str, "\t")

		str_splice := strings.Split(str, "\t")

		if str_splice[1] != "N/A" {
			scores[str_splice[0]] = append(scores[str_splice[0]], str_splice[1])
		}
		if str_splice[2] != "N/A" {
			exp[str_splice[0]] = append(exp[str_splice[0]], str_splice[2])
		}
		if str_splice[3] != "N/A" {
			qptm[str_splice[0]] = append(qptm[str_splice[0]], str_splice[3])
		}
		if str_splice[4] != "N/A" {
			// fmt.Println(str_splice[4])
			expre[str_splice[0]] = append(expre[str_splice[0]], str_splice[4])
		}
		if str_splice[5] != "N/A" && str_splice[5] != "" {
			cptac[str_splice[0]] = append(cptac[str_splice[0]], str_splice[5])
		}
	}
	data["id"] = id
	data["exp"] = exp
	data["scores"] = scores
	data["co_expre"] = expre
	data["qptm"] = qptm
	data["cptac"] = cptac

	c.JSON(http.StatusOK, data)
}

func changeResTable(c *gin.Context) {
	newQueryInfo := c.PostForm("newQueryInfo")
	orderInfos := c.PostForm("orderInfos")

	rowNumber := c.PostForm("rowNumber")
	pageNumber := c.PostForm("pageNumber")
	pNum, _ := strconv.Atoi(pageNumber)
	rNum, _ := strconv.Atoi(rowNumber)
	begin := (pNum - 1) * rNum
	end := pNum * rNum

	sql_c := "select count(*) from proteins where " + newQueryInfo
	sqls := "select * from proteins where " + newQueryInfo + " order by " + orderInfos + " limit " + strconv.Itoa(begin) + "," + strconv.Itoa(rNum)

	count, _ := utils.QueryCount(sql_c)
	res, err := utils.Query(sqls)

	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error"})
	} else {
		// fmt.Println(res)
		var ret map[string]interface{}
		ret = make(map[string]interface{})

		var data map[int]interface{}
		data = make(map[int]interface{})
		for k, _ := range res {
			data[k] = structs.Map(&res[k])
		}

		ret["data"] = data
		ret["count"] = count
		ret["begin"] = begin
		ret["end"] = end
		allPageNumber := float64(count) / float64(rNum)

		ret["allPageNumber"] = math.Ceil(float64(allPageNumber))
		c.JSON(http.StatusOK, ret)
	}
}

func simpleSearch(c *gin.Context) {
	queryinput := c.PostForm("simple_search_input0")
	tag := c.PostForm("simple_search_tag0")
	sqls := "select * from proteins where " + tag + "='" + queryinput + "' limit 10"
	sql_c := "select count(*) from proteins where " + tag + "='" + queryinput + "'"
	count, err := utils.QueryCount(sql_c)
	res, err := utils.Query(sqls)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error"})
	} else {
		var data map[int]interface{}
		data = make(map[int]interface{})
		for k, _ := range res {
			data[k] = structs.Map(&res[k])
		}
		rawQuerInfos := tag + "='" + queryinput + "'"
		showSearchStr := "Search content: Uniprot Id =" + queryinput + ";"
		allPageNumber := float64(count) / float64(10)
		pageNumber := math.Ceil(allPageNumber)

		var pagelist []interface{}
		flag := 0
		if pageNumber > 5 {
			if pageNumber > 10 {
				flag = 4
				for i := pageNumber; i > pageNumber-5; i++ {
					pagelist = append(pagelist, i)
				}
			} else {
				flag = 3
			}

		} else if pageNumber == 1 {
			flag = 1
		} else {
			flag = 2
			for i := 2; i <= int(pageNumber); i++ {
				pagelist = append(pagelist, i)
			}
		}

		begin := 0
		end := 0
		if count < 10 && count > 0 {
			begin = 1
			end = count
		} else if count > 0 {
			begin = 1
			end = 10
		}
		c.HTML(http.StatusOK, "user/result.html", gin.H{"title": "Result", "data": data, "rawQueryInfos": rawQuerInfos, "showSearchStr": showSearchStr, "pageNumber": pageNumber, "pagelist": pagelist, "flag": flag, "count": count, "begin": begin, "end": end})
	}
}

func advanceSearch(c *gin.Context) {
	c.Request.ParseForm()
	keys := make(map[string][]string)
	input_index := make(map[string][]string)
	showSearchStr := "Search content: "

	for key, valueArray := range c.Request.PostForm {
		if key != "simple_search_input0" && strings.Contains(key, "simple_search_input") {
			input_index["input"] = append(input_index["input"], key[19:])
		}
		keys[key] = valueArray
	}
	fmt.Println(input_index["input"])
	query_sql := "select * from proteins where "
	query_count := "select count(*) from proteins where "

	var common string
	if keys["simple_search_tag0"][0] == "Context" {
		common = " ( uniprotId like '%" + keys["simple_search_input0"][0] + "%' or genename like '%" + keys["simple_search_input0"][0] + "%' or proteinname '%" + keys["simple_search_input0"][0] + "'%) "

	} else {
		common = "(" + keys["simple_search_tag0"][0] + " like '%" + keys["simple_search_input0"][0] + "%') "
	}

	showSearchStr += keys["simple_search_tag0"][0] + " = " + keys["simple_search_input0"][0] + " "

	for obj := range input_index["input"] {
		if len(keys["simple_search_input"+input_index["input"][obj]]) != 0 {
			// query_sql += keys["simple_search_link"+input_index["input"][obj]][0] + " (" + keys["simple_search_tag"+input_index["input"][obj]][0] + " like '%" + keys["simple_search_input"+input_index["input"][obj]][0] + "%') "
			// query_count += keys["simple_search_link"+input_index["input"][obj]][0] + " (" + keys["simple_search_tag"+input_index["input"][obj]][0] + " like '%" + keys["simple_search_input"+input_index["input"][obj]][0] + "%') "
			// fmt.Println(keys["simple_search_tag"+input_index["input"][obj]][0])
			strings.Trim(keys["simple_search_input"+input_index["input"][obj]][0], " ")
			if keys["simple_search_input"+input_index["input"][obj]][0] == "" {
				continue
			} else if keys["simple_search_tag"+input_index["input"][obj]][0] == "Context" {
				common += keys["simple_search_link"+input_index["input"][obj]][0] + " ( uniprotId like '%" + keys["simple_search_input"+input_index["input"][obj]][0] + "%' or genename like '%" + keys["simple_search_input"+input_index["input"][obj]][0] + "%' or proteinname '%" + keys["simple_search_input"+input_index["input"][obj]][0] + "'%) "
				showSearchStr += keys["simple_search_link"+input_index["input"][obj]][0] + " " + keys["simple_search_tag"+input_index["input"][obj]][0] + " = " + keys["simple_search_input"+input_index["input"][obj]][0] + " "
			} else {
				common += keys["simple_search_link"+input_index["input"][obj]][0] + " (" + keys["simple_search_tag"+input_index["input"][obj]][0] + " like '%" + keys["simple_search_input"+input_index["input"][obj]][0] + "%') "
				showSearchStr += keys["simple_search_link"+input_index["input"][obj]][0] + " " + keys["simple_search_tag"+input_index["input"][obj]][0] + " = " + keys["simple_search_input"+input_index["input"][obj]][0] + " "
			}
		}
	}
	query_sql += common
	query_count += common
	fmt.Println(query_sql)
	fmt.Println(query_count)
	showSearchStr += ";"
	fmt.Println(showSearchStr)

	query_sql += " limit 10 "
	res, err := utils.Query(query_sql)
	count, _ := utils.QueryCount(query_count)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error"})
	} else {
		var data map[int]interface{}
		data = make(map[int]interface{})
		for k, _ := range res {
			data[k] = structs.Map(&res[k])
		}

		allPageNumber := float64(count) / float64(10)
		pageNumber := math.Ceil(allPageNumber)

		var pagelist []interface{}
		flag := 0
		if pageNumber > 5 {
			if pageNumber > 10 {
				flag = 4
				for i := pageNumber; i > pageNumber-5; i++ {
					pagelist = append(pagelist, i)
				}
			} else {
				flag = 3
			}
		} else if pageNumber == 1 {
			flag = 1
		} else if pageNumber == 0 {
			flag = 0
		} else {
			flag = 2
			for i := 2; i <= int(pageNumber); i++ {
				pagelist = append(pagelist, i)
			}
		}
		begin := 0
		end := 0
		if count < 10 && count > 0 {
			end = count
		} else if count > 0 {
			begin = 1
			end = 10
		}
		c.HTML(http.StatusOK, "user/result.html", gin.H{"title": "Result", "data": data, "rawQueryInfos": common, "showSearchStr": showSearchStr, "pageNumber": pageNumber, "pagelist": pagelist, "flag": flag, "begin": begin, "end": end, "count": count})
	}
}

func Result(c *gin.Context) {
	loadtype := c.PostForm("type")
	fmt.Println(c.Request.Header)
	if loadtype == "queryfile" {
		resFile(c)
	} else if loadtype == "changeRes" {
		changeResTable(c)
	} else if loadtype == "advance" {
		advanceSearch(c)
	} else {
		simpleSearch(c)
	}
}
