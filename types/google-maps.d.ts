declare global {
  interface Window {
    google: typeof google
  }
}

declare namespace google.maps {
  class Map {
    constructor(mapDiv: HTMLElement, opts?: MapOptions)
    setCenter(latlng: LatLng | LatLngLiteral): void
    setZoom(zoom: number): void
  }

  class Marker {
    constructor(opts?: MarkerOptions)
    setMap(map: Map | null): void
    addListener(eventName: string, handler: Function): MapsEventListener
  }

  class InfoWindow {
    constructor(opts?: InfoWindowOptions)
    open(map?: Map, anchor?: Marker): void
  }

  class LatLng {
    constructor(lat: number, lng: number)
  }

  class Size {
    constructor(width: number, height: number)
  }

  class Point {
    constructor(x: number, y: number)
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral
    zoom?: number
    styles?: MapTypeStyle[]
  }

  interface MarkerOptions {
    position?: LatLng | LatLngLiteral
    map?: Map
    title?: string
    icon?: string | Icon | Symbol
  }

  interface InfoWindowOptions {
    content?: string | Element
  }

  interface LatLngLiteral {
    lat: number
    lng: number
  }

  interface Icon {
    url: string
    scaledSize?: Size
    anchor?: Point
  }

  interface MapTypeStyle {
    featureType?: string
    elementType?: string
    stylers?: any[]
  }

  interface MapsEventListener {
    remove(): void
  }
}

export {}
