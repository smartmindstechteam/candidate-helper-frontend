"use client";

import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";

type Supporter = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export default function SupporterMap({
  supporters,
}: {
  supporters: Supporter[];
}) {
  const [selected, setSelected] = React.useState<Supporter | null>(null);
  const [addSupporters, setAddingSupporters] = React.useState<
    { lat: number; lng: number }[]
  >([
    {
      lat: 9.944378012794473,
      lng: 43.178347167969264,
    },
    {
      lat: 10.014708668263154,
      lng: 43.35412841796875,
    },
    {
      lat: 10.67937623634873,
      lng: 43.93091064453185,
    },
    {
      lat: 10.26344790380655,
      lng: 44.59009033203125,
    },
    {
      lat: 9.949788602016227,
      lng: 45.31518798828168,
    },
    {
      lat: 10.420161643564654,
      lng: 45.260256347656394,
    },
    {
      lat: 9.971430062147505,
      lng: 44.72192626953114,
    },
  ]);
  return (
    <div className="w-full h-[600px]">
      <Map
        mapLib={import("maplibre-gl")}
        initialViewState={{
          longitude: 44.06,
          latitude: 9.56,
          zoom: 7,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https:tiles.stadiamaps.com/styles/alidade_smooth.json"
        onClick={(e) =>
          setAddingSupporters((s) => {
            console.log(addSupporters);
            return [...s, { lat: e.lngLat.lat, lng: e.lngLat.lng }];
          })
        }
      >
        {addSupporters.map((s) => (
          <Marker longitude={s.lng} latitude={s.lat} key={s.lat}>
            <div className="bg-blue-500 rounded-full w-3 h-3 border-2 border-white cursor-pointer" />
          </Marker>
        ))}

        {selected && (
          <Popup
            longitude={selected.lng}
            latitude={selected.lat}
            onClose={() => setSelected(null)}
            closeButton={true}
            anchor="top"
          >
            <div className="text-sm">
              <strong>{selected.name}</strong>
              <p>Lat: {selected.lat.toFixed(3)}</p>
              <p>Lng: {selected.lng.toFixed(3)}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
