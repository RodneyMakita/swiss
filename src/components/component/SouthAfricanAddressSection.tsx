'use client';
import { getAuth } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import '@/app/globals.css';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db, collection, doc, getDoc, setDoc } from '@/lib/firebase';
import { Spinner } from "@nextui-org/react";

interface Address {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
  cellphone: string;
  country: string;
}

interface AddressErrors {
  firstName?: string;
  lastName?: string;
  streetAddress?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  cellphone?: string;
}

const southAfricanProvinces = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape"
] as const;

type Province = typeof southAfricanProvinces[number];

export default function Component() {
  const [address, setAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    province: '',
    postalCode: '',
    cellphone: '',
    country: 'ZA'
  });

  const [errors, setErrors] = useState<AddressErrors>({});

  const [loading, setLoading] = useState(false); 



  useEffect(() => {
    const fetchAddress = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("User is not authenticated");
        return;
      }

      try {
        const userId = user.uid;
        const addressDoc = await getDoc(doc(collection(db, "users", userId, "Address"), "addressId"));

        if (addressDoc.exists()) {
          setAddress(addressDoc.data() as Address);
        } else {
          console.log("No address found for the user.");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: AddressErrors = {};
    if (!address.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!address.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!address.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.province) newErrors.province = 'Province is required';

    if (!/^\d{4}$/.test(address.postalCode)) {
      newErrors.postalCode = 'Postal code must be a 4-digit number';
    }

    const cellphoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    if (!cellphoneRegex.test(address.cellphone)) {
      newErrors.cellphone = 'Please enter a valid South African cellphone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true); // Set loading to true when starting submission
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("User is not authenticated");
        setLoading(false); // Stop loading if user is not authenticated
        return;
      }

      try {
        const userId = user.uid;
        await setDoc(doc(collection(db, "users", userId, "Address"), "addressId"), address);
        console.log('Address saved successfully:', address);
       
      } catch (error) {
        console.error('Error saving address:', error);
      } finally {
        setLoading(false); // Stop loading when submission is complete
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
        <h2 className="text-2xl font-bold">Shipping Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={address.firstName}
              onChange={handleChange}
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && <p className="text-sm text-red-500" role="alert">{errors.firstName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={address.lastName}
              onChange={handleChange}
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && <p className="text-sm text-red-500" role="alert">{errors.lastName}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="streetAddress">Street Address</Label>
          <Input
            id="streetAddress"
            name="streetAddress"
            value={address.streetAddress}
            onChange={handleChange}
            aria-invalid={!!errors.streetAddress}
          />
          {errors.streetAddress && <p className="text-sm text-red-500" role="alert">{errors.streetAddress}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              aria-invalid={!!errors.city}
            />
            {errors.city && <p className="text-sm text-red-500" role="alert">{errors.city}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Select onValueChange={(value: Province) => handleSelectChange('province', value)} value={address.province}>
              <SelectTrigger id="province">
                <SelectValue placeholder="Select a province" />
              </SelectTrigger>
              <SelectContent>
                {southAfricanProvinces.map((province) => (
                  <SelectItem key={province} value={province}>{province}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.province && <p className="text-sm text-red-500" role="alert">{errors.province}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={address.postalCode}
              onChange={handleChange}
              aria-invalid={!!errors.postalCode}
            />
            {errors.postalCode && <p className="text-sm text-red-500" role="alert">{errors.postalCode}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cellphone">Cellphone Number</Label>
            <Input
              id="cellphone"
              name="cellphone"
              type="tel"
              placeholder="e.g., 0721234567"
              value={address.cellphone}
              onChange={handleChange}
              aria-invalid={!!errors.cellphone}
            />
            {errors.cellphone && <p className="text-sm text-red-500" role="alert">{errors.cellphone}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select onValueChange={(value) => handleSelectChange('country', value)} value={address.country}>
            <SelectTrigger id="country">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ZA">South Africa</SelectItem>
              <SelectItem value="BW">Botswana</SelectItem>
              <SelectItem value="LS">Lesotho</SelectItem>
              <SelectItem value="NA">Namibia</SelectItem>
              <SelectItem value="SZ">Eswatini (Swaziland)</SelectItem>
              <SelectItem value="ZM">Zambia</SelectItem>
              <SelectItem value="ZW">Zimbabwe</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">Save Address</Button>
        <Button type="button" className="w-full" onClick={() => window.history.back()}>Go Back</Button> 
      </form>


   
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <Spinner size="lg" />
        </div>
      )}
  


    </>
  );
}
