import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { supabase } from "../lib/supabase";

type Property = {
  id: string;
  estate_id: string | null;
  title: string;
  property_type: string;
  listing_type: string;
  location: string | null;
  price: number;
  bedrooms: number;
  bathrooms: number;
  status: string;
  primary_image?: string | null;
};

type Estate = {
  id: string;
  name: string;
};

type PropertyImage = {
  id: string;
  property_id: string;
  image_url: string;
  is_primary: boolean;
};

type PropertiesProps = {
  onBack: () => void;
};

export default function Properties({ onBack }: PropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [estates, setEstates] = useState<Estate[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<PropertyImage[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [estateId, setEstateId] = useState("");
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState("sale");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCompany();
  }, []);

  useEffect(() => {
    if (companyId) {
      loadEstates();
      loadProperties();
    }
  }, [companyId]);

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

    if (error) {
      console.error(error);
      setMessage("Company not found.");
      return;
    }

    setCompanyId(data.id);
  };

  const loadEstates = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("estates")
      .select("id,name")
      .eq("company_id", companyId)
      .order("name");

    if (error) {
      console.error(error);
      return;
    }

    setEstates(data || []);
  };

  const loadProperties = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("properties")
      .select(
        `
          id,
          estate_id,
          title,
          property_type,
          listing_type,
          location,
          price,
          bedrooms,
          bathrooms,
          status,
          property_images (
            image_url,
            is_primary
          )
        `
      )
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const formattedProperties =
      data?.map((property: any) => {
        const primaryImage =
          property.property_images?.find(
            (image: any) => image.is_primary
          )?.image_url ||
          property.property_images?.[0]?.image_url ||
          null;

        return {
          id: property.id,
          estate_id: property.estate_id,
          title: property.title,
          property_type: property.property_type,
          listing_type: property.listing_type,
          location: property.location,
          price: property.price,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          status: property.status,
          primary_image: primaryImage,
        };
      }) || [];

      setProperties(formattedProperties);
    };

    const getEstateName = (id: string | null) => {
      if (!id) return "No estate assigned";

      return (
        estates.find((estate) => estate.id === id)?.name ||
        "Estate"
      );
    };

    const resetForm = () => {
      setEditingId(null);
      setEstateId("");
      setTitle("");
      setPropertyType("");
      setListingType("sale");
      setLocation("");
      setPrice("");
      setBedrooms("");
      setBathrooms("");
      setExistingImages([]);
      setImageFiles([]);
    };

    const loadPropertyImages = async (propertyId: string) => {
      const { data, error } = await supabase
        .from("property_images")
        .select("id,property_id,image_url,is_primary")
        .eq("property_id", propertyId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setExistingImages(data || []);
    };

  const startEditing = async (property: Property) => {
    setEditingId(property.id);
    setEstateId(property.estate_id || "");
    setTitle(property.title);
    setPropertyType(property.property_type);
    setListingType(property.listing_type);
    setLocation(property.location || "");
    setPrice(String(property.price));
    setBedrooms(String(property.bedrooms));
    setBathrooms(String(property.bathrooms));
    setImageFiles([]);
    setMessage("");

    await loadPropertyImages(property.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const uploadPropertyImages = async (propertyId: string) => {
    if (imageFiles.length === 0) return;

    for (let index = 0; index < imageFiles.length; index++) {
      const file = imageFiles[index];

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const filePath = `${propertyId}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("property-images")
        .getPublicUrl(filePath);

      const { count } = await supabase
        .from("property_images")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("property_id", propertyId);

      const { error: imageError } = await supabase
        .from("property_images")
        .insert({
          property_id: propertyId,
          image_url: publicUrl,
          is_primary: (count || 0) === 0 && index === 0,
          sort_order: (count || 0) + index,
        });

      if (imageError) {
        throw imageError;
      }
    }
  };

  const deletePropertyImage = async (image: PropertyImage) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmed) return;

    try {
      const marker = "/property-images/";
      const position = image.image_url.indexOf(marker);

      if (position !== -1) {
        const storagePath = image.image_url.substring(
          position + marker.length
        );

        const { error: storageError } = await supabase.storage
          .from("property-images")
          .remove([storagePath]);

        if (storageError) {
          throw storageError;
        }
      }

      const { error } = await supabase
        .from("property_images")
        .delete()
        .eq("id", image.id);

      if (error) throw error;

      await loadPropertyImages(image.property_id);
      await loadProperties();

      setMessage("Image deleted successfully.");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    }
  };

  const setPrimaryImage = async (image: PropertyImage) => {
    try {
      const { error: resetError } = await supabase
        .from("property_images")
        .update({
          is_primary: false,
        })
        .eq("property_id", image.property_id);

      if (resetError) throw resetError;

      const { error } = await supabase
        .from("property_images")
        .update({
          is_primary: true,
        })
        .eq("id", image.id);

      if (error) throw error;

      await loadPropertyImages(image.property_id);
      await loadProperties();

      setMessage("Primary image updated.");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    }
  };

  const saveProperty = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId) {
      setMessage("Company not found.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (editingId) {
        const { error } = await supabase
          .from("properties")
          .update({
            estate_id: estateId || null,
            title,
            property_type: propertyType,
            listing_type: listingType,
            location,
            price: Number(price),
            bedrooms: Number(bedrooms || 0),
            bathrooms: Number(bathrooms || 0),
          })
          .eq("id", editingId)
          .eq("company_id", companyId);

        if (error) throw error;

        // Upload new images added during edit
        await uploadPropertyImages(editingId);

        setMessage("Property updated successfully.");
      } else {
        const slug =
          title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") +
          "-" +
          Math.random().toString(36).substring(2, 7);

        const { data: newProperty, error } = await supabase
          .from("properties")
          .insert({
            company_id: companyId,
            estate_id: estateId || null,
            title,
            slug,
            property_type: propertyType,
            listing_type: listingType,
            location,
            price: Number(price),
            bedrooms: Number(bedrooms || 0),
            bathrooms: Number(bathrooms || 0),
            status: "available",
          })
          .select("id")
          .single();

        if (error) throw error;

        if (!newProperty) {
          throw new Error("Property could not be created.");
        }

        {editingId && existingImages.length > 0 && (
          <div>
            <label className="mb-3 block text-sm font-medium text-slate-300">
              Existing Images
            </label>

            <div className="grid grid-cols-2 gap-3">
              {existingImages.map((image) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950"
                >
                <img
                  src={image.image_url}
                  alt="Property"
                  className="aspect-[4/3] w-full object-cover"
                />

                <div className="space-y-2 p-3">
                  {image.is_primary ? (
                    <p className="text-xs font-semibold text-orange-400">
                      Primary Image
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(image)}
                      className="text-xs text-orange-400 hover:text-orange-300"
                    >
                      Set as Primary
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deletePropertyImage(image)}
                    className="block text-xs text-red-400 hover:text-red-300"
                  >
                    Delete Image
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

        // Upload property images
        await uploadPropertyImages(newProperty.id);

        setMessage("Property added successfully.");
      }

      resetForm();
      setImageFiles([]);

      await loadProperties();
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Property deleted successfully.");
    await loadProperties();
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

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-500">
              Property Management
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Properties
            </h1>

            <p className="mt-2 text-slate-400">
              Manage Zertop Limited property listings.
            </p>
          </div>

          <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
            <Plus size={24} />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* FORM */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">
              {editingId ? "Edit Property" : "Add Property"}
            </h2>

            <form onSubmit={saveProperty} className="space-y-4">
              {/* ESTATE */}
              <select
                value={estateId}
                onChange={(e) => setEstateId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="">Select Estate</option>

                {estates.map((estate) => (
                  <option key={estate.id} value={estate.id}>
                    {estate.name}
                  </option>
                ))}
              </select>

              {/* PROPERTY TITLE */}
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Property title"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              />

              {/* PROPERTY TYPE */}
              <input
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                required
                placeholder="Property type e.g. Duplex"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              />

              {/* LISTING TYPE */}
              <select
                value={listingType}
                onChange={(e) => setListingType(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
                <option value="lease">For Lease</option>
              </select>

              {/* LOCATION */}
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              />

              {/* PRICE */}
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                placeholder="Price"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Property Images
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => {
                    setImageFiles(
                      e.target.files ? Array.from(e.target.files) : []
                    );
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300"
                />

                {imageFiles.length > 0 && (
                  <p className="mt-2 text-xs text-slate-400">
                    {imageFiles.length} image
                    {imageFiles.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>

              {/* BEDROOMS / BATHROOMS */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  min="0"
                  placeholder="Bedrooms"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
                />

                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  min="0"
                  placeholder="Bathrooms"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              {message && (
                <p className="text-sm text-slate-300">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-orange-500 py-3 font-semibold transition hover:bg-orange-600 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Property"
                  : "Add Property"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full rounded-xl border border-slate-700 py-3 text-slate-300 hover:bg-slate-800"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          {/* PROPERTY LIST */}
          <div>
            {properties.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
                <p className="text-slate-400">
                  No properties added yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                  >
                    {property.primary_image ? (
                      <div className="aspect-[16/10] w-full bg-slate-800">
                        <img
                          src={property.primary_image}
                          alt={property.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/10] items-center justify-center bg-slate-800 text-sm text-slate-500">
                        No property image
                      </div>
                    )}

                    <div className="p-5">
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase text-orange-400">
                          {property.status}
                        </span>

                        <h3 className="mt-3 text-xl font-bold">
                          {property.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          {property.property_type}
                        </p>

                        <p className="mt-2 text-sm font-medium text-orange-400">
                          {getEstateName(property.estate_id)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(property)}
                          className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:text-white"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteProperty(property.id)
                          }
                          className="rounded-lg border border-red-900 p-2 text-red-400 hover:bg-red-950"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 text-sm text-slate-400">
                      <p>
                        {property.location ||
                          "Location not specified"}
                      </p>

                      <p>
                        {property.bedrooms} Bedrooms •{" "}
                        {property.bathrooms} Bathrooms
                      </p>

                      <p className="capitalize">
                        {property.listing_type === "sale"
                          ? "For Sale"
                          : property.listing_type === "rent"
                          ? "For Rent"
                          : "For Lease"}
                      </p>

                      <p className="text-lg font-bold text-white">
                        ₦
                        {Number(
                          property.price
                        ).toLocaleString()}
                      </p>
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