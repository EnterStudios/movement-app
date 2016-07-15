import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {BackgroundGeolocation} from 'ionic-native';
import {LocalNotifications} from 'ionic-native';


import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {SettingsService} from './settings';
import {VenueService} from './venues';

declare var window: any;

@Injectable()
export class GeoService {
    currentCoords = {
        lat: 40.740837,
        lng: -74.001806
    }
    constructor(private platform:Platform,
                public venueService:VenueService){ }

    isEnabled(){
        return BackgroundGeolocation.isLocationEnabled();
    }

    initBackgroundLocation(){
        let config = {
            desiredAccuracy: 10,
            stationaryRadius: 10,
            distanceFilter: 5,
            // activityType: 'Other', // https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/index.html#//apple_ref/occ/instp/CLLocationManager/activityType 
            stopOnTerminate: false, // enable this to clear background location settings when the app terminates

            debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        };

        BackgroundGeolocation.configure(config)
            .then((location) => {
                console.log('====================================')
                console.log("[js] BackgroundGeolocation")
                console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
                console.log(location)

                if(location.speed < 1.0){
                    this.venueService.checkintoVenue({
                        lat: location.latitude,
                        lng: location.longitude
                    }).subscribe(
                        i => {
                            LocalNotifications.schedule({
                                id: 1,
                                title: "Visit Succesfully Logged"
                            });
                        },
                        e => {
                            LocalNotifications.schedule({
                                id: 1,
                                title: "Visit Failed to Log",
                                text: JSON.stringify(e)
                            });
                        },
                        () => BackgroundGeolocation.finish()
                    );
                }else{
                    BackgroundGeolocation.finish(); // FOR IOS ONLY
                }

            })
            .catch((error) => {
                console.log('[js] BackgroundGeolocation error');
                console.log(error);
            });
        
        BackgroundGeolocation.start();

    }


    startMonitoringVisits(){
        
    }


    initVisitsListener(){
        // if( window.plugins.visit ){
        //     // use startMonitoring and provide success, failure callbacks
        //     window.plugins.visit.startMonitoring( function( visit ){
        //         console.log("==========> GOT THE VISIT");
        //         if( visit.departureDate ){
        //              // we know this is a departure visit
        //              console.log("==========> DEPARTURE");
        //         }else{
        //              // this is an arrival visit
        //              console.log("==========> ARRIVAL");
        //              this.venueService.checkintoVenue({
        //                 lat: visit.latitude,
        //                 lng: visit.longitude,
        //             }).subscribe(
        //                 i=>{},
        //                 e=>console.log(e),
        //                 ()=>{}
        //             );
        //         }
        //     }, function(  ){
        //         console.log("==========> IT ALL BROKE")
        //     });
        // }
    }

    initBackgroundGeo2(isActivate) {
        // this.platform.ready().then(() => {
        //     console.log('geoService ready')
        //     // https://github.com/mauron85/cordova-plugin-background-geolocation
        //     let config = {
        //         desiredAccuracy: 10,
        //         stationaryRadius: 10,
        //         distanceFilter: 30,
        //         activityType: 'Fitness',
        //         stopOnTerminate: false,
        //         startOnBoot: true,
        //         saveBatteryOnBackground: true,

        //         debug: true,
        //         // interval: 30 * 60 * 1000    //30 min
        //     }

        //     var callbackFn = function(location){
        //         console.log('Location => ' + location.latitude + ',' + location.longitude);
        //         console.log(JSON.stringify(location));

                

        //         // this.venueService.checkintoVenue({
        //         //         lat: location.latitude,
        //         //         lng: location.longitude,
        //         //     }).subscribe(
        //         //         i=>{},
        //         //         e=>console.log(e),
        //         //         ()=>{ 
        //         //             window.backgroundGeolocation.finish(); 
        //         //         }
        //         //     );

                
        //     }

        //     var errorFn = function(error) {
        //         console.log('BackgroundGeolocation error');
        //         console.log(JSON.stringify(error));
        //     }

        //     window.backgroundGeolocation.configure(callbackFn, errorFn, config);
        //     if(isActivate){
        //         window.backgroundGeolocation.start();


        //         // https://github.com/mauron85/cordova-plugin-background-geolocation/blob/master/www/backgroundGeolocation.js#L107
        //         window.backgroundGeolocation.onStationary(function(location){
        //             console.log("========================> on stationary yo")
        //             this.venueService.checkintoVenue({
        //                 lat: location.latitude,
        //                 lng: location.longitude,
        //             }).subscribe(
        //                 i=>{},
        //                 e=>console.log(e),
        //                 ()=>{}
        //             );


        //         },function(err){
        //             console.log('ON STATIONARY ERROR');
        //             console.log(err);
        //         });
        //     }
        //     else{
        //         window.backgroundGeolocation.stop();
        //     }
        // });
    }

    getCurrentCoords(){
        // Geolocation.getCurrentPosition().then((resp) => {
        //      this.currentCoords.lat = resp.coords.latitude;
        //      this.currentCoords.lng = resp.coords.longitude;
        // });

        // let watch = Geolocation.watchPosition();
        // watch.subscribe((data) => {
        //     this.currentCoords.lat = data.coords.latitude;
        //     this.currentCoords.lng = data.coords.longitude;
        // });    
    }
    

    public mapStyle:any = [
      {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#e9e9e9"
              },
              {
                  "lightness": 17
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#f5f5f5"
              },
              {
                  "lightness": 20
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#ffffff"
              },
              {
                  "lightness": 17
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#ffffff"
              },
              {
                  "lightness": 29
              },
              {
                  "weight": 0.2
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#ffffff"
              },
              {
                  "lightness": 18
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#ffffff"
              },
              {
                  "lightness": 16
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#f5f5f5"
              },
              {
                  "lightness": 21
              }
          ]
      },
      {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#dedede"
              },
              {
                  "lightness": 21
              }
          ]
      },
      {
          "elementType": "labels.text.stroke",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "color": "#ffffff"
              },
              {
                  "lightness": 16
              }
          ]
      },
      {
          "elementType": "labels.text.fill",
          "stylers": [
              {
                  "saturation": 36
              },
              {
                  "color": "#333333"
              },
              {
                  "lightness": 40
              }
          ]
      },
      {
          "elementType": "labels.icon",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#f2f2f2"
              },
              {
                  "lightness": 19
              }
          ]
      },
      {
          "featureType": "administrative",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#fefefe"
              },
              {
                  "lightness": 20
              }
          ]
      },
      {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#fefefe"
              },
              {
                  "lightness": 17
              },
              {
                  "weight": 1.2
              }
          ]
      }
  ]; 

}
