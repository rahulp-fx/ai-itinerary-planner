import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Interests() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // 1. Retrieve Data from ALL previous steps (Home -> Calendar -> Logistics)
  const { 
    startPoint, 
    destination, 
    startDate, 
    endDate, 
    budget, 
    noOfPeople, 
    transportation 
  } = location.state || {};

  // 2. Local State for Interests
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [otherPreferences, setOtherPreferences] = useState("");

  const interestOptions = [
    "History & Culture 🏛️", 
    "Adventure & Trekking 🧗", 
    "Nature & Wildlife 🌿", 
    "Food & Nightlife 🍜", 
    "Relaxation & Spa 🧖‍♀️", 
    "Shopping 🛍️", 
    "Beaches 🏖️", 
    "Religious Sites 🕉️"
  ];

  // Toggle Interest Selection
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // 3. FINAL SUBMIT - Call the Backend!
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Combine checkboxes and text input into one list for the AI
    const finalPreferences = [...selectedInterests];
    if (otherPreferences.trim()) {
      finalPreferences.push(otherPreferences);
    }

    const payload = {
      startPoint,
      destination,
      startDate,
      endDate,
      budget,
      noOfPeople,
      transportation, // This is an array (e.g., ["Flight", "Car"])
      preferences: finalPreferences // This is an array of strings
    };

    try {
      // 🚀 THE BIG API CALL
      // Make sure this matches your actual Vercel Backend URL
      const response = await axios.post(
        "https://ai-itinerary-planner-henna.vercel.app/api/generate-itinerary", 
        payload
      );
      
      // Navigate to the Result Page with the new Trip ID
      navigate(`/itinerary/${response.data._id}`);
    } catch (error) {
      console.error("Error generating trip:", error);
      alert("Something went wrong! Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Final Touches ✨</h1>
      <p style={{textAlign: "center", color: "#666", marginBottom: "20px"}}>
        What kind of experiences do you love?
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Interests</label>
          <div className="checkbox-group">
            {interestOptions.map(interest => (
              <label 
                key={interest} 
                className={`checkbox-btn ${selectedInterests.includes(interest) ? 'active' : ''}`}
              >
                <input 
                  type="checkbox" 
                  checked={selectedInterests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                  style={{ display: 'none' }}
                />
                {interest}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Any Specific Requests?</label>
          <input 
            placeholder="e.g. I need wheelchair access, or Vegan food only" 
            value={otherPreferences}
            onChange={(e) => setOtherPreferences(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "✨ Dreaming up your trip..." : "🚀 Generate Itinerary"}
        </button>
      </form>
    </div>
  );
}