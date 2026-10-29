"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Loader2, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  "Mountain",
  "Adventure",
  "City",
  "Cultural",
  "Nature",
];

type FormValues = {
  name: string;
  country: string;
  category: string;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type Destination = Partial<FormValues> & {
  _id?: string;
  id?: string;
};

type EditDestinationDialogProps = {
  destination: Destination;
  onUpdated?: () => void;
};

const formatDateForInput = (date: string | undefined): string => {
  if (!date) return "";

  const value = date.trim();

  // Already in yyyy-MM-dd format.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const parsed = new Date(year, month - 1, day);

    return parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day
      ? value
      : "";
  }

  // Convert dd/MM/yyyy to yyyy-MM-dd.
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (match) {
    const [, day, month, year] = match;
    const dayNumber = Number(day);
    const monthNumber = Number(month);
    const yearNumber = Number(year);
    const parsed = new Date(yearNumber, monthNumber - 1, dayNumber);

    if (
      parsed.getFullYear() === yearNumber &&
      parsed.getMonth() === monthNumber - 1 &&
      parsed.getDate() === dayNumber
    ) {
      return `${year}-${month}-${day}`;
    }
  }

  return "";
};

const validate = (values: FormValues): FormErrors => {
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

  if (
    !values.price.trim() ||
    !Number.isFinite(Number(values.price)) ||
    Number(values.price) <= 0
  ) {
    errors.price = "Enter a valid price.";
  }

  if (!values.duration.trim()) {
    errors.duration = "Duration is required.";
  }

  if (!values.imageUrl.trim()) {
    errors.imageUrl = "Image URL is required.";
  } else {
    try {
      const url = new URL(values.imageUrl);

      if (url.protocol !== "http:" && url.protocol !== "https:") {
        errors.imageUrl = "Enter a valid HTTP or HTTPS URL.";
      }
    } catch {
      errors.imageUrl = "Enter a valid image URL.";
    }
  }

  return errors;
};

const FieldError = ({
  id,
  message,
}: {
  id: string;
  message?: string;
}) => {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="text-sm text-red-500">
      {message}
    </p>
  );
};

export default function EditDestinationDialog({
  destination,
  onUpdated,
}: EditDestinationDialogProps) {
  const router = useRouter();

  const createValues = (): FormValues => ({
    name: destination.name ?? "",
    country: destination.country ?? "",
    category: destination.category ?? "",
    price: String(destination.price ?? ""),
    duration: destination.duration ?? "",
    departureDate: formatDateForInput(destination.departureDate),
    imageUrl: destination.imageUrl ?? "",
    description: destination.description ?? "",
  });

  const [values, setValues] = useState<FormValues>(createValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const setField = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setSubmitError("");
  };

  const resetForm = () => {
    setValues(createValues());
    setErrors({});
    setSubmitError("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (loading) return;

    if (nextOpen) {
      // Initialize the form when the dialog opens.
      resetForm();
    }

    setOpen(nextOpen);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = validate(values);
    setErrors(newErrors);
    setSubmitError("");

    if (Object.keys(newErrors).length > 0) return;

    const destinationId = destination._id ?? destination.id;

    if (!destinationId) {
      setSubmitError("Destination ID is missing.");
      return;
    }

    setLoading(true);

    const token = await getTokenFromClient()

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/destinations/${encodeURIComponent(destinationId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...values,
            price: Number(values.price),
          }),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || `Update failed (HTTP ${response.status}).`,
        );
      }

      if (result?.matchedCount === 0) {
        throw new Error("Destination was not found in the database.");
      }

      setOpen(false);
      onUpdated?.();
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button type="button" variant="outline">
            <Pencil className="size-4" />
            Edit
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Destination</DialogTitle>
          <DialogDescription>
            Update the destination information below.
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="destination-name">Destination Name</Label>
            <Input
              id="destination-name"
              value={values.name}
              onChange={(event) => setField("name", event.target.value)}
              aria-invalid={!!errors.name}
            />
            <FieldError id="error-name" message={errors.name} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={values.country}
                onChange={(event) => setField("country", event.target.value)}
                aria-invalid={!!errors.country}
              />
              <FieldError id="error-country" message={errors.country} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Select
                value={values.category}
                onValueChange={(value) => setField("category", value ?? "")}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FieldError id="error-category" message={errors.category} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="1"
                value={values.price}
                onChange={(event) => setField("price", event.target.value)}
                aria-invalid={!!errors.price}
              />
              <FieldError id="error-price" message={errors.price} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="7 Days / 6 Nights"
                value={values.duration}
                onChange={(event) => setField("duration", event.target.value)}
                aria-invalid={!!errors.duration}
              />
              <FieldError id="error-duration" message={errors.duration} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="departure-date">Departure Date</Label>
            <Input
              id="departure-date"
              type="date"
              value={values.departureDate}
              onChange={(event) =>
                setField("departureDate", event.target.value)
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              type="url"
              value={values.imageUrl}
              onChange={(event) => setField("imageUrl", event.target.value)}
              aria-invalid={!!errors.imageUrl}
            />
            <FieldError id="error-image-url" message={errors.imageUrl} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={values.description}
              onChange={(event) => setField("description", event.target.value)}
              className="min-h-32"
            />
          </div>

          {submitError && (
            <p role="alert" className="text-sm text-red-500">
              {submitError}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              <X className="size-4" />
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Pencil className="size-4" />
              )}
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
