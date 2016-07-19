import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

import {GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';

import {Venue} from '../../models/venue';
import {VenueService} from '../../services/venues';
import {AccountService} from '../../services/account';
import {GeoService} from '../../services/geo';

declare var window: any;
declare var Chart: any;

@Component({
  templateUrl: 'build/pages/cohort/cohort.html',
  directives: [CHART_DIRECTIVES, GOOGLE_MAPS_DIRECTIVES]
})
export class CohortPage {
  coords ={
            lat: 40.740837,
            lng: -74.001806
          };
  
  youUrl:string = "imgs/location.png";
  iconUrl:string ="imgs/venue.png";
    
  chartType:string = 'doughnut';
  chartLabels:string[] =[];
  chartData:number[] = [];
  chartOptions:any = {
    animation: {
      animateRotate: true,
      animateScale: true,
    },
    responsive: false,
    legend: false
    // legend: {
    //     labels: ((l)=>{
    //       console.log(l);
    //       return l;
    //     })
    //   }
  };
  dataLoaded:boolean = false

  constructor(private nav: NavController,
              public venueService:VenueService,
              public accountService: AccountService,
              public geoService:GeoService) {
                this.nav = nav;
                
                this.accountService.loadLoggedInUser();

  }


  onPageWillEnter() {
    console.log("onPageWillEnter");
    this.getCurrentCoords();
    this.loadData();
  }


  syncCoords(){
    this.geoService.bgGeo.getCurrentPosition((location,taskId)=>{
      
      this.coords.lat = location.coords.latitude;
      this.coords.lng = location.coords.longitude;

      this.geoService.bgGeo.finish(taskId);

    }, (error)=>{console.log(error);});
  }

  getCurrentCoords(){
    console.log("getCurrentCoords()");
    if(this.geoService.state){
      console.log("Plugin is initiated so get the coords");
      this.syncCoords();
    }else{
      console.log("Plugin is not initiated so intiate it")
      this.geoService.initBackgroundLocation().then(()=>{
        this.syncCoords();
        console.log("Plugin configured and initialized");
      }, ()=>{
        console.log("There was an error");
      });
    }
  }
  
  loadData(){
    this.dataLoaded = false;
    this.venueService.loadCohortVenues();
    this.chartLabels = this.venueService.categories;
    this.chartData = this.venueService.data;

    // PATCH-JOB
    setTimeout(()=>{
      this.dataLoaded = true;
    }, 1000)
  }

  clickedMarker(venue:Venue){
    console.log('clicked it')
    console.log(venue);
  }

  centerMap(venue:Venue){
    this.coords.lat = venue.lat;
    this.coords.lng = venue.lng;
  }

}
