$(document).ready(function() {
	
	// google maps api function
     function initialize() {
        
     	var markerArray = [];

		// google api code for setting boundry of map
		var bounds = new google.maps.LatLngBounds();

     	// function to set all markers to standard style
     	var deselectAllMarkers = function() {
     		for (var i = 0; i < markerArray.length; i++) {
     			markerArray[i].setIcon(standardMarker);
     		}
     	};

     	// drop down and marker filter
		$('select').on('change', function(){
			deselectAllMarkers();
			$('aside').hide();
			$('input').val("");
			bounds = new google.maps.LatLngBounds();
			for (var i = 0; i < markerArray.length; i++) {
     			if (this.value ==='All') {
					markerArray[i].setVisible(true);
					bounds.extend(markerArray[i].position);	
				} else if (markerArray[i].type.indexOf(this.value) > -1) {
		    		markerArray[i].setVisible(true);
		    		bounds.extend(markerArray[i].position);	
		    	} else {
		    		markerArray[i].setVisible(false);
		    	}
     		}

     		// controls zoom level when only single marker
    	  	if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
				var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01);
				var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01);
				bounds.extend(extendPoint1);
				bounds.extend(extendPoint2);
		    }

        	map.fitBounds(bounds);
        	map.panToBounds(bounds);
		});

		// search box and marker filter
		$('.search').submit(function(event) {
			event.preventDefault();
			$('#pac-input').blur();
			deselectAllMarkers();
			$('aside').hide();
			bounds = new google.maps.LatLngBounds();

			var phrase = $('#pac-input').val().toLowerCase();
			$.each(markerArray, function(i, marker) {
		        // search title
		        if (marker.title.toLowerCase().search(new RegExp(phrase, 'g')) !== -1) {
		        	marker.setVisible(true);
		            bounds.extend(marker.position);
		        // search comments
		        } else if (marker.comments.toLowerCase().search(new RegExp(phrase, 'g')) !== -1) {
		        	marker.setVisible(true);
		        	bounds.extend(marker.position);
		        } else {
		        	marker.setVisible(false);
		        }
		    });

			// controls zoom level when only single marker
    	  	if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
				var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01);
				var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01);
				bounds.extend(extendPoint1);
				bounds.extend(extendPoint2);
		    }

        	map.fitBounds(bounds);
        	map.panToBounds(bounds);
		});

        // style of standard markers
		var standardMarker = {
		    path: google.maps.SymbolPath.CIRCLE,
		    fillColor: '#D0006E',
		    fillOpacity: 1,
		    scale: 4,
		    strokeColor: '#D0006E',
		    strokeWeight: 4
		};

		// style of marker when selected
        var selectedMarker = {
		    path: google.maps.SymbolPath.CIRCLE,
		    fillColor: '#00C618',
		    fillOpacity: 1,
		    scale: 4,
		    strokeColor: '#00C618',
		    strokeWeight: 10
		};     	

     	// center map on Melbourne, zoom on CBD
        var mapOptions = {
          center: {lat: -37.8136, lng: 144.9631},
          zoom: 14
        };

        // google maps api
        var map = new google.maps.Map(document.getElementById('mapCanvas'),
            mapOptions);

        // fix for markers not showing
		google.maps.event.addListener(map, 'zoom_changed', function() {
		    setTimeout(function() {
		        var cnt = map.getCenter();
		        cnt.e+=0.000001;
		        map.panTo(cnt);
		        cnt.e-=0.000001;
		        map.panTo(cnt);
		    },400);
		});

	    // get json information
	    json.forEach(function(pin) {
	        // get position of POI
	        var poiLatLng = new google.maps.LatLng(pin.lat, pin.long);

	        // place marker on map
	        var marker = new google.maps.Marker({
			    position: poiLatLng,
			    map: map,
				title: pin.name,
				// change style of marker
				icon: standardMarker,
				type: pin.type,
				comments: pin.comments
			});

	    	// on marker click show content
			google.maps.event.addListener(marker, 'click', function() {
		     	// set all markers to standard style
				deselectAllMarkers();
				// populates contents box
				$('aside').show();
				$('.poiName').html(pin.name);
				$('.poiType').html(pin.type.join(', '));
				
				// if no comments then hide comment section
				if (pin.comments === '') {
					$('.comments').hide();
				} else {
					$('.comments').show().html(pin.comments);
				}
				// if no website then hide website section
				if (pin.website === '') {
					$('.website').hide();
				} else {
					$('.website').show().html('<a href="' + pin.website + '" target="_blank">' + pin.website + '</a>');
				}

				// centers marker
				map.panTo(poiLatLng);

				// change selected marker style
				marker.setIcon(selectedMarker);
  			});

			// clicking map hides comments box and removes selectedMarker style
  			google.maps.event.addListener(map, 'click', function() {
				$('aside').hide();
				marker.setIcon(standardMarker);
  			});

	    	markerArray.push(marker);
	    });

/*
	window.onresize = function(event) {
		console.log(map.getCenter())
	};
*/
    }

    // loads map api & initialize function
  	google.maps.event.addDomListener(window, 'load', initialize);

});