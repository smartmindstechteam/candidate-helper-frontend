"use client";

import { useRegions } from "@/hooks/api/useGeography";

const Page = () => {
  const { data, isLoading, isError } = useRegions();
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading regions.</p>}
      {data && (
        <ul>
          {data.map((region) => (
            <li key={region.id}>
              <h1>{region.name}</h1>
              <ul className="ps-3 text-xs">
                {region.districts.map((district) => (
                  <li key={district.id}>
                    {district.name} {district.pollingStations.length}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
