var map;
var latlng_data = [];
var accidents = null;
var markers = [];

function map_loaded_handler() {
    console.log("Map is loaded");
    load_accident_data(function() {
        plot_map();
        plot_markers();
    });
}

function plot_map() {
    var taiwan = new google.maps.LatLng(23.7115779, 121.0267781);
    map = new google.maps.Map(document.getElementById("map"), {
        center: taiwan,
        zoom: 8
    });
    // Adds heatmap layer
    var layer = new google.maps.FusionTablesLayer({
        query: {
            select: "location",
            from: "1EzVx_dMXBPe_aIzie3AguMW0Wpl_fwEa4Aed9Nfr"
        },
        heatmap: {
            enabled: true
        }
    });
    layer.setMap(map);
}

function plot_markers() {
    for (var i in window.accidents) {
        var acc = window.accidents[i];
        new google.maps.Marker({
            position: new google.maps.LatLng(acc[0], acc[1]),
            map: map,
            title: acc[2],
            icon: "https://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0"
        });
    }
}

function load_accident_data(callback) {
    var xhr = new XMLHttpRequest();
    var url = "/accidents?accident_type=death";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            window.accidents = JSON.parse(xhr.responseText);
            console.log("Get accident locations", window.accidents.length);
            callback();
        }
    };
    xhr.send();
}
