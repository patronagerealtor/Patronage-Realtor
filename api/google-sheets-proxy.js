// Google Sheets Proxy API
export async function POST(request) {
  try {
    const { name, phone, email, propertyType, source } = await request.json();
    
    // Forward to Google Apps Script
    const response = await fetch('https://script.google.com/macros/s/AKfycby0VUKW6idgXDHoSjV0nWYOiKfzGuOgp5a1J6Yi8K3k16Q7eaanrCXb7a31ZDkVfQ9S/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        phone,
        email,
        propertyType,
        source
      }),
    });
    
    if (!response.ok) {
      throw new Error('Google Sheets request failed');
    }
    
    const data = await response.json();
    return Response.json(data);
    
  } catch (error) {
    return Response.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
