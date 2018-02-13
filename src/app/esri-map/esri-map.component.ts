import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';
@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {
  public mapView: any;
  public search: any;

  @ViewChild('mapViewNode') private mapViewEl: ElementRef;
  @Output() located: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    return loadModules(['esri/Map', 'esri/views/MapView', 'esri/widgets/Search'])
      .then(([Map, MapView, Search]) => {
        const mapProperties: any = {
          basemap: 'dark-gray-vector'
        };
        const map: any = new Map(mapProperties);

        const mapViewProperties: any = {
          // create the map view at the DOM element in this component
          container: this.mapViewEl.nativeElement,
          // supply additional options
          center: [-78.63, 35.8],
          zoom: 10,
          map // property shorthand for object literal
        };
  
        this.mapView = new MapView(mapViewProperties);      
        this.mapView.on('click', event => {
          this.search.search(event.mapPoint);
        });
        this.search = new Search({
          view: this.mapView
        });
        this.search.on('search-complete', event => {
          this.located.emit(event.results[0]);
        }); 
        this.mapView.ui.add(this.search, {
          position: 'top-left',
          index: 0
        })
      });
  }

}
