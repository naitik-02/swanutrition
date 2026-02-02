"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  X,
  Upload,
  Settings,
  Truck, 
} from "lucide-react";
import { useSettingContext } from "@/context/setting";
import Loading from "@/components/loading";

const Page = () => {
  const [title, setTitle] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [logo, setLogo] = useState(null);
  const [storeStatus, setStoreStatus] = useState("open");
  const [logoPreview, setLogoPreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [freeThreshold, setFreeThreshold] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [defaultCharge, setDefaultCharge] = useState(0);
  const [slabs, setSlabs] = useState([]); 

  const { setting, createSetting, updateSetting, loading, btnLoading } = useSettingContext();

  useEffect(() => {
    if (setting) {
      setTitle(setting.title || "");
      setOpenTime(setting.open_time || "");
      setCloseTime(setting.close_time || "");
      setStoreStatus(setting.store_status || "open");
      setLogoPreview(setting.logo || "");
      
      setFreeThreshold(setting.free_delivery_threshold || 0);
      setPlatformFee(setting.platform_fee || 0);
      setDefaultCharge(setting.default_delivery_charge || 0);
      setSlabs(setting.distance_slabs || []);

      setIsEditing(true);
    }
  }, [setting]);

  const addSlab = () => {
    setSlabs([...slabs, { min_km: 0, max_km: 0, price: 0 }]);
  };

  const removeSlab = (index) => {
    setSlabs(slabs.filter((_, i) => i !== index));
  };

  const updateSlab = (index, field, value) => {
    const newSlabs = [...slabs];
    newSlabs[index][field] = Number(value);
    setSlabs(newSlabs);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      setLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview("");
  };
  console.log("storeStatus" , storeStatus)

  const saveSettings = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("openTime", openTime);
      formData.append("closeTime", closeTime);
      
      formData.append("storeStatus", storeStatus );

      formData.append("free_delivery_threshold", freeThreshold);
      formData.append("platform_fee", platformFee);
      formData.append("default_delivery_charge", defaultCharge);
      formData.append("distance_slabs", JSON.stringify(slabs));

      if (logo) formData.append("logo", logo);

      if (isEditing && setting?._id) {
        await updateSetting(setting._id, formData);
      } else {
        await createSetting(formData);
      }
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings Management</h1>
            <p className="text-gray-600">Configure your store and delivery rules</p>
          </div>
          <button 
            onClick={saveSettings}
            disabled={btnLoading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {btnLoading ? "Saving..." : "Save All Settings"}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column: Basic Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Basic Settings</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Title*</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Open Time (24h)</label>
                  <input type="number" value={openTime} onChange={(e) => setOpenTime(e.target.value)} className="w-full rounded-lg border-2 border-gray-200 py-3 px-4" placeholder="9" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Close Time (24h)</label>
                  <input type="number" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} className="w-full rounded-lg border-2 border-gray-200 py-3 px-4" placeholder="21" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Status</label>
                <select 
                  value={storeStatus} 
                  onChange={(e) => setStoreStatus(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 py-3 px-4"
                >
                  <option value="open">Open</option>
                  <option value="close">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                {!logoPreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload logo</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img src={logoPreview} alt="Preview" className="w-full h-32 object-contain rounded-lg border-2 bg-gray-50" />
                    <button onClick={removeLogo} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"><X className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Delivery Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Delivery Rules</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Free Delivery Above (₹)</label>
                  <input type="number" value={freeThreshold} onChange={(e) => setFreeThreshold(e.target.value)} className="w-full rounded-lg border-2 border-gray-200 py-3 px-4" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform Fee (₹)</label>
                  <input type="number" value={platformFee} onChange={(e) => setPlatformFee(e.target.value)} className="w-full rounded-lg border-2 border-gray-200 py-3 px-4" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Delivery Charge (₹)</label>
                <input type="number" value={defaultCharge} onChange={(e) => setDefaultCharge(e.target.value)} className="w-full rounded-lg border-2 border-gray-200 py-3 px-4" />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Distance Slabs (KM)</h3>
                  <button onClick={addSlab} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <Plus className="w-4 h-4" /> Add Slab
                  </button>
                </div>
                
                <div className="space-y-3">
                  {slabs.map((slab, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <input 
                        type="number" placeholder="Min KM" value={slab.min_km} 
                        onChange={(e) => updateSlab(index, "min_km", e.target.value)}
                        className="w-full rounded-md border py-1 px-2 text-sm"
                      />
                      <span className="text-gray-400">-</span>
                      <input 
                        type="number" placeholder="Max KM" value={slab.max_km} 
                        onChange={(e) => updateSlab(index, "max_km", e.target.value)}
                        className="w-full rounded-md border py-1 px-2 text-sm"
                      />
                      <input 
                        type="number" placeholder="Price ₹" value={slab.price} 
                        onChange={(e) => updateSlab(index, "price", e.target.value)}
                        className="w-full rounded-md border py-1 px-2 text-sm bg-blue-50"
                      />
                      <button onClick={() => removeSlab(index)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;