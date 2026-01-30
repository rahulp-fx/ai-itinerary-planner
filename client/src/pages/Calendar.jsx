import { useState } from "react";
// import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { DateRange } from "react-date-range";
import { format } from "date-fns";

export default function Calendar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { startPoint, destination } = location.state || {};

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);

    const start = format(dateRange[0].startDate, "dd-mm-yyyy");
    const end = format(dateRange[0].endDate, "dd-mm-yyyy");

    navigate("/interests", {
      state: {
        startPoint,
        destination,
        startDate: start,
        endDate: end,
      },
    });
  };

  return (
    <div className='form-container'>
      <h1>Select Dates for {destination || "Trip"}</h1>

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          {/* Calendar Container - Always Visible */}
          <div
            style={{
              marginTop: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              background: "white",
              padding: "10px",
            }}
          >
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              minDate={new Date()}
              rangeColors={["#667eea"]}
            />
          </div>
        </div>
        <button type='submit' className='submit-btn'>
          Next
        </button>
      </form>
    </div>
  );
}
