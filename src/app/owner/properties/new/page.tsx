"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewPropertyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    region: "",
    sleepsMin: "1",
    sleepsMax: "10",
    bedrooms: "1",
    bathrooms: "1",
    priceFromMidweek: "",
    priceFromWeekend: "",
    description: "",
    houseRules: "",
    checkInOut: "Check-in: 4pm, Check-out: 10am",
    heroImage: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          slug,
          sleepsMin: parseInt(formData.sleepsMin),
          sleepsMax: parseInt(formData.sleepsMax),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          priceFromMidweek: parseFloat(formData.priceFromMidweek),
          priceFromWeekend: parseFloat(formData.priceFromWeekend),
          isPublished: false,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create property");
      }

      const data = await response.json();
      router.push(`/owner/properties/${data.property.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create property");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/owner/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <Card className="p-8 bg-white">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Property
          </h1>
          <p className="text-gray-600 mb-8">
            Fill in the details below to list your property
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Luxury Manor House"
                    className="mt-1 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Cornwall"
                    className="mt-1 rounded-lg"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="region">Region *</Label>
                <select
                  id="region"
                  name="region"
                  required
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300"
                >
                  <option value="">Select Region</option>
                  <option value="England">England</option>
                  <option value="Scotland">Scotland</option>
                  <option value="Wales">Wales</option>
                  <option value="Northern Ireland">Northern Ireland</option>
                  <option value="Ireland">Ireland</option>
                </select>
              </div>
            </div>

            {/* Capacity */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Capacity & Rooms
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="sleepsMin">Min Guests *</Label>
                  <Input
                    id="sleepsMin"
                    name="sleepsMin"
                    type="number"
                    required
                    value={formData.sleepsMin}
                    onChange={handleChange}
                    className="mt-1 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="sleepsMax">Max Guests *</Label>
                  <Input
                    id="sleepsMax"
                    name="sleepsMax"
                    type="number"
                    required
                    value={formData.sleepsMax}
                    onChange={handleChange}
                    className="mt-1 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    required
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="mt-1 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    required
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="mt-1 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Pricing
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priceFromMidweek">Midweek Price (£) *</Label>
                  <Input
                    id="priceFromMidweek"
                    name="priceFromMidweek"
                    type="number"
                    step="0.01"
                    required
                    value={formData.priceFromMidweek}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="mt-1 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="priceFromWeekend">Weekend Price (£) *</Label>
                  <Input
                    id="priceFromWeekend"
                    name="priceFromWeekend"
                    type="number"
                    step="0.01"
                    required
                    value={formData.priceFromWeekend}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="mt-1 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <Textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property..."
                rows={6}
                className="mt-1 rounded-lg"
              />
            </div>

            {/* House Rules */}
            <div>
              <Label htmlFor="houseRules">House Rules</Label>
              <Textarea
                id="houseRules"
                name="houseRules"
                value={formData.houseRules}
                onChange={handleChange}
                placeholder="Any specific rules..."
                rows={4}
                className="mt-1 rounded-lg"
              />
            </div>

            {/* Hero Image */}
            <div>
              <Label htmlFor="heroImage">Hero Image URL</Label>
              <Input
                id="heroImage"
                name="heroImage"
                type="url"
                value={formData.heroImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="mt-1 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can add more images after creating the property
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="rounded-full px-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Property"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
