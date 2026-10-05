const { supabaseAdmin, supabase } = require('./supabaseClient');

const clearAll = async () => {
  const db = supabaseAdmin || supabase;
  
  if (!supabaseAdmin) {
    console.error("No service role key provided, may lack permissions to delete all.");
  }
  
  try {
    // 1. Delete all bookings
    console.log("Deleting all bookings...");
    const { error: deleteError } = await db
      .from('bookings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything
      
    if (deleteError) throw deleteError;
    console.log("✅ Successfully deleted all bookings.");

    // 2. Reset all storage units to available
    console.log("Resetting all storage units to available...");
    const { error: updateError } = await db
      .from('storage_units')
      .update({ is_available: true })
      .neq('id', '00000000-0000-0000-0000-000000000000');
      
    if (updateError) throw updateError;
    console.log("✅ Successfully reset all storage units.");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    process.exit(0);
  }
};

clearAll();
