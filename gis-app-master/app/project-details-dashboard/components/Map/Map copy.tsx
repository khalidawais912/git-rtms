// import { Library } from "@googlemaps/js-api-loader";
// import { GoogleMap, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
// import React, { useEffect, useState } from "react";
// import projectLocation from "../../../../public/images/projectLocation.png";
// import { SingleProjectDashboard } from "../ProjectDetailsDashboard";

// const containerStyle = {
//   width: "100%",
//   height: "411px",
//   borderRadius: "10px",
//   boxShadow: "0px 3px 10px 1px #c4c4c4",
// };

// interface Props {
//   data: SingleProjectDashboard;
// }

// const libraries: Library[] = ["marker"];

// function Map({ data }: Props) {
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`,
//     libraries, // Add "marker" to load the marker library
//   });

//   const [isOpen, setIsOpen] = useState(false);
//   const [map, setMap] = useState<google.maps.Map | null>(null);

//   // Ensure the coordinates are valid numbers
//   const center = {
//     lat: parseFloat(data.vehicalTrackings[0].endLat), // Default to 0 if parsing fails
//     lng: parseFloat(data.vehicalTrackings[0].endLong), // Default to 0 if parsing fails
//   };

//   // Log to check values
//   useEffect(() => {
//     console.log("Latitude:", center.lat, "Longitude:", center.lng);
//   }, [center]);

//   useEffect(() => {
//     if (isLoaded && map) {
//       // Check that center values are not 0
//       if (center.lat && center.lng) {
//         const { AdvancedMarkerElement } = google.maps.marker;

//         // Create a container div for the marker content
//         const markerContent = document.createElement("div");
//         markerContent.style.width = "43px";
//         markerContent.style.height = "51px";
//         markerContent.style.backgroundImage = `url(${projectLocation.src})`;
//         markerContent.style.backgroundSize = "cover";

//         // Initialize the AdvancedMarkerElement with custom content
//         new AdvancedMarkerElement({
//           map: map, // Set the map here
//           position: new google.maps.LatLng(center.lat, center.lng), // Ensure position is a LatLng object
//           content: markerContent as HTMLElement,
//         });
//       }
//     }
//   }, [isLoaded, map, center.lat, center.lng]);

//   return isLoaded ? (
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={center}
//       zoom={15} // Adjust zoom level here
//       mapTypeId="hybrid"
//       onLoad={(map) => setMap(map)}
//     >
//       {isOpen && (
//         <InfoWindow position={center} onCloseClick={() => setIsOpen(false)}>
//           <div
//             style={{
//               overflow: "hidden",
//               width: "300px",
//             }}
//           >
//             {/* <p className="fs-6 fw-normal m-0">{data.projectName}</p> */}
//           </div>
//         </InfoWindow>
//       )}
//     </GoogleMap>
//   ) : (
//     <></>
//   );
// }

// export default React.memo(Map);
