import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) throw new Error("Não autenticado");

    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin");
    if (!roles || roles.length === 0) throw new Error("Sem permissão de admin");

    const { full_name, email, phone } = await req.json();
    if (!email || !full_name) throw new Error("Nome e email são obrigatórios");

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    let hostId: string;

    if (existing) {
      hostId = existing.id;
      // Ensure hospedeiro role
      await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: hostId, role: "hospedeiro" }, { onConflict: "user_id,role" });
    } else {
      // Create new user with random password (they'll use "forgot password" to access)
      const tempPassword = crypto.randomUUID() + "Aa1!";
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { full_name },
      });
      if (createError) throw createError;
      hostId = newUser.user.id;

      // Update profile phone if provided
      if (phone) {
        await supabaseAdmin
          .from("profiles")
          .update({ phone })
          .eq("user_id", hostId);
      }

      // Add hospedeiro role (trigger already adds 'turista')
      await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: hostId, role: "hospedeiro" });

      // Add host benefits
      await supabaseAdmin.rpc("become_host", { _user_id: hostId });
    }

    return new Response(JSON.stringify({ host_id: hostId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
