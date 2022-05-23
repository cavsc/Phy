/**
* Author: Qingfeng Zhang
* Version: 1.0
*/
// Define functions

/*----- Check submit form -----*/
function check_email_form()
{
	if($('#dataset').val()=='')
	{
		alert('Please select the dataset you want to download, thanks.');
		return false;
	}
	if($('#title').val()=='')
	{
		alert('Please select your title, thanks.');
		return false;
	}
	if($('#firstname').val()=='')
	{
		alert('Please input your first name, thanks.');
		return false;
	}
	if($('#lastname').val()=='')
	{
		alert('Please input your last name, thanks.');
		return false;
	}
	if($('#affiliation').val()=='')
	{
		alert('Please input your affiliation, thanks.');
		return false;
	}
	if($('#country').val()=='')
	{
		alert('Please select your country, thanks.');
		return false;
	}
	if($('#email').val()=='')
	{
		alert('Please input your email address, thanks.');
		return false;
	}
	apos=$('#email').val().indexOf("@");
	//alert($('#email').val());
	dotpos=$('#email').val().lastIndexOf(".");
  	if (apos<1||dotpos-apos<1)
	{
		alert('Please input correct email address, thanks.');
		return false;
	}
	if(validated==false){
	    alert('Please pass the verification, thanks.');
	    return false;
	}
	else{
	    addcookie('valid',passTime,5);
	}
}

