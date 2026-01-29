import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 1. Form State
  const [formData, setFormData] = useState({
    startPointt: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    noOfPeople: 1,
    preferences: [], // We will just use text for now to keep it simple
    transportation: [],
  });

  const transportOptions = [
    "Train",
    "Flight",
    "Bus",
    "Bike",
    "Walk",
    "Car",
    "Self Drive",
  ];

  // 2. Handle Text Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Special handler for Checkboxes
  const handleTransportChange = (option) => {
    const current = formData.transportation;
    if (current.includes(option)) {
      // Remove if already selected
      setFormData({
        ...formData,
        transportation: current.filter((item) => item !== option),
      });
    } else {
      // Add if not selected
      setFormData({ ...formData, transportation: [...current, option] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://ai-itinerary-planner-henna.vercel.app/api/generate-itinerary",
        {
          ...formData,
          preferences: formData.preferences.split(","),
        },
      );

      navigate(`/itinerary/${response.data._id}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate plan. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='form-container'>
      <h1>🌍 Plan Your Journey</h1>

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

        <div className='row'>
          <div className='form-group'>
            <label>Start Date</label>
            <input
              type='date'
              name='startDate'
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>End Date</label>
            <input
              type='date'
              name='endDate'
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className='form-group'>
          <label>Budget (INR)</label>
          <input
            type='number'
            name='budget'
            placeholder='20000'
            onChange={handleChange}
            required
          />
        </div>

        <div className='form-group'>
          <label>Travelers</label>
          <input
            type='number'
            name='noOfPeople'
            placeholder='2'
            onChange={handleChange}
            required
          />
        </div>

        {/* Transportation Selection */}
        <div className='form-group'>
          <label>Preferred Mode of Transport</label>
          <div className='checkbox-group'>
            {transportOptions.map((option) => (
              <label
                key={option}
                className={`checkbox-btn ${formData.transportation.includes(option) ? "active" : ""}`}
              >
                <input
                  type='checkbox'
                  checked={formData.transportation.includes(option)}
                  onChange={() => handleTransportChange(option)}
                  style={{ display: "none" }}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className='form-group'>
          <label>Other Preferences</label>
          <input
            name='preferences'
            placeholder='e.g., Veg Food, History, Trekking'
            onChange={handleChange}
          />
        </div>

        <button type='submit' disabled={loading} className='submit-btn'>
          {loading ? "✨ Generating Plan..." : "🚀 Generate Itinerary"}
        </button>
      </form>
    </div>
  );
}
