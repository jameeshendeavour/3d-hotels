import { Component, Input, OnInit } from '@angular/core';
import { MapboxStyleSwitcherControl, MapboxStyleSwitcherOptions, MapboxStyleDefinition } from "mapbox-gl-style-switcher";
import { ActivatedRoute } from '@angular/router';
import center from "@turf/center";
import bbox from "@turf/bbox";
import jsonData from './csv-data-quality.json';
import mapboxgl from 'mapbox-gl';
import { LngLat, LngLatLike, Map, MapLayerMouseEvent } from 'mapbox-gl';
import { GeoJsonProperties } from 'geojson';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public data: GeoJSON.FeatureCollection<GeoJSON.MultiPolygon> | undefined;
  public points: any;
  public selectedElement: GeoJsonProperties | undefined;
  public selectedLngLat: LngLat | undefined;
  public cursorStyle: string | undefined;
  private mapType: string;
  private address: string;
  public center: LngLatLike | undefined;
  public zoom: [number] = [0];
  public pitch: number = 30;
  private bb: any;
  private originalCoordinates: GeoJSON.Position[] = [];
  private features = {
    'type': 'FeatureCollection',
    'features': <any[]>[]
  };
  private map: any;

  constructor(private actRoute: ActivatedRoute) {
    this.mapType = this.actRoute.snapshot.params['mapType'];
    this.address = this.actRoute.snapshot.params['address'];
  }

  async ngOnInit() {
    const data: GeoJSON.FeatureCollection<GeoJSON.MultiPolygon> = (await import(
      './building.geo.json'
    )) as any;
    this.data = data;
    /* @ts-ignore */
    this.center = center(data).geometry.coordinates;
    /* @ts-ignore */
    this.bb = bbox(data);
    // console.log(data.features[0].geometry.coordinates.slice()[0][0][0])
    // this.originalCoordinates = data.features[0].geometry.coordinates.slice()[0][0];
    // data.features[0].geometry.coordinates = [this.originalCoordinates[0]];
    // this.data = data;
    // this.center = this.originalCoordinates[0] as [number, number];
    this.zoom = [14];
    this.pitch = 30;
	
	this.points = [
    {
      type: 'Point' as const,
      coordinates: [103.8384040305209,
							1.2898577280523967],
							properties: {
          message: 'Foo',
        },
    },
    {
      type: 'Point' as const,
      coordinates: [103.8384040305209,
							1.2898577280523967],
							properties: {
          message: 'Foo',
        },
    },
    {
      type: 'Point' as const,
      coordinates: [103.8384040305209,
							1.2898577280523967],
							properties: {
          message: 'Foo',
        },
    },
	];
  }

  onMapLoad(map: any) {
    this.map = map;
    this.add3DBuildingControl(map)
    this.fileUploadControl(map)
    map.addControl(new MapboxStyleSwitcherControl());
    map.resize();
	map.fitBounds(this.bb, {
          maxZoom: 18,
          center: this.center
        });
  }

  onClick(evt: MapLayerMouseEvent) {
    this.selectedLngLat = evt.lngLat;
    this.selectedElement = evt.features?.[0].properties as GeoJsonProperties;
  }


  onMapIdle(map: any) {
    console.log("onMapIdle");
  }

  changeListener(eve: any) {
    const selectedFile = eve.target.files[0]
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const fileContent = event.target.result;
      console.log(fileContent)
      this.data = fileContent;
      /* @ts-ignore */
      this.center = center(data).geometry.coordinates;
      /* @ts-ignore */
      this.bb = bbox(data);
      // console.log(data.features[0].geometry.coordinates.slice()[0][0][0])
      // this.originalCoordinates = data.features[0].geometry.coordinates.slice()[0][0];
      // data.features[0].geometry.coordinates = [this.originalCoordinates[0]];
      // this.data = data;
      // this.center = this.originalCoordinates[0] as [number, number];
      this.zoom = [14];
      this.pitch = 30;

    }
    console.log(reader.readAsText(selectedFile));
  }

  add3DBuildingControl(map: any) {
    class HomeButton {
      onAdd(map: any) {
        map.setLayoutProperty(
          'add-3d-buildings',
          'visibility',
          'none'
        );
        const div = document.createElement("div");
        div.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
        div.innerHTML = `<button>
        <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="font-size: 20px;"><title>Toggle 3D Building</title><path d="M14,8h1a1,1,0,0,0,0-2H14a1,1,0,0,0,0,2Zm0,4h1a1,1,0,0,0,0-2H14a1,1,0,0,0,0,2ZM9,8h1a1,1,0,0,0,0-2H9A1,1,0,0,0,9,8Zm0,4h1a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Zm12,8H20V3a1,1,0,0,0-1-1H5A1,1,0,0,0,4,3V20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Zm-8,0H11V16h2Zm5,0H15V15a1,1,0,0,0-1-1H10a1,1,0,0,0-1,1v5H6V4H18Z"></path></svg>
        </button>`;
        div.addEventListener("contextmenu", (e) => e.preventDefault());
        div.addEventListener("click", () => {
          const visibility = map.getLayoutProperty(
            'add-3d-buildings',
            'visibility'
          );
          if (visibility === 'visible') {
            map.setLayoutProperty('add-3d-buildings', 'visibility', 'none');
          } else {
            map.setLayoutProperty(
              'add-3d-buildings',
              'visibility',
              'visible'
            );
          }
        });

        return div;
      }
    }

    const homeButton = new HomeButton();
    map.addControl(homeButton, "top-right");
  }

  fileUploadControl(map: any) {
    class FileUpload {
      onAdd(map: any) {
        const div = document.createElement("div");
        div.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
        div.innerHTML = `<button>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="upload-file"><path d="M12.71,11.29a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-2,2a1,1,0,0,0,1.42,1.42l.29-.3V17a1,1,0,0,0,2,0V14.41l.29.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42ZM20,8.94a1.31,1.31,0,0,0-.06-.27l0-.09a1.07,1.07,0,0,0-.19-.28h0l-6-6h0a1.07,1.07,0,0,0-.28-.19l-.1,0A1.1,1.1,0,0,0,13.06,2H7A3,3,0,0,0,4,5V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V9S20,9,20,8.94ZM14,5.41,16.59,8H15a1,1,0,0,1-1-1ZM18,19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V5A1,1,0,0,1,7,4h5V7a3,3,0,0,0,3,3h3Z"></path></svg>

        </button>`;
        div.addEventListener("contextmenu", (e) => e.preventDefault());


        div.addEventListener("click", () => {
          let browseField = document?.getElementById("uploadForm");
          browseField?.click();
        });


        return div;
      }
    }

    const fileUpload = new FileUpload();
    map.addControl(fileUpload, "top-right");
  }

}
