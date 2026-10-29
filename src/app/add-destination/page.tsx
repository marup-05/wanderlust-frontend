
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const categories = [
  "Beach",
  "Adventure",
  "Cultural",
  "Mountain",
  "Honeymoon",
  "Wildlife",
  "Historical",
];

type FormValues = {
  name: string;
  country: string;
  category: string | null;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const emptyValues: FormValues = {
  name: "",
  country: "",
  category: null,
  price: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
};

function isValidDate(value: string) {
  const [month, day, year] = value.split("/").map(Number);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Destination name is required.";
  }

  if (!values.country.trim()) {
    errors.country = "Country is required.";
  }

  if (!values.category) {
    errors.category = "Please select a category.";
  }

  if (!values.price.trim()) {
    errors.price = "Price is required.";
  } else if (
    !/^\d+(\.\d{1,2})?$/.test(values.price.trim()) ||
    Number(values.price) <= 0
  ) {
    errors.price = "Enter a valid price greater than 0.";
  }

  if (!values.duration.trim()) {
    errors.duration = "Duration is required.";
  }

  if (!values.departureDate.trim()) {
    errors.departureDate = "Departure date is required.";
  } else if (
    !/^\d{2}\/\d{2}\/\d{4}$/.test(values.departureDate) ||
    !isValidDate(values.departureDate)
  ) {
    errors.departureDate =
      "Enter a valid date in mm/dd/yyyy format.";
  }

  if (
    values.imageUrl.trim() &&
    !/^https?:\/\/\S+$/i.test(values.imageUrl.trim())
  ) {
    errors.imageUrl =
      "Enter a valid image URL starting with http:// or https://.";
  }

  return errors;
}

function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}

const AddDestinationPage = () => {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setSuccessMessage(null);
    setSubmitError(null);

    setErrors((prev) =>
      prev[field] ? { ...prev, [field]: undefined } : prev
    );
  };

  const reset = () => {
    setValues(emptyValues);
    setErrors({});
    setSuccessMessage(null);
    setSubmitError(null);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const newErrors = validate(values);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSuccessMessage(null);
      setSubmitError(null);
      return;
    }

   const token = await getTokenFromClient()

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-destination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        setSubmitError(
          "The server rejected the request. Please try again later."
        );
        return;
      }

      const data = await res.json();
      console.log(data);

      setSuccessMessage(
        `Travel package "${values.name.trim()}" has been added successfully!`
      );

      setValues(emptyValues);

      // Redirect after successfully adding the destination
      router.push("/destinations");
    } catch (error) {
      console.error("Failed to add destination:", error);

      setSubmitError(
        "Could not reach the server. Please try again later."
      );
    }
  };

  return (
    <section className="min-h-screen bg-[#eefbfa] px-4 py-10 sm:px-10">
      <div className="mx-auto w-full">
        <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
          Add New Travel Package
        </h1>

        <Card className="mx-auto mt-8 max-w-3xl rounded-lg py-0">
          <CardContent className="px-5 py-7 sm:px-6 sm:py-8">
            <form
              noValidate
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              aria-label="Add new travel package"
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="destination-name">
                  Destination Name
                </Label>

                <Input
                  id="destination-name"
                  name="name"
                  placeholder="Bali Paradise"
                  value={values.name}
                  onChange={(e) => setField("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={
                    errors.name ? "error-name" : undefined
                  }
                />

                <FieldError id="error-name" message={errors.name} />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="country">Country</Label>

                  <Input
                    id="country"
                    name="country"
                    placeholder="Indonesia"
                    value={values.country}
                    onChange={(e) => setField("country", e.target.value)}
                    aria-invalid={!!errors.country}
                    aria-describedby={
                      errors.country ? "error-country" : undefined
                    }
                  />

                  <FieldError
                    id="error-country"
                    message={errors.country}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="category">Category</Label>

                  <Select
                    value={values.category ?? ""}
                    onValueChange={(value) =>
                      setField("category", value || null)
                    }
                  >
                    <SelectTrigger
                      id="category"
                      aria-invalid={!!errors.category}
                      aria-describedby={
                        errors.category ? "error-category" : undefined
                      }
                      className="w-full"
                    >
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>

                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FieldError
                    id="error-category"
                    message={errors.category}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="price">Price (USD)</Label>

                  <Input
                    id="price"
                    name="price"
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g., 1299"
                    value={values.price}
                    onChange={(e) => setField("price", e.target.value)}
                    aria-invalid={!!errors.price}
                    aria-describedby={
                      errors.price ? "error-price" : undefined
                    }
                  />

                  <FieldError id="error-price" message={errors.price} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="duration">Duration</Label>

                  <Input
                    id="duration"
                    name="duration"
                    placeholder="e.g., 7 Days/6 Nights"
                    value={values.duration}
                    onChange={(e) =>
                      setField("duration", e.target.value)
                    }
                    aria-invalid={!!errors.duration}
                    aria-describedby={
                      errors.duration ? "error-duration" : undefined
                    }
                  />

                  <FieldError
                    id="error-duration"
                    message={errors.duration}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="departure-date">Departure Date</Label>

                <Input
                  id="departure-date"
                  name="departureDate"
                  inputMode="numeric"
                  placeholder="mm/dd/yyyy"
                  value={values.departureDate}
                  onChange={(e) =>
                    setField("departureDate", e.target.value)
                  }
                  aria-invalid={!!errors.departureDate}
                  aria-describedby={
                    errors.departureDate
                      ? "error-departure-date"
                      : undefined
                  }
                />

                <FieldError
                  id="error-departure-date"
                  message={errors.departureDate}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="image-url">Image URL</Label>

                <Input
                  id="image-url"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={values.imageUrl}
                  onChange={(e) => setField("imageUrl", e.target.value)}
                  aria-invalid={!!errors.imageUrl}
                  aria-describedby={
                    errors.imageUrl ? "error-image-url" : undefined
                  }
                />

                <FieldError
                  id="error-image-url"
                  message={errors.imageUrl}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description</Label>

                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the travel experience..."
                  value={values.description}
                  onChange={(e) =>
                    setField("description", e.target.value)
                  }
                  className="min-h-40"
                />
              </div>

              {successMessage && (
                <div
                  role="status"
                  className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                >
                  {successMessage}
                </div>
              )}

              {submitError && (
                <div
                  role="alert"
                  className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {submitError}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={reset}
                  className="rounded-md bg-white text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="size-4" />
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="rounded-md bg-teal-500 text-white hover:bg-teal-600"
                >
                  <Plus className="size-4" />
                  Add Travel Package
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AddDestinationPage;
