# Google Apps Script Webhook Setup

This file contains the Google Apps Script code for the Gudi Padwa leads webhook.

## Setup Instructions

1. **Create a new Google Apps Script project:**
   - Go to [script.google.com](https://script.google.com)
   - Click "New project"
   - Delete the default code and paste the code below

2. **Deploy as Web App:**
   - Click "Deploy" > "New deployment"
   - Select "Web app" as the deployment type
   - Set "Execute as" to "Me" (your Google account)
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
   - Copy the Web app URL and update it in the GudiPadwaOffer.tsx component

## Google Apps Script Code

```javascript
// Google Apps Script for Gudi Padwa Leads Webhook
// Replace 'YOUR_SPREADSHEET_ID' with your actual Google Sheet ID

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const SHEET_NAME = 'Gudi Padwa Leads';

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get or create the spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Set up headers
      sheet.getRange('A1:E1').setValues([[
        'Name',
        'Phone', 
        'Email',
        'Property Type',
        'Source Page',
        'Timestamp'
      ]]);
      sheet.getRange('A1:F1').setFontWeight('bold');
      sheet.autoResizeColumn(1, 6);
    }
    
    // Add new row with the lead data
    sheet.appendRow([
      data.name || '',
      data.phone || '',
      data.email || '',
      data.propertyType || '',
      data.source || '',
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    ]);
    
    // Auto-resize columns for better readability
    sheet.autoResizeColumn(1, 6);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Lead data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error processing webhook: ' + error.toString());
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Failed to save lead data',
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to create a new spreadsheet and return its ID
function createSpreadsheet() {
  const ss = SpreadsheetApp.create('Gudi Padwa Leads Database');
  const sheet = ss.getActiveSheet();
  sheet.setName(SHEET_NAME);
  
  // Set up headers
  sheet.getRange('A1:F1').setValues([[
    'Name',
    'Phone', 
    'Email',
    'Property Type',
    'Source Page',
    'Timestamp'
  ]]);
  sheet.getRange('A1:F1').setFontWeight('bold');
  
  // Share settings (optional - make it accessible to your team)
  ss.addEditor(Session.getEffectiveUser().getEmail());
  
  Logger.log('Spreadsheet created with ID: ' + ss.getId());
  return ss.getId();
}

// Test function to verify the setup
function testWebhook() {
  const testData = {
    name: 'Test User',
    phone: '9876543210',
    email: 'test@example.com',
    propertyType: '2 BHK',
    source: '/design-studio'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log('Test result: ' + result.getContent());
}
```

## How to Get Your Spreadsheet ID

1. Create a new Google Sheet at [sheets.google.com](https://sheets.google.com)
2. Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Replace `YOUR_SPREADSHEET_ID` in the script with your actual ID

## Security Notes

- The webhook is set to accept requests from anyone
- Consider adding authentication if you need additional security
- You can restrict access by IP address in Google Apps Script if needed

## Testing

Use the `testWebhook()` function in the Google Apps Script editor to test the setup before deploying.

## Webhook URL Format

After deployment, your webhook URL will look like:
```
https://script.google.com/macros/s/SCRIPT_ID/exec
```

Replace `YOUR_WEBHOOK_URL_HERE` in the GudiPadwaOffer.tsx component with this URL.
