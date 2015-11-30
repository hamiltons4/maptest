if (Meteor.isClient) {
  /*****************************************************************************/
/* MapDemoIndex: Lifecycle Hooks */
/*****************************************************************************/

Template.mapCanvas.rendered = function () {
    var tmpl = this;
    var searchInput = this.$('#address');

    VazcoMaps.init({}, function() {

        // gMaps.js plugin usage [ http://hpneo.github.io/gmaps/ ]

        tmpl.mapEngine = VazcoMaps.gMaps();

        tmpl.newMap = new tmpl.mapEngine({
            div: '#map-canvas',
            lat: 38.9847,
            lng: -77.1131,
        });

        tmpl.newMap.addMarker({
          lat: 38.9847,
          lng: -77.1131,
          /*
          lat: 52.22968,
          lng: 21.01223, */
          draggable: true,
          dragend: function() {
            var point = this.getPosition();
            tmpl.mapEngine.geocode({location: point, callback: function(results) {
              searchInput.val(results[0].formatted_address);
              tmpl.newMap.setCenter(results[0].geometry.location.lat(), results[0].geometry.location.lng());
            }});
          }
        });

        // or standard google maps api
        // var mapOptions = {
        //     zoom: 13
        // };
        // tmpl.newMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    });

};


/*****************************************************************************/
/* MapDemoIndex: Event Handlers and Helpers */
/*****************************************************************************/
Template.mapCanvas.events({
  'submit form': function(e, tmpl) {
      e.preventDefault();
      var searchInput = $(e.target).find('#address');
      //tmpl.newMap.removeMarkers();
      tmpl.mapEngine.geocode({
        address: searchInput.val(),
        callback: function(results, status) {
          if (status == 'OK') {
            var latlng = results[0].geometry.location;
            tmpl.newMap.setCenter(latlng.lat(), latlng.lng());
            tmpl.newMap.addMarker({
              lat: latlng.lat(),
              lng: latlng.lng(),
              click: function(e) {
               alert('You clicked in this marker');
               },

              draggable: true,
              dragend: function() {
                var point = this.getPosition();
                tmpl.mapEngine.geocode({location: point, callback: function(results) {
                  searchInput.val(results[0].formatted_address);
                  tmpl.newMap.setCenter(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                }});
              }
            });
            searchInput.val(results[0].formatted_address);
          } else {
            console.log(status);
          }
        }
      });
  }
});



}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
