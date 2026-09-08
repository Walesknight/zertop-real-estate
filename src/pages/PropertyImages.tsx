import { useEffect, useState } from "react";
import { Trash2, ImagePlus } from "lucide-react";
import { supabase } from "../lib/supabase";

type Property = {
  id: string;
  title: string;
};

type PropertyImage = {
  id: string;
  property_id: string;
  image_url: string;
  is_primary: boolean;
};

type PropertyImagesProps = {
  onBack: () => void;
};

export default function PropertyImages({
  onBack,
}: PropertyImagesProps) {
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [properties, setProperties] = useState<Property[]>([]);
  const [images, setImages] = useState<PropertyImage[]>([]);

  const [propertyId, setPropertyId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCompany();
  }, []);

  useEffect(() => {
    if (companyId) {
      loadProperties();
    }
  }, [companyId]);

  useEffect(() => {
    if (propertyId) {
      loadImages();
    } else {
      setImages([]);
    }
  }, [propertyId]);

  const loadCompany = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (error || !data) {
      setMessage("Company not found.");
      return;
    }

    setCompanyId(data.id);
  };

  const loadProperties = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("properties")
      .select("id,title")
      .eq("company_id", companyId)
      .order("title");

    if (error) {
      console.error(error);
      return;
    }

    setProperties(data || []);
  };

  const loadImages = async () => {
    if (!propertyId) return;

    const { data, error } = await supabase
      .from("property_images")
      .select("*")
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setImages(data || []);
  };

  const uploadImage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!propertyId) {
      setMessage("Select a property.");
      return;
    }

    if (!file) {
      setMessage("Select an image.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const extension = file.name.split(".").pop();

      const fileName = `${propertyId}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      const firstImage = images.length === 0;

      const { error: databaseError } = await supabase
        .from("property_images")
        .insert({
          property_id: propertyId,
          image_url: publicUrl,
          is_primary: firstImage,
        });

      if (databaseError) throw databaseError;

      setFile(null);
      setMessage("Image uploaded successfully.");

      await loadImages();
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Image upload failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const setPrimaryImage = async (imageId: string) => {
    if (!propertyId) return;

    await supabase
      .from("property_images")
      .update({ is_primary: false })
      .eq("property_id", propertyId);

    const { error } = await supabase
      .from("property_images")
      .update({ is_primary: true })
      .eq("id", imageId);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadImages();
  };

  const deleteImage = async (image: PropertyImage) => {
    if (!window.confirm("Delete this image?")) return;

    const url = image.image_url;

    const marker = "/property-images/";

    const position = url.indexOf(marker);

    if (position !== -1) {
      const storagePath = url.substring(
        position + marker.length
      );

      await supabase.storage
        .from("property-images")
        .remove([storagePath]);
    }

    const { error } = await supabase
      .from("property_images")
      .delete()
      .eq("id", image.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadImages();
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={onBack}
          className="mb-5 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          ← Back to Dashboard
        </button>

        <div className="mb-8">
          <p className="text-sm font-semibold text-orange-500">
            Property Media
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Property Images
          </h1>

          <p className="mt-2 text-slate-400">
            Upload and manage photos for Zertop property listings.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex items-center gap-3">
              <ImagePlus className="text-orange-500" />

              <h2 className="text-xl font-semibold">
                Upload Image
              </h2>
            </div>

            <form onSubmit={uploadImage} className="space-y-4">
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
              >
                <option value="">Select Property</option>

                {properties.map((property) => (
                  <option
                    key={property.id}
                    value={property.id}
                  >
                    {property.title}
                  </option>
                ))}
              </select>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm"
              />

              {message && (
                <p className="text-sm text-slate-300">
                  {message}
                </p>
              )}

              <button
                disabled={loading}
                className="w-full rounded-xl bg-orange-500 py-3 font-semibold hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload Image"}
              </button>
            </form>
          </div>

          <div>
            {!propertyId ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                Select a property to view its images.
              </div>
            ) : images.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                No images uploaded for this property.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                  >
                    <div className="aspect-[4/3] bg-slate-800">
                      <img
                        src={image.image_url}
                        alt="Property"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-4">
                      {image.is_primary ? (
                        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
                          Primary Image
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            setPrimaryImage(image.id)
                          }
                          className="text-sm text-orange-400 hover:text-orange-300"
                        >
                          Set as Primary
                        </button>
                      )}

                      <button
                        onClick={() => deleteImage(image)}
                        className="mt-4 flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}