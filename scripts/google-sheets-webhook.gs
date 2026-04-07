// Google Apps Script Webhook for Akshay Tritiya Leads
function doGet(e) {
  return HtmlService.createHtmlOutput("Hello! This is the Akshay Tritiya Leads webhook. Please use POST requests.");
}

function doOptions(e) {
  // Handle CORS preflight requests
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    
    // Add a new row with the form data
    sheet.appendRow([
      data.name || '',
      data.phone || '',
      data.email || '',
      data.propertyType || '',
      data.source || '',
      new Date().toLocaleString()
    ]);
    
    // Return success response with CORS headers
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Lead saved successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

// Set up the webhook
function setupWebhook() {
  // This function helps you get the webhook URL
  const scriptUrl = ScriptApp.getService().getUrl();
  Logger.log('Your webhook URL is: ' + scriptUrl);
}
