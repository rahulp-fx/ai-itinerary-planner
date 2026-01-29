//  server/test_api.js
const fetch = require ('node-fetch');

async function testServer() {
  const response = await fetch('http://localhost:5000/api/generate-itinerary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      destination: "Goa",
      startDate: "2024-12-01",
      endDate: "2024-12-05",
      budget: 20000,
      noOfPeople: 2,
      preferences: ["Beach", "Party", "Scooter Rental"]
  })
});

const data = await response.json();
console.log(JSON.stringify(data,null,2));

}

testServer();