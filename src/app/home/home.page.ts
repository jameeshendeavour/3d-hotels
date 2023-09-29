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
  public outline: GeoJSON.FeatureCollection<GeoJSON.MultiPolygon> | undefined;
  public block: GeoJSON.FeatureCollection<GeoJSON.MultiPolygon> | undefined;
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
      './hexagon.geo.json'
    )) as any;
    this.data = data;
	
	
	const outline: GeoJSON.FeatureCollection<GeoJSON.MultiPolygon> = (await import(
      './outline.geo.json'
    )) as any;
    this.outline = outline;
	
	
	
	const block: GeoJSON.FeatureCollection<GeoJSON.MultiPolygon> = (await import(
      './block.geo.json'
    )) as any;
    this.block = block;
	
	
	
	
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
	this.change3DLayerControl(map, this.data, this.block, this.outline)
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
  
  
  change3DLayerControl(map: any, data: any, block: any, outline: any) {
    class LayerSwitcher {
      onAdd(map: any) {
        const div = document.createElement("div");
        div.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
        div.innerHTML = `<button>
        <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Change building style </title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M176 416v64M80 32h192a32 32 0 0132 32v412a4 4 0 01-4 4H48h0V64a32 32 0 0132-32zM320 192h112a32 32 0 0132 32v256h0-160 0V208a16 16 0 0116-16z"/><path d="M98.08 431.87a16 16 0 1113.79-13.79 16 16 0 01-13.79 13.79zM98.08 351.87a16 16 0 1113.79-13.79 16 16 0 01-13.79 13.79zM98.08 271.87a16 16 0 1113.79-13.79 16 16 0 01-13.79 13.79zM98.08 191.87a16 16 0 1113.79-13.79 16 16 0 01-13.79 13.79zM98.08 111.87a16 16 0 1113.79-13.79 16 16 0 01-13.79 13.79zM178.08 351.87a16 16 0 1113.79-13.79 16 16 0 01-13.79 13.79zM178.08 271.87a16 16 0 1113.79-13.79 16 16 0 01-13.79 13.79zM178.08 191.87a16 16 0 1113.79-13.79 16 16 0 01-13.79 13.79zM178.08 111.87a16 16 0 1113.79-13.79 16 16 0 01-13.79 13.79zM258.08 431.87a16 16 0 1113.79-13.79 16 16 0 01-13.79 13.79zM258.08 351.87a16 16 0 1113.79-13.79 16 16 0 01-13.79 13.79zM258.08 271.87a16 16 0 1113.79-13.79 16 16 0 01-13.79 13.79z"/><ellipse cx="256" cy="176" rx="15.95" ry="16.03" transform="rotate(-45 255.99 175.996)"/><path d="M258.08 111.87a16 16 0 1113.79-13.79 16 16 0 01-13.79 13.79zM400 400a16 16 0 1016 16 16 16 0 00-16-16zM400 320a16 16 0 1016 16 16 16 0 00-16-16zM400 240a16 16 0 1016 16 16 16 0 00-16-16zM336 400a16 16 0 1016 16 16 16 0 00-16-16zM336 320a16 16 0 1016 16 16 16 0 00-16-16zM336 240a16 16 0 1016 16 16 16 0 00-16-16z"/></svg>

        </button>`;
        div.addEventListener("contextmenu", (e) => e.preventDefault());
		
		div.addEventListener("click", () => {
			const traceVisibility = map.getLayoutProperty(
				'trace',
				'visibility'
			);
			const blockVisibility = map.getLayoutProperty(
				'block',
				'visibility'
			);
			const outlineVisibility = map.getLayoutProperty(
				'outline',
				'visibility'
			);
			if (traceVisibility === 'visible') {
				map.setLayoutProperty('trace', 'visibility', 'none');
				map.setLayoutProperty('block', 'visibility', 'visible');
				map.setLayoutProperty('outline', 'visibility', 'none');
				/* @ts-ignore */
			    const cent = center(block).geometry.coordinates;
			    /* @ts-ignore */
			    const bb = bbox(block);
				
				map.fitBounds(bb, {
				  maxZoom: 18,
				  center: cent
				});
		
			} else if (blockVisibility === 'visible') {
				map.setLayoutProperty('trace', 'visibility', 'none');
				map.setLayoutProperty('block', 'visibility', 'none');
				map.setLayoutProperty('outline', 'visibility', 'visible');
				
				/* @ts-ignore */
			    const cent = center(outline).geometry.coordinates;
			    /* @ts-ignore */
			    const bb = bbox(outline);
				
				map.fitBounds(bb, {
				  maxZoom: 18,
				  center: cent
				});
				
			} else if (outlineVisibility === 'visible') {
				map.setLayoutProperty('trace', 'visibility', 'visible');
				map.setLayoutProperty('block', 'visibility', 'none');
				map.setLayoutProperty('outline', 'visibility', 'none');
				
				/* @ts-ignore */
			    const cent = center(data).geometry.coordinates;
			    /* @ts-ignore */
			    const bb = bbox(data);
				
				map.fitBounds(bb, {
				  maxZoom: 18,
				  center: cent
				});
				
			}
			
        });

        return div;
      }
    }

    const layerSwitcher = new LayerSwitcher();
    map.addControl(layerSwitcher, "top-right");
  }

}
