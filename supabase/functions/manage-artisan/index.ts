import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Fix: Declare Deno global to resolve TypeScript errors in environments that don't have Deno types loaded.
declare const Deno: any;

// CORS headers for preflight and actual requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // Explicitly allow POST method
}

// Helper to safely delete a storage object from a public URL
const deleteStorageObject = async (supabaseAdmin: any, bucket: string, url: string | null) => {
    if (!url) return;
    try {
        // Extract path from a URL like: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
        const urlObject = new URL(url);
        const path = urlObject.pathname.split(`/${bucket}/`)[1];
        if (path) {
            await supabaseAdmin.storage.from(bucket).remove([path]);
        }
    } catch (e) {
        // Log error but don't throw, to allow deletion to proceed
        console.error(`Failed to parse or delete URL ${url}:`, e.message);
    }
};


serve(async (req) => {
  // Handle CORS preflight requests. This is a standard requirement for browsers
  // to check permissions before sending the actual request.
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204, // No Content
      headers: corsHeaders,
    });
  }

  try {
    // Create a Supabase client with the service_role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const { action, payload } = await req.json()

    switch (action) {
      case 'CREATE': {
        const { artisanData, password } = payload;
        const { email } = artisanData;
        
        // 1. Create the auth user
        const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          password: password,
          email_confirm: true, // Auto-confirm email
        });

        if (authError) throw authError;
        if (!user) throw new Error('User creation failed.');

        // 2. Insert the artisan profile, linking it to the new auth user
        const { data: newArtisan, error: insertError } = await supabaseAdmin
          .from('artisans')
          .insert({ ...artisanData, auth_user_id: user.id })
          .select()
          .single();
        
        if (insertError) {
          // If profile insert fails, clean up the created auth user to prevent orphans
          await supabaseAdmin.auth.admin.deleteUser(user.id);
          throw insertError;
        }

        return new Response(JSON.stringify(newArtisan), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'UPDATE': {
        const { updatedArtisan, newPassword } = payload;
        const { id, auth_user_id, email, ...updateData } = updatedArtisan;

        // 1. Update auth user if email or password is changed
        const { data: { user: existingUser }, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(auth_user_id);
        if(getUserError) throw getUserError;

        if (newPassword || email !== existingUser.email) {
            const authUpdates: { email?: string; password?: string } = {};
            if (newPassword) authUpdates.password = newPassword;
            if (email) authUpdates.email = email;

            const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(auth_user_id, authUpdates);
            if (authError) throw authError;
        }

        // 2. Update artisan profile in the public table
        const { data: artisan, error: updateError } = await supabaseAdmin
            .from('artisans')
            .update({ ...updateData, email }) // ensure email is also updated here
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;

        return new Response(JSON.stringify(artisan), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'DELETE': {
        const { id, auth_user_id } = payload;

        // 1. Get artisan data to find image URLs for deletion
        const { data: artisanToDelete, error: fetchError } = await supabaseAdmin
            .from('artisans')
            .select('profile_image_url, cover_image_url, gallery_urls')
            .eq('id', id)
            .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "No rows found" error if profile is already gone
            throw new Error(`Could not fetch artisan to delete images: ${fetchError.message}`);
        }

        // 2. Delete all images from storage if the artisan was found
        if (artisanToDelete) {
            await deleteStorageObject(supabaseAdmin, 'profile-images', artisanToDelete.profile_image_url);
            await deleteStorageObject(supabaseAdmin, 'cover-images', artisanToDelete.cover_image_url);
            if (artisanToDelete.gallery_urls && artisanToDelete.gallery_urls.length > 0) {
                for (const url of artisanToDelete.gallery_urls) {
                    await deleteStorageObject(supabaseAdmin, 'gallery-images', url);
                }
            }
        }
        
        // 3. Delete the auth user (this will cascade or orphan the profile)
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(auth_user_id);
        // Don't throw if user is already deleted, just log it.
        if (authError && !authError.message.toLowerCase().includes('not found')) {
            throw new Error(`Could not delete auth user: ${authError.message}`);
        }

        // 4. Delete the artisan profile from the table
        const { error: dbError } = await supabaseAdmin.from('artisans').delete().eq('id', id);
        if (dbError) {
             throw new Error(`Could not delete artisan profile: ${dbError.message}`);
        }

        return new Response(JSON.stringify({ message: 'Artisan deleted successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'DELETE_GALLERY_IMAGE': {
        const { imageUrl } = payload;
        await deleteStorageObject(supabaseAdmin, 'gallery-images', imageUrl);
        return new Response(JSON.stringify({ message: 'Image deleted from storage' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action specified' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500, // Use 500 for server-side errors
    });
  }
});
