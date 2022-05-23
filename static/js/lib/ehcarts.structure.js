//protein structure show 
function listLength(sequence){
  listSequence = [];
  for(var i=0;i<sequence.length;i++){
    listSequence.push(i+1);
  }
  return listSequence;
}

function showPTM(sequence,ptminfo){
  var mod_color ={'Hydroxyisobutyrylation':'#fda7ec','Acetylation':'#8fc3fb','Butyrylation':'#38e04d','Crotonylation':'#58a9f0','Methylation':'#f9c3c5','Phosphorylation':'#f0b952','Succinylation':'#d2a871','SUMOylation':'#d5d953','Ubiquitination':'#86d986','Ubiquitylation':'#86d986','Glycosylation':'#74d6ec'};
  var PTMreturn = [];
  var singlePTMs = ptminfo.split(';');
  for(var i=0;i<singlePTMs.length;i++){
    var singlePTMtype = singlePTMs[i].split(':')[0];
    var singlePTMInfo = singlePTMs[i].split(':')[1].split(',');
    var PTMsite = [];
    for(var j = 0;j<singlePTMInfo.length;j++){
      PTMsite.push(Number(singlePTMInfo[j])-1);
    }
    var singlePTMres = [];
    for(var j=0;j<sequence.length;j++){
      var residue = sequence[j]+(j+1);
      if(PTMsite.indexOf(j) > -1){
        singlePTMres.push([j,1,mod_color[singlePTMtype],residue]);
      }
      else{
        singlePTMres.push([j,0,mod_color[singlePTMtype],residue]);
      }
    }
    PTMreturn.push({"name":singlePTMtype,"type":"bar","barWidth": "5","stack": "total","itemStyle": {"normal": {"color": mod_color[singlePTMtype],}},"data":singlePTMres});
  }
  return PTMreturn;
}

function showDisorder(sequence,disorder){
  var singleDisorders = disorder.split(',');
  var singleDisordersD = [];
  var singleDisordersO = [];
  for(var j=0;j<sequence.length;j++){
    var residue = sequence[j]+(j+1);
    var score = Number(singleDisorders[j]);
    if(score > 0.5){
      singleDisordersD.push([j,score,'#f3944f',residue]);
      singleDisordersO.push([j,0,'#4cd9da',residue]);
    }
    else{
      singleDisordersD.push([j,0,'#f3944f',residue]);
      singleDisordersO.push([j,score,'#4cd9da',residue]);
    }
  }
  var disorderReturn = [{"name":'Disordered',"type":"bar","barWidth": "100%","stack": "total","itemStyle": {"normal": {"color": '#f3944f'}},"data":singleDisordersD},{"name":'Ordered',"type":"bar","barWidth": "100%","stack": "total","itemStyle": {"normal": {"color": '#4cd9da'}},"data":singleDisordersO}];
  return disorderReturn;
}

function showStructure(sequence,secondstr){
  var singleStructures = secondstr.split(',');
  var singleStructuresA = [];
  var singleStructuresB = [];
  var singleStructuresC = [];
  for(var j=0;j<sequence.length;j++){
    var residue = sequence[j]+(j+1);
    var struc = singleStructures[j];
    if(struc == 'A'){
      singleStructuresA.push([j,1,'#db3d3d',residue]);
      singleStructuresB.push([j,0,'#3ddb92',residue]);
      singleStructuresC.push([j,0,'#dddddd',residue]);
    }
    else if(struc == 'B'){
      singleStructuresA.push([j,0,'#db3d3d',residue]);
      singleStructuresB.push([j,1,'#3ddb92',residue]);
      singleStructuresC.push([j,0,'#dddddd',residue]);
    }
    else{
      singleStructuresA.push([j,0,'#db3d3d',residue]);
      singleStructuresB.push([j,0,'#3ddb92',residue]);
      singleStructuresC.push([j,1,'#dddddd',residue]);
    }
  }
  var structureReturn = [{"name":'Alpha-helix',"type":"bar","barWidth": "100%","stack": "total","itemStyle": {"normal": {"color": '#db3d3d'}},"data":singleStructuresA},{"name":'Beta-strand',"type":"bar","barWidth": "100%","stack": "total","itemStyle": {"normal": {"color": '#3ddb92'}},"data":singleStructuresB},{"name":'Coil',"type":"bar","barWidth": "100%","stack": "total","itemStyle": {"normal": {"color": '#dddddd'}},"data":singleStructuresC}];
  return structureReturn;
}

function showSurface(sequence,surface){
  singleSurfaces = surface.split(',');
  surfaceReturn = [];
  for(var i=0;i<singleSurfaces.length;i++){
    var labelinfo = sequence[i]+(i+1)+'<br> Score: '+singleSurfaces[i];
    surfaceReturn.push([i,Number(singleSurfaces[i]),labelinfo]);
  }
  return surfaceReturn;
}

function showLegand(ptminfo){
  var Legandreturn = [];
  var singlePTMs = ptminfo.split(';');
  for(var i=0;i<singlePTMs.length;i++){
    var singlePTMtype = singlePTMs[i].split(':')[0];
    Legandreturn.push(singlePTMtype);
  }
  return Legandreturn;
}

function get_mordetail(line){
  //echarts function
  var ptminfo = $('#ptminfo-'+line).val();
  var sequence = $('#sequence-'+line).val();
  var disorder = $('#disorder-'+line).val();
  var surface = $('#surface-'+line).val();
  var secondstr = $('#secondstr-'+line).val();

  //PTM
 
  var myChart0 = echarts.init(document.getElementById('ptmshow-'+line));
  var option0 = {
    title: {
        text: 'PTMs',
        show:true
    },
    tooltip : {
        trigger: 'axis',
        textStyle:{align:'left'},
        formatter: function (params) {
          var tipinfo = params[0].data[3];
          for(var i=0;i<params.length;i++){
            if(params[i].data[1] == 1){
              tipinfo = tipinfo+'<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].data[2]+'"></span>'+params[i].seriesName;
            }
          }
          return tipinfo;
        }
    },
    legend: {
        x: '20',
        top: '25',
        textStyle: {
          color: '#90979c'
        },
        data: showLegand(ptminfo)
    },
    grid: {
        left: '25',
        right: '50',
        bottom: '50',
        top: '50',
        containLabel: false
    },
    xAxis : [
        {
          type : 'category',
          data : listLength(sequence),
          axisTick: {
            alignWithLabel: true
          }
        }
    ],
    yAxis : [
        {
          type : 'value',
          show: false
        }
    ],
    series : showPTM(sequence,ptminfo),
    dataZoom: [
        {
          show: true,
          realtime: true,
          start:0,
          end:100,
          left: 22,
          right: 50,
          bottom: 0,
          height: 30,
          handleColor: 'red',
          backgroundColor: '#ffffff'
        },
        {
          type: 'inside',
          ealtime: true
        }
    ]
  };
  myChart0.setOption(option0);
 
  // disorder
  var myChart1 = echarts.init(document.getElementById('disordershow-'+line));
  var option1 = {
    title: {
        text: 'Disorder',
        show:true
    },
    tooltip : {
        trigger: 'axis',
        textStyle:{align:'left'},
        formatter: function (params) {
          var tipinfo = params[0].data[3];
          for(var i=0;i<params.length;i++){
            if(params[i].data[1] > 0){
              tipinfo = tipinfo+'<br> Score: '+params[i].data[1]+'<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].data[2]+'"></span>'+params[i].seriesName;
            }
          }
          return tipinfo;
        }
    },
    legend: {
        x: '20',
        top: '25',
        textStyle: {
            color: '#90979c'
        },
        data: ['Disordered','Ordered']
    },
    grid: {
        left: '25',
        right: '50',
        bottom: '10',
        top: '50',
        containLabel: false
    },
    xAxis : [
        {
          show:false,
          type : 'category',
          data : listLength(sequence),
          axisTick: {
            alignWithLabel: true
          }
        }
    ],
    yAxis : [
        {
          type : 'value',
          show: true
        }
    ],
    series : showDisorder(sequence,disorder),
    dataZoom: [
        {
          show: false,
          realtime: true,
          start:0,
          end:100
        },
        {
          type: 'inside',
          realtime: true
        }
    ]
  };
  myChart1.setOption(option1);
  //second structure  
  var myChart2 = echarts.init(document.getElementById('secondstrshow-'+line));
  var option2 = {
    title: {
        text: 'Second structure',
        show:true
    },
    tooltip : {
        trigger: 'axis',
        textStyle:{align:'left'},
        formatter: function (params) {
          var tipinfo = params[0].data[3];
          for(var i=0;i<params.length;i++){
            if(params[i].data[1] == 1){
              tipinfo = tipinfo+'<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].data[2]+'"></span>'+params[i].seriesName;
            }
          }
          return tipinfo;
        }
    },
    legend: {
        x: '20',
        top: '25',
        textStyle: {
          color: '#90979c'
        },
        data: ['Alpha-helix','Beta-strand','Coil']
    },
    grid: {
        left: '25',
        right: '50',
        bottom: '10',
        top: '50',
        containLabel: false
    },
    xAxis : [
        {
          show:false,
          type : 'category',
          data : listLength(sequence),
          axisTick: {
            alignWithLabel: true
          }
        }
    ],
    yAxis : [
        {
          type : 'value',
          show: false
        }
    ],
    series : showStructure(sequence,secondstr),
    dataZoom: [
        {
          show: false,
          realtime: true,
          start:0,
          end:100
        },
        {
          type: 'inside',
          realtime: true
        }
    ]
  };
  myChart2.setOption(option2);
  //surface access    
  var myChart3 = echarts.init(document.getElementById('surfaceshow-'+line));    
  var option3 = {
    title: {
        text:'Surface accessibility',
        show:true
    },
    color: ['#3398DB'],
    tooltip : {
        confine:false, 
        trigger: 'axis',
        textStyle:{align:'left'},
        formatter: function (params) {
          return params[0].data[2]
        }
    },
    grid: {
        left: '25',
        right: '50',
        bottom: '10',
        top: '50',
        containLabel: false
    },
    xAxis : [
        {
          show:false,
          type : 'category',
          data : listLength(sequence),
          axisTick: {
            alignWithLabel: true
          }
        }
    ],
    yAxis : [
        {
          type : 'value'
        }
    ],
    series : [
        {
          //showAllSymbol: true,
          //symbolSize:3,
          symbolSize: 0,
          name:'surface',
          type:'line',
          smooth: '0.2',
          data:showSurface(sequence,surface)
        }
    ],
    dataZoom: [
        {
          show: false,
          realtime: true,
          start:0,
          end:100
        },
        {
          type: 'inside',
          realtime: true
        }
    ]
  };
  myChart3.setOption(option3);


  echarts.connect([myChart0,myChart1,myChart2,myChart3]);
}



function drawTimeCourse(drawDivID){
  var thisLine = drawDivID.split('-')[1];
  if($('#timeCourseData-'+thisLine).text() == 'N/A'){
    $('#'+drawDivID).html('N/A');
  }else{
  var timeCourseData = JSON.parse($('#timeCourseData-'+thisLine).text());
  var myChart = echarts.init(document.getElementById(drawDivID));
  var option = {
    title: {
        text:'Time Course Change',
        show:false
    },
    color: ['#3398DB'],
    tooltip : {
        confine:false, 
        trigger: 'axis',
        textStyle:{align:'left'}
    },
    grid: {
        left: '50',
        right: '10',
        bottom: '100',
        top: '50',
        containLabel: false
    },
    xAxis : [
        {
          show:true,
          type : 'category',
          data : timeCourseData['condition'],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {  
            interval:0,
            rotate:20,
          }
        }
    ],
    yAxis : [
        {
          type : 'value',
          name: 'Log2Ratio'
        }
    ],
    series : [
        {
          //showAllSymbol: true,
          //symbolSize:3,
          markPoint:{
            data: timeCourseData['conMarker']
          },
          symbolSize: 6,
          name:'Log2Ratio',
          type:'line',
          data:timeCourseData['values']
        }
    ],
    dataZoom: [
        {
          show: false,
          realtime: true,
          start:0,
          end:100
        },
        {
          type: 'inside',
          realtime: true
        }
    ]
  };
  myChart.setOption(option);
}
}