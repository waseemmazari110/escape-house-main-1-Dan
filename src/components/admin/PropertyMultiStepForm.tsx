"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Save, Check, Home, MapPin, Bed, Sparkles, FileText, PoundSterling, Image, Search } from "lucide-react";
import { GEH_API } from "@/lib/api-client";
import { toast } from "sonner";

type PropertyFormData = {
  // Essentials
  title: string;
  property_type: string;
  status: string;
  description: string;
  
  // Location
  address: string;
  town: string;
  county: string;
  postcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  
  // Rooms
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  
  // Amenities
  amenities: string[];
  features: string[];
  
  // Policies
  check_in_time: string;
  check_out_time: string;
  minimum_stay: number;
  cancellation_policy: string;
  house_rules: string;
  
  // Pricing
  base_price: number;
  weekend_price?: number;
  cleaning_fee?: number;
  security_deposit?: number;
  
  // Media
  images: string[];
  hero_video?: string;
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  slug?: string;
};

const STEPS = [
  { id: 1, name: "Essentials", icon: Home },
  { id: 2, name: "Location", icon: MapPin },
  { id: 3, name: "Rooms", icon: Bed },
  { id: 4, name: "Amenities", icon: Sparkles },
  { id: 5, name: "Policies", icon: FileText },
  { id: 6, name: "Pricing", icon: PoundSterling },
  { id: 7, name: "Media", icon: Image },
  { id: 8, name: "SEO", icon: Search },
];

const AMENITIES_OPTIONS = [
  "Hot Tub", "Swimming Pool", "Games Room", "Cinema Room", "BBQ", 
  "Garden", "Parking", "WiFi", "Pet Friendly", "Accessible",
  "EV Charging", "Tennis Court", "Beach Access", "Fishing Lake"
];

const PROPERTY_TYPES = [
  "Manor House", "Country House", "Cottage", "Castle", "Luxury House", 
  "Party House", "Stately House", "Quirky Property"
];

interface PropertyMultiStepFormProps {
  propertyId?: string;
  initialData?: Partial<PropertyFormData>;
}

export function PropertyMultiStepForm({ propertyId, initialData }: PropertyMultiStepFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<PropertyFormData>({
    // Essentials
    title: initialData?.title || "",
    property_type: initialData?.property_type || "",
    status: initialData?.status || "draft",
    description: initialData?.description || "",
    
    // Location
    address: initialData?.address || "",
    town: initialData?.town || "",
    county: initialData?.county || "",
    postcode: initialData?.postcode || "",
    country: initialData?.country || "United Kingdom",
    latitude: initialData?.latitude,
    longitude: initialData?.longitude,
    
    // Rooms
    max_guests: initialData?.max_guests || 8,
    bedrooms: initialData?.bedrooms || 4,
    bathrooms: initialData?.bathrooms || 2,
    
    // Amenities
    amenities: initialData?.amenities || [],
    features: initialData?.features || [],
    
    // Policies
    check_in_time: initialData?.check_in_time || "15:00",
    check_out_time: initialData?.check_out_time || "10:00",
    minimum_stay: initialData?.minimum_stay || 2,
    cancellation_policy: initialData?.cancellation_policy || "",
    house_rules: initialData?.house_rules || "",
    
    // Pricing
    base_price: initialData?.base_price ?? 0,
    weekend_price: initialData?.weekend_price ?? 0,
    cleaning_fee: initialData?.cleaning_fee,
    security_deposit: initialData?.security_deposit,
    
    // Media
    images: initialData?.images || [],
    hero_video: initialData?.hero_video,
    
    // SEO
    meta_title: initialData?.meta_title,
    meta_description: initialData?.meta_description,
    slug: initialData?.slug,
  });

  const updateField = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Check if a step is accessible based on required fields
  const isStepAccessible = (step: number): boolean => {
    // Step 1 is always accessible
    if (step === 1) return true;
    
    // For subsequent steps, check if essential fields are filled
    switch (step) {
      case 2: // Location - requires Essentials
        return formData.title.trim() !== "" && formData.property_type !== "";
      case 3: // Rooms - requires Essentials
        return formData.title.trim() !== "" && formData.property_type !== "";
      case 4: // Amenities - requires Essentials
        return formData.title.trim() !== "" && formData.property_type !== "";
      case 5: // Policies - requires Essentials
        return formData.title.trim() !== "" && formData.property_type !== "";
      case 6: // Pricing - requires Essentials
        return formData.title.trim() !== "" && formData.property_type !== "";
      case 7: // Media - requires Essentials
        return formData.title.trim() !== "" && formData.property_type !== "";
      case 8: // SEO - requires Essentials
        return formData.title.trim() !== "" && formData.property_type !== "";
      default:
        return true;
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Essentials
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.property_type) newErrors.property_type = "Property type is required";
        break;
      
      case 2: // Location
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.town.trim()) newErrors.town = "Town is required";
        break;
      
      case 3: // Rooms
        if (formData.max_guests < 1) newErrors.max_guests = "Must accommodate at least 1 guest";
        if (formData.bedrooms < 1) newErrors.bedrooms = "Must have at least 1 bedroom";
        break;
      
      case 6: // Pricing
        if (formData.base_price <= 0) newErrors.base_price = "Base price must be greater than 0";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStepClick = (targetStep: number) => {
    // Check if the target step is accessible
    if (!isStepAccessible(targetStep)) {
      toast.error("Please complete required fields in the Essentials section first");
      return;
    }
    
    // If going to a previous step or the current step, allow it
    if (targetStep <= currentStep) {
      setCurrentStep(targetStep);
      return;
    }
    
    // If going forward, validate the current step first
    if (validateStep(currentStep)) {
      setCurrentStep(targetStep);
    } else {
      toast.error("Please complete all required fields before proceeding");
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      // Validate and convert prices
      const basePriceNum = parseFloat(String(formData.base_price)) || 0;
      const weekendPriceNum = parseFloat(String(formData.weekend_price || formData.base_price)) || 0;
      
      const maxGuestsNum = parseInt(String(formData.max_guests)) || 1;
      const bedroomsNum = parseInt(String(formData.bedrooms)) || 1;
      const bathroomsNum = parseInt(String(formData.bathrooms)) || 1;

      // Transform form data to API schema
      const apiData = {
        title: formData.title.trim(),
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        location: (formData.town || formData.address).trim(),
        region: (formData.county || formData.country || 'United Kingdom').trim(),
        sleepsMin: 1,
        sleepsMax: maxGuestsNum,
        bedrooms: bedroomsNum,
        bathrooms: bathroomsNum,
        priceFromMidweek: basePriceNum,
        priceFromWeekend: weekendPriceNum,
        description: formData.description?.trim() || 'No description provided',
        houseRules: formData.house_rules?.trim() || null,
        checkInOut: `Check-in: ${formData.check_in_time}, Check-out: ${formData.check_out_time}`,
        heroImage: formData.images[0] || '/placeholder-property.jpg',
        heroVideo: formData.hero_video?.trim() || null,
        mapLat: formData.latitude !== undefined && !isNaN(parseFloat(String(formData.latitude))) ? parseFloat(String(formData.latitude)) : null,
        mapLng: formData.longitude !== undefined && !isNaN(parseFloat(String(formData.longitude))) ? parseFloat(String(formData.longitude)) : null,
        isPublished: false,
      };

      console.log('Saving draft with data:', apiData);

      if (propertyId) {
        // Update existing property
        await GEH_API.put(`/properties?id=${propertyId}`, apiData);
        toast.success("Property draft saved successfully");
      } else {
        // Create new property as draft
        const response = await GEH_API.post("/properties", apiData) as any;
        toast.success("Property draft created successfully");
        router.push(`/admin/properties/${response.id}/edit`);
      }
    } catch (error: any) {
      console.error('Save draft error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.message || error.response?.data?.error || "Failed to save draft";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    // Validate all required fields
    const requiredFieldsErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) requiredFieldsErrors.title = "Title is required";
    if (!formData.property_type) requiredFieldsErrors.property_type = "Property type is required";
    if (!formData.description.trim()) requiredFieldsErrors.description = "Description is required";
    if (!formData.address.trim()) requiredFieldsErrors.address = "Address is required";
    if (!formData.town.trim()) requiredFieldsErrors.town = "Town is required";
    if (formData.max_guests < 1) requiredFieldsErrors.max_guests = "Max guests is required";
    if (formData.bedrooms < 1) requiredFieldsErrors.bedrooms = "Bedrooms must be at least 1";
    if (formData.bathrooms < 1) requiredFieldsErrors.bathrooms = "Bathrooms must be at least 1";
    if (formData.base_price <= 0) requiredFieldsErrors.base_price = "Base price must be greater than 0";
    if (!formData.images || formData.images.length === 0) requiredFieldsErrors.images = "At least one image is required";

    if (Object.keys(requiredFieldsErrors).length > 0) {
      setErrors(requiredFieldsErrors);
      toast.error("Please fill in all required fields");
      // Jump to first step with error
      if (requiredFieldsErrors.title || requiredFieldsErrors.property_type || requiredFieldsErrors.description) setCurrentStep(1);
      else if (requiredFieldsErrors.address || requiredFieldsErrors.town) setCurrentStep(2);
      else if (requiredFieldsErrors.max_guests || requiredFieldsErrors.bedrooms || requiredFieldsErrors.bathrooms) setCurrentStep(3);
      else if (requiredFieldsErrors.base_price) setCurrentStep(6);
      else if (requiredFieldsErrors.images) setCurrentStep(7);
      return;
    }

    setIsLoading(true);
    try {
      // Validate prices are valid numbers
      const basePriceNum = parseFloat(String(formData.base_price));
      const weekendPriceNum = parseFloat(String(formData.weekend_price || formData.base_price));
      
      if (isNaN(basePriceNum) || basePriceNum <= 0) {
        setErrors({ base_price: "Base price must be a valid number greater than 0" });
        toast.error("Base price must be a valid number greater than 0");
        setCurrentStep(6);
        setIsLoading(false);
        return;
      }
      
      if (isNaN(weekendPriceNum) || weekendPriceNum <= 0) {
        setErrors({ weekend_price: "Weekend price must be a valid number greater than 0" });
        toast.error("Weekend price must be a valid number greater than 0");
        setCurrentStep(6);
        setIsLoading(false);
        return;
      }

      // Validate integer fields
      const maxGuestsNum = parseInt(String(formData.max_guests)) || 1;
      const bedroomsNum = parseInt(String(formData.bedrooms)) || 1;
      const bathroomsNum = parseInt(String(formData.bathrooms)) || 1;

      if (maxGuestsNum < 1) {
        setErrors({ max_guests: "Max guests must be at least 1" });
        toast.error("Max guests must be at least 1");
        setCurrentStep(3);
        setIsLoading(false);
        return;
      }

      // Transform form data to API schema
      const apiData = {
        title: formData.title.trim(),
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        location: (formData.town || formData.address).trim(),
        region: (formData.county || formData.country || 'United Kingdom').trim(),
        sleepsMin: 1,
        sleepsMax: maxGuestsNum,
        bedrooms: bedroomsNum,
        bathrooms: bathroomsNum,
        priceFromMidweek: basePriceNum,
        priceFromWeekend: weekendPriceNum,
        description: formData.description.trim(),
        houseRules: formData.house_rules?.trim() || null,
        checkInOut: `Check-in: ${formData.check_in_time}, Check-out: ${formData.check_out_time}`,
        heroImage: formData.images[0] || '/placeholder-property.jpg',
        heroVideo: formData.hero_video?.trim() || null,
        mapLat: formData.latitude !== undefined && !isNaN(parseFloat(String(formData.latitude))) ? parseFloat(String(formData.latitude)) : null,
        mapLng: formData.longitude !== undefined && !isNaN(parseFloat(String(formData.longitude))) ? parseFloat(String(formData.longitude)) : null,
        isPublished: true,
      };

      console.log('Publishing with data:', apiData);

      if (propertyId) {
        // Update existing property
        await GEH_API.put(`/properties?id=${propertyId}`, apiData);
        toast.success("Property published successfully");
        router.push("/admin/properties");
      } else {
        // Create new property
        const response = await GEH_API.post("/properties", apiData) as any;
        toast.success("Property published successfully");
        router.push("/admin/properties");
      }
    } catch (error: any) {
      console.error('Publish error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.message || error.response?.data?.error || "Failed to publish property";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Essentials
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-gray-900">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g., The Brighton Manor"
                className={errors.title ? "border-red-500 text-gray-900" : "text-gray-900"}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="property_type" className="text-gray-900">Property Type *</Label>
              <Select value={formData.property_type} onValueChange={(value) => updateField("property_type", value)}>
                <SelectTrigger className={errors.property_type ? "border-red-500 text-gray-900" : "text-gray-900"}>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.property_type && <p className="text-red-500 text-sm mt-1">{errors.property_type}</p>}
            </div>



            <div>
              <Label htmlFor="description" className="text-gray-900">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your property..."
                rows={6}
                className="text-gray-900"
              />
            </div>
          </div>
        );

      case 2: // Location
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="address" className="text-gray-900">Full Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="123 High Street"
                className={errors.address ? "border-red-500 text-gray-900" : "text-gray-900"}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="town" className="text-gray-900">Town *</Label>
                <Input
                  id="town"
                  value={formData.town}
                  onChange={(e) => updateField("town", e.target.value)}
                  placeholder="Brighton"
                  className={errors.town ? "border-red-500 text-gray-900" : "text-gray-900"}
                />
                {errors.town && <p className="text-red-500 text-sm mt-1">{errors.town}</p>}
              </div>

              <div>
                <Label htmlFor="county" className="text-gray-900">County</Label>
                <Input
                  id="county"
                  value={formData.county}
                  onChange={(e) => updateField("county", e.target.value)}
                  placeholder="East Sussex"
                  className="text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postcode" className="text-gray-900">Postcode</Label>
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => updateField("postcode", e.target.value)}
                  placeholder="BN1 1AA"
                  className="text-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-gray-900">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  className="text-gray-900"
                />
              </div>
            </div>


          </div>
        );

      case 3: // Rooms
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="max_guests" className="text-gray-900">Maximum Guests *</Label>
              <Input
                id="max_guests"
                type="number"
                min="1"
                value={formData.max_guests}
                onChange={(e) => updateField("max_guests", parseInt(e.target.value) || 0)}
                className={errors.max_guests ? "border-red-500 text-gray-900" : "text-gray-900"}
              />
              {errors.max_guests && <p className="text-red-500 text-sm mt-1">{errors.max_guests}</p>}
            </div>

            <div>
              <Label htmlFor="bedrooms" className="text-gray-900">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                min="1"
                value={formData.bedrooms}
                onChange={(e) => updateField("bedrooms", parseInt(e.target.value) || 0)}
                className={errors.bedrooms ? "border-red-500 text-gray-900" : "text-gray-900"}
              />
              {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
            </div>

            <div>
              <Label htmlFor="bathrooms" className="text-gray-900">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                min="1"
                value={formData.bathrooms}
                onChange={(e) => updateField("bathrooms", parseInt(e.target.value) || 0)}
                className="text-gray-900"
              />
            </div>
          </div>
        );

      case 4: // Amenities
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-gray-900">Select Amenities</Label>
              <div className="grid grid-cols-2 gap-4 mt-3">
                {AMENITIES_OPTIONS.map(amenity => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <label htmlFor={amenity} className="text-sm cursor-pointer text-gray-900">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5: // Policies
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="check_in_time" className="text-gray-900">Check-in Time</Label>
                <Input
                  id="check_in_time"
                  type="time"
                  value={formData.check_in_time}
                  onChange={(e) => updateField("check_in_time", e.target.value)}
                  className="text-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="check_out_time" className="text-gray-900">Check-out Time</Label>
                <Input
                  id="check_out_time"
                  type="time"
                  value={formData.check_out_time}
                  onChange={(e) => updateField("check_out_time", e.target.value)}
                  className="text-gray-900"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="minimum_stay" className="text-gray-900">Minimum Stay (nights)</Label>
              <Input
                id="minimum_stay"
                type="number"
                min="1"
                value={formData.minimum_stay}
                onChange={(e) => updateField("minimum_stay", parseInt(e.target.value) || 1)}
                className="text-gray-900"
              />
            </div>

            <div>
              <Label htmlFor="cancellation_policy" className="text-gray-900">Cancellation Policy</Label>
              <Textarea
                id="cancellation_policy"
                value={formData.cancellation_policy}
                onChange={(e) => updateField("cancellation_policy", e.target.value)}
                placeholder="Describe your cancellation policy..."
                rows={4}
                className="text-gray-900"
              />
            </div>

            <div>
              <Label htmlFor="house_rules" className="text-gray-900">House Rules</Label>
              <Textarea
                id="house_rules"
                value={formData.house_rules}
                onChange={(e) => updateField("house_rules", e.target.value)}
                placeholder="List your house rules..."
                rows={4}
                className="text-gray-900"
              />
            </div>
          </div>
        );

      case 6: // Pricing
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="base_price" className="text-gray-900">Base Price (per night) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                <Input
                  id="base_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.base_price || ""}
                  onChange={(e) => updateField("base_price", e.target.value ? parseFloat(e.target.value) : "")}
                  placeholder="Enter base price"
                  className={`pl-7 text-gray-900 ${errors.base_price ? "border-red-500" : ""}`}
                />
              </div>
              {errors.base_price && <p className="text-red-500 text-sm mt-1">{errors.base_price}</p>}
            </div>

            <div>
              <Label htmlFor="weekend_price" className="text-gray-900">Weekend Price (per night)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                <Input
                  id="weekend_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.weekend_price || ""}
                  onChange={(e) => updateField("weekend_price", parseFloat(e.target.value) || undefined)}
                  className="pl-7 text-gray-900"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cleaning_fee" className="text-gray-900">Cleaning Fee</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                <Input
                  id="cleaning_fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cleaning_fee || ""}
                  onChange={(e) => updateField("cleaning_fee", parseFloat(e.target.value) || undefined)}
                  className="pl-7 text-gray-900"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="security_deposit" className="text-gray-900">Security Deposit</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                <Input
                  id="security_deposit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.security_deposit || ""}
                  onChange={(e) => updateField("security_deposit", parseFloat(e.target.value) || undefined)}
                  className="pl-7 text-gray-900"
                />
              </div>
            </div>
          </div>
        );

      case 7: // Media
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-gray-900">Property Images</Label>
              <div className="space-y-4 mt-3">
                {formData.images.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={url} readOnly className="flex-1 text-gray-900" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addImageUrl}
                  className="w-full"
                >
                  Add Image URL
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="hero_video" className="text-gray-900">Hero Video URL (Optional)</Label>
              <Input
                id="hero_video"
                value={formData.hero_video || ""}
                onChange={(e) => updateField("hero_video", e.target.value)}
                placeholder="https://example.com/video.mp4"
                className="text-gray-900"
              />
            </div>
          </div>
        );

      case 8: // SEO
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="slug" className="text-gray-900">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug || ""}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="brighton-manor"
                className="text-gray-900"
              />
              <p className="text-sm text-gray-500 mt-1">Leave blank to auto-generate from title</p>
            </div>

            <div>
              <Label htmlFor="meta_title" className="text-gray-900">Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title || ""}
                onChange={(e) => updateField("meta_title", e.target.value)}
                placeholder="The Brighton Manor - Luxury Party House"
                maxLength={60}
                className="text-gray-900"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.meta_title?.length || 0}/60 characters</p>
            </div>

            <div>
              <Label htmlFor="meta_description" className="text-gray-900">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description || ""}
                onChange={(e) => updateField("meta_description", e.target.value)}
                placeholder="Luxury 8-bedroom party house in Brighton with hot tub, pool, and games room. Perfect for hen parties and celebrations."
                rows={3}
                maxLength={160}
                className="text-gray-900"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.meta_description?.length || 0}/160 characters</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      {/* Progress Steps */}
      <div className="mb-6 md:mb-8">
        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden">
          <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            <div className="flex items-center gap-2 min-w-max">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isAccessible = isStepAccessible(step.id);
                
                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleStepClick(step.id)}
                      disabled={!isAccessible}
                      className={`relative flex flex-col items-center gap-1 touch-manipulation ${
                        isActive ? "text-[var(--color-accent-sage)]" : isCompleted ? "text-green-600" : "text-gray-400"
                      } ${!isAccessible ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"}`}
                    >
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                          isActive
                            ? "border-[var(--color-accent-sage)] bg-[var(--color-accent-sage)] text-white shadow-md"
                            : isCompleted
                            ? "border-green-600 bg-green-600 text-white"
                            : isAccessible
                            ? "border-gray-300 bg-white"
                            : "border-gray-200 bg-gray-100"
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </div>
                      <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">{step.name}</span>
                    </button>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`w-8 sm:w-12 h-0.5 mx-1 flex-shrink-0 ${
                          currentStep > step.id ? "bg-green-600" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Step Counter for Mobile */}
          <div className="text-center mt-2">
            <span className="text-xs text-gray-500 font-medium">
              Step {currentStep} of {STEPS.length}
            </span>
          </div>
        </div>

        {/* Desktop: Full Width with Connectors */}
        <div className="hidden md:block">
          <div className="flex justify-between items-center">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isAccessible = isStepAccessible(step.id);
              
              return (
                <div key={step.id} className="flex-1">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleStepClick(step.id)}
                      disabled={!isAccessible}
                      className={`relative flex flex-col items-center group w-full ${
                        isActive ? "text-[var(--color-accent-sage)]" : isCompleted ? "text-green-600" : "text-gray-400"
                      } ${!isAccessible ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          isActive
                            ? "border-[var(--color-accent-sage)] bg-[var(--color-accent-sage)] text-white shadow-lg"
                            : isCompleted
                            ? "border-green-600 bg-green-600 text-white"
                            : isAccessible
                            ? "border-gray-300 bg-white hover:border-gray-400 hover:shadow-md"
                            : "border-gray-200 bg-gray-100"
                        }`}
                      >
                        {isCompleted ? <Check className="w-5 h-5 lg:w-6 lg:h-6" /> : <Icon className="w-5 h-5 lg:w-6 lg:h-6" />}
                      </div>
                      <span className="text-xs lg:text-sm mt-2 font-medium text-center px-1">{step.name}</span>
                    </button>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 lg:mx-3 ${
                          currentStep > step.id ? "bg-green-600" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">{STEPS[currentStep - 1].name}</h2>
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pb-safe">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="w-full sm:w-auto order-2 sm:order-1 touch-manipulation"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Back</span>
        </Button>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 order-1 sm:order-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isLoading}
            className="w-full sm:w-auto touch-manipulation"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>

          {currentStep < STEPS.length ? (
            <Button 
              type="button" 
              onClick={handleNext}
              className="w-full sm:w-auto touch-manipulation"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Continue</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handlePublish}
              disabled={isLoading}
              style={{ background: "var(--color-accent-sage)", color: "white" }}
              className="w-full sm:w-auto touch-manipulation"
            >
              <Check className="w-4 h-4 mr-2" />
              {propertyId ? "Update" : "Publish"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}



