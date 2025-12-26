import { useState, useEffect } from "react";
import { Plus, X, ChevronDown, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const generateOrderId = () => {
  const savedOrderId = sessionStorage.getItem('orderId');
  if (savedOrderId) return savedOrderId;
  const newId = `ID-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  sessionStorage.setItem('orderId', newId);
  return newId;
};

const getFromStorage = (key, defaultValue) => {
  try {
    const saved = sessionStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to sessionStorage:', e);
  }
};

function AddItemModal({ open, onClose, onAddItem }) {
  // States for unique lists from DB
const [materialList, setMaterialList] = useState([]);
const [distList, setDistList] = useState([]);
const [specList, setSpecList] = useState([]); // Shared by Spec 1 and Spec 2
const [spec2List, setSpec2List] = useState([]);

// UI States for Dropdowns
const [activeDropdown, setActiveDropdown] = useState(null); // 'material', 'dist', 'spec1', 'spec2'
const [filteredOptions, setFilteredOptions] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false); // FIXED: Added missing loading state
    const [filteredItems, setFilteredItems] = useState([]);
    const [showItemDropdown, setShowItemDropdown] = useState(false);
    useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/databases/Tribal/collections/workflow_list/documents`);
            const docs = res.data.documents || (Array.isArray(res.data) ? res.data : []);
            
            setMaterialList([...new Set(docs.map(doc => doc.Matrial).filter(Boolean))]);
            setDistList([...new Set(docs.map(doc => doc["Disprition/type"]).filter(Boolean))]);
            setSpecList([...new Set(docs.map(doc => doc.SPECIFICATION).filter(Boolean))]);
            setSpec2List([...new Set(docs.map(doc => doc.SPECIFICATION).filter(Boolean))]);
        } catch (err) {
            console.error("Error fetching form data:", err);
        }
    };
    fetchData();
}, []);
useEffect(() => {
    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/databases/Tribal/collections/workflow_list/documents`);
            const docs = res.data.documents || (Array.isArray(res.data) ? res.data : []);
            
            // USE BRACKET NOTATION FOR "Item-Names"
            const uniqueItems = [...new Set(docs.map(doc => doc["Item-Names"]).filter(Boolean))];
            
            setItems(uniqueItems);
        } catch (err) {
            console.error("Error fetching item names:", err);
        } finally {
            setLoading(false);
        }
    };
    fetchItems();
}, []);
  const [itemData, setItemData] = useState({
    item: "",
    qty: "50",
    size: "M",
    material: "",
    distType: "",
    backColor: "#1f2937",
    frontColor: "#a855f7",
    spec1: "",
    sleeveType: "full",
    sleeveColor: "#ec4899",
    tower: true,
    rib: true,
    cuff: false,
    tipping: false,
    spec2: "",
    neckType: "2",
    sleeveColor2: "#a855f7",
    tippingCheck: true,
    patti: true,
    customNote: "",
    images: [],
  });

  const handleSubmit = () => {
    onAddItem({
      ...itemData,
      id: Date.now(),
      images: ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Order</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <div>
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="w-32 h-40 bg-gray-100 rounded-lg overflow-hidden relative">
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200" 
                    alt="Product" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {[1, 2].map((img) => (
                <div key={img} className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100" 
                      alt="Product" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-2 h-2 text-white" />
                  </button>
                </div>
              ))}
              <div className="w-20 h-24 border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg flex items-center justify-center cursor-pointer">
                <Plus className="w-6 h-6 text-blue-400" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <Label className="text-gray-600 text-sm">Item</Label>
          <input
    type="text"
    autoComplete="off"
    value={itemData.item}
    onChange={(e) => {
      const val = e.target.value;
      setItemData({ ...itemData, item: val });
      
      // Filter the items list as user types
      const filtered = items.filter(i => 
        i.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredItems(filtered);
    }}
    onFocus={() => {
      setShowItemDropdown(true);
      // Show all items if input is empty, otherwise show current matches
      setFilteredItems(itemData.item ? 
        items.filter(i => i.toLowerCase().includes(itemData.item.toLowerCase())) : 
        items
      );
    }}
    // Close dropdown with delay to allow onMouseDown to fire
    onBlur={() => setTimeout(() => setShowItemDropdown(false), 250)}
    className="mt-1 flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4880ff] border-gray-300"
    placeholder={loading ? "Loading items..." : "Search or type item"}
  />

  {/* SEARCH RESULTS DROPDOWN */}
  {showItemDropdown && (
    <ul className="absolute z-[1000] w-full bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-48 overflow-auto list-none p-0">
      {filteredItems.length > 0 ? (
        filteredItems.map((itemName, index) => (
          <li
            key={index}
            onMouseDown={() => {
              setItemData({ ...itemData, item: itemName });
              setShowItemDropdown(false);
            }}
            className="px-4 py-2 hover:bg-[#4880ff] hover:text-white cursor-pointer text-sm border-b border-gray-50 last:border-b-0 text-left"
          >
            {itemName}
          </li>
        ))
      ) : (
        <li className="px-4 py-3 text-sm text-gray-500 text-center italic">
          No matches found
        </li>
      )}
    </ul>
  )}
              </div>
              <div>
                <Label className="text-gray-600 text-sm">Qty</Label>
                <Input 
                  value={itemData.qty} 
                  onChange={(e) => setItemData({...itemData, qty: e.target.value})}
                  className="mt-1" 
                  data-testid="input-qty"
                />
              </div>
              <div>
                <Label className="text-gray-600 text-sm">Size</Label>
                <Select value={itemData.size} onValueChange={(v) => setItemData({...itemData, size: v})}>
                  <SelectTrigger className="mt-1" data-testid="select-size">
                    <SelectValue placeholder="M - Medium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">S - Small</SelectItem>
                    <SelectItem value="M">M - Medium</SelectItem>
                    <SelectItem value="L">L - Large</SelectItem>
                    <SelectItem value="XL">XL - Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-gray-600 text-sm">Custom Note</Label>
              <Textarea 
                value={itemData.customNote}
                onChange={(e) => setItemData({...itemData, customNote: e.target.value})}
                placeholder="Enter notes..." 
                className="mt-1 h-24" 
                data-testid="textarea-custom-note"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-600 text-sm">Material</Label>
             <input
        type="text"
         placeholder={loading ? "Loading Materials..." : "Search or type Material"}
        value={itemData.material}
        onChange={(e) => {
            const val = e.target.value;
            setItemData({...itemData, material: val});
            setFilteredOptions(materialList.filter(m => m.toLowerCase().includes(val.toLowerCase())));
        }}
        onFocus={() => {
            setActiveDropdown('material');
            setFilteredOptions(itemData.material ? materialList.filter(m => m.toLowerCase().includes(itemData.material.toLowerCase())) : materialList);
        }}
        onBlur={() => setTimeout(() => setActiveDropdown(null), 250)}
        className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#4880ff] outline-none"
        placeholder="Search material..."
    />
    {activeDropdown === 'material' && filteredOptions.length > 0 && (
        <ul className="absolute z-[1001] w-full bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-40 overflow-auto">
            {filteredOptions.map((opt, i) => (
                <li key={i} onMouseDown={() => setItemData({...itemData, material: opt})} className="px-4 py-2 hover:bg-[#4880ff] hover:text-white cursor-pointer text-sm">
                    {opt}
                </li>
            ))}
        </ul>
    )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-600 text-sm">Distribution Type</Label>
                <input
        type="text"
         placeholder={loading ? "Distribution Type..." : "Search or Distribution"}
        value={itemData.distType}
        onChange={(e) => {
            const val = e.target.value;
            setItemData({...itemData, distType: val});
            setFilteredOptions(distList.filter(d => d.toLowerCase().includes(val.toLowerCase())));
        }}
        onFocus={() => {
            setActiveDropdown('dist');
            setFilteredOptions(itemData.distType ? distList.filter(d => d.toLowerCase().includes(itemData.distType.toLowerCase())) : distList);
        }}
        onBlur={() => setTimeout(() => setActiveDropdown(null), 250)}
        className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#4880ff] outline-none"
    />
    {activeDropdown === 'dist' && filteredOptions.length > 0 && (
        <ul className="absolute z-[1001] w-full bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-40 overflow-auto">
            {filteredOptions.map((opt, i) => (
                <li key={i} onMouseDown={() => setItemData({...itemData, distType: opt})} className="px-4 py-2 hover:bg-[#4880ff] hover:text-white cursor-pointer text-sm">
                    {opt}
                </li>
            ))}
        </ul>
    )}
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Back Color</Label>
                  <div className="mt-1 flex gap-1">
                    <button type="button" onClick={() => setItemData({...itemData, backColor: "#1f2937"})} style={{backgroundColor: "#1f2937"}} className={`w-6 h-6 rounded-full border-2 ${itemData.backColor === "#1f2937" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-back-color-gray" />
                    <button type="button" onClick={() => setItemData({...itemData, backColor: "#a855f7"})} style={{backgroundColor: "#a855f7"}} className={`w-6 h-6 rounded-full border-2 ${itemData.backColor === "#a855f7" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-back-color-purple" />
                    <button type="button" onClick={() => setItemData({...itemData, backColor: "#ec4899"})} style={{backgroundColor: "#ec4899"}} className={`w-6 h-6 rounded-full border-2 ${itemData.backColor === "#ec4899" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-back-color-pink" />
                    <button type="button" onClick={() => setItemData({...itemData, backColor: "#3b82f6"})} style={{backgroundColor: "#3b82f6"}} className={`w-6 h-6 rounded-full border-2 ${itemData.backColor === "#3b82f6" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-back-color-blue" />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Front Color</Label>
                  <div className="mt-1 flex gap-1">
                    <button type="button" onClick={() => setItemData({...itemData, frontColor: "#1f2937"})} style={{backgroundColor: "#1f2937"}} className={`w-6 h-6 rounded-full border-2 ${itemData.frontColor === "#1f2937" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-front-color-gray" />
                    <button type="button" onClick={() => setItemData({...itemData, frontColor: "#a855f7"})} style={{backgroundColor: "#a855f7"}} className={`w-6 h-6 rounded-full border-2 ${itemData.frontColor === "#a855f7" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-front-color-purple" />
                    <button type="button" onClick={() => setItemData({...itemData, frontColor: "#ec4899"})} style={{backgroundColor: "#ec4899"}} className={`w-6 h-6 rounded-full border-2 ${itemData.frontColor === "#ec4899" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-front-color-pink" />
                    <button type="button" onClick={() => setItemData({...itemData, frontColor: "#3b82f6"})} style={{backgroundColor: "#3b82f6"}} className={`w-6 h-6 rounded-full border-2 ${itemData.frontColor === "#3b82f6" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-front-color-blue" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-gray-600 text-sm">Spec 1</Label>
           <input
        type="text"
        value={itemData.spec1}
         placeholder={loading ? "Loading Spec..." : "Search or type Spec"}
        onChange={(e) => {
            const val = e.target.value;
            setItemData({...itemData, spec1: val});
            setFilteredOptions(specList.filter(s => s.toLowerCase().includes(val.toLowerCase())));
        }}
        onFocus={() => {
            setActiveDropdown('spec1');
            setFilteredOptions(itemData.spec1 ? specList.filter(s => s.toLowerCase().includes(itemData.spec1.toLowerCase())) : specList);
        }}
        onBlur={() => setTimeout(() => setActiveDropdown(null), 250)}
        className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#4880ff] outline-none"
    />
    {activeDropdown === 'spec1' && filteredOptions.length > 0 && (
        <ul className="absolute z-[1001] w-full bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-40 overflow-auto">
            {filteredOptions.map((opt, i) => (
                <li key={i} onMouseDown={() => setItemData({...itemData, spec1: opt})} className="px-4 py-2 hover:bg-[#4880ff] hover:text-white cursor-pointer text-sm">
                    {opt}
                </li>
            ))}
        </ul>
    )}
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Sleeve Type</Label>
                  <Select value={itemData.sleeveType} onValueChange={(v) => setItemData({...itemData, sleeveType: v})}>
                    <SelectTrigger className="mt-1" data-testid="select-sleeve-type">
                      <SelectValue placeholder="Full Sleeve" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Sleeve</SelectItem>
                      <SelectItem value="half">Half Sleeve</SelectItem>
                      <SelectItem value="narrow">Narrow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Sleeve Color</Label>
                  <div className="mt-1 flex gap-1">
                    <button type="button" onClick={() => setItemData({...itemData, sleeveColor: "#1f2937"})} style={{backgroundColor: "#1f2937"}} className={`w-6 h-6 rounded-full border-2 ${itemData.sleeveColor === "#1f2937" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-sleeve-color-gray" />
                    <button type="button" onClick={() => setItemData({...itemData, sleeveColor: "#a855f7"})} style={{backgroundColor: "#a855f7"}} className={`w-6 h-6 rounded-full border-2 ${itemData.sleeveColor === "#a855f7" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-sleeve-color-purple" />
                    <button type="button" onClick={() => setItemData({...itemData, sleeveColor: "#ec4899"})} style={{backgroundColor: "#ec4899"}} className={`w-6 h-6 rounded-full border-2 ${itemData.sleeveColor === "#ec4899" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-sleeve-color-pink" />
                    <button type="button" onClick={() => setItemData({...itemData, sleeveColor: "#3b82f6"})} style={{backgroundColor: "#3b82f6"}} className={`w-6 h-6 rounded-full border-2 ${itemData.sleeveColor === "#3b82f6" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-sleeve-color-blue" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="tower" 
                    checked={itemData.tower}
                    onCheckedChange={(v) => setItemData({...itemData, tower: v})}
                  />
                  <Label htmlFor="tower" className="text-sm">Tower</Label>
                  <div className="w-5 h-5 rounded-full bg-gray-800 border border-gray-300" />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="cuff" checked={itemData.cuff} onCheckedChange={(v) => setItemData({...itemData, cuff: v})} />
                  <Label htmlFor="cuff" className="text-sm">CUFF</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="rib" checked={itemData.rib} onCheckedChange={(v) => setItemData({...itemData, rib: v})} />
                  <Label htmlFor="rib" className="text-sm">RIB</Label>
                  <div className="w-5 h-5 rounded-full bg-purple-500 border border-gray-300" />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="tipping-opt" checked={itemData.tipping} onCheckedChange={(v) => setItemData({...itemData, tipping: v})} />
                  <Label htmlFor="tipping-opt" className="text-sm">TIPPING</Label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-gray-600 text-sm">Spec 2</Label>
               <input
        type="text"
         placeholder={loading ? "Loading Spec..." : "Search or type Spec"}
        autoComplete="off"
         value={itemData.spec2}
        
        onChange={(e) => {
            const val = e.target.value;
            setItemData({...itemData, spec2: val});
            setFilteredOptions(spec2List.filter(s => s.toLowerCase().includes(val.toLowerCase())));
        }}
        onFocus={() => {
            setActiveDropdown('spec2');
            setFilteredOptions(itemData.spec2 ? spec2List.filter(s => s.toLowerCase().includes(itemData.spec2.toLowerCase())) : spec2List);
        }}
        onBlur={() => setTimeout(() => setActiveDropdown(null), 250)}
        className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#4880ff] outline-none"
        placeholder="Search Spec 2..."
    />
    {activeDropdown === 'spec2' && filteredOptions.length > 0 && (
        <ul className="absolute z-[1001] w-full bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-40 overflow-auto list-none p-0">
            {filteredOptions.map((opt, i) => (
                <li key={i} onMouseDown={() => setItemData({...itemData, spec2: opt})} className="px-4 py-2 hover:bg-[#4880ff] hover:text-white cursor-pointer text-sm border-b border-gray-50 last:border-b-0">
                    {opt}
                </li>
            ))}
        </ul>
    )}
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Neck Type</Label>
                  <Select value={itemData.neckType} onValueChange={(v) => setItemData({...itemData, neckType: v})}>
                    <SelectTrigger className="mt-1" data-testid="select-neck-type">
                      <SelectValue placeholder="2" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Sleeve Color 2</Label>
                  <div className="mt-1 flex gap-1">
                    <button type="button" onClick={() => setItemData({...itemData, sleeveColor2: "#1f2937"})} style={{backgroundColor: "#1f2937"}} className={`w-6 h-6 rounded-full border-2 ${itemData.sleeveColor2 === "#1f2937" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-sleeve2-color-gray" />
                    <button type="button" onClick={() => setItemData({...itemData, sleeveColor2: "#a855f7"})} style={{backgroundColor: "#a855f7"}} className={`w-6 h-6 rounded-full border-2 ${itemData.sleeveColor2 === "#a855f7" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-sleeve2-color-purple" />
                    <button type="button" onClick={() => setItemData({...itemData, sleeveColor2: "#ec4899"})} style={{backgroundColor: "#ec4899"}} className={`w-6 h-6 rounded-full border-2 ${itemData.sleeveColor2 === "#ec4899" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-sleeve2-color-pink" />
                    <button type="button" onClick={() => setItemData({...itemData, sleeveColor2: "#3b82f6"})} style={{backgroundColor: "#3b82f6"}} className={`w-6 h-6 rounded-full border-2 ${itemData.sleeveColor2 === "#3b82f6" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-sleeve2-color-blue" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="tipping-check" 
                    checked={itemData.tippingCheck}
                    onCheckedChange={(v) => setItemData({...itemData, tippingCheck: v})}
                  />
                  <Label htmlFor="tipping-check" className="text-sm">Tipping</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="patti" checked={itemData.patti} onCheckedChange={(v) => setItemData({...itemData, patti: v})} />
                  <Label htmlFor="patti" className="text-sm">Patti</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6 pt-4 border-t">
          <Button 
            variant="outline" 
            className="border-[#4880ff] text-[#4880ff] px-12"
            onClick={onClose}
            data-testid="button-cancel-item"
          >
            Cancel
          </Button>
          <Button 
            className="bg-[#4880ff] text-white px-12"
         onClick={handleSubmit}    
  //           onClick={() => {
  //   // Perform your submit logic here (e.g., API call)
    
  //   // Clear all session storage related to the order
  //   sessionStorage.removeItem('orderData');
  //   sessionStorage.removeItem('orderItems');
  //   sessionStorage.removeItem('orderId');
    
  //   // Optionally redirect or reset local state
  //   window.location.reload(); 
  // }}
            data-testid="button-add-item-confirm"
          >
            Add Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PreviewModal({ open, onClose, orderData, items,handledesignernewrequest }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="bg-white p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold italic text-gray-800" style={{ fontFamily: 'serif' }}>
                Tribal
              </h1>
              <p className="text-xs text-gray-500 tracking-widest uppercase">Arts & Films</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>Tribal@123.com</p>
              <p>Bejai, Mangalore.</p>
              <p>+91 1234567890</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8 text-sm">
            <div>
              <p className="text-gray-500">Order Date</p>
              <p className="font-semibold">23 Nov 2025</p>
            </div>
            <div>
              <p className="text-gray-500">Order ID</p>
              <p className="font-semibold">OD123456789</p>
            </div>
            <div>
              <p className="text-gray-500">Party Name</p>
              <p className="font-semibold">ABC Sports</p>
            </div>
            <div>
              <p className="text-gray-500">Phone Number</p>
              <p className="font-semibold">+91 1234567890</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {items.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4 py-3 border-b">
                <span className="text-gray-500">{index + 1}.</span>
                <div className="flex gap-2">
                  {[1, 2, 3].map((img) => (
                    <div key={img} className="w-12 h-12 bg-gray-800 rounded overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100" 
                        alt="Product" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Sports Tshirt</p>
                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  <p className="text-sm text-gray-500">Comments</p>
                </div>
                <p className="font-semibold">₹200</p>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <p className="font-semibold mb-2">QC Specification</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Checkbox checked disabled />
                <span className="text-sm">Ironing</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked disabled />
                <span className="text-sm">Packing</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked disabled />
                <span className="text-sm">Screening</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Sample Comment Here</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-center text-yellow-700">
              Once approved, no modifications, replacements, or edits will be possible.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              className="border-[#4880ff] text-[#4880ff] px-8"
              data-testid="button-share"
            >
              Share
            </Button>
            <Button 
              className="bg-[#4880ff] text-white px-8"
              data-testid="button-confirm"
       onClick={handledesignernewrequest}

            >
              Confirm
            </Button>
            <Button 
              variant="outline"
              onClick={onClose}
              data-testid="button-cancel-preview"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditItemModal({ open, onClose, item, onUpdateItem }) {
    // States for unique lists from DB
    const [materialList, setMaterialList] = useState([]);
    const [distList, setDistList] = useState([]);
    const [specList, setSpecList] = useState([]); 
    const [items, setItems] = useState([]);
    
    // UI States for Dropdowns
    const [loading, setLoading] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null); 
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [showItemDropdown, setShowItemDropdown] = useState(false);

    const [itemData, setItemData] = useState({
        item: "",
        qty: "50",
        size: "M",
        material: "",
        distType: "",
        backColor: "#1f2937",
        frontColor: "#a855f7",
        spec1: "",
        sleeveType: "full",
        sleeveColor: "#ec4899",
        tower: true,
        rib: true,
        cuff: false,
        tipping: false,
        spec2: "",
        neckType: "2",
        sleeveColor2: "#a855f7",
        tippingCheck: true,
        patti: true,
        customNote: "",
        images: [],
    });

    // Fetch Database Lists
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/databases/Tribal/collections/workflow_list/documents`);
                const docs = res.data.documents || (Array.isArray(res.data) ? res.data : []);
                setMaterialList([...new Set(docs.map(doc => doc.Matrial).filter(Boolean))]);
                setDistList([...new Set(docs.map(doc => doc["Disprition/type"]).filter(Boolean))]);
                setSpecList([...new Set(docs.map(doc => doc.SPECIFICATION).filter(Boolean))]);
                const uniqueItems = [...new Set(docs.map(doc => doc["Item-Names"]).filter(Boolean))];
                setItems(uniqueItems);
            } catch (err) {
                console.error("Error fetching form data:", err);
            }
        };
        fetchData();
    }, []);

    // Load existing item data into form
    useEffect(() => {
        if (item) {
            setItemData({
                ...item,
                item: item.item || "",
                qty: item.qty || "50",
                size: item.size || "M",
                material: item.material || "",
                distType: item.distType || "",
                backColor: item.backColor || "#1f2937",
                frontColor: item.frontColor || "#a855f7",
                spec1: item.spec1 || "",
                sleeveType: item.sleeveType || "full",
                sleeveColor: item.sleeveColor || "#ec4899",
                tower: item.tower ?? true,
                rib: item.rib ?? true,
                cuff: item.cuff ?? false,
                tipping: item.tipping ?? false,
                spec2: item.spec2 || "",
                neckType: item.neckType || "2",
                sleeveColor2: item.sleeveColor2 || "#a855f7",
                tippingCheck: item.tippingCheck ?? true,
                patti: item.patti ?? true,
                customNote: item.customNote || "",
                images: item.images || [],
            });
        }
    }, [item]);

    const handleSubmit = () => {
        onUpdateItem({
            ...itemData,
            id: item.id,
            images: itemData.images.length > 0 ? itemData.images : ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
        });
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Edit Order Item</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    {/* LEFT COLUMN */}
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-3 mb-4">
                            {/* Images logic remains same */}
                            <div className="w-32 h-40 bg-gray-100 rounded-lg overflow-hidden relative">
                                <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200" alt="Product" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="relative">
                                <Label className="text-sm text-gray-600">Item</Label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    value={itemData.item}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setItemData({ ...itemData, item: val });
                                        setFilteredItems(items.filter(i => i.toLowerCase().includes(val.toLowerCase())));
                                    }}
                                    onFocus={() => {
                                        setShowItemDropdown(true);
                                        setFilteredItems(itemData.item ? items.filter(i => i.toLowerCase().includes(itemData.item.toLowerCase())) : items);
                                    }}
                                    onBlur={() => setTimeout(() => setShowItemDropdown(false), 250)}
                                    className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#4880ff] outline-none"
                                />
                                {showItemDropdown && (
                                    <ul className="absolute z-[1000] w-full bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-48 overflow-auto list-none p-0">
                                        {filteredItems.map((itemName, index) => (
                                            <li key={index} onMouseDown={() => setItemData({ ...itemData, item: itemName })} className="px-4 py-2 hover:bg-[#4880ff] hover:text-white cursor-pointer text-sm">
                                                {itemName}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div>
                                <Label className="text-sm text-gray-600">Qty</Label>
                                <Input value={itemData.qty} onChange={(e) => setItemData({ ...itemData, qty: e.target.value })} />
                            </div>
                            <div>
                                <Label className="text-sm text-gray-600">Size</Label>
                                <Select value={itemData.size} onValueChange={(v) => setItemData({ ...itemData, size: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {["XS", "S", "M", "L", "XL", "XXL"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="relative">
                            <Label className="text-sm text-gray-600">Material</Label>
                            <input
                                type="text"
                                value={itemData.material}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setItemData({ ...itemData, material: val });
                                    setFilteredOptions(materialList.filter(m => m.toLowerCase().includes(val.toLowerCase())));
                                }}
                                onFocus={() => {
                                    setActiveDropdown('material');
                                    setFilteredOptions(itemData.material ? materialList.filter(m => m.toLowerCase().includes(itemData.material.toLowerCase())) : materialList);
                                }}
                                onBlur={() => setTimeout(() => setActiveDropdown(null), 250)}
                                className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#4880ff] outline-none"
                            />
                            {activeDropdown === 'material' && filteredOptions.length > 0 && (
                                <ul className="absolute z-[1001] w-full bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-40 overflow-auto">
                                    {filteredOptions.map((opt, i) => (
                                        <li key={i} onMouseDown={() => setItemData({ ...itemData, material: opt })} className="px-4 py-2 hover:bg-[#4880ff] hover:text-white cursor-pointer text-sm">
                                            {opt}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-3 gap-4">
                            <div className="relative">
                                <Label className="text-gray-600 text-sm">Dist. Type</Label>
                                <input
                                    type="text"
                                    value={itemData.distType}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setItemData({ ...itemData, distType: val });
                                        setFilteredOptions(distList.filter(d => d.toLowerCase().includes(val.toLowerCase())));
                                    }}
                                    onFocus={() => {
                                        setActiveDropdown('dist');
                                        setFilteredOptions(itemData.distType ? distList.filter(d => d.toLowerCase().includes(itemData.distType.toLowerCase())) : distList);
                                    }}
                                    onBlur={() => setTimeout(() => setActiveDropdown(null), 250)}
                                    className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#4880ff] outline-none"
                                />
                                {activeDropdown === 'dist' && filteredOptions.length > 0 && (
                                    <ul className="absolute z-[1001] w-full bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-40 overflow-auto">
                                        {filteredOptions.map((opt, i) => (
                                            <li key={i} onMouseDown={() => setItemData({ ...itemData, distType: opt })} className="px-4 py-2 hover:bg-[#4880ff] hover:text-white cursor-pointer text-sm">
                                                {opt}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {/* Color buttons remain same as your Edit Modal layout */}
                            <div>
                                <Label className="text-xs text-gray-500 block mb-1">Back Color</Label>
                                <div className="flex gap-1">
                                    {["#1f2937", "#a855f7", "#ec4899", "#3b82f6"].map(c => (
                                        <button key={c} type="button" onClick={() => setItemData({...itemData, backColor: c})} style={{backgroundColor: c}} className={`w-6 h-6 rounded-full border-2 ${itemData.backColor === c ? 'border-blue-500' : 'border-gray-300'}`} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs text-gray-500 block mb-1">Front Color</Label>
                                <div className="flex gap-1">
                                    {["#1f2937", "#a855f7", "#ec4899", "#3b82f6"].map(c => (
                                        <button key={c} type="button" onClick={() => setItemData({...itemData, frontColor: c})} style={{backgroundColor: c}} className={`w-6 h-6 rounded-full border-2 ${itemData.frontColor === c ? 'border-blue-500' : 'border-gray-300'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="relative">
                                    <Label className="text-gray-600 text-sm">Spec 1</Label>
                                    <input
                                        type="text"
                                        value={itemData.spec1}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setItemData({ ...itemData, spec1: val });
                                            setFilteredOptions(specList.filter(s => s.toLowerCase().includes(val.toLowerCase())));
                                        }}
                                        onFocus={() => {
                                            setActiveDropdown('spec1');
                                            setFilteredOptions(itemData.spec1 ? specList.filter(s => s.toLowerCase().includes(itemData.spec1.toLowerCase())) : specList);
                                        }}
                                        onBlur={() => setTimeout(() => setActiveDropdown(null), 250)}
                                        className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#4880ff] outline-none"
                                    />
                                    {activeDropdown === 'spec1' && filteredOptions.length > 0 && (
                                        <ul className="absolute z-[1001] w-full bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-40 overflow-auto">
                                            {filteredOptions.map((opt, i) => (
                                                <li key={i} onMouseDown={() => setItemData({ ...itemData, spec1: opt })} className="px-4 py-2 hover:bg-[#4880ff] hover:text-white cursor-pointer text-sm">
                                                    {opt}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-gray-600 text-sm">Sleeve Type</Label>
                                    <Select value={itemData.sleeveType} onValueChange={(v) => setItemData({ ...itemData, sleeveType: v })}>
                                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="full">Full Sleeve</SelectItem>
                                            <SelectItem value="half">Half Sleeve</SelectItem>
                                            <SelectItem value="narrow">Narrow</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* Sleeve Color logic same as Add Modal */}
                                <div>
                                    <Label className="text-gray-600 text-sm">Sleeve Color</Label>
                                    <div className="mt-1 flex gap-1">
                                        {["#1f2937", "#a855f7", "#ec4899", "#3b82f6"].map(c => (
                                            <button key={c} type="button" onClick={() => setItemData({...itemData, sleeveColor: c})} style={{backgroundColor: c}} className={`w-6 h-6 rounded-full border-2 ${itemData.sleeveColor === c ? 'border-blue-500' : 'border-gray-300'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {["tower", "rib", "cuff", "tipping"].map(check => (
                                    <div key={check} className="flex items-center gap-2">
                                        <Checkbox id={`edit-${check}`} checked={itemData[check]} onCheckedChange={(v) => setItemData({ ...itemData, [check]: v })} />
                                        <Label htmlFor={`edit-${check}`} className="text-xs uppercase">{check}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="relative">
                                    <Label className="text-gray-600 text-sm">Spec 2</Label>
                                    <input
                                        type="text"
                                        value={itemData.spec2}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setItemData({ ...itemData, spec2: val });
                                            setFilteredOptions(specList.filter(s => s.toLowerCase().includes(val.toLowerCase())));
                                        }}
                                        onFocus={() => {
                                            setActiveDropdown('spec2');
                                            setFilteredOptions(itemData.spec2 ? specList.filter(s => s.toLowerCase().includes(itemData.spec2.toLowerCase())) : specList);
                                        }}
                                        onBlur={() => setTimeout(() => setActiveDropdown(null), 250)}
                                        className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#4880ff] outline-none"
                                    />
                                    {activeDropdown === 'spec2' && filteredOptions.length > 0 && (
                                        <ul className="absolute z-[1001] w-full bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-40 overflow-auto">
                                            {filteredOptions.map((opt, i) => (
                                                <li key={i} onMouseDown={() => setItemData({ ...itemData, spec2: opt })} className="px-4 py-2 hover:bg-[#4880ff] hover:text-white cursor-pointer text-sm">
                                                    {opt}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-gray-600 text-sm">Neck Type</Label>
                                    <Select value={itemData.neckType} onValueChange={(v) => setItemData({ ...itemData, neckType: v })}>
                                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1</SelectItem>
                                            <SelectItem value="2">2</SelectItem>
                                            <SelectItem value="3">3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-gray-600 text-sm">Sleeve Color 2</Label>
                                    <div className="mt-1 flex gap-1">
                                        {["#1f2937", "#a855f7", "#ec4899", "#3b82f6"].map(c => (
                                            <button key={c} type="button" onClick={() => setItemData({...itemData, sleeveColor2: c})} style={{backgroundColor: c}} className={`w-6 h-6 rounded-full border-2 ${itemData.sleeveColor2 === c ? 'border-blue-500' : 'border-gray-300'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="edit-tippingCheck" checked={itemData.tippingCheck} onCheckedChange={(v) => setItemData({ ...itemData, tippingCheck: v })} />
                                    <Label htmlFor="edit-tippingCheck" className="text-sm">Tipping</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="edit-patti" checked={itemData.patti} onCheckedChange={(v) => setItemData({ ...itemData, patti: v })} />
                                    <Label htmlFor="edit-patti" className="text-sm">Patti</Label>
                                </div>
                            </div>
                        </div>
                        <Textarea value={itemData.customNote} onChange={(e) => setItemData({ ...itemData, customNote: e.target.value })} placeholder="Custom notes..." />
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-6 pt-4 border-t">
                    <Button variant="outline" className="border-[#4880ff] text-[#4880ff] px-12" onClick={onClose}>Cancel</Button>
                    <Button className="bg-[#4880ff] text-white px-12" onClick={handleSubmit}>Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
// function EditItemModal({ open, onClose, item, onUpdateItem }) {



//   const [itemData, setItemData] = useState({
//     item: "tshirt",
//     qty: "50",
//     size: "M",
//     material: "fabric",
//     distType: "full",
//     backColor: "#1f2937",
//     frontColor: "#a855f7",
//     spec1: "full",
//     sleeveType: "full",
//     sleeveColor: "#ec4899",
//     tower: true,
//     rib: true,
//     cuff: false,
//     tipping: false,
//     spec2: "netfold",
//     neckType: "2",
//     sleeveColor2: "#a855f7",
//     tippingCheck: true,
//     patti: true,
//     customNote: "",
//     images: [],
//   });
  
//   useEffect(() => {
//     if (item) {
//       setItemData({
//         ...item,
//         item: item.item || "tshirt",
//         qty: item.qty || "50",
//         size: item.size || "M",
//         material: item.material || "fabric",
//         distType: item.distType || "full",
//         backColor: item.backColor || "#1f2937",
//         frontColor: item.frontColor || "#a855f7",
//         spec1: item.spec1 || "full",
//         sleeveType: item.sleeveType || "full",
//         sleeveColor: item.sleeveColor || "#ec4899",
//         tower: item.tower ?? true,
//         rib: item.rib ?? true,
//         cuff: item.cuff ?? false,
//         tipping: item.tipping ?? false,
//         spec2: item.spec2 || "netfold",
//         neckType: item.neckType || "2",
//         sleeveColor2: item.sleeveColor2 || "#a855f7",
//         tippingCheck: item.tippingCheck ?? true,
//         patti: item.patti ?? true,
//         customNote: item.customNote || "",
//         images: item.images || [],
//       });
//     }
//   }, [item]);

//   const handleSubmit = () => {
//     onUpdateItem({
//       ...itemData,
//       id: item.id,
//       images: itemData.images.length > 0 ? itemData.images : ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
//     });
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-bold">Edit Order Item</DialogTitle>
//         </DialogHeader>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
//           <div>
//             <div className="flex flex-wrap gap-3 mb-4">
//               <div className="w-32 h-40 bg-gray-100 rounded-lg overflow-hidden relative">
//                 <div className="w-full h-full bg-gray-800 flex items-center justify-center">
//                   <img 
//                     src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200" 
//                     alt="Product" 
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </div>
//               <div className="w-32 h-40 bg-gray-100 rounded-lg overflow-hidden relative">
//                 <div className="w-full h-full bg-gray-800 flex items-center justify-center">
//                   <img 
//                     src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200" 
//                     alt="Product" 
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-3 mb-4">
//               <div>
//                 <Label className="text-sm text-gray-600">Item</Label>
//                 <Select 
//                   value={itemData.item} 
//                   onValueChange={(v) => setItemData({...itemData, item: v})}
//                 >
//                   <SelectTrigger data-testid="select-edit-item-type">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="tshirt">T-Shirt</SelectItem>
//                     <SelectItem value="polo">Polo</SelectItem>
//                     <SelectItem value="hoodie">Hoodie</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label className="text-sm text-gray-600">Qty</Label>
//                 <Input 
//                   value={itemData.qty}
//                   onChange={(e) => setItemData({...itemData, qty: e.target.value})}
//                   data-testid="input-edit-qty"
//                 />
//               </div>
//               <div>
//                 <Label className="text-sm text-gray-600">Size</Label>
//                 <Select 
//                   value={itemData.size}
//                   onValueChange={(v) => setItemData({...itemData, size: v})}
//                 >
//                   <SelectTrigger data-testid="select-edit-size">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="XS">XS</SelectItem>
//                     <SelectItem value="S">S</SelectItem>
//                     <SelectItem value="M">M</SelectItem>
//                     <SelectItem value="L">L</SelectItem>
//                     <SelectItem value="XL">XL</SelectItem>
//                     <SelectItem value="XXL">XXL</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3 mb-4">
//               <div>
//                 <Label className="text-sm text-gray-600">Material</Label>
//                 {/* <Select 
//                   value={itemData.material}
//                   onValueChange={(v) => setItemData({...itemData, material: v})}
//                 >
//                   <SelectTrigger data-testid="select-edit-material">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="fabric">Fabric</SelectItem>
//                     <SelectItem value="cotton">Cotton</SelectItem>
//                     <SelectItem value="polyester">Polyester</SelectItem>
//                   </SelectContent>
//                 </Select> */}
//               </div>
//               <div>
//                 <Label className="text-sm text-gray-600">Dist. Type</Label>
//                 <Select 
//                   value={itemData.distType}
//                   onValueChange={(v) => setItemData({...itemData, distType: v})}
//                 >
//                   <SelectTrigger data-testid="select-edit-dist-type">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="full">Full</SelectItem>
//                     <SelectItem value="half">Half</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="mb-4">
//               <Label className="text-sm text-gray-600 mb-2 block">Color</Label>
//               <div className="flex flex-wrap gap-4">
//                 <div>
//                   <span className="text-xs text-gray-500 block mb-1">Back</span>
//                   <div className="flex gap-1">
//                     <button type="button" onClick={() => setItemData({...itemData, backColor: "#1f2937"})} style={{backgroundColor: "#1f2937"}} className={`w-6 h-6 rounded-full border-2 ${itemData.backColor === "#1f2937" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-edit-back-color-gray" />
//                     <button type="button" onClick={() => setItemData({...itemData, backColor: "#a855f7"})} style={{backgroundColor: "#a855f7"}} className={`w-6 h-6 rounded-full border-2 ${itemData.backColor === "#a855f7" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-edit-back-color-purple" />
//                     <button type="button" onClick={() => setItemData({...itemData, backColor: "#ec4899"})} style={{backgroundColor: "#ec4899"}} className={`w-6 h-6 rounded-full border-2 ${itemData.backColor === "#ec4899" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-edit-back-color-pink" />
//                     <button type="button" onClick={() => setItemData({...itemData, backColor: "#3b82f6"})} style={{backgroundColor: "#3b82f6"}} className={`w-6 h-6 rounded-full border-2 ${itemData.backColor === "#3b82f6" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-edit-back-color-blue" />
//                   </div>
//                 </div>
//                 <div>
//                   <span className="text-xs text-gray-500 block mb-1">Front</span>
//                   <div className="flex gap-1">
//                     <button type="button" onClick={() => setItemData({...itemData, frontColor: "#1f2937"})} style={{backgroundColor: "#1f2937"}} className={`w-6 h-6 rounded-full border-2 ${itemData.frontColor === "#1f2937" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-edit-front-color-gray" />
//                     <button type="button" onClick={() => setItemData({...itemData, frontColor: "#a855f7"})} style={{backgroundColor: "#a855f7"}} className={`w-6 h-6 rounded-full border-2 ${itemData.frontColor === "#a855f7" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-edit-front-color-purple" />
//                     <button type="button" onClick={() => setItemData({...itemData, frontColor: "#ec4899"})} style={{backgroundColor: "#ec4899"}} className={`w-6 h-6 rounded-full border-2 ${itemData.frontColor === "#ec4899" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-edit-front-color-pink" />
//                     <button type="button" onClick={() => setItemData({...itemData, frontColor: "#3b82f6"})} style={{backgroundColor: "#3b82f6"}} className={`w-6 h-6 rounded-full border-2 ${itemData.frontColor === "#3b82f6" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-edit-front-color-blue" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <div className="mb-4">
//               <Label className="text-sm text-gray-600 mb-2 block">Spec-1</Label>
//               <div className="flex gap-2 mb-3">
//                 <Button 
//                   variant={itemData.spec1 === "half" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setItemData({...itemData, spec1: "half"})}
//                   data-testid="button-edit-spec1-half"
//                 >
//                   Half
//                 </Button>
//                 <Button 
//                   variant={itemData.spec1 === "full" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setItemData({...itemData, spec1: "full"})}
//                   data-testid="button-edit-spec1-full"
//                 >
//                   Full
//                 </Button>
//               </div>

//               <div className="grid grid-cols-2 gap-3 mb-3">
//                 <div>
//                   <Label className="text-sm text-gray-600">Sleeve Type</Label>
//                   <Select 
//                     value={itemData.sleeveType}
//                     onValueChange={(v) => setItemData({...itemData, sleeveType: v})}
//                   >
//                     <SelectTrigger data-testid="select-edit-sleeve-type">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="full">Full</SelectItem>
//                       <SelectItem value="half">Half</SelectItem>
//                       <SelectItem value="sleeveless">Sleeveless</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label className="text-sm text-gray-600">Sleeve Color</Label>
//                   <div className="flex gap-1 mt-1">
//                     <button type="button" onClick={() => setItemData({...itemData, sleeveColor: "#1f2937"})} style={{backgroundColor: "#1f2937"}} className={`w-6 h-6 rounded-full border-2 ${itemData.sleeveColor === "#1f2937" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-edit-sleeve-color-gray" />
//                     <button type="button" onClick={() => setItemData({...itemData, sleeveColor: "#a855f7"})} style={{backgroundColor: "#a855f7"}} className={`w-6 h-6 rounded-full border-2 ${itemData.sleeveColor === "#a855f7" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-edit-sleeve-color-purple" />
//                     <button type="button" onClick={() => setItemData({...itemData, sleeveColor: "#ec4899"})} style={{backgroundColor: "#ec4899"}} className={`w-6 h-6 rounded-full border-2 ${itemData.sleeveColor === "#ec4899" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-edit-sleeve-color-pink" />
//                     <button type="button" onClick={() => setItemData({...itemData, sleeveColor: "#3b82f6"})} style={{backgroundColor: "#3b82f6"}} className={`w-6 h-6 rounded-full border-2 ${itemData.sleeveColor === "#3b82f6" ? 'border-blue-500' : 'border-gray-300'}`} data-testid="button-edit-sleeve-color-blue" />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-3 mb-4">
//                 <div className="flex items-center gap-1">
//                   <Checkbox 
//                     checked={itemData.tower}
//                     onCheckedChange={(v) => setItemData({...itemData, tower: v})}
//                   />
//                   <Label className="text-sm">Tower</Label>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Checkbox 
//                     checked={itemData.rib}
//                     onCheckedChange={(v) => setItemData({...itemData, rib: v})}
//                   />
//                   <Label className="text-sm">RIB</Label>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Checkbox 
//                     checked={itemData.cuff}
//                     onCheckedChange={(v) => setItemData({...itemData, cuff: v})}
//                   />
//                   <Label className="text-sm">Cuff</Label>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Checkbox 
//                     checked={itemData.tipping}
//                     onCheckedChange={(v) => setItemData({...itemData, tipping: v})}
//                   />
//                   <Label className="text-sm">Tipping</Label>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-4">
//               <Label className="text-sm text-gray-600 mb-2 block">Spec-2</Label>
//               <div className="flex gap-2 mb-3">
//                 <Button 
//                   variant={itemData.spec2 === "single" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setItemData({...itemData, spec2: "single"})}
//                   data-testid="button-edit-spec2-single"
//                 >
//                   Single
//                 </Button>
//                 <Button 
//                   variant={itemData.spec2 === "netfold" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setItemData({...itemData, spec2: "netfold"})}
//                   data-testid="button-edit-spec2-netfold"
//                 >
//                   NET Fold
//                 </Button>
//               </div>

//               <div className="grid grid-cols-2 gap-3 mb-3">
//                 <div>
//                   <Label className="text-sm text-gray-600">Neck Type</Label>
//                   <Select 
//                     value={itemData.neckType}
//                     onValueChange={(v) => setItemData({...itemData, neckType: v})}
//                   >
//                     <SelectTrigger data-testid="select-edit-neck-type">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="1">Type 1</SelectItem>
//                       <SelectItem value="2">Type 2</SelectItem>
//                       <SelectItem value="3">Type 3</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label className="text-sm text-gray-600">Sleeve Color</Label>
//                   <div className="flex gap-1 mt-1">
//                     {["gray-800", "purple-500", "pink-500", "blue-500"].map((color) => (
//                       <button
//                         key={color}
//                         className={`w-6 h-6 rounded-full bg-${color} border-2 ${itemData.sleeveColor2 === color ? 'border-blue-500' : 'border-gray-300'}`}
//                         onClick={() => setItemData({...itemData, sleeveColor2: color})}
//                         data-testid={`button-edit-sleeve-color2-${color}`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-3 mb-4">
//                 <div className="flex items-center gap-1">
//                   <Checkbox 
//                     checked={itemData.tippingCheck}
//                     onCheckedChange={(v) => setItemData({...itemData, tippingCheck: v})}
//                   />
//                   <Label className="text-sm">Tipping</Label>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Checkbox 
//                     checked={itemData.patti}
//                     onCheckedChange={(v) => setItemData({...itemData, patti: v})}
//                   />
//                   <Label className="text-sm">Patti</Label>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <Label className="text-sm text-gray-600">Custom Note (Optional)</Label>
//               <Textarea 
//                 value={itemData.customNote}
//                 onChange={(e) => setItemData({...itemData, customNote: e.target.value})}
//                 placeholder="Add any special instructions..."
//                 className="mt-1"
//                 data-testid="textarea-edit-custom-note"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <Button variant="outline" onClick={onClose} data-testid="button-cancel-edit">
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} className="bg-[#4880ff] text-white" data-testid="button-save-edit">
//             Save Changes
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

export function CreateOrder() {
const [locations, setLocations] = useState([]); 
    const [filteredLocations, setFilteredLocations] = useState([]); 
    const [dispatchValue, setDispatchValue] = useState(""); 
    const [showDispatchDropdown, setShowDispatchDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
  const [dealers, setDealers] = useState([]); 
    const [filteredDealers, setFilteredDealers] = useState([]); 
    const [inputValue, setInputValue] = useState(""); 
    const [showDropdown, setShowDropdown] = useState(false);
 //   const [loading, setLoading] = useState(false);
  const [orderId] = useState(generateOrderId());
  const [orderItems, setOrderItems] = useState(() => 
    getFromStorage('orderItems', [])
  );
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
 // Inside your main CreateOrder component
const [orderData, setOrderData] = useState(() => getFromStorage('orderData', {
  orderDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  orderId: generateOrderId(),
  partyName: "",
  orderPlacedBy: "", // Add this
    jobOrNumber: "",   // Add this
  phoneNumber: "",
  dispatchPlace: "",
  dispatchDate: "",
  dispatchTime: "",
  priority: "",
  note: "",
  qcSpecifications: [],
  sampleComment: ""
}));
  const [qcSpec, setQcSpec] = useState(() => 
    getFromStorage('qcSpec', {
      packing: true,
      screening: true,
      button: false,
      smallFusing: false,
      cutting: true,
      setting: false,
      printing: true,
      fusing: false,
      screen: true,
      stitching: false,
      rawMaterial: true,
      smallFusing2: false,
    })
  );

  const handledesignernewrequest = async () => {
    try {
        // 1. Retrieve data from sessionStorage
        const orderData = JSON.parse(sessionStorage.getItem('orderData'));
        const orderItems = JSON.parse(sessionStorage.getItem('orderItems')) || [];

        if (!orderData) {
            alert("No order data found in session!");
            return;
        }

        // 2. Map the data to match your Excel/Workflow headers
        // Initializing all status fields to "New" as requested
        const workflowPayload = {
            order_id: orderData.jobOrNumber, // The custom OR-5680 style ID
            internal_id: orderData.orderId,  // The ID-1766... style ID
            customer_name: orderData.partyName,
            items_count: orderItems.length,
            order_placedby: orderData.orderPlacedBy,
            received_date_time: new Date().toLocaleString(),
            dispatch_date: orderData.dispatchDate,
            dispatch_time: orderData.dispatchTime,
            dispatch_location: orderData.dispatchPlace,
            designer_comments_neworder: orderData.note,
            
            // Status Initializations
            last_updated_status: "New",
            last_updated_department: "Designer",
            last_updated_time: new Date().toISOString(),
            design_status: "New",
            design_status_changed_on: new Date().toISOString(),
            design_status_changed_by: orderData.orderPlacedBy,
            
            // Other department statuses initialized to "New" or pending
            setting_status: "New",
            payment_status: "New",
            raw_material_status: "New",
            cutting_status: "New",
            fusing_status: "New",
            printing_status: "New",
            screen_status: "New",
            stiching_status: "New",
            trimming_packing_status: "New",
            dispatch_status: "New",
            
            // Extracting all images from items into a single array
            images: orderItems.flatMap(item => item.images || [])
        };

        // 3. Send to Backend
        const response = await fetch(`${API_BASE_URL}/workflow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workflowPayload),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Workflow created successfully:", result);
            await handleorderrequest();
            await handlehistory();
            alert("Order submitted to workflow successfully!");
 sessionStorage.removeItem('orderData');
    sessionStorage.removeItem('orderItems');
    sessionStorage.removeItem('orderId');
    window.location.reload();
        } else {
            throw new Error("Failed to update workflow");
        }
    } catch (error) {
        console.error("Error in handledesignernewrequest:", error);
        alert("Error saving request. Check console.");
    }
};
const handleorderrequest = async () => {
    try {
        const orderData = JSON.parse(sessionStorage.getItem('orderData'));
        const orderItems = JSON.parse(sessionStorage.getItem('orderItems')) || [];

        if (!orderData || orderItems.length === 0) return;

        // Map items to match the "db_orders" format
        const ordersPayload = orderItems.map((item, index) => ({
            OrderID: orderData.orderId,
            // Increments: ID-176...-5481, ID-176...-5482, etc.
            Unique_OrderID: `${orderData.orderId}${index + 1}`, 
            "Order Name": item.item,
            "Orders Count": item.qty,
            Material: item.material,
            Specification: item.spec1 || "", // Mapping spec1 to Specification
            "Distribution Type": item.distType,
            DispatchDate: orderData.dispatchDate,
            "Image-1": item.images?.[0] || "",
            "Image-2": item.images?.[1] || "",
            "Image-3": item.images?.[2] || ""
        }));

        const response = await fetch(`${API_BASE_URL}/orders/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ordersPayload),
        });

        if (!response.ok) throw new Error("Failed to save individual orders");
        
        console.log("Individual items saved to orders collection.");
    } catch (error) {
        console.error("Error in handleorderrequest:", error);
    }
};
const handlehistory = async () => {
    try {
        const orderData = JSON.parse(sessionStorage.getItem('orderData'));
        if (!orderData) return;

        // Get Current Date and Time
        const now = new Date();
        const receivedDate = now.toLocaleDateString('en-GB'); // Formats as DD/MM/YYYY
        const receivedTime = now.toLocaleTimeString('en-GB', { hour12: false }); // Formats as HH:MM:SS

        // Extract User and Dept from your specific UI elements
        const userNameElement = document.querySelector("#root > div.group\\/sidebar-wrapper.flex.min-h-svh.w-full.has-\\[\\[data-variant\\=inset\\]\\]\\:bg-sidebar > div > div.flex.flex-col.flex-1.overflow-hidden > header > div > div > div > p.font-semibold.text-sm.text-gray-800");
        const deptElement = document.querySelector("#root > div.group\\/sidebar-wrapper.flex.min-h-svh.w-full.has-\\[\\[data-variant\\=inset\\]\\]\\:bg-sidebar > div > div.flex.flex-col.flex-1.overflow-hidden > header > div > div > div > p.text-xs.text-gray-500");

        const historyPayload = {
            OrderID: orderData.orderId,
            ReceivedDate: receivedDate,
            ReceivedTime: receivedTime,
            UserName: userNameElement ? userNameElement.innerHTML : "System",
            Department: deptElement ? deptElement.innerHTML : "System",
            Status: "New",
            "Party Name": orderData.partyName,
            Comments: "New order",
            JobID: orderData.jobOrNumber,
            DispatchDate: orderData.dispatchDate
        };

        const response = await fetch(`${API_BASE_URL}/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(historyPayload),
        });

        if (!response.ok) throw new Error("Failed to save history");
        console.log("History entry created successfully.");

    } catch (error) {
        console.error("Error in handlehistory:", error);
    }
};
 
  

// Persist to session storage whenever data changes
useEffect(() => {
  saveToStorage('orderData', orderData);
}, [orderData]);
// Sync orderItems to session storage
//const [orderItems, setOrderItems] = useState(() => getFromStorage('orderItems', []));
useEffect(() => {
  saveToStorage('orderItems', orderItems);
}, [orderItems]);

useEffect(() => {
  saveToStorage('orderItems', orderItems);
}, [orderItems]);

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);



  const handleAddItempopup = (e) => {
setShowAddItemModal(true)
  }

  // const handledeashok = (e) =>{
  //   alert("dddd")
  // }
//   const handledesignernewrequest = (e) => {
// alert("dddd")
//   }



  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const h24 = hour;
            const ampm = h24 >= 12 ? 'PM' : 'AM';
            const h12 = h24 % 12 || 12; // Convert 0 to 12
            const mStr = minute === 0 ? '00' : '30';
            
            const displayTime = `${h12}:${mStr} ${ampm}`;
            const valueTime = `${h24.toString().padStart(2, '0')}:${mStr}`; // "00:00", "13:30", etc.
            
            slots.push({ displayTime, valueTime });
        }
    }
    return slots;
};




const timeSlots = generateTimeSlots();
// 1. Fetch data from Tribal -> workflow_list
    useEffect(() => {
        const fetchLocations = async () => {
       
       
          setLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/databases/Tribal/collections/workflow_list/documents`);
                const docs = res.data.documents || (Array.isArray(res.data) ? res.data : []);
                
                // Using your logic: Extract unique values from the dealer/location column
                const uniqueLocations = [...new Set(docs.map(doc => doc["Dis-Place"]).filter(Boolean))];
         //   alert(uniqueLocations)
                setLocations(uniqueLocations);
            } catch (err) {
                console.error("Error fetching locations:", err);
            } finally {
          
              setLoading(false);
            }
        };
        fetchLocations();
    }, []);

 // Function for manual typing
const handleDispatchChange = (e) => {
    const value = e.target.value;
    setDispatchValue(value); // Updates the local text state for the filter

    // SYNC WITH MAIN STATE:
    setOrderData(prev => ({
        ...prev,
        dispatchPlace: value
    }));

    setFilteredLocations(
        locations.filter(l => l.toLowerCase().includes(value.toLowerCase()))
    );
};

// Function for selecting from the dropdown
const selectLocation = (loc) => {
    setDispatchValue(loc); // Updates local input display
    setShowDispatchDropdown(false);

    // SYNC WITH MAIN STATE:
    setOrderData(prev => ({
        ...prev,
        dispatchPlace: loc
    }));
};
useEffect(() => {
        const fetchDealers = async () => {
           setLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/databases/Tribal/collections/workflow_list/documents`);
                // Extracting documents array from the response
                const docs = res.data.documents || (Array.isArray(res.data) ? res.data : []);
                
                // Get unique dealer names from the "Dealer" column
                const uniqueDealers = [...new Set(docs.map(doc => doc.Delear).filter(Boolean))];
          //      alert(uniqueDealers)
                setDealers(uniqueDealers);
            } catch (err) {
                console.error("Error fetching dealers:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDealers();
    }, []);

    // 2. Filter logic
    // const handleInputChange = (e) => {
    //     const value = e.target.value;
    //     alert(value)
    //     setInputValue(value);
        
    //     if (!value.trim()) {
    //         setFilteredDealers(dealers); // Show all if empty
    //     } else {
    //         const filtered = dealers.filter(dealer =>
    //             dealer.toLowerCase().includes(value.toLowerCase())
    //         );
    //         setFilteredDealers(filtered);
    //     }
    // };
    // Function called when selecting from the dropdown list
// const selectDealer = (dealer) => {
//     // 1. Update the local input display value
//     setInputValue(dealer); 
    
//     // 2. IMPORTANT: Update the main orderData state
//     // This will trigger the useEffect that saves to Session Storage
//     setOrderData(prev => ({
//         ...prev,
//         partyName: dealer
//     }));

//     // 3. Hide the dropdown
//     setShowDropdown(false);
// };

// Function called when typing in the input
const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Sync typing with orderData immediately
    setOrderData(prev => ({
        ...prev,
        partyName: value
    }));

    // Filter logic
    setFilteredDealers(
        dealers.filter(d => d.toLowerCase().includes(value.toLowerCase()))
    );
};

    // 3. Selection logic
    // const selectDealer = (dealer) => {
    //     setInputValue(dealer);
    //     setShowDropdown(false); // Close immediately after selection
    // };
const selectDealer = (dealer) => {
    // 1. Update the local input display value
    setInputValue(dealer); 
    
    // 2. IMPORTANT: Update the main orderData state
    // This will trigger the useEffect that saves to Session Storage
    setOrderData(prev => ({
        ...prev,
        partyName: dealer
    }));
    // 3. Hide the dropdown
    setShowDropdown(false);
};
  useEffect(() => {
    saveToStorage('orderItems', orderItems);
  }, [orderItems]);

  useEffect(() => {
    saveToStorage('orderData', orderData);
  }, [orderData]);

  useEffect(() => {
    saveToStorage('qcSpec', qcSpec);
  }, [qcSpec]);

  const handleAddItem = (item) => {
    setOrderItems([...orderItems, item]);
  };

  const handleDeleteItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItemId(selectedItemId === id ? null : id);
  };

  const handleEditOrderClick = () => {
    if (selectedItemId) {
      const itemToEdit = orderItems.find(item => item.id === selectedItemId);
      if (itemToEdit) {
        setEditingItem(itemToEdit);
        setShowEditItemModal(true);
      }
    }
  };

  const handleUpdateItem = (updatedItem) => {
    setOrderItems(orderItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setShowEditItemModal(false);
    setEditingItem(null);
    setSelectedItemId(null);
  };



  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800" data-testid="text-order-id">{orderId}</h2>
          
 <Label className="text-gray-600 text-sm">JobID/OrderID</Label>
 <Select 
  value={orderData.orderPlacedBy} // Controlled component
  onValueChange={(v) => setOrderData(prev => ({...prev, orderPlacedBy: v}))} 
>
  <SelectTrigger className="mt-1" data-testid="select-order-placed-by" style={{width:"150px"}}>
    <SelectValue placeholder="Select here" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="JOB">JOB</SelectItem>
    <SelectItem value="OR">OR</SelectItem>
  </SelectContent>
</Select>
   <input
  id="job-input"
  type="number"
  style={{width:'200px'}}
  autoComplete="off"
  // Link to state
  value={orderData.jobOrNumber || ""} 
  onChange={(e) => setOrderData(prev => ({...prev, jobOrNumber: e.target.value}))}
  onBlur={() => setTimeout(() => setShowDropdown(false), 250)}
  className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4880ff] border-gray-300"
  placeholder="JOB/OR Number"
/>
            
          <Button variant="outline" className="border-[#4880ff] text-[#4880ff]" data-testid="button-add-new-party">
            + Add New Party
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <Label className="text-gray-600 text-sm">Party Name</Label>
           <input
                id="dealer-input"
                placeholder="Enter Party Name" 
  value={orderData.partyName}
 
                type="text"
                autoComplete="off"
            //   value={inputValue}
              onChange={handleInputChange}
                onFocus={() => {
                    setShowDropdown(true);
                    
                  //  setOrderData({ ...orderData, partyName: e.target.value })
                    // Show current matches or all dealers on focus
                    setFilteredDealers(inputValue ? 
                        dealers.filter(d => d.toLowerCase().includes(inputValue.toLowerCase())) : 
                        dealers
                    );
                }}
                // The Fix: Increase delay slightly to 250ms to ensure onClick captures on mobile/slow devices
                onBlur={() => setTimeout(() => setShowDropdown(false), 250)}
                className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4880ff] border-gray-300"
            //    placeholder={loading ? "Loading dealers..." : "Enter dealer name"}
            />
     

            {/* DROPDOWN RESULTS */}
            
            {showDropdown && filteredDealers.length > 0 && (

                              <ul style={{width:'400px'}}  className="absolute z-[999] w-full bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-48 overflow-auto list-none p-0">
                    {filteredDealers.map((dealer, index) => (
                        <li
                            key={index}
                            onMouseDown={(e) => {
                                // IMPORTANT: onMouseDown fires before onBlur
                                // This is a safer alternative to the setTimeout delay
                                selectDealer(dealer);
                            }}
                            className="px-4 py-2 hover:bg-[#4880ff] hover:text-white cursor-pointer text-sm border-b border-gray-100 last:border-b-0 text-left transition-colors"
                        >
                            {dealer}
                        </li>
                    ))}
                </ul>
            )}
              </div>
              <div>
                <Label className="text-gray-600 text-sm">Order Placed By</Label>
                <Select onValueChange={(v) => setOrderData({...orderData, orderPlacedBy: v})}>
                  <SelectTrigger className="mt-1" data-testid="select-order-placed-by">
                    <SelectValue placeholder="Dhanush S" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dhanush">Dhanush S</SelectItem>
                    <SelectItem value="rakshith">Rakshith</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-600 text-sm">Priority</Label>
                <Select onValueChange={(v) => setOrderData({...orderData, priority: v})}>
                  <SelectTrigger className="mt-1" data-testid="select-priority">
                    <SelectValue placeholder="High" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-gray-600 text-sm">Dispatch Date</Label>
              <input
    type="date"
    id="dispatch-date"
    className="mt-2 flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4880ff] border-gray-300"
    value={orderData.dispatchDate || ""}
    onChange={(e) => setOrderData({ ...orderData, dispatchDate: e.target.value })}
    data-testid="input-dispatch-date"
  />
              </div>
              <div>
                <Label className="text-gray-600 text-sm">Dispatch Time</Label>
                {/* <Select onValueChange={(v) => setOrderData({...orderData, dispatchTime: v})}>
                  <SelectTrigger className="mt-1" data-testid="select-dispatch-time">
                    <SelectValue placeholder="10:30 AM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10:30">10:30 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                  </SelectContent>
                </Select> */}
                <Select 
    onValueChange={(v) => setOrderData({ ...orderData, dispatchTime: v })}
    value={orderData.dispatchTime}
  >
    <SelectTrigger className="mt-1" data-testid="select-dispatch-time">
        <SelectValue placeholder="Select Time" />
    </SelectTrigger>
    <SelectContent className="max-h-60 overflow-y-auto">
        {timeSlots.map((slot) => (
            <SelectItem key={slot.valueTime} value={slot.valueTime}>
                {slot.displayTime}
            </SelectItem>
        ))}
    </SelectContent>
  </Select>
              </div>
              <div>
                <Label className="text-gray-600 text-sm">Dispatch Place</Label>
               {/* <input
                id="dispatch-location-input"
                type="text"
                autoComplete="off"
                value={dispatchValue}
                onChange={handleDispatchChange}
                onFocus={() => {
                    setShowDispatchDropdown(true);
                    setFilteredLocations(dispatchValue ? 
                        locations.filter(l => l.toLowerCase().includes(dispatchValue.toLowerCase())) : 
                        locations
                    );
                }}
                onBlur={() => setTimeout(() => setShowDispatchDropdown(false), 250)}
                className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4880ff] border-gray-300"
                 placeholder={loading ? "Loading places..." : "Enter dispatch location"}
            /> */}
            <input
    id="dispatch-location-input"
    type="text"
    autoComplete="off"
    // Use the main state value to ensure persistence after refresh
    value={orderData.dispatchPlace} 
    onChange={handleDispatchChange}
    onFocus={() => {
        setShowDispatchDropdown(true);
        setFilteredLocations(orderData.dispatchPlace ? 
            locations.filter(l => l.toLowerCase().includes(orderData.dispatchPlace.toLowerCase())) : 
            locations
        );
    }}
    onBlur={() => setTimeout(() => setShowDispatchDropdown(false), 250)}
    className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4880ff] border-gray-300"
    placeholder={loading ? "Loading places..." : "Enter dispatch location"}
/>

            {/* DROPDOWN RESULTS */}
            {showDispatchDropdown && filteredLocations.length > 0 && (
                <ul 
                    style={{ width: '400px' }} 
                    className="absolute z-[999] bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-48 overflow-auto list-none p-0"
                >
                    {filteredLocations.map((loc, index) => (
                        <li
                            key={index}
                            onMouseDown={() => selectLocation(loc)}
                            className="px-4 py-2 hover:bg-[#4880ff] hover:text-white cursor-pointer text-sm border-b border-gray-100 last:border-b-0 text-left transition-colors"
                        >
                            {loc}
                        </li>
                    ))}
                </ul>
            )}
              </div>
            </div>
          </div>

          <div>
            <Label className="text-gray-600 text-sm">Add Note</Label>
            <Textarea 
              placeholder="Write Here" 
              className="mt-1 h-32"
              value={orderData.note}
              onChange={(e) => setOrderData({...orderData, note: e.target.value})}
              data-testid="textarea-note"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Order Details</h3>
          <Button 
            variant="outline" 
            className="border-[#4880ff] text-[#4880ff]"
        onClick={() => handleAddItempopup()}
            data-testid="button-add-item"
          >
            + Add Item
          </Button>
        </div>

        {orderItems.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-center p-3 text-sm font-semibold text-gray-600 w-12">Select</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Size</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Qty</th>
                   <th className="text-left p-3 text-sm font-semibold text-gray-600">Item</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Dist Type</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Material</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Spec-1</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Sleeve Type</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Sleeve Color</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Spec-2</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Neck Type</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Color</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Images</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item.id} className={`border-b ${selectedItemId === item.id ? 'bg-blue-50' : ''}`}>
                    <td className="p-3 text-center">
                      <Checkbox 
                        checked={selectedItemId === item.id}
                        onCheckedChange={() => handleSelectItem(item.id)}
                        data-testid={`checkbox-select-item-${item.id}`}
                      />
                    </td>
                    <td className="p-3 text-sm">{item.size}</td>
                    <td className="p-3 text-sm">{item.qty}</td>
                     <td className="p-3 text-sm capitalize">{item.item}</td>
                    <td className="p-3 text-sm capitalize">{item.distType}</td>
                    <td className="p-3 text-sm capitalize">{item.material}</td>
                    <td className="p-3 text-sm capitalize">{item.spec1}</td>
                    <td className="p-3 text-sm capitalize">{item.sleeveType}</td>
                    <td className="p-3">
                      <div className="w-5 h-5 rounded-full bg-red-500 border border-gray-300" />
                    </td>
                    <td className="p-3 text-sm">NET Fold</td>
                    <td className="p-3 text-sm">{item.neckType}</td>
                    <td className="p-3">
                      <div className="w-5 h-5 rounded-full bg-red-500 border border-gray-300" />
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((img) => (
                          <div key={img} className="w-8 h-8 bg-gray-800 rounded overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=50" 
                              alt="Product" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => {
                            setEditingItem(item);
                            setShowEditItemModal(true);
                          }}
                          data-testid={`button-edit-item-${item.id}`}
                        >
                          <Edit className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleDeleteItem(item.id)}
                          data-testid={`button-delete-item-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {orderItems.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">QC Specification</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={qcSpec.packing} 
                    onCheckedChange={(v) => setQcSpec({...qcSpec, packing: v})}
                  />
                  <Label className="text-sm">Packing</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={qcSpec.screening}
                    onCheckedChange={(v) => setQcSpec({...qcSpec, screening: v})}
                  />
                  <Label className="text-sm">Screening</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={qcSpec.button}
                    onCheckedChange={(v) => setQcSpec({...qcSpec, button: v})}
                  />
                  <Label className="text-sm">Button</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={qcSpec.smallFusing}
                    onCheckedChange={(v) => setQcSpec({...qcSpec, smallFusing: v})}
                  />
                  <Label className="text-sm">Small Fusing</Label>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Assign Department</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={qcSpec.cutting}
                    onCheckedChange={(v) => setQcSpec({...qcSpec, cutting: v})}
                  />
                  <Label className="text-sm">Cutting</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={qcSpec.printing}
                    onCheckedChange={(v) => setQcSpec({...qcSpec, printing: v})}
                  />
                  <Label className="text-sm">Printing</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={qcSpec.screen}
                    onCheckedChange={(v) => setQcSpec({...qcSpec, screen: v})}
                  />
                  <Label className="text-sm">Screen</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={qcSpec.rawMaterial}
                    onCheckedChange={(v) => setQcSpec({...qcSpec, rawMaterial: v})}
                  />
                  <Label className="text-sm">Raw-material</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={qcSpec.setting}
                    onCheckedChange={(v) => setQcSpec({...qcSpec, setting: v})}
                  />
                  <Label className="text-sm">Setting</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={qcSpec.fusing}
                    onCheckedChange={(v) => setQcSpec({...qcSpec, fusing: v})}
                  />
                  <Label className="text-sm">Fusing</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={qcSpec.stitching}
                    onCheckedChange={(v) => setQcSpec({...qcSpec, stitching: v})}
                  />
                  <Label className="text-sm">Stitching</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={qcSpec.smallFusing2}
                    onCheckedChange={(v) => setQcSpec({...qcSpec, smallFusing2: v})}
                  />
                  <Label className="text-sm">Small Fusing</Label>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Custom Note</h4>
              <Textarea 
                placeholder="Enter custom notes..." 
                className="h-32"
                data-testid="textarea-custom-note-order"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button 
          variant="outline" 
          className="border-[#4880ff] text-[#4880ff]" 
          onClick={() => setShowPreview(true)}
          data-testid="button-preview"
        >
          Preview
        </Button>
        <Button 
          className="bg-[#4880ff] text-white" 
          data-testid="button-edit-order"
          onClick={handleEditOrderClick}
          disabled={!selectedItemId}
        >
          Edit Order
        </Button>
        <Button variant="outline" data-testid="button-cancel">
          Cancel
        </Button>
      </div>

      <AddItemModal 
        open={showAddItemModal} 
        onClose={() => setShowAddItemModal(false)}
        onAddItem={handleAddItem}
      />

      <EditItemModal 
        open={showEditItemModal} 
        onClose={() => {
          setShowEditItemModal(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onUpdateItem={handleUpdateItem}
      />

      <PreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        orderData={orderData}
        items={orderItems}
        handledesignernewrequest={handledesignernewrequest} // Add this line
      />
    </div>
  );
}