function addcookie(cname, cvalue, mint) {
  var d = new Date();
  d.setTime(d.getTime() + (mint*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function check_simple_search_form()
{
	if($('#simple_search_input0').val()=='')
	{
		alert('Please input your keyword(s), thanks.');
		return false;
	}
}

function check_advance_search_form()
{
	if($('#simple_search_input0').val()=='')
	{
		alert('The first search row must have keyword(s), thanks.');
		return false;
	}
}

/*----- Home/Search page search example function -----*/
function changeExampleLink(line,link){
	$('#simple_search_link'+line).find("option").prop("selected",false);
	$('#simple_search_link'+line).find("option[value='"+link+"']").prop("selected",true);
}
function changeExampleTag(line,tag){
	$('#simple_search_tag'+line).find("option").prop("selected",false);
	$('#simple_search_tag'+line).find("option[value='"+tag+"']").prop("selected",true);
}
function changeExampleInput(line,keyword){
	$('#simple_search_input'+line).prop('value',keyword);
}
function changeExampleMod(mod){
	$('#simple_search_mod').find("option").prop("selected",false);
	$('#simple_search_mod').find("option[value='"+mod+"']").prop("selected",true);
}
function changeExampleOrg(org){
	$('#simple_search_org').find("option").prop("selected",false);
	$('#simple_search_org').find("option[value='"+org+"']").prop("selected",true);
}

/*----- Get filter part information -----*/
function getFilterInfo(){
	var filterInfos = [];
	$(".filter-div .unselected").each(function(){
		if(!$(this).hasClass('selectedall')){
			var subFilterInfos = [];
			var chooseFilterDiv = $(this).closest('.filter-div');
			var Tag = chooseFilterDiv.attr("value");
			chooseFilterDiv.find(".selected").each(function(){
				subFilterInfos.push(Tag + " = '" + $(this).text() + "'");
			})
			filterInfos.push('(' + subFilterInfos.join(' or ') + ')');
		}
	});
	return filterInfos;
}

/*----- Get search part information -----*/
function getSearchInfo(){
	var searchInfos = [];
	$(".search-line").each(function(){
		if($(this).val() != ''){
			searchInfos.push($(this).attr("name") + " like '%" + $(this).val() + "%'");
		}
	})
	return searchInfos;
}

/*----- Get order information -----*/
function getOrderInfo(){
	var orderTag = '';
	var orderSort = '';
	$('.arrow').each(function(){
		if($(this).hasClass('ri-sort-asc')){
			orderTag = $(this).closest('.arrange').attr('value');
			orderSort = 'asc';
		}
		else if($(this).hasClass('ri-sort-desc')){
			orderTag = $(this).closest('.arrange').attr('value');
			orderSort = 'desc';
		}
	})

	if(orderTag == ''){
		orderInfos = 'uniprotId' +" "+ 'asc';
	}
	else{
		orderInfos = orderTag+' '+orderSort;
	}
	console.log(orderInfos)
	return orderInfos;
}

function showSingleButton(buttonValue,buttonContain,nowPage,allPage){
    if(buttonContain =='<'){
        if(nowPage==1){
            return "<li class='page-item disabled'><span class='page-link'>"+buttonContain+"</span></li>";
        }else{
            return "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='"+(nowPage-1)+"'>"+buttonContain+"</a></li>";
        }
    }else if(buttonContain == '>'){
        if(nowPage == allPage){
          return "<li class='page-item disabled'><span class='page-link'>"+buttonContain+"</span></li>";
        }else{
          return "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='"+(nowPage+1)+"'>"+buttonContain+"</a></li>";
        }
    }else if(buttonContain == '...'){
    	return "<li class='page-item disabled'><span class='page-link'>"+buttonContain+"</span></li>";
	}else{
		if(buttonValue == nowPage){
		return "<li class='page-item active'><span class='page-link'>"+buttonContain+"</span></li>";
		}else{
		return "<li class='page-item'><a class='page-link' href='javascript:void(0)' value='"+buttonValue+"'>"+buttonContain+"</a></li>";
		}
	}
}

function showButtonInfo(allPage,nowPage) {
	console.log(allPage,nowPage)
    var retunButtonInfo = '';
    if(allPage>1){
    retunButtonInfo = retunButtonInfo+"<nav aria-label='Page navigation' class='float-right'><ul class='pagination'>";
    retunButtonInfo = retunButtonInfo+showSingleButton('', '<', nowPage, allPage);
    if(allPage<8){
      for(var i=1;i<allPage+1;i++){
        retunButtonInfo = retunButtonInfo+showSingleButton(i, i, nowPage, allPage);
      }
    }else if(nowPage<5){
      for(var i=1;i<6;i++){
        retunButtonInfo = retunButtonInfo+showSingleButton(i, i, nowPage, allPage);
      }
      retunButtonInfo = retunButtonInfo+showSingleButton('', '...', nowPage, allPage);
      retunButtonInfo = retunButtonInfo+showSingleButton(allPage, allPage, nowPage, allPage);
    }else if(nowPage>allPage-4){
      retunButtonInfo = retunButtonInfo+showSingleButton(1, 1, nowPage, allPage);
      retunButtonInfo = retunButtonInfo+showSingleButton('', '...', nowPage, allPage);
      for(var i=allPage-4;i<allPage+1;i++){
        retunButtonInfo = retunButtonInfo+showSingleButton(i, i, nowPage, allPage);
      }
    }else{
      retunButtonInfo = retunButtonInfo+showSingleButton(1, 1, nowPage, allPage);
      retunButtonInfo = retunButtonInfo+showSingleButton('', '...', nowPage, allPage);
      for(var i=nowPage-1;i<nowPage+2;i++){
        retunButtonInfo = retunButtonInfo+showSingleButton(i, i, nowPage, allPage);
      }
      retunButtonInfo = retunButtonInfo+showSingleButton('', '...', nowPage, allPage);
      retunButtonInfo = retunButtonInfo+showSingleButton(allPage, allPage, nowPage, allPage);
    }
    retunButtonInfo = retunButtonInfo+showSingleButton('', '>', nowPage, allPage);
    retunButtonInfo = retunButtonInfo+"</ul></nav>";
  }
  return retunButtonInfo;
}

/*----- Main function for result page change, including filter, table search, change page number -----*/
function changeResultTable(nowPage){
	var rawQueryInfo = [$('#rawQueryInfo').text()];
	var filterInfos = getFilterInfo();
	var searchInfos = getSearchInfo();
	var orderInfos = getOrderInfo();
	var rowNumber = Number($('#selectRowNumber').val());
	
	if(filterInfos.includes("()")){
		alert('Please select at least one filter option!');
	}
	else{
		var newQueryInfos = [].concat(rawQueryInfo, filterInfos, searchInfos);
		var newQueryInfo = newQueryInfos.join(" and ");
		console.log(newQueryInfo)
		$.ajax({
			url:"result",
			method:"POST",
			data:{"newQueryInfo":newQueryInfo,"orderInfos":orderInfos,"rowNumber":rowNumber,"type":"changeRes","pageNumber":nowPage},
			success:function(ret){
				console.log(ret)
				let data = ret["data"]
				let html = ''
				for(let row in data){
					html += "<tr class='Table-line'><td><i class='ri-add-circle-fill' value='"
					html += data[row]["UniprotId"]+"|"+data[row]["Site"]+"|"+data[row]["Id"]
					html +="'></i></td><td>"+data[row]["UniprotId"]+"</td><td>"+data[row]["Site"]+"</td><td>"+data[row]["Genename"]+"</td><td>"+data[row]["Proteinname"]+"</td><td>"+data[row]["Seq"]+"</td></tr>"
					html += '<tr class="Detail-line">'+
							'<td colspan="11"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></td>'+
							'</tr>'
				}
				$("#tableChange").html(html);

				
				ret["begin"] += 1

				if(ret["end"]>ret["count"]){
					ret["end"] = ret["count"]
				}
				// $("#pageInfo").html("Showing "+begin+" to "+end+" of "+ret["count"]+" entries");
				$("#pageInfo").html("Showing "+ret["begin"]+" to "+ret["end"]+" of "+ret["count"]+" entries");
				let allPage = ret["allPageNumber"]
				console.log(allPage)
				let buttoninfo = showButtonInfo(allPage,nowPage)
				$("#pageButton").html(buttoninfo);

			},
			error:function(){
				alert("queryInfo error")
			}
		})
	}
}

/*----- Download result table fnction-----*/
function downloadResultTable(){
	var rawQueryInfo = [$('#rawQueryInfo').text()];
	var filterInfos = getFilterInfo();
	var searchInfos = getSearchInfo();
	if(filterInfos.includes("()")){
		alert('Please select at least one filter option!');
	}
	else{
		var newQueryInfos = [].concat(rawQueryInfo, filterInfos, searchInfos);
		var newQueryInfo = newQueryInfos.join(" and ");
		$.post("./resource/functions.php", {"type":"download", "newQueryInfo":newQueryInfo}, function(returnInfo, status){
			if(status == 'success'){
				let alink = document.createElement("a");
                alink.download="qPTM.result.txt";
                alink.href="./resource/download/"+returnInfo;
                alink.click();
			}
			else{
				alert('Failed, plaese try again!')
			}
		})
	}
}

/*----- Main function for qkinact page change -----*/
function changeQueryTable(nowPage){
	var queryInfoFile = $('#queryInfoFile').text();
	var rowNumber = Number($('#selectRowNumber').val());
	if(!queryInfoFile){
		alert('Failed, please try again!');
	}
	else{
		$.post("./resource/functions.php", {"type":"qkinactchange", "queryInfoFile":queryInfoFile, "nowPage":nowPage, "rowNumber":rowNumber}, function(returnInfo, status){
			if(status == 'success'){
				var changeInfo = JSON.parse(returnInfo);
				$("#tableChange").html(changeInfo["tableChange"]);
				$("#pageInfo").html(changeInfo["pageInfoChange"]);
				$("#pageButton").html(changeInfo["pageButtonChange"]);
			}
			else{
				alert('Failed, plaese try again!')
			}
		})
	}
}

function tableInTableOrder(){

}

/*----- Information Table Generate -----*/
function GenerateInfo(id,scores,cptac,co_expre,qptm){
	let html = '<div class="btn-group" role="group" aria-label="detail button">'+
	// '<button type="button" class="btn btn-outline-info" id="exp-'+id+'">About experiment</button>'+
	// '<button type="button" class="btn btn-outline-info" id="pro-'+id+'">About protein</button>'+
	'<button type="button" class="btn btn-outline-info active" id="enz-'+id+'">Potential kinases and their inhibitors</button></div>'
	// '<button type="button" class="btn btn-outline-info show-str" id="str-'+id+'">Sequence and Structure</button></div>'
	html += ''


	html += '<div class="more-info" id="div-enz-0" style="">'+
			'<table class="table table-bordered">'+
			'<thead>'+
				'<tr><th style="width:15%"></th><th style="width:80%"></th><th style="width:5%"></th></tr>'+
			'</thead>'+
			'<tbody>'+
				'<tr><td>Scores.</td>'+
				'<td><table class="table table-bordered hide-table hide-more" id="'+id+'-score">'+
				'<thead class="thead-dark">'+
				'<tr><th style="width:40%" class="arrange2">Kinase<i class="arrow ri-arrow-up-down-fill"></i></th>'+
				'<th style="width:60%" class="arrange2">Score<i class="arrow ri-arrow-up-down-fill"></i></th></tr></thead><tbody>'
	for(let prop in scores){
		html += '<tr><td>'+prop+'</td>'
		let scoress = ''
		for(i=0;i<scores[prop].length;i++){
			scoress += scores[prop][i]
		}
		html += '<td>'+scoress+'</td></tr>'
	}
	html += '</tbody></table></td><td style="vertical-align:top"><i class="show-table ri-arrow-down-circle-fill"></i></td></tr>'

	html += '<tr><td>QPTM.</td>'+
			'<td><table class="table table-bordered hide-table hide-more" id="'+id+'-qptm">'+
			'<thead class="thead-dark">'+
			'<tr><th style="width:20%" class="arrange2">Kinase<i class="arrow ri-arrow-up-down-fill"></i></th>'+
			'<th style="width:10%" class="arrange2">LogFC_Kinase<i class="arrow ri-arrow-up-down-fill"></i></th>'+
			'<th style="width:10%" class="arrange2">LogFC_Sub<i class="arrow ri-arrow-up-down-fill"></i></th>'+
			'<th style="width:10%" class="arrange2">Cor<i class="arrow ri-arrow-up-down-fill"></i></th>'+
			'<th style="width:10%" class="arrange2">Pval<i class="arrow ri-arrow-up-down-fill"></i></th>'+
			'<th style="width:20%" class="arrange2">Condition<i class="arrow ri-arrow-up-down-fill"></i></th>'+
			'<th style="width:20%" class="arrange2">Pmid<i class="arrow ri-arrow-up-down-fill"></i></th>'+
			'</tr></thead><tbody>'
	for(let prop in qptm){
		html += '<tr><td>'+prop+'</td>'
		// let cptacs = ''
		for(i=0;i<qptm[prop].length;i++){
			qptm_val = qptm[prop][i]
			qptm_val_split = qptm_val.split('#')
			html += '<td>'+qptm_val_split[1]+'</td>'
			html += '<td>'+qptm_val_split[2]+'</td>'
			html += '<td>'+qptm_val_split[3]+'</td>'
			html += '<td>'+qptm_val_split[4]+'</td>'
			html += '<td>'+qptm_val_split[7]+'</td>'
			html += '<td><a href="https://pubmed.ncbi.nlm.nih.gov/'+qptm_val_split[6]+'" target="_blank">'+qptm_val_split[6]+'</a></td>'
		}
		html += '</tr>'
	}
	html += '</tbody></table></td><td style="vertical-align:top"><i class="show-table ri-arrow-down-circle-fill"></i></td></tr>'


	html += '<tr><td>CPTAC.</td>'+
	'<td><table class="table table-bordered hide-table hide-more" id="'+id+'-cptac">'+
	'<thead class="thead-dark">'+
	'<tr><th style="width:20%" class="arrange2">Kinase<i class="arrow ri-arrow-up-down-fill"></i></th>'+
	'<th style="width:20%" class="arrange2">Cor<i class="arrow ri-arrow-up-down-fill"></i></th>'+
	'<th style="width:20%" class="arrange2">Pval<i class="arrow ri-arrow-up-down-fill"></i></th>'+
	'<th style="width:20%" class="arrange2">Num<i class="arrow ri-arrow-up-down-fill"></i></th>'+
	'<th style="width:20%" class="arrange2">Pmid<i class="arrow ri-arrow-up-down-fill"></i></th>'+
	'</tr></thead><tbody>'

	for(let prop in cptac){
		html += '<tr><td>'+prop+'</td>'
		// let cptacs = ''
		for(i=0;i<cptac[prop].length;i++){
			cptac_val = cptac[prop][i]
			cptac_val_split = cptac_val.split('#')
			for(j=0;j<cptac_val_split.length;j++){
				if(j!=4 & j!=3){
					if(j==0 | j == 1){
						html += '<td>'+parseFloat(cptac_val_split[j]).toFixed(3) + '</td>'
					}else if(j==5){
						html += '<td><a href="https://pubmed.ncbi.nlm.nih.gov/'+cptac_val_split[j]+'" target="_blank">'+cptac_val_split[j]+'</a></td>'
					}else{
						html += '<td>'+cptac_val_split[j] + '</td>'
					}
				}
			}
		}
		html += '</tr>'
	}
	html += '</tbody></table></td><td style="vertical-align:top"><i class="show-table ri-arrow-down-circle-fill"></i></td></tr>'

	html += '<tr><td>CO_EXPRE.</td>'+
			'<td><table class="table table-bordered hide-table hide-more" id="'+id+'-coexp">'+
			'<thead class="thead-dark">'+
			'<tr><th style="width:20%" class="arrange2">Kinase<i class="arrow ri-arrow-up-down-fill"></i></th>'+
			'<th style="width:10%" class="arrange2">LogFC_Kinase<i class="arrow ri-arrow-up-down-fill"></i></th>'+
			'<th style="width:10%" class="arrange2">LogFC_Sub<i class="arrow ri-arrow-up-down-fill"></i></th>'+
			'<th style="width:20%" class="arrange2">ConditionSub<i class="arrow ri-arrow-up-down-fill"></i></th>'+
			'<th style="width:20%" class="arrange2">ConditionKinase<i class="arrow ri-arrow-up-down-fill"></i></th>'+
			'<th style="width:20%" class="arrange2">Pmid<i class="arrow ri-arrow-up-down-fill"></i></th>'+
			'</tr></thead><tbody>'
	for(let prop in co_expre){
		html += '<tr><td>'+prop+'</td>'
		// let cptacs = ''
		for(i=0;i<co_expre[prop].length;i++){
			co_val = co_expre[prop][i]
			co_val_split = co_val.split('#')
			// html += '<td>'+co_val_split[1]+'</td>'
			html += '<td>'+co_val_split[3]+'</td>'
			html += '<td>'+co_val_split[5]+'</td>'
			html += '<td>'+co_val_split[8]+'</td>'
			html += '<td>'+co_val_split[9]+'</td>'
			html += '<td><a href="https://pubmed.ncbi.nlm.nih.gov/'+co_val_split[7]+'" target="_blank">'+co_val_split[7]+'</a></td>'
		}
		html += '</tr>'
	}
	html += '</tbody></table></td><td style="vertical-align:top"><i class="show-table ri-arrow-down-circle-fill"></i></td></tr>'

	html +=	'</tbody>'+
			'</table>'+
			'</div>'
	return html
}


/*----- create new table ----- */
//  function quickSort(datarow,begin,end,col){
	// if(end>begin){
	// 	let key = datarow[begin];
	// 	let i=begin;
	// 	let j=end;
	// 	while(i<j){
	// 		while(i<j && datarow[j][col]>key[col]){
	// 			j--
	// 		}
	// 		if(i<j){
	// 			datarow[i] = datarow[j]
	// 		}
	// 		while(i<j && datarow[i][col]<key[col]){
	// 			i++
	// 		}
	// 		if(i<j){
	// 			datarow[j] = datarow[i]
	// 			j--
	// 		}
	// 	}
	// 	datarow[i] = key
	// 	quickSort(datarow,begin,i-1)
	// 	quickSort(datarow,i+1,end)
	// }
// }

function normalSort(datarow,rowNum,col,fx)
{
	let newData = []
	let flag;
	if(fx=="asc"){
		for(let i=0;i<rowNum;i++){
			console.log("升序")
			let mincol = datarow[i][col]
			flag = i
			for(let j=i+1;j<rowNum;j++){
				if(datarow[j][col]<mincol){
					flag = j
					mincol = datarow[j][col]
				}
			}
			if(flag!=i){
				newData = datarow[i]
				datarow[i] = datarow[flag]
				datarow[flag] = newData
			}
		}
	}else{
		for(let i=rowNum-1;i>=0;i--){
			console.log("降序")
			let maxcol = datarow[i][col]
			flag = i
			for(let j=i-1;j>=0;j--){
				if(datarow[j][col]<maxcol){
					flag = j
					maxcol = datarow[j][col]
				}
			}
			if(flag!=i){
				newData = datarow[i]
				datarow[i] = datarow[flag]
				datarow[flag] = newData
			}
		}
	}
	return datarow
}

function floatSort(datarow,rowNum,col,fx){
	let newData = []
	let flag;
	if(fx=="asc"){
		for(let i=0;i<rowNum;i++){
			console.log("升序")
			let mincol = datarow[i][col]
			flag = i
			for(let j=i+1;j<rowNum;j++){
				if(parseFloat(datarow[j][col])<parseFloat(mincol)){
					flag = j
					mincol = datarow[j][col]
				}
			}
			if(flag!=i){
				newData = datarow[i]
				datarow[i] = datarow[flag]
				datarow[flag] = newData
			}
		}
	}else{
		for(let i=rowNum-1;i>=0;i--){
			console.log("降序")
			let maxcol = datarow[i][col]
			flag = i
			for(let j=i-1;j>=0;j--){
				if(parseFloat(datarow[j][col])<parseFloat(maxcol)){
					flag = j
					maxcol = datarow[j][col]
				}
			}
			if(flag!=i){
				newData = datarow[i]
				datarow[i] = datarow[flag]
				datarow[flag] = newData
			}
		}
	}
	return datarow
}

function bubbleSort(datarow,rowNum,col,fx){
	let regs = /^(-?\d+)(\.\d+)?$/;
	if(regs.test(datarow[0][col])){
		datarow = floatSort(datarow,rowNum,col,fx)
	}else{
		datarow = normalSort(datarow,rowNum,col,fx)
	}
	return datarow
}

let m = 0
let n = 0
/*----- Table arrange2 function -----*/
$(document).on('click','.arrange2',function(){
	let changeClass = '';
	if($(this).find('.arrow').hasClass('ri-arrow-up-down-fill') | $(this).find('.arrow').hasClass('ri-sort-asc')){
		changeClass = 'ri-sort-desc';
	}
	else{
		changeClass = 'ri-sort-asc';
	}
	let arrange2_dad = $(this).closest("table").attr('id')
	console.log(arrange2_dad)
	$('#'+arrange2_dad).find('.ri-sort-desc').removeClass('ri-sort-desc').addClass('ri-arrow-up-down-fill');
	$('#'+arrange2_dad).find('.ri-sort-asc').removeClass('ri-sort-asc').addClass('ri-arrow-up-down-fill');
	$(this).find('.arrow').removeClass('ri-arrow-up-down-fill').removeClass('ri-sort-desc').removeClass('ri-sort-asc').addClass(changeClass);

	let col = $(this).index()
	// let tb = document.getElementById(arrange2_dad).getElementsByTagName("tbody")

	let datarow = []
	$('#'+arrange2_dad+' tbody tr').each(function(i){
		let coldata = []
		n = 0
		$(this).children('td').each(function(j){
			coldata[n] = $(this).text()
			n += 1
			// console.log("第"+(i+1)+"行，第"+(j+1)+"个td的值："+$(this).text()+"。");
		})
		datarow[m]= coldata
		m+=1
	})
	m = 0

	let colNum=0;
	if(datarow.length != 0){
		colNum = datarow[0].length
		if(changeClass=='ri-sort-asc'){
			datarow = bubbleSort(datarow,datarow.length,col,"asc")
		}else{
			datarow = bubbleSort(datarow,datarow.length,col,"dec")
		}
	}

	let html = ''
	for(var key in datarow){
		html += '<tr>'
		var data = datarow[key]
		for(var key2 in data){
			html += '<td>' + data[key2]+'</td>'
		}
		html += '</tr>'
	}

	$('#'+arrange2_dad).find('tbody').html(html)
})

$(document).ready(function(){
/*----- Set home page search example -----*/
	$('#Home #Example').on('click',function(){
		changeExampleTag(0,'uniprotId');
		changeExampleInput(0,'A0A0B4J2F2');
		// changeExampleMod('all');
		// changeExampleOrg('Human');
	})

/*----- Table filter function -----*/
	$('#Result #filterButton').on('click',function(){
		$(this).html("<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> waiting...");
		changeResultTable(1);
		$(this).html("Filter");
	})
/*----- Table row number change function -----*/
	$('#Result #selectRowNumber').on('change',function(){
		changeResultTable(1);
	})

/*----- Table arrange function -----*/
	$('.arrange').on('click',function(){
		var changeClass = '';
		if($(this).find('.arrow').hasClass('ri-arrow-up-down-fill') | $(this).find('.arrow').hasClass('ri-sort-asc')){
			changeClass = 'ri-sort-desc';
		}
		else{
			changeClass = 'ri-sort-asc';
		}
		$('.arrange').find('.ri-sort-desc').removeClass('ri-sort-desc').addClass('ri-arrow-up-down-fill');
		$('.arrange').find('.ri-sort-asc').removeClass('ri-sort-asc').addClass('ri-arrow-up-down-fill');
		$(this).find('.arrow').removeClass('ri-arrow-up-down-fill').removeClass('ri-sort-desc').removeClass('ri-sort-asc').addClass(changeClass);

		changeResultTable(1);
	})
/*----- Page change function -----*/
	$(document).on('click','#Result .page-item',function(){
		if(!$(this).hasClass("disabled") & !$(this).hasClass("active")){
			var choosePage = Number($(this).find("a").first().attr("value"));
			changeResultTable(choosePage);
		}
	})
/*----- Table search function -----*/
	$('#Result .search-line').on('input',function(){
		changeResultTable(1);
	})


/*----- More detail information show -----*/
	$(document).on('click','#Result .Table-line .ri-add-circle-fill',function(){
		$(this).removeClass('ri-add-circle-fill').addClass('ri-indeterminate-circle-fill');
		$(this).closest('.Table-line').next('.Detail-line').show();
		var addLine = $(this).closest('.Table-line').next('.Detail-line').find("td").first();
		console.log(addLine.text())
		if(addLine.text() == 'Loading...'){
			var rawdata = $(this).attr("value");
			$.ajax({
				url:"/result",
				type:"POST",
				data:{"rawdata":rawdata,"type":"queryfile"},
				success:function(data){
					let id = data["id"]
					let scores = data["scores"]
					let cptac = data["cptac"]
					let co_expre = data["co_expre"]
					let qptm = data["qptm"]
					html = GenerateInfo(id,scores,cptac,co_expre,qptm)
					addLine.html(html)
					$('[data-toggle="popover"]').popover();

				},
				error:function(){
					alert("error")
				}
			})
		}
	})
	$(document).on('click','#Result .Table-line .ri-indeterminate-circle-fill',function(){
		$(this).removeClass('ri-indeterminate-circle-fill').addClass('ri-add-circle-fill');
		$(this).closest('.Table-line').next('.Detail-line').hide();
	})
	$(document).on('click','#Result .btn-group .btn',function(){
		$clickBtn = $(this).attr('id');
		$(this).closest('.btn-group').find('.btn').each(function(){
			if($(this).attr('id') != $clickBtn){
				$(this).removeClass('active')
				$('#div-'+$(this).attr('id')).slideUp();
			}
			else{
				$(this).addClass('active')
				$('#div-'+$(this).attr('id')).slideDown();
			}
		})
	})
/*----- Display protein structure -----*/
	$(document).on('click','#Result .show-str',function(){
		var lineID = $(this).attr('id');
		var line = lineID.split('-')[1];
		if($('#ptmshow-'+line).html()==''){
			get_mordetail(line);
		}
	})
/*----- Detail table hide/show -----*/
	$(document).on('click','#Result .show-table',function(){
		if($(this).hasClass('ri-arrow-down-circle-fill')){
			$(this).removeClass('ri-arrow-down-circle-fill').addClass('ri-arrow-up-circle-fill');
			$(this).closest('tr').find('.hide-table').removeClass('hide-more');
		}
		else if($(this).hasClass('ri-arrow-up-circle-fill')){
			$(this).removeClass('ri-arrow-up-circle-fill').addClass('ri-arrow-down-circle-fill');
			$(this).closest('tr').find('.hide-table').addClass('hide-more');
		}
	})

	$(document).on('click','#Result .show-text',function(){
		if($(this).hasClass('ri-arrow-down-circle-fill')){
			$(this).removeClass('ri-arrow-down-circle-fill').addClass('ri-arrow-up-circle-fill');
			$(this).closest('tr').find('.hide-text').removeClass('text-less');
		}
		else if($(this).hasClass('ri-arrow-up-circle-fill')){
			$(this).removeClass('ri-arrow-up-circle-fill').addClass('ri-arrow-down-circle-fill');
			$(this).closest('tr').find('.hide-text').addClass('text-less');
		}
	})

/*----- Download the result table -----*/
	$('#Result #download_button').on('click',function(){
		$(this).html("<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> waiting...");
		downloadResultTable();
		$(this).html("Download");
	})

/*----- Search page add/remove search line -----*/
	$(document).on('click', '#simple_search_form .ri-add-circle-fill', function(){
		//less than 10 lines, else warning!
		if($('#simple_search_form').find('.row').length > 10){
			alert('Please do not add too many search rows!');
		}
		else{
			//add line
			$(this).closest('.row').after('<div class="row"><div class="col-md-1"></div><div class="col-md-2"><select class="form-control my-select-tag"><option value="and">AND</option><option value="or">OR</option><option value="and not">NOT</option></select></div><div class="col-md-2"><select class="form-control my-select-tag"><option value="Context">Any Field</option><option value="uniprotId">UniProt Id</option><option value="genename">Gene Name</option><option value="proteinname">Protein Name</option><option value="func">Function</option><option value="samdetail">Sample</option><option value="con condetail">Condition</option></select></div><div class="col-md-6"><input class="form-control" type="text" placeholder="Please select a type and enter keyword(s)."></div><div class="col-md-1"><i class="ri-add-circle-fill"></i><i class="ri-indeterminate-circle-fill"></i></div></div>');
			//re-arrange name and id
			var AllSearchLineNum = $('#simple_search_form').find('.row').length-1;
			for(var num=2;num<AllSearchLineNum;num++){
		 	 	$('#simple_search_form').find('.row:eq('+num+')').find('select:eq(0)').attr('name','simple_search_link'+num).attr('id','simple_search_link'+num);
			  	$('#simple_search_form').find('.row:eq('+num+')').find('select:eq(1)').attr('name','simple_search_tag'+num).attr('id','simple_search_tag'+num);
		 	 	$('#simple_search_form').find('.row:eq('+num+')').find('input').attr('name','simple_search_input'+num).attr('id','simple_search_input'+num);
			}
		}
	})

	//remove one search line
    $(document).on('click','#simple_search_form .ri-indeterminate-circle-fill',function(){
      $(this).closest('.row').remove();
    })

/*----- Search page set example -----*/
	$('#Search #Example').on('click',function(){
		changeExampleTag(0,'uniprotId');
		changeExampleInput(0,'A0A0B4J2F2');
		// changeExampleLink(1,'and');
		// changeExampleTag(1,'samdetail');
		// changeExampleInput(1,'Hela');
		changeExampleMod('all');
		changeExampleOrg('Human');

		var AllSearchLineNum = $('#simple_search_form').find('.row').length-1;
		for(var num=2;num<AllSearchLineNum;num++){
			changeExampleLink(num,'and');
			changeExampleTag(num,'Context');
			changeExampleInput(num,'');
		}
	})

/*----- qKinAct change function -----*/
/*----- Table row number change function -----*/
	$('#query #selectRowNumber').on('change',function(){
		changeQueryTable(1);
	})
/*----- Page change function -----*/
	$(document).on('click','#query .page-item',function(){
		if(!$(this).hasClass("disabled") & !$(this).hasClass("active")){
			var choosePage = Number($(this).find("a").first().attr("value"));
			changeQueryTable(choosePage);
		}
	})

})

/*----- Tooltip function start -----*/
$(function () {
  	$('[data-toggle="tooltip"]').tooltip()
})

if(document.getElementById('download')){

var validated = false;
var passTime = false;
/*----- 图片验证 -----*/
jigsaw.init({
  el: document.getElementById('captcha'),
  onSuccess: function() {
    var d = new Date();
    passTime = d.getTime();
    document.getElementById('msg').value = passTime;
    validated = true;
  },
  onFail: cleanMsg,
  onRefresh: function() {
    cleanMsg();
    validated = false;
  }
})
function cleanMsg() {
  document.getElementById('msg').value = '';
}

}