function resolveDateForGraphs(originalDate) {
    //We are using local time now for all data
    var thisDateString = originalDate;
    //Check to see that the incoming data is not DateTimeKind.Unspecified - if it is, force it as UTC
    var lastChar = thisDateString[thisDateString.length - 1];
    if (lastChar != 'Z') { thisDateString = thisDateString + 'Z';}

    var dLocal = Date.parse(thisDateString);

    return dLocal;
}

function prepData(d) {
    var r = [];
    console.log(d);
    for (var i=0;i<d.length;i++) {
        r.push([resolveDateForGraphs(d[i].time), parseFloat(d[i].value)]);
    }
    return r;
}

function fetchDataForDMA(dma) {
  var bl = 'baseline%20consumption';
  var ed = 'Est%20Dom%20Baseload';
  var en = 'Est%20Nondom%20Baseload';
  var id = idmap[dma];

  var url1 = 'https://map-rainuk4.meniscus.co.uk/Map/ReadData/CalcJson?exp=ToJson(%22'
  var url2 = '%22,%22';
  var url3 = '%22,ToTime(2016,3,31,0,0,0),ToTime(2017,5,31,23,59,0),null)&apiKey=yyy7dR43!u';

  var bl_url = url1 + id + url2 + bl + url3;
  var ed_url = url1 + id + url2 + ed + url3;
  var en_url = url1 + id + url2 + en + url3;

  console.log(en_url);

  jQuery.getJSON(bl_url, function(data) {
    //console.log(data[0]);
    var d = prepData(data[0]['baseline consumption']);
    //console.log('BC',d);
    H.series[2].setData(d);
  });

  jQuery.getJSON(ed_url, function(data) {
    //console.log(data[0]);
    var d = prepData(data[0]['Est Dom Baseload']);
    //console.log('D',d);
    H.series[0].setData(d);
  });

  jQuery.getJSON(en_url, function(data) {
    console.log(data[0]);
    var d = prepData(data[0]['Est Nondom Baseload']);
    console.log('ND',d);
    H.series[1].setData(d);
  });
}


var H = Highcharts.chart('graph', {
    title: {
        text: 'Actual vs Expected Usage'
    },
    chart: {
      height: "800px",
      zoomType: 'x'
    },
    xAxis: {
        type: 'datetime'
    },
    plotOptions: {
        area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        }
    },
    series: [
      {
        type: 'area',
        name: 'Household Expectation',
        data: domTS,
        marker: {
            lineWidth: 2,
            lineColor: Highcharts.getOptions().colors[0],
            fillColor: 'white',
            symbol: 'circle'
        }
      },{
        type: 'area',
        name: 'Non-Household Expectation',
        data: ndomTS,
        marker: {
            lineWidth: 2,
            lineColor: Highcharts.getOptions().colors[1],
            fillColor: 'white',
            symbol: 'circle'
        }
      },{
          type: 'spline',
          name: 'Actual Usage',
          data: actualTS,
          color: 'darkblue',
          marker: {
              lineWidth: 2,
              lineColor: 'darkblue',
              fillColor: 'white',
              symbol: 'circle'
          }
      }
    ]
});
