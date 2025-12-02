// Quick test script to verify property creation API
const testPropertyCreation = async () => {
  const testData = {
    title: "Test Property",
    slug: "test-property-" + Date.now(),
    location: "Brighton",
    region: "England",
    sleepsMin: 1,
    sleepsMax: 8,
    bedrooms: 4,
    bathrooms: 2,
    priceFromMidweek: 500,
    priceFromWeekend: 750,
    description: "Test property description",
    heroImage: "/placeholder.jpg",
    isPublished: false
  };

  try {
    console.log('Testing property creation...');
    console.log('Payload:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const responseText = await response.text();
    console.log('\nResponse Status:', response.status);
    console.log('Response:', responseText);

    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('\n✅ SUCCESS! Property created with ID:', data.id);
      return data;
    } else {
      console.log('\n❌ FAILED! Status:', response.status);
      try {
        const errorData = JSON.parse(responseText);
        console.log('Error:', errorData);
      } catch (e) {
        console.log('Raw error:', responseText);
      }
    }
  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
  }
};

testPropertyCreation();
