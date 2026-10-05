const { supabase, supabaseAdmin } = require("../supabaseClient");

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const db = supabaseAdmin || supabase;

    // Fetch conversations where user is participant 1 or 2
    const { data: convs, error } = await db
      .from('conversations')
      .select(`
        id,
        updated_at,
        p1:profiles!participant1_id(id, full_name, role),
        p2:profiles!participant2_id(id, full_name, role)
      `)
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Format for frontend
    const formatted = convs.map(c => {
      const otherPerson = c.p1.id === userId ? c.p2 : c.p1;
      return {
        id: c.id,
        other_user: otherPerson,
        updated_at: c.updated_at
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error("getConversations error:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: conversationId } = req.params;
    const db = supabaseAdmin || supabase;

    // Verify user is in conversation
    const { data: conv } = await db
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .single();
      
    if (!conv) return res.status(403).json({ error: "Not authorized or conversation not found" });

    const { data: messages, error } = await db
      .from('messages')
      .select('id, sender_id, text, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.status(200).json(messages);
  } catch (error) {
    console.error("getMessages error:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId, text, conversationId } = req.body;
    const db = supabaseAdmin || supabase;
    
    let convId = conversationId;

    // If no conversationId, check if one exists or create it
    if (!convId) {
      if (!targetUserId) return res.status(400).json({ error: "targetUserId required if no conversationId" });
      
      const { data: existing } = await db
        .from('conversations')
        .select('id')
        .or(`and(participant1_id.eq.${userId},participant2_id.eq.${targetUserId}),and(participant1_id.eq.${targetUserId},participant2_id.eq.${userId})`)
        .maybeSingle();
        
      if (existing) {
        convId = existing.id;
      } else {
        const { data: newConv, error: convError } = await db
          .from('conversations')
          .insert({ participant1_id: userId, participant2_id: targetUserId })
          .select('id')
          .single();
          
        if (convError) throw convError;
        convId = newConv.id;
      }
    }

    // Insert message
    const { data: message, error: msgError } = await db
      .from('messages')
      .insert({
        conversation_id: convId,
        sender_id: userId,
        text
      })
      .select('*')
      .single();
      
    if (msgError) throw msgError;
    
    // Update conversation timestamp
    await db.from('conversations').update({ updated_at: new Date() }).eq('id', convId);

    res.status(201).json(message);
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

const getUsers = async (req, res) => {
  try {
    const db = supabaseAdmin || supabase;
    const { data: users, error } = await db
      .from('profiles')
      .select('id, full_name, role')
      .neq('id', req.user.id)
      .limit(50);
      
    if (error) throw error;
    res.status(200).json(users);
  } catch (error) {
    console.error("getUsers error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

module.exports = { getConversations, getMessages, sendMessage, getUsers };
