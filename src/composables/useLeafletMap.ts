import { ref, onMounted, onUnmounted, nextTick, type Ref } from 'vue';
import * as L from 'leaflet';
import { MAP_CONFIG } from '@/config/constants';

interface UseLeafletMapOptions {
  containerId: string;
  center?: L.LatLngExpression;
  enableClick?: boolean;
  initialMarker?: L.LatLngExpression;
  autoInit?: boolean;
}

export interface MapInitResult {
  success: boolean;
  error?: string;
  message?: string;
}

interface UseLeafletMapReturn {
  map: Ref<L.Map | null>;
  marker: Ref<L.Marker | null>;
  isReady: Ref<boolean>;
  createMarker: (coords: L.LatLngExpression) => void;
  removeMarker: () => void;

  setView: (center: L.LatLngExpression) => void;
  initializeMap: () => Promise<MapInitResult>;
}

export function useLeafletMap(options: UseLeafletMapOptions): UseLeafletMapReturn {
  const { containerId, center, enableClick, initialMarker, autoInit = true } = options;

  const map = ref<L.Map | null>(null);
  const marker = ref<L.Marker | null>(null);
  const isReady = ref(false);

  function createMarker(coords: L.LatLngExpression) {
    if (!map.value) return;
    removeMarker();

    marker.value = L.marker(coords).addTo(map.value as unknown as L.Map);
  }

  function removeMarker() {
    if (marker.value && map.value) {
      map.value.removeLayer(marker.value as unknown as L.Layer);
      marker.value = null;
    }
  }

  function setView(newCenter: L.LatLngExpression) {
    map.value?.setView(newCenter, MAP_CONFIG.DEFAULT_ZOOM);
  }

  async function initializeMap(): Promise<MapInitResult> {
    await import('leaflet/dist/leaflet.css');

    const container = document.getElementById(containerId);
    if (!container) {
      const errorMsg = `Container with id "${containerId}" not found in DOM`;
      console.error(errorMsg);
      return {
        success: false,
        error: 'CONTAINER_NOT_FOUND',
        message: errorMsg,
      };
    }

    if (map.value) {
      const message = 'Map already initialized';
      console.warn(message);
      return {
        success: true,
        message,
      };
    }

    try {
      const initialCenter: L.LatLngExpression =
        center || (MAP_CONFIG.DEFAULT_CENTER as unknown as L.LatLngExpression);

      map.value = L.map(containerId).setView(initialCenter, MAP_CONFIG.DEFAULT_ZOOM);

      L.tileLayer(MAP_CONFIG.TILE_URL, {
        maxZoom: MAP_CONFIG.MAX_ZOOM,
        attribution: MAP_CONFIG.ATTRIBUTION,
      }).addTo(map.value as unknown as L.Map);

      if (initialMarker) {
        createMarker(initialMarker);
      }

      if (enableClick) {
        map.value.on('click', (e: L.LeafletMouseEvent) => createMarker(e.latlng));
      }

      isReady.value = true;

      return {
        success: true,
        message: 'Map initialized successfully',
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error initializing map:', error);
      return {
        success: false,
        error: 'INITIALIZATION_ERROR',
        message: errorMsg,
      };
    }
  }

  onMounted(async () => {
    if (autoInit) {
      await nextTick();
      await initializeMap();
    }
  });

  onUnmounted(() => {
    map.value?.remove();
    map.value = null;
    marker.value = null;
    isReady.value = false;
  });

  return {
    map: map as Ref<L.Map>,
    marker: marker as Ref<L.Marker>,
    isReady,
    createMarker,
    removeMarker,
    setView,
    initializeMap,
  };
}
