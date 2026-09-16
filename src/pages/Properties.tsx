import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  ImagePlus,
  LandPlot,
  MapPin,
  Pencil,
  Plus,
  Search,
  Star,
  Toilet,
  Trash2,
} from "lucide-react";

import { supabase } from "../lib/supabase";

type Property = {
  id: string;
  estate_id: string | null;
  title: string;
  property_type: string;
  listing_type: string;
  location: string | null;
  city: string | null;
  state: string | null;
  price: number;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  description: string | null;
  land_size: number | null;
  land_size_unit: string | null;
  initial_deposit: number;
  installment_months: number;
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

type MessageType = "success" | "error" | null;

export default function Properties({
  onBack,
}: PropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [estates, setEstates] = useState<Estate[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(
    null
  );

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<
    PropertyImage[]
  >([]);

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [estateId, setEstateId] = useState("");
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState("sale");

  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [toilets, setToilets] = useState("");

  const [description, setDescription] = useState("");

  const [landSize, setLandSize] = useState("");
  const [landSizeUnit, setLandSizeUnit] = useState("sqm");

  const [initialDeposit, setInitialDeposit] = useState("");
  const [installmentMonths, setInstallmentMonths] =
    useState("");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<MessageType>(null);

  const [fileInputKey, setFileInputKey] = useState(0);

  /* =====================================
     INITIAL LOAD
  ===================================== */

  useEffect(() => {
    loadCompany();
  }, []);

  useEffect(() => {
    if (!companyId) return;

    Promise.all([
      loadEstates(),
      loadProperties(),
    ]).finally(() => {
      setPageLoading(false);
    });
  }, [companyId]);

  /* =====================================
     COMPANY
  ===================================== */

  const loadCompany = async () => {
    setPageLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessageType("error");
      setMessage("Unable to find the logged-in user.");
      setPageLoading(false);
      return;
    }

    // Primary method: company assigned to staff account.
    const {
      data: staffMember,
      error: staffError,
    } = await supabase
      .from("staff_members")
      .select("company_id")
      .eq("user_id", user.id)
      .eq("active", true)
      .maybeSingle();

    if (staffError) {
      console.error(
        "Staff company lookup error:",
        staffError
      );
    }

    if (staffMember?.company_id) {
      setCompanyId(staffMember.company_id);
      return;
    }

    // Legacy fallback for company owner accounts.
    const {
      data: company,
      error: companyError,
    } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (companyError) {
      console.error(
        "Company lookup error:",
        companyError
      );
    }

    if (!company?.id) {
      setMessageType("error");
      setMessage(
        "This staff account is not linked to a company."
      );
      setPageLoading(false);
      return;
    }

    setCompanyId(company.id);
  };

  /* =====================================
     ESTATES
  ===================================== */

  const loadEstates = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("estates")
      .select("id,name")
      .eq("company_id", companyId)
      .order("name");

    if (error) {
      console.error("Estates error:", error);
      return;
    }

    setEstates(data || []);
  };

  /* =====================================
     PROPERTIES
  ===================================== */

  const loadProperties = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("properties")
      .select(`
        id,
        estate_id,
        title,
        property_type,
        listing_type,
        location,
        city,
        state,
        price,
        bedrooms,
        bathrooms,
        toilets,
        description,
        land_size,
        land_size_unit,
        initial_deposit,
        installment_months,
        status,
        property_images (
          image_url,
          is_primary
        )
      `)
      .eq("company_id", companyId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Properties loading error:", error);

      setMessageType("error");
      setMessage(error.message);
      return;
    }

    const formattedProperties =
      data?.map((property: any) => {
        const images =
          property.property_images || [];

        const primaryImage =
          images.find(
            (image: any) =>
              image.is_primary
          )?.image_url ||
          images[0]?.image_url ||
          null;

        return {
          id: property.id,
          estate_id: property.estate_id,
          title: property.title,
          property_type: property.property_type,
          listing_type: property.listing_type,
          location: property.location,
          city: property.city,
          state: property.state,
          price: property.price,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          toilets: property.toilets,
          description: property.description,
          land_size: property.land_size,
          land_size_unit:
            property.land_size_unit,
          initial_deposit:
            property.initial_deposit,
          installment_months:
            property.installment_months,
          status: property.status,
          primary_image: primaryImage,
        };
      }) || [];

    setProperties(formattedProperties);
  };

  /* =====================================
     HELPERS
  ===================================== */

  const getEstateName = (
    id: string | null
  ) => {
    if (!id) return "No estate assigned";

    return (
      estates.find(
        (estate) =>
          estate.id === id
      )?.name || "Estate"
    );
  };

  const resetForm = () => {
    setEditingId(null);

    setEstateId("");
    setTitle("");
    setPropertyType("");
    setListingType("sale");

    setLocation("");
    setCity("");
    setState("");

    setPrice("");
    setBedrooms("");
    setBathrooms("");
    setToilets("");

    setDescription("");

    setLandSize("");
    setLandSizeUnit("sqm");

    setInitialDeposit("");
    setInstallmentMonths("");

    setExistingImages([]);
    setImageFiles([]);
    setFileInputKey(
      (current) => current + 1
    );
  };

  /* =====================================
     IMAGE MANAGEMENT
  ===================================== */

  const loadPropertyImages = async (
    propertyId: string
  ) => {
    const { data, error } = await supabase
      .from("property_images")
      .select(
        "id,property_id,image_url,is_primary"
      )
      .eq("property_id", propertyId)
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Property images error:",
        error
      );
      return;
    }

    setExistingImages(data || []);
  };

  const uploadPropertyImages = async (
    propertyId: string
  ) => {
    if (
      !companyId ||
      imageFiles.length === 0
    ) {
      return;
    }

    const {
      count,
      error: countError,
    } = await supabase
      .from("property_images")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq(
        "property_id",
        propertyId
      );

    if (countError) {
      throw countError;
    }

    const existingCount = count || 0;

    for (
      let index = 0;
      index < imageFiles.length;
      index++
    ) {
      const file = imageFiles[index];

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "jpg";

      const filePath = `${companyId}/${propertyId}/${crypto.randomUUID()}.${extension}`;

      const {
        error: uploadError,
      } = await supabase.storage
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

      const {
        error: imageError,
      } = await supabase
        .from("property_images")
        .insert({
          property_id: propertyId,
          image_url: publicUrl,
          is_primary:
            existingCount === 0 &&
            index === 0,
        });

      if (imageError) {
        throw imageError;
      }
    }
  };

  const getStoragePath = (
    imageUrl: string
  ) => {
    const marker =
      "/storage/v1/object/public/property-images/";

    const position =
      imageUrl.indexOf(marker);

    if (position === -1) {
      return null;
    }

    return decodeURIComponent(
      imageUrl.substring(
        position + marker.length
      )
    );
  };

  const deletePropertyImage = async (
    image: PropertyImage
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this image?"
      );

    if (!confirmed) return;

    try {
      const storagePath =
        getStoragePath(
          image.image_url
        );

      if (storagePath) {
        const {
          error: storageError,
        } = await supabase.storage
          .from("property-images")
          .remove([storagePath]);

        if (storageError) {
          console.error(
            "Storage delete error:",
            storageError
          );
        }
      }

      const { error } = await supabase
        .from("property_images")
        .delete()
        .eq("id", image.id);

      if (error) {
        throw error;
      }

      // If the deleted image was primary,
      // make another image primary.
      if (image.is_primary) {
        const {
          data: remainingImages,
        } = await supabase
          .from("property_images")
          .select("id")
          .eq(
            "property_id",
            image.property_id
          )
          .limit(1);

        const nextImage =
          remainingImages?.[0];

        if (nextImage) {
          await supabase
            .from("property_images")
            .update({
              is_primary: true,
            })
            .eq("id", nextImage.id);
        }
      }

      await loadPropertyImages(
        image.property_id
      );

      await loadProperties();

      setMessageType("success");
      setMessage(
        "Image deleted successfully."
      );
    } catch (error) {
      setMessageType("error");

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Unable to delete image."
        );
      }
    }
  };

  const setPrimaryImage = async (
    image: PropertyImage
  ) => {
    try {
      const {
        error: resetError,
      } = await supabase
        .from("property_images")
        .update({
          is_primary: false,
        })
        .eq(
          "property_id",
          image.property_id
        );

      if (resetError) {
        throw resetError;
      }

      const { error } = await supabase
        .from("property_images")
        .update({
          is_primary: true,
        })
        .eq("id", image.id);

      if (error) {
        throw error;
      }

      await loadPropertyImages(
        image.property_id
      );

      await loadProperties();

      setMessageType("success");
      setMessage(
        "Primary image updated successfully."
      );
    } catch (error) {
      setMessageType("error");

      if (error instanceof Error) {
        setMessage(error.message);
      }
    }
  };

  /* =====================================
     EDIT PROPERTY
  ===================================== */

  const startEditing = async (
    property: Property
  ) => {
    setEditingId(property.id);

    setEstateId(
      property.estate_id || ""
    );

    setTitle(property.title);

    setPropertyType(
      property.property_type
    );

    setListingType(
      property.listing_type
    );

    setLocation(
      property.location || ""
    );

    setCity(
      property.city || ""
    );

    setState(
      property.state || ""
    );

    setPrice(
      String(property.price || "")
    );

    setBedrooms(
      property.bedrooms
        ? String(property.bedrooms)
        : ""
    );

    setBathrooms(
      property.bathrooms
        ? String(property.bathrooms)
        : ""
    );

    setToilets(
      property.toilets
        ? String(property.toilets)
        : ""
    );

    setDescription(
      property.description || ""
    );

    setLandSize(
      property.land_size
        ? String(property.land_size)
        : ""
    );

    setLandSizeUnit(
      property.land_size_unit ||
        "sqm"
    );

    setInitialDeposit(
      property.initial_deposit
        ? String(
            property.initial_deposit
          )
        : ""
    );

    setInstallmentMonths(
      property.installment_months
        ? String(
            property.installment_months
          )
        : ""
    );

    setImageFiles([]);
    setFileInputKey(
      (current) => current + 1
    );

    setMessage("");
    setMessageType(null);

    await loadPropertyImages(
      property.id
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================
     SAVE PROPERTY
  ===================================== */

  const saveProperty = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!companyId) {
      setMessageType("error");
      setMessage(
        "Company not found."
      );
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType(null);

    try {
      const payload = {
        estate_id:
          estateId || null,

        title:
          title.trim(),

        property_type:
          propertyType.trim(),

        listing_type:
          listingType,

        location:
          location.trim() || null,

        city:
          city.trim() || null,

        state:
          state.trim() || null,

        price:
          Number(price),

        bedrooms:
          Number(
            bedrooms || 0
          ),

        bathrooms:
          Number(
            bathrooms || 0
          ),

        toilets:
          Number(
            toilets || 0
          ),

        description:
          description.trim() || null,

        land_size:
          landSize
            ? Number(landSize)
            : null,

        land_size_unit:
          landSize
            ? landSizeUnit ||
              "sqm"
            : null,

        initial_deposit:
          Number(
            initialDeposit || 0
          ),

        installment_months:
          Number(
            installmentMonths || 0
          ),
      };

      if (editingId) {
        const { error } =
          await supabase
            .from("properties")
            .update(payload)
            .eq(
              "id",
              editingId
            )
            .eq(
              "company_id",
              companyId
            );

        if (error) {
          throw error;
        }

        await uploadPropertyImages(
          editingId
        );

        setMessageType("success");
        setMessage(
          "Property updated successfully."
        );
      } else {
        const cleanSlug =
          title
            .toLowerCase()
            .trim()
            .replace(
              /[^a-z0-9]+/g,
              "-"
            )
            .replace(
              /^-+|-+$/g,
              ""
            );

        const slug = `${cleanSlug}-${Math.random()
          .toString(36)
          .substring(2, 7)}`;

        const {
          data: newProperty,
          error,
        } = await supabase
          .from("properties")
          .insert({
            company_id:
              companyId,

            ...payload,

            slug,

            status:
              "available",
          })
          .select("id")
          .single();

        if (error) {
          throw error;
        }

        if (!newProperty) {
          throw new Error(
            "Property could not be created."
          );
        }

        await uploadPropertyImages(
          newProperty.id
        );

        setMessageType("success");
        setMessage(
          "Property added successfully."
        );
      }

      resetForm();
      await loadProperties();
    } catch (error) {
      console.error(
        "Property save error:",
        error
      );

      setMessageType("error");

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Something went wrong."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
     DELETE PROPERTY
  ===================================== */

  const deleteProperty = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this property?"
      );

    if (!confirmed) return;

    if (!companyId) return;

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id)
      .eq(
        "company_id",
        companyId
      );

    if (error) {
      setMessageType("error");
      setMessage(error.message);
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    setMessageType("success");
    setMessage(
      "Property deleted successfully."
    );

    await loadProperties();
  };

  /* =====================================
     SEARCH
  ===================================== */

  const filteredProperties =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return properties;
      }

      return properties.filter(
        (property) => {
          return (
            property.title
              .toLowerCase()
              .includes(term) ||
            property.property_type
              .toLowerCase()
              .includes(term) ||
            property.location
              ?.toLowerCase()
              .includes(term) ||
            property.city
              ?.toLowerCase()
              .includes(term) ||
            property.state
              ?.toLowerCase()
              .includes(term) ||
            getEstateName(
              property.estate_id
            )
              .toLowerCase()
              .includes(term)
          );
        }
      );
    }, [
      properties,
      search,
      estates,
    ]);

  /* =====================================
     UI
  ===================================== */

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0b1b35]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-6">
          <div className="flex items-center gap-4">
            <img
              src="/zertop-logo.png"
              alt="Zertop Limited"
              className="h-11 w-auto object-contain md:h-13"
            />

            <div className="hidden border-l border-gray-200 pl-4 sm:block">
              <p className="text-sm font-bold">
                Property Management
              </p>

              <p className="text-xs text-gray-400">
                Zertop Management System
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
          >
            <ArrowLeft size={17} />

            <span className="hidden sm:inline">
              Dashboard
            </span>
          </button>
        </div>

        <div className="h-1 bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c]" />
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">
        {/* PAGE TITLE */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f97316]">
              Property Management
            </p>

            <h1 className="mt-2 text-3xl font-black md:text-4xl">
              Properties
            </h1>

            <p className="mt-2 text-gray-500">
              Add, edit and manage Zertop property listings.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-3">
            <Building2
              size={20}
              className="text-[#f97316]"
            />

            <div>
              <p className="text-xs text-gray-400">
                Total Properties
              </p>

              <p className="font-black">
                {properties.length}
              </p>
            </div>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mb-6 rounded-2xl border p-4 text-sm ${
              messageType ===
              "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid items-start gap-8 lg:grid-cols-[400px_1fr]">
          {/* =====================================
              FORM
          ===================================== */}

          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#f97316]">
                {editingId ? (
                  <Pencil
                    size={21}
                  />
                ) : (
                  <Plus
                    size={22}
                  />
                )}
              </div>

              <div>
                <h2 className="text-xl font-black">
                  {editingId
                    ? "Edit Property"
                    : "Add Property"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {editingId
                    ? "Update property information"
                    : "Create a new public listing"}
                </p>
              </div>
            </div>

            <form
              onSubmit={saveProperty}
              className="space-y-5"
            >
              <FormField label="Estate">
                <select
                  value={estateId}
                  onChange={(e) =>
                    setEstateId(
                      e.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="">
                    Select Estate
                  </option>

                  {estates.map(
                    (estate) => (
                      <option
                        key={
                          estate.id
                        }
                        value={
                          estate.id
                        }
                      >
                        {
                          estate.name
                        }
                      </option>
                    )
                  )}
                </select>
              </FormField>

              <FormField label="Property Title *">
                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  required
                  placeholder="e.g. 2 Bedroom Semi-Detached"
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField label="Property Type *">
                <input
                  value={propertyType}
                  onChange={(e) =>
                    setPropertyType(
                      e.target.value
                    )
                  }
                  required
                  placeholder="e.g. Duplex, Land, Apartment"
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField label="Listing Type">
                <select
                  value={listingType}
                  onChange={(e) =>
                    setListingType(
                      e.target.value
                    )
                  }
                  className={
                    inputClass
                  }
                >
                  <option value="sale">
                    For Sale
                  </option>

                  <option value="rent">
                    For Rent
                  </option>

                  <option value="lease">
                    For Lease
                  </option>
                </select>
              </FormField>

              <FormField label="Location">
                <div className="relative">
                  <MapPin
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f97316]"
                  />

                  <input
                    value={location}
                    onChange={(e) =>
                      setLocation(
                        e.target.value
                      )
                    }
                    placeholder="Area / address"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="City">
                  <input
                    value={city}
                    onChange={(e) =>
                      setCity(
                        e.target.value
                      )
                    }
                    placeholder="Epe"
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField label="State">
                  <input
                    value={state}
                    onChange={(e) =>
                      setState(
                        e.target.value
                      )
                    }
                    placeholder="Lagos"
                    className={
                      inputClass
                    }
                  />
                </FormField>
              </div>

              <FormField label="Price *">
                <input
                  type="number"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value
                    )
                  }
                  required
                  min="0"
                  placeholder="Property price"
                  className={
                    inputClass
                  }
                />
              </FormField>

              <div className="grid grid-cols-3 gap-3">
                <FormField label="Beds">
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) =>
                      setBedrooms(
                        e.target.value
                      )
                    }
                    min="0"
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField label="Baths">
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) =>
                      setBathrooms(
                        e.target.value
                      )
                    }
                    min="0"
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField label="Toilets">
                  <input
                    type="number"
                    value={toilets}
                    onChange={(e) =>
                      setToilets(
                        e.target.value
                      )
                    }
                    min="0"
                    className={
                      inputClass
                    }
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-[1fr_110px] gap-3">
                <FormField label="Land Size">
                  <input
                    type="number"
                    value={landSize}
                    onChange={(e) =>
                      setLandSize(
                        e.target.value
                      )
                    }
                    min="0"
                    placeholder="500"
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField label="Unit">
                  <select
                    value={
                      landSizeUnit
                    }
                    onChange={(e) =>
                      setLandSizeUnit(
                        e.target.value
                      )
                    }
                    className={
                      inputClass
                    }
                  >
                    <option value="sqm">
                      sqm
                    </option>

                    <option value="sqft">
                      sqft
                    </option>

                    <option value="acres">
                      acres
                    </option>

                    <option value="hectares">
                      hectares
                    </option>
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Initial Deposit">
                  <input
                    type="number"
                    value={
                      initialDeposit
                    }
                    onChange={(e) =>
                      setInitialDeposit(
                        e.target.value
                      )
                    }
                    min="0"
                    placeholder="0"
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField label="Installment">
                  <input
                    type="number"
                    value={
                      installmentMonths
                    }
                    onChange={(e) =>
                      setInstallmentMonths(
                        e.target.value
                      )
                    }
                    min="0"
                    placeholder="Months"
                    className={
                      inputClass
                    }
                  />
                </FormField>
              </div>

              <FormField label="Description">
                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows={5}
                  placeholder="Describe the property..."
                  className={`${inputClass} resize-none`}
                />
              </FormField>

              {/* EXISTING IMAGES */}
              {editingId &&
                existingImages.length >
                  0 && (
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-gray-700">
                      Existing Images
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      {existingImages.map(
                        (image) => (
                          <div
                            key={
                              image.id
                            }
                            className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                          >
                            <div className="relative">
                              <img
                                src={
                                  image.image_url
                                }
                                alt="Property"
                                className="aspect-[4/3] w-full object-cover"
                              />

                              {image.is_primary && (
                                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[#f97316] shadow">
                                  <Star
                                    size={
                                      11
                                    }
                                    fill="currentColor"
                                  />
                                  Primary
                                </span>
                              )}
                            </div>

                            <div className="space-y-2 p-3">
                              {!image.is_primary && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPrimaryImage(
                                      image
                                    )
                                  }
                                  className="block text-xs font-semibold text-[#f97316]"
                                >
                                  Set as Primary
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  deletePropertyImage(
                                    image
                                  )
                                }
                                className="block text-xs font-semibold text-red-500"
                              >
                                Delete Image
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* NEW IMAGES */}
              <FormField label="Property Images">
                <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/50 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                    <ImagePlus
                      size={19}
                      className="text-[#f97316]"
                    />

                    Upload property photos
                  </div>

                  <input
                    key={
                      fileInputKey
                    }
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(e) => {
                      setImageFiles(
                        e.target
                          .files
                          ? Array.from(
                              e
                                .target
                                .files
                            )
                          : []
                      );
                    }}
                    className="block w-full text-xs text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#f97316] file:shadow-sm"
                  />

                  {imageFiles.length >
                    0 && (
                    <p className="mt-3 text-xs font-medium text-gray-500">
                      {
                        imageFiles.length
                      }{" "}
                      image
                      {imageFiles.length >
                      1
                        ? "s"
                        : ""}{" "}
                      selected
                    </p>
                  )}
                </div>
              </FormField>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] py-3.5 font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
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
                  onClick={
                    resetForm
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 font-semibold text-gray-600 transition hover:bg-gray-100"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          {/* =====================================
              PROPERTY LIST
          ===================================== */}

          <div>
            {/* SEARCH */}
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm focus-within:border-orange-300">
              <Search
                size={19}
                className="shrink-0 text-[#f97316]"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search properties, estates or locations..."
                className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            {pageLoading ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <img
                  src="/zertop-logo.png"
                  alt="Zertop Limited"
                  className="mx-auto h-14 w-auto object-contain"
                />

                <p className="mt-5 text-gray-500">
                  Loading properties...
                </p>
              </div>
            ) : filteredProperties.length ===
              0 ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <Building2
                  size={40}
                  className="mx-auto text-gray-300"
                />

                <h3 className="mt-4 text-lg font-bold">
                  {search
                    ? "No matching properties"
                    : "No properties added yet"}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {search
                    ? "Try a different search."
                    : "Use the form to create your first property listing."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredProperties.map(
                  (property) => (
                    <article
                      key={
                        property.id
                      }
                      className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
                    >
                      {/* IMAGE */}
                      {property.primary_image ? (
                        <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                          <img
                            src={
                              property.primary_image
                            }
                            alt={
                              property.title
                            }
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-[16/10] items-center justify-center bg-gray-100 text-sm text-gray-400">
                          <div className="text-center">
                            <ImagePlus
                              size={
                                28
                              }
                              className="mx-auto text-gray-300"
                            />

                            <p className="mt-2">
                              No property image
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold uppercase text-green-700">
                                {
                                  property.status
                                }
                              </span>

                              <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase text-[#f97316]">
                                {property.listing_type ===
                                "sale"
                                  ? "For Sale"
                                  : property.listing_type ===
                                    "rent"
                                  ? "For Rent"
                                  : "For Lease"}
                              </span>
                            </div>

                            <h3 className="mt-3 line-clamp-2 text-xl font-black">
                              {
                                property.title
                              }
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              {
                                property.property_type
                              }
                            </p>
                          </div>

                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                startEditing(
                                  property
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
                              aria-label="Edit property"
                            >
                              <Pencil
                                size={
                                  16
                                }
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteProperty(
                                  property.id
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                              aria-label="Delete property"
                            >
                              <Trash2
                                size={
                                  16
                                }
                              />
                            </button>
                          </div>
                        </div>

                        <p className="mt-4 text-sm font-bold text-[#f97316]">
                          {getEstateName(
                            property.estate_id
                          )}
                        </p>

                        <div className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                          <MapPin
                            size={
                              16
                            }
                            className="mt-0.5 shrink-0 text-[#f97316]"
                          />

                          <span>
                            {[
                              property.location,
                              property.city,
                              property.state,
                            ]
                              .filter(
                                Boolean
                              )
                              .join(
                                ", "
                              ) ||
                              "Location not specified"}
                          </span>
                        </div>

                        {/* FEATURES */}
                        <div className="mt-5 flex flex-wrap gap-4 border-y border-gray-100 py-4 text-xs font-medium text-gray-500">
                          {Number(
                            property.bedrooms
                          ) > 0 && (
                            <span className="flex items-center gap-1.5">
                              <BedDouble
                                size={
                                  15
                                }
                                className="text-[#f5a400]"
                              />

                              {
                                property.bedrooms
                              }{" "}
                              Beds
                            </span>
                          )}

                          {Number(
                            property.bathrooms
                          ) > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Bath
                                size={
                                  15
                                }
                                className="text-[#f97316]"
                              />

                              {
                                property.bathrooms
                              }{" "}
                              Baths
                            </span>
                          )}

                          {Number(
                            property.toilets
                          ) > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Toilet
                                size={
                                  15
                                }
                                className="text-[#ef233c]"
                              />

                              {
                                property.toilets
                              }{" "}
                              Toilets
                            </span>
                          )}

                          {property.land_size &&
                            Number(
                              property.land_size
                            ) >
                              0 && (
                              <span className="flex items-center gap-1.5">
                                <LandPlot
                                  size={
                                    15
                                  }
                                  className="text-[#f97316]"
                                />

                                {Number(
                                  property.land_size
                                ).toLocaleString()}{" "}
                                {property.land_size_unit ||
                                  "sqm"}
                              </span>
                            )}
                        </div>

                        <div className="mt-5">
                          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                            Price
                          </p>

                          <p className="mt-1 text-2xl font-black">
                            ₦
                            {Number(
                              property.price
                            ).toLocaleString()}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            startEditing(
                              property
                            )
                          }
                          className="mt-5 w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-bold text-[#0b1b35] transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
                        >
                          Edit Property
                        </button>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#0b1b35] outline-none transition placeholder:text-gray-400 focus:border-[#f97316] focus:bg-white focus:ring-2 focus:ring-orange-100";

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

function FormField({
  label,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      {children}
    </div>
  );
}