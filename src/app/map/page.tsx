import SupporterMap from "@/components/mapexample";

const supporters = [
  { id: "1", name: "Ali", lat: 9.56, lng: 44.06 },
  { id: "2", name: "Amina", lat: 9.57, lng: 44.07 },
  { id: "3", name: "Hassan", lat: 9.5, lng: 44.02 },
];

export default function SupportersPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-3">Supporters Map</h1>
      <SupporterMap supporters={supporters} />
    </div>
  );
}
