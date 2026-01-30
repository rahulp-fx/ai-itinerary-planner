import { useState, useEffect } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

// Fix for default Leaflet marker icons not showing in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to auto-zoom the map to fit both markers
function MapUpdater({ startCoords, destCoords }) {
  const map = useMap();
  useEffect(() => {
    if (startCoords && destCoords) {
      const bounds = L.latLngBounds([startCoords, destCoords]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (startCoords) {
      map.flyTo(startCoords, 10);
    } else if (destCoords) {
      map.flyTo(destCoords, 10);
    }
  }, [startCoords, destCoords, map]);
  return null;
}

export default function Home() {
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);

  // 1. Form State
  const [formData, setFormData] = useState({
    startPoint: "",
    destination: "",
    // startDate: "",
    // endDate: "",
    // budget: "",
    // noOfPeople: 1,
    // preferences: [], // We will just use text for now to keep it simple
    // transportation: [],
  });

  // Coordinates for the map
  const [startCoords, setStartCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to convert City Name -> Lat/Lng
  const geocodeCity = async (city, setCoords) => {
    if (!city) return;
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${city}`,
      );
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setCoords([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  // Debounce search (wait 1 sec after typing stops to fetch coords)
  useEffect(() => {
    const timer = setTimeout(() => {
      geocodeCity(formData.startPoint, setStartCoords);
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData.startPoint]);

  useEffect(() => {
    const timer = setTimeout(() => {
      geocodeCity(formData.destination, setDestCoords);
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData.destination]);

  // const transportOptions = [
  //   "Train",
  //   "Flight",
  //   "Bus",
  //   "Bike",
  //   "Walk",
  //   "Car",
  //   "Self Drive",
  // ];

  // Special handler for Checkboxes
  // const handleTransportChange = (option) => {
  //   const current = formData.transportation;
  //   if (current.includes(option)) {
  //     // Remove if already selected
  //     setFormData({
  //       ...formData,
  //       transportation: current.filter((item) => item !== option),
  //     });
  //   } else {
  //     // Add if not selected
  //     setFormData({ ...formData, transportation: [...current, option] });
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);

    navigate("/calendar", {
      state: {
        startPoint: formData.startPoint,
        destination: formData.destination,
      },
    });
  };

  return (
    <div className='form-container'>
      <h1>Plan Your Journey</h1>

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>From</label>
          <input
            name='startPoint'
            placeholder='e.g., Mumbai'
            onChange={handleChange}
            required
          />
        </div>

        <div className='form-group'>
          <label>To</label>
          <input
            name='destination'
            placeholder='e.g., Goa'
            onChange={handleChange}
            required
          />
        </div>

        <button type='submit' className='submit-btn'>
          Next
        </button>
      </form>
      {/* MAP SECTION */}
      <div
        style={{
          height: "300px",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #ddd",
        }}
      >
        <MapContainer
          center={[20.5937, 78.9629]} // Default center (India)
          zoom={4}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Start Marker */}
          {startCoords && (
            <Marker position={startCoords}>
              <Popup>Start: {formData.startPoint}</Popup>
            </Marker>
          )}

          {/* Destination Marker */}
          {destCoords && (
            <Marker position={destCoords}>
              <Popup>Dest: {formData.destination}</Popup>
            </Marker>
          )}

          {/* Auto-Zoom Component */}
          <MapUpdater startCoords={startCoords} destCoords={destCoords} />
        </MapContainer>
      </div>
    </div>
  );
}
