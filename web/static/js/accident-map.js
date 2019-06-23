var map;
var latlng_data = [];
var accidents = null;
var markers = [];

function map_loaded_handler() {
    console.log("Map is loaded");
    load_accident_data(function() {
        plot_map();
        plot_markers();
        plot_legend();
    });
}

function plot_map() {
    var taiwan = new google.maps.LatLng(23.7115779, 121.0267781);
    map = new google.maps.Map(document.getElementById("map"), {
        center: taiwan,
        zoom: 8,
        styles: [{
                "elementType": "geometry",
                "stylers": [{
                    "color": "#212121"
                }]
            },
            {
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#212121"
                }]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#757575"
                }]
            },
            {
                "featureType": "administrative.country",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#bdbdbd"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#181818"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#1b1b1b"
                }]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#2c2c2c"
                }]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#8a8a8a"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#373737"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#3c3c3c"
                }]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#4e4e4e"
                }]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                }]
            },
            {
                "featureType": "transit",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#000000"
                }]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#3d3d3d"
                }]
            }
        ]
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

function plot_legend() {
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
        document.getElementById("legend"));
}

function load_accident_data(callback) {
    var xhr = new XMLHttpRequest();
    var url = "/accidents?accident_type=death";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            window.accidents = JSON.parse(xhr.responseText);
            console.log("Get accident locations", window.accidents.length);
            callback();
        }
    };
    xhr.send();
}
