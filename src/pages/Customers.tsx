import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

import { supabase } from "../lib/supabase";

type Customer = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  customer_type: string;
  notes: string | null;
};

type CustomersProps = {
  onBack: () => void;
};

type MessageType =
  | "success"
  | "error"
  | null;

export default function Customers({
  onBack,
}: CustomersProps) {
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [companyId, setCompanyId] =
    useState<string | null>(null);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [customerType, setCustomerType] =
    useState("prospect");

  const [notes, setNotes] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<MessageType>(null);

  /* =====================================
     INITIAL LOAD
  ===================================== */

  useEffect(() => {
    loadCompany();
  }, []);

  useEffect(() => {
    if (!companyId) return;

    loadCustomers().finally(() => {
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
      setMessage(
        "Unable to find the logged-in user."
      );

      setPageLoading(false);
      return;
    }

    /*
      Main lookup for Admin, Manager,
      Realtor and Staff accounts.
    */
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
      setCompanyId(
        staffMember.company_id
      );

      return;
    }

    /*
      Fallback for legacy owner account.
    */
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
     LOAD CUSTOMERS
  ===================================== */

  const loadCustomers = async () => {
    if (!companyId) return;

    const { data, error } =
      await supabase
        .from("customers")
        .select(
          `
          id,
          full_name,
          email,
          phone,
          address,
          customer_type,
          notes
        `
        )
        .eq(
          "company_id",
          companyId
        )
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "Customers loading error:",
        error
      );

      setMessageType("error");
      setMessage(error.message);
      return;
    }

    setCustomers(data || []);
  };

  /* =====================================
     FORM
  ===================================== */

  const resetForm = () => {
    setEditingId(null);
    setFullName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCustomerType("prospect");
    setNotes("");
  };

  const startEditing = (
    customer: Customer
  ) => {
    setEditingId(customer.id);

    setFullName(
      customer.full_name
    );

    setEmail(
      customer.email || ""
    );

    setPhone(
      customer.phone || ""
    );

    setAddress(
      customer.address || ""
    );

    setCustomerType(
      customer.customer_type
    );

    setNotes(
      customer.notes || ""
    );

    setMessage("");
    setMessageType(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const saveCustomer = async (
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

    if (!fullName.trim()) {
      setMessageType("error");
      setMessage(
        "Please enter the customer's full name."
      );
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType(null);

    const customerData = {
      company_id: companyId,
      full_name: fullName.trim(),
      email:
        email.trim() || null,
      phone:
        phone.trim() || null,
      address:
        address.trim() || null,
      customer_type:
        customerType,
      notes:
        notes.trim() || null,
    };

    try {
      if (editingId) {
        const { error } =
          await supabase
            .from("customers")
            .update(customerData)
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

        setMessageType(
          "success"
        );

        setMessage(
          "Customer updated successfully."
        );
      } else {
        const { error } =
          await supabase
            .from("customers")
            .insert(
              customerData
            );

        if (error) {
          throw error;
        }

        setMessageType(
          "success"
        );

        setMessage(
          "Customer added successfully."
        );
      }

      resetForm();

      await loadCustomers();
    } catch (error) {
      console.error(
        "Customer save error:",
        error
      );

      setMessageType("error");

      if (
        error instanceof Error
      ) {
        setMessage(
          error.message
        );
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
     DELETE
  ===================================== */

  const deleteCustomer = async (
    id: string
  ) => {
    if (!companyId) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this customer?"
      );

    if (!confirmed) return;

    setMessage("");
    setMessageType(null);

    const { error } =
      await supabase
        .from("customers")
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
      "Customer deleted successfully."
    );

    await loadCustomers();
  };

  /* =====================================
     FILTER
  ===================================== */

  const filteredCustomers =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return customers;
      }

      return customers.filter(
        (customer) => {
          return Boolean(
            customer.full_name
              ?.toLowerCase()
              .includes(term) ||
              customer.email
                ?.toLowerCase()
                .includes(term) ||
              customer.phone
                ?.toLowerCase()
                .includes(term) ||
              customer.address
                ?.toLowerCase()
                .includes(term) ||
              customer.customer_type
                ?.toLowerCase()
                .includes(term)
          );
        }
      );
    }, [customers, search]);

  /* =====================================
     STATS
  ===================================== */

  const prospectCount =
    customers.filter(
      (customer) =>
        customer.customer_type ===
        "prospect"
    ).length;

  const buyerCount =
    customers.filter(
      (customer) =>
        customer.customer_type ===
        "buyer"
    ).length;

  const investorCount =
    customers.filter(
      (customer) =>
        customer.customer_type ===
        "investor"
    ).length;

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
              className="h-11 w-auto object-contain md:h-14"
            />

            <div className="hidden border-l border-gray-200 pl-4 sm:block">
              <p className="text-sm font-bold">
                Customer Management
              </p>

              <p className="text-xs text-gray-400">
                Zertop CRM
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
          >
            <ArrowLeft
              size={17}
            />

            <span className="hidden sm:inline">
              Dashboard
            </span>
          </button>
        </div>

        <div className="h-1 bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c]" />
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">
        {/* TITLE */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f97316]">
            CRM
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Customers
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Manage Zertop Limited
            buyers, prospects,
            tenants and investors.
          </p>
        </div>

        {/* STATS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Customers"
            value={
              customers.length
            }
          />

          <SummaryCard
            title="Prospects"
            value={
              prospectCount
            }
          />

          <SummaryCard
            title="Buyers"
            value={buyerCount}
          />

          <SummaryCard
            title="Investors"
            value={
              investorCount
            }
          />
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

        <div className="grid items-start gap-8 lg:grid-cols-[390px_1fr]">
          {/* FORM */}
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#f97316]">
                {editingId ? (
                  <Pencil
                    size={21}
                  />
                ) : (
                  <UserPlus
                    size={22}
                  />
                )}
              </div>

              <div>
                <h2 className="text-xl font-black">
                  {editingId
                    ? "Edit Customer"
                    : "Add Customer"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {editingId
                    ? "Update customer details"
                    : "Create a new customer record"}
                </p>
              </div>
            </div>

            <form
              onSubmit={
                saveCustomer
              }
              className="space-y-5"
            >
              <FormField label="Full Name *">
                <input
                  value={
                    fullName
                  }
                  onChange={(e) =>
                    setFullName(
                      e.target.value
                    )
                  }
                  required
                  placeholder="Customer full name"
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField label="Email Address">
                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="customer@email.com"
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField label="Phone Number">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  placeholder="080..."
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField label="Address">
                <input
                  value={
                    address
                  }
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  placeholder="Customer address"
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField label="Customer Type">
                <select
                  value={
                    customerType
                  }
                  onChange={(e) =>
                    setCustomerType(
                      e.target.value
                    )
                  }
                  className={
                    inputClass
                  }
                >
                  <option value="prospect">
                    Prospect
                  </option>

                  <option value="buyer">
                    Buyer
                  </option>

                  <option value="tenant">
                    Tenant
                  </option>

                  <option value="investor">
                    Investor
                  </option>
                </select>
              </FormField>

              <FormField label="Notes">
                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(
                      e.target.value
                    )
                  }
                  placeholder="Customer notes..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </FormField>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] py-3.5 font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Customer"
                  : "Add Customer"}
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

          {/* CUSTOMER LIST */}
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
                placeholder="Search customers..."
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
                  Loading
                  customers...
                </p>
              </div>
            ) : filteredCustomers.length ===
              0 ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <Users
                  size={40}
                  className="mx-auto text-gray-300"
                />

                <h3 className="mt-4 text-lg font-bold">
                  {search
                    ? "No matching customers"
                    : "No customers yet"}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Customer records will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredCustomers.map(
                  (customer) => (
                    <article
                      key={
                        customer.id
                      }
                      className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md md:p-6"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase text-[#f97316]">
                            {
                              customer.customer_type
                            }
                          </span>

                          <h3 className="mt-4 text-xl font-black text-[#0b1b35]">
                            {
                              customer.full_name
                            }
                          </h3>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              startEditing(
                                customer
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
                            aria-label="Edit customer"
                          >
                            <Pencil
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteCustomer(
                                customer.id
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                            aria-label="Delete customer"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>
                      </div>

                      {/* DETAILS */}
                      <div className="mt-5 grid gap-4 rounded-2xl bg-[#f8fafc] p-4 text-sm sm:grid-cols-2">
                        <div className="flex gap-3">
                          <Phone
                            size={17}
                            className="mt-0.5 shrink-0 text-[#f97316]"
                          />

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Phone
                            </p>

                            <p className="mt-1 font-medium text-[#0b1b35]">
                              {customer.phone ||
                                "Not provided"}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Mail
                            size={17}
                            className="mt-0.5 shrink-0 text-[#f97316]"
                          />

                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Email
                            </p>

                            <p className="mt-1 break-all font-medium text-[#0b1b35]">
                              {customer.email ||
                                "Not provided"}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 sm:col-span-2">
                          <MapPin
                            size={17}
                            className="mt-0.5 shrink-0 text-[#f97316]"
                          />

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Address
                            </p>

                            <p className="mt-1 font-medium text-[#0b1b35]">
                              {customer.address ||
                                "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {customer.notes && (
                        <div className="mt-5 border-t border-gray-100 pt-4">
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                            Notes
                          </p>

                          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
                            {
                              customer.notes
                            }
                          </p>
                        </div>
                      )}
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

type SummaryCardProps = {
  title: string;
  value: number;
};

function SummaryCard({
  title,
  value,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black text-[#0b1b35]">
        {value}
      </p>
    </div>
  );
}