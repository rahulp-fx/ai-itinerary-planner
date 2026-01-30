import {useState } from "react";
import {useNavigate,useLocation} from "react-router-dom";

export default function Logistics(){
  const navigate = useNavigate();
  const location = useLocation();

  // get data from previous page
  const {startPoint, destination,startDate,endDate} = location.state || {};

  //local state for this page
  const [formData, setFormData] = useState({
    budget: "",
    travelerTypes: "", //"solo","couple","family","friends"
    noOfPeople: 1,
    transportation: []
  });

  const transportOptions = ["Train","Flight", "Bus", "Car", "Self Drive", "Bike" , "Walk"];
  const travelerTypes = ["Solo","Couple","Family","Friends"];

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleTravelerTypeChange = (type) => {
    let count = 1;
    if (type === "Solo") count = 1;
    if (type === "Couple") count = 2;
    if (type === "Family" || type === "Friends") count = 3; // Default starting number

    setFormData({ 
      ...formData, 
      travelerType: type, // Updates the active state
      noOfPeople: count   // Updates the number input
    });
  };

  const handleTransportChange = (option) => {
    const current = formData.transportation;
    if (current.includes(option)) {
      setFormData({ ...formData, transportation: current.filter(item => item !== option) });
    } else {
      setFormData({ ...formData, transportation: [...current, option] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/interests", {
      state: {
        startPoint,
        destination,
        startDate,
        endDate,
        budget: formData.budget,
        noOfPeople: formData.noOfPeople,
        transportation: formData.transportation
      }
    });
  };

  return (
    <div className="form-container">
      <h1>Trip Logistics 🧳</h1>
      <p style={{textAlign: "center", color: "#666", marginBottom: "20px"}}>
        For {destination}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Total Budget (INR)</label>
          <input 
            type="number" 
            name="budget" 
            placeholder="e.g. 25000" 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* NEW: Traveler Type Selection */}
        <div className="form-group">
          <label>Who are you traveling with?</label>
          <div className="checkbox-group" style={{ marginBottom: "15px" }}>
            {travelerTypes.map(type => (
              <label 
                key={type} 
                className={`checkbox-btn ${formData.travelerType === type ? 'active' : ''}`}
                onClick={() => handleTravelerTypeChange(type)}
              >
                {type}
              </label>
            ))}
          </div>

          {/* Conditional Input: Show ONLY if Family or Friends is selected */}
          {(formData.travelerType === "Family" || formData.travelerType === "Friends") && (
            <div style={{ animation: "fadeIn 0.5s" }}>
              <label style={{ fontSize: "0.9rem", color: "#666" }}>How many people?</label>
              <input 
                type="number" 
                name="noOfPeople" 
                value={formData.noOfPeople}
                onChange={handleChange} 
                min="2"
                required 
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Preferred Mode of Transport</label>
          <div className="checkbox-group">
            {transportOptions.map(option => (
              <label key={option} className={`checkbox-btn ${formData.transportation.includes(option) ? 'active' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={formData.transportation.includes(option)}
                  onChange={() => handleTransportChange(option)}
                  style={{ display: 'none' }}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Next: Select Interests →
        </button>
      </form>
    </div>
  );
}