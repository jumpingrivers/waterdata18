console.log('TABLE');
//create Tabulator on DOM element with id "example-table"
$("#table").tabulator({
    //height:205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    layout:"fitDataFill", //fit columns to width of table (optional)
    columns:[ //Define Table Columns
        {title:"Rank", field:"rank"},
        {title:"DMA", field:"dma"},
        {title:"Sector", field:"sector"},
        {title:"Household", field:"household", align:"left", formatter:"progress"},
        {title:"#", field:"household"},
        {title:"Non-household", field:"nonhousehold", formatter:"progress"},
        {title:"#", field:"nonhousehold"},
    ],
    rowClick:function(e, row){ //trigger an alert message when the row is clicked
        update_dma(row.getData().id);
        show_graph();
    },
});
$("#table").tabulator("setData", tabledata);
$('#table').hide();
console.log('/TABLE');

console.log('MAP');
var geojson
var mapboxAccessToken = "pk.eyJ1Ijoic2VibWVsbG9yIiwiYSI6ImNqaGQyMXg2MjA0bnAzNm5xdGVqNGNvMDUifQ.ugviVV-SY9YjK0zQSuL0QQ";
var map = L.map('map', {preferCanvas:true}).setView([54, -1.8], 8);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
    attribution: 'Explorers I'
}).addTo(map);

function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
  console.log(e.target.feature.properties.name);
  update_dma(e.target.feature.properties.name);
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// INSERT DATA HERE
geojson = L.geoJson(veroData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Estimated Leakage</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' Ml / year'
        : 'Hover over a DMA');
};

info.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

console.log('/MAP');

function show_table() {
  $('#map').hide()
  $('#graph').hide()
  $('#img').hide()
  $('#table').show()
}
function show_map() {
  $('#table').hide()
  $('#graph').hide()
  $('#img').hide()
  $('#map').show()
}
function show_graph() {
  $('#table').hide()
  $('#map').hide()
  $('#img').hide()
  $('#graph').show()
}
function show_img() {
  $('#table').hide()
  $('#map').hide()
  $('#graph').hide()
  $('#img').show()
}

var THE_DMA;
function update_dma(dma) {
  $('.dma_text').each(function(i,el){
    el.innerText = dma + ', ' + idmap[dma];
  });
  THE_DMA = dma;
  console.log('SHOWGRAOH');
  fetchDataForDMA(dma);
  show_graph();
}

show_table();
//update_dma(1);
