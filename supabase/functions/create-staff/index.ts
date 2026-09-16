import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: "Missing authorization header.",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const anonKey =
      Deno.env.get("SUPABASE_ANON_KEY");

    const serviceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      throw new Error(
        "Required Supabase environment variables are missing."
      );
    }

    // =====================================
    // LOGGED-IN ADMIN CLIENT
    // =====================================

    const userClient = createClient(
      supabaseUrl,
      anonKey,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized.",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // =====================================
    // VERIFY ADMIN + GET COMPANY
    // =====================================

    const {
      data: adminRecord,
      error: adminError,
    } = await userClient
      .from("staff_members")
      .select(
        "id,role,active,company_id"
      )
      .eq("user_id", user.id)
      .eq("role", "admin")
      .eq("active", true)
      .maybeSingle();

    if (adminError) {
      console.error(
        "Admin verification error:",
        adminError
      );

      return new Response(
        JSON.stringify({
          error: adminError.message,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!adminRecord) {
      return new Response(
        JSON.stringify({
          error:
            "Only administrators can add staff.",
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!adminRecord.company_id) {
      return new Response(
        JSON.stringify({
          error:
            "Your administrator account is not linked to a company.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // =====================================
    // FORM DATA
    // =====================================

    const body = await req.json();

    const fullName = String(
      body.fullName ?? ""
    ).trim();

    const email = String(
      body.email ?? ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      body.password ?? ""
    );

    const role = String(
      body.role ?? ""
    );

    if (
      !fullName ||
      !email ||
      !password ||
      !role
    ) {
      return new Response(
        JSON.stringify({
          error: "All fields are required.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const allowedRoles = [
      "admin",
      "manager",
      "realtor",
      "staff",
    ];

    if (!allowedRoles.includes(role)) {
      return new Response(
        JSON.stringify({
          error: "Invalid staff role.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({
          error:
            "Password must be at least 6 characters.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // =====================================
    // PRIVILEGED SERVER CLIENT
    // =====================================

    const adminClient = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // =====================================
    // CREATE AUTH USER
    // =====================================

    const {
      data: createdUser,
      error: createUserError,
    } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    });

    if (
      createUserError ||
      !createdUser.user
    ) {
      return new Response(
        JSON.stringify({
          error:
            createUserError?.message ??
            "Unable to create staff account.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // =====================================
    // CREATE STAFF RECORD
    // =====================================

    const { error: staffInsertError } =
      await adminClient
        .from("staff_members")
        .insert({
          user_id: createdUser.user.id,
          full_name: fullName,
          role,
          active: true,

          // Automatically link new staff
          // to the same company as the admin.
          company_id:
            adminRecord.company_id,
        });

    if (staffInsertError) {
      await adminClient.auth.admin.deleteUser(
        createdUser.user.id
      );

      return new Response(
        JSON.stringify({
          error:
            staffInsertError.message,
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Staff account created successfully.",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "create-staff error:",
      error
    );

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});