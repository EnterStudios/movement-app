import {Account} from './account';

export class Venue{
    id:number;
    foursquare_id:string;
    
    name:string;
    category:string;

    checkins:number;

    lat:number;
    lng:number;
    
    revealed_users:Account[];
    
    constructor(){}
}