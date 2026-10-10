import React, { useEffect } from 'react';
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import type { Incident } from '../data';

type Props = {
  incidents: Incident[];
  selectedId: string;
  onSelect: (id: string) => void;
};

type ResourceSite = { kind: string; name: string; latitude: number; longitude: number };

function neededSites(incident: Incident): ResourceSite[] {
  if (incident.status === 'RESOLVED') return [];
  if (incident.primary_resource.toLowerCase().includes('insulin')) return [
    { kind: 'MEDICAL SUPPORT', name: 'Requested · illustrative marker', latitude: 12.982, longitude: 80.204 },
    { kind: 'MEDICAL TEAM', name: 'Requested · illustrative marker', latitude: 12.971, longitude: 80.228 },
  ];
  if (incident.primary_resource.toLowerCase().includes('boat')) return [
    { kind: 'RESCUE BOAT', name: 'Requested · illustrative marker', latitude: 12.934, longitude: 80.174 },
  ];
  if (incident.type.toLowerCase().includes('fire')) return [
    { kind: 'FIRE CREW', name: 'Requested · illustrative marker', latitude: 12.946, longitude: 80.151 },
    { kind: 'MEDICAL SUPPORT', name: 'Requested · illustrative marker', latitude: 12.959, longitude: 80.133 },
  ];
  return [];
}

function MapTools({ incidents }: { incidents: Incident[] }) {
  const map = useMap();
  const boundsKey = incidents.map(({ latitude, longitude }) => `${latitude},${longitude}`).join('|');

  useEffect(() => {
    const points = incidents.map(({ latitude, longitude }) => [latitude, longitude] as [number, number]);
    if (points.length) map.fitBounds(points, { padding: [36, 36], maxZoom: 13 });
  }, [map, boundsKey]);

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return <button className="map-fit-control" onClick={() => {
    const points = incidents.map(({ latitude, longitude }) => [latitude, longitude] as [number, number]);
    if (points.length) map.fitBounds(points, { padding: [36, 36], maxZoom: 13 });
  }}>Fit incidents</button>;
}

export default function IncidentMap({ incidents, selectedId, onSelect }: Props) {
  return <MapContainer className="incident-leaflet-map" center={[12.97, 80.20]} zoom={11} scrollWheelZoom zoomControl attributionControl>
    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
    <MapTools incidents={incidents} />
    {incidents.map((incident) => {
      const isSelected = incident.id === selectedId;
      const sites = neededSites(incident);
      return <React.Fragment key={incident.id}>
        <Circle center={[incident.latitude, incident.longitude]} radius={incident.impact_radius_m} pathOptions={{ color: '#2585d8', weight: 2, fillColor: '#3d9af0', fillOpacity: .16, dashArray: '5 5' }} />
        <CircleMarker center={[incident.latitude, incident.longitude]} radius={isSelected ? 10 : 8} pathOptions={{ color: '#ffe0dc', weight: 2, fillColor: '#c33e36', fillOpacity: .96 }} eventHandlers={{ click: () => onSelect(incident.id) }}>
          <Popup>
            <div className="incident-map-popup">
              <strong>{incident.type}</strong>
              <em>{incident.urgency} PRIORITY · {incident.status}</em>
              <span><b>Exact reported location:</b> {incident.location}</span>
              <span><b>People affected:</b> {incident.people_affected}</span>
              <span><b>Resources needed:</b> {incident.status === 'RESOLVED' ? 'No immediate resource request' : incident.primary_resource}</span>
              <span><b>Evidence:</b> {incident.evidence[0]}</span>
              <span><b>Coordinates:</b> {incident.latitude.toFixed(5)}, {incident.longitude.toFixed(5)}</span>
              <small>Blue circle is an illustrative response area for this demo, not a verified impact boundary.</small>
            </div>
          </Popup>
        </CircleMarker>
        {sites.map((site) => <CircleMarker key={`${incident.id}-${site.kind}`} center={[site.latitude, site.longitude]} radius={7} pathOptions={{ color: '#d8f1ff', weight: 2, fillColor: '#1789d2', fillOpacity: .98 }}>
          <Tooltip direction="top" offset={[0, -7]} permanent>{site.kind} · {site.name}</Tooltip>
        </CircleMarker>)}
      </React.Fragment>;
    })}
  </MapContainer>;
}
