import { fetchPropertiesFromSupabase } from './src/lib/supabase.js';

async function testPerformance() {
  console.log('Testing Supabase query performance with direct fetch...');
  console.time('Total_Test_Time');

  try {
    const properties = await fetchPropertiesFromSupabase();
    console.log(`Fetched ${properties.length} properties`);
    console.timeEnd('Total_Test_Time');
  } catch (error) {
    console.error('Test failed:', error);
    console.timeEnd('Total_Test_Time');
  }
}

testPerformance();