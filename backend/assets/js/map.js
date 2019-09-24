/*
 fileName: map.js
 description: process AMap function and manage Tourist areas
 */

// variables for AMap
var map = null; // AMap pointer
var googleLayer;
var state = 'new';
// selected position
var leftBottom = [116.391541, 39.913155];
var rightTop = [116.402635, 39.92223931];

// current position
var currentLocation = [];

// flag for MouseTool
var isFirst = true;
var base_url = "";

//list for Attraction Mark
var markList = [];
var markerId = 100;

var district, polygons = [], citycode;
var citySelect, districtSelect, areaSelect;

var opts;
var imageLayer = null;
var mapMarker = null;
var mapMarker1 = null;
var dragging = false;
var dragging1 = false;
var cornerLocation = [];
var zoom_data;

/* function: initMap
 description: Init AMap using center position and add AMap.MouseTool plugin
 param: center // center position of current map view
 */

function initMap(center) {
    zoom_data = 5;
    map = new AMap.Map('custom-map-container', {
        resizeEnable: true,
        zoom: zoom_data,
        center: center,//地图中心点
        scrollWheel: true
    });
}

function setCenter(obj) {
    map.setCenter(obj[obj.options.selectedIndex].center);
}

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {

    mapMarker = null;
    mapMarker1 = null;
    imageLayer = null;
    dragging = false;
    dragging1 = false;
    cornerLocation = [];
    map = null;

    currentLocation = [(leftBottom[0] + rightTop[0]) / 2, (leftBottom[1] + rightTop[1]) / 2];
    cornerLocation = [rightTop[0], leftBottom[1]];
    initMap(currentLocation);


    map.on('moveend', getCity);

    function getCity() {
        map.getCity(function (data) {
            console.log(data);
            console.log(map.getCenter())
            $('input[name="province"]').val(data.province);
            $('input[name="city"]').val(data.city);
            $('input[name="area"]').val(data.district);
            $('input[name="latitude"]').val(map.getCenter().lat);
            $('input[name="longitude"]').val(map.getCenter().lng);
            $('input[name="address"]').val(data.province + data.city + data.district);
        });

    }

    showCityInfo();

    function showCityInfo() {
        //实例化城市查询类
        var citysearch = new AMap.CitySearch();
        //自动获取用户IP，返回当前城市
        console.log(citysearch);
        citysearch.getLocalCity(function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                if (result && result.city && result.bounds) {
                    var cityinfo = result.city;
                    var citybounds = result.bounds;
                    console.log(result);
                    //地图显示当前城市
                    map.setBounds(citybounds);
                    map.setZoom(13);
                }
            } else {
                console.log(result.info);
            }
        });
    }

    $('form').find('input').keypress(function(e){
        if ( e.which == 13 ) // Enter key = keycode 13
        {
            $(this).next().focus();  //Use whatever selector necessary to focus the 'next' input
            return false;
        }
    });
    /*
     Event code that find string for Search of Tourist Area
     */
    AMap.plugin('AMap.Autocomplete', function () {//回调函数
        var autoOptions = {
            //city: "", //城市，默认全国
            input: "detail_addr_input"//使用联想输入的input的id
        };
        var autocomplete = new AMap.Autocomplete(autoOptions);
        var placeSearch = new AMap.PlaceSearch({
            map: map
        });

        AMap.event.addListener(autocomplete, "select", function (data) {
            console.log(data);
            currentLocation = [data['poi']['location']['lng'], data['poi']['location']['lat']];
            map.setCenter(currentLocation);
            map.setZoom(15);
            var position = currentLocation;

            getCity();
            return;
            leftBottom = [position[0] - .001, position[1] - .001];
            rightTop = [position[0] + .001, position[1] + .001];

            imageLayer.setBounds(new AMap.Bounds(leftBottom, rightTop));
            cornerLocation = [rightTop[0], leftBottom[1]];
            mapMarker.setPosition(currentLocation);
            mapMarker1.setPosition(cornerLocation);
            var arr = [leftBottom, rightTop];
            $('#area-position').val(JSON.stringify(arr));
        });
    });


/////////////////////////////////////////////////////

});

