function processGraphMultiSeries() {
    var seriesType = 'line';
    var dp = 2;
    var axisName = 'axis0';  //default

    //Highcharts.setOptions({ global: { useUTC: true } });

    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graph-container-1',
            height: graphHeight,
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            zoomType: 'x'
        },
        title: {
            text: _dataGraphTitle
        },
        xAxis: {
            type: 'datetime',
            labels: {
                enabled: true
            },
            dateTimeLabelFormats: {
                minTickInterval: 24 * 3600 * 1000,
                millisecond: '%b %e'
            },
        },
        yAxis: {min: 0, max: 10},
        legend: {
            enabled: true
        },
        exporting: {
            enabled: true
        }
    });

    //Work out number of y axis
    var yxaisUnits = [];
    var axisIdx = 0;
    for (var i = 0, l = _multiSeriesArray.length; i < l; i++) {
        //if (_multiSeriesArray[i].unit !== '') {
            var addAxis = true;
            if (yxaisUnits.length != 0) {
                for (var s = 0; s < yxaisUnits.length; s++) {
                    if (yxaisUnits[s].indexOf(_multiSeriesArray[i].unit) != -1) { addAxis = false;}
                }
            }
            if (addAxis) {
                yxaisUnits.push(_multiSeriesArray[i].unit);
                chart.addAxis({
                    id: 'axis' + axisIdx,
                    title: {
                        text: _multiSeriesArray[i].unit
                    },
                    lineWidth: 1
                });
                axisIdx++;
            }
        //}
    }

    //Clear down array
    _graphDataForExport = [];

    for (var series = 0; series < _multiSeriesArray.length; series++) {

        var processed_originalData = [];
        var originalData = _multiSeriesArray[series].seriesData;

        for (var i = 0; i < originalData.length; i++) {
            try {
                var dateForGraph = resolveDateForGraphs(originalData[i].time);
                if (!isNaN(dateForGraph)) {
                    if (originalData[i].value == "True" || originalData[i].value == "False") {
                        var bVal = (originalData[i].value === "True");
                        var val = bVal ? 1 : 0;
                        processed_originalData.push([dateForGraph, parseFloat(val)])
                    } else {
                        processed_originalData.push([dateForGraph, parseFloat(originalData[i].value)])
                    }
                };
            } catch (err) { }

        }
        for (var a = 0; a < yxaisUnits.length; a++) {
            if (_multiSeriesArray[series].unit == yxaisUnits[a]) {
                axisName = 'axis' + a;
            }
        }

        _graphDataForExport[series] = processed_originalData;

        chart.addSeries({
            name: _multiSeriesArray[series].seriesTitle + ' (' + _multiSeriesArray[series].unit + ')',
            data: processed_originalData,
            type: seriesType,
            yAxis: axisName,
            tooltip: {
                valueSuffix: _multiSeriesArray[series].unit,
                valueDecimals: dp
            }
        });
    }

    chart.redraw();
    chart.reflow();

    hideLoader();
}
