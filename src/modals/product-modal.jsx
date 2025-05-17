import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  TextField,
  MenuItem,
  CircularProgress,
  Button,
  ClickAwayListener,
  FormControl,
  InputLabel,
  Select,
  TextareaAutosize,
} from "@mui/material";
import { X, ChevronDown } from "lucide-react";
import { useEventStore, useProductStore } from "../hooks/useModalState";
import $api from "../http/api";
import { notification } from "../components/notification";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "white",
  boxShadow: 24,
  px: 3,
  py: 2,
  borderRadius: "8px",
};

export default function ProductModal() {
  const { open, onClose } = useProductStore();
  const { toggleIsAddModal, setType, setText } = useEventStore();
  // States for warehouses
  const [warehouseSearch, setWarehouseSearch] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const [warehousePage, setWarehousePage] = useState(1);
  const [hasMoreWarehouses, setHasMoreWarehouses] = useState(true);
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);

  // States for events
  const [eventSearch, setEventSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventPage, setEventPage] = useState(1);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);
  const [showEventDropdown, setShowEventDropdown] = useState(false);

  // States for types
  const [typeSearch, setTypeSearch] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [types, setTypes] = useState([]);
  const [typeLoading, setTypeLoading] = useState(false);
  const [typePage, setTypePage] = useState(1);
  const [hasMoreTypes, setHasMoreTypes] = useState(true);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // States for child types
  const [childTypeSearch, setChildTypeSearch] = useState("");
  const [selectedChildType, setSelectedChildType] = useState(null);
  const [childTypes, setChildTypes] = useState([]);
  const [childTypeLoading, setChildTypeLoading] = useState(false);
  const [childTypePage, setChildTypePage] = useState(1);
  const [hasMoreChildTypes, setHasMoreChildTypes] = useState(true);
  const [showChildTypeDropdown, setShowChildTypeDropdown] = useState(false);

  // Fetch warehouses with pagination and search
  const fetchWarehouses = async () => {
    setWarehouseLoading(true);
    try {
      const res = await $api.get("warehouses/all", {
        params: { search: warehouseSearch, page: warehousePage, limit: 10 },
      });

      if (res.status === 200) {
        if (warehousePage === 1) {
          setWarehouses(res.data.warehouses);
        } else {
          setWarehouses((prev) => [...prev, ...res.data.warehouses]);
        }
        setHasMoreWarehouses(res.data.totalPages > warehousePage);
      }
    } catch (error) {
      notification(
        error.response?.data?.message || "Omborxonalarni yuklashda xatolik"
      );
      return;
    } finally {
      setWarehouseLoading(false);
    }
  };

  // Fetch events with pagination and search
  const fetchEvents = async () => {
    setEventLoading(true);
    try {
      const res = await $api.get(eventSearch ? "events/search" : "events/all", {
        params: { search: eventSearch, page: eventPage, limit: 10 },
      });
      if (res.status === 200) {
        if (eventPage === 1) {
          setEvents(res.data.events);
        } else {
          setEvents((prev) => [...prev, ...res.data.events]);
        }
        setHasMoreEvents(res.data.totalPages > eventPage);
      }
    } catch (error) {
      notification(
        error.response?.data?.message || "Eventlarni yuklashda xatolik"
      );
      return;
    } finally {
      setEventLoading(false);
    }
  };

  // Fetch types with pagination and search
  const fetchTypes = async () => {
    setTypeLoading(true);
    try {
      const res = await $api.get("product/types/all", {
        params: { search: typeSearch, page: typePage, limit: 10 },
      });

      if (res.status === 200) {
        if (typePage === 1) {
          setTypes(res.data.types);
        } else {
          setTypes((prev) => [...prev, ...res.data.types]);
        }
        setHasMoreTypes(res.data.types.length >= 10);
      }
    } catch (error) {
      notification(
        error.response?.data?.message || "Turlarni yuklashda xatolik"
      );
      return;
    } finally {
      setTypeLoading(false);
    }
  };

  // Fetch child types by type ID with pagination and search
  const fetchChildTypes = async () => {
    if (!selectedType) return;

    setChildTypeLoading(true);
    try {
      const res = await $api.get(`child/types/get/by/type/${selectedType}`, {
        params: { search: childTypeSearch, page: childTypePage, limit: 10 },
      });
      console.log(res);
      

      if (res.status === 200) {
        if (childTypePage === 1) {
          setChildTypes(res.data.data);
        } else {
          setChildTypes((prev) => [...prev, ...res.data.childTypes]);
        }
        setHasMoreChildTypes(false);
      }
    } catch (error) {
      return notification(
        error.response?.data?.message || "Child turlarni yuklashda xatolik"
      );
      
    } finally {
      setChildTypeLoading(false);
    }
  };

  // Fetch child types when selectedType changes
  useEffect(() => {
    if (selectedType) {
      setChildTypePage(1);
      fetchChildTypes();
    } else {
      setChildTypes([]);
    }
  }, [selectedType]);

  // Reset child type when type changes
  useEffect(() => {
    setSelectedChildType(null);
  }, [selectedType]);

  // Fetch data when search or page changes for paginated selects
  useEffect(() => {
    if (open && (warehouseSearch || warehousePage > 1)) {
      fetchWarehouses();
    }
  }, [warehouseSearch, warehousePage, open]);

  useEffect(() => {
    if (open && (eventSearch || eventPage > 1)) {
      fetchEvents();
    }
  }, [eventSearch, eventPage, open]);

  useEffect(() => {
    if (open && (typeSearch || typePage > 1)) {
      fetchTypes();
    }
  }, [typeSearch, typePage, open]);

  useEffect(() => {
    if (open && selectedType) {
      fetchChildTypes();
    }
  }, [childTypeSearch, childTypePage, selectedType, open]);

  // Reset all states when modal opens
  useEffect(() => {
    if (open) {
      setWarehouseSearch("");
      setSelectedWarehouse(null);
      setWarehouses([]);
      setWarehousePage(1);
      setHasMoreWarehouses(true);
      setShowWarehouseDropdown(false);

      setEventSearch("");
      setSelectedEvent(null);
      setEvents([]);
      setEventPage(1);
      setHasMoreEvents(true);
      setShowEventDropdown(false);

      setTypeSearch("");
      setSelectedType(null);
      setTypes([]);
      setTypePage(1);
      setHasMoreTypes(true);
      setShowTypeDropdown(false);

      setChildTypeSearch("");
      setSelectedChildType(null);
      setChildTypes([]);
      setChildTypePage(1);
      setHasMoreChildTypes(true);
      setShowChildTypeDropdown(false);
    }
  }, [open]);
  const units = [
    "dona",
    "kg",
    "gramm",
    "litr",
    "millilitr",
    "santimetr",
    "metr",
    "to'plam",
    "juft",
    "o'ram",
    "quti",
    "tugun / bog'lama",
  ];

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    unit: "",
    given_count: "",
    description: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleClose = () => {
    onClose();
    setFormData({
      name: "",
      quantity: "",
      price: "",
      unit: "",
      given_count: "",
      description: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedWarehouse) {
      notification("Omborxonani kiriting");
      return;
    }
    if (!selectedEvent) {
      notification("Yuk xatini kiriting");
      return;
    }
    if (!selectedType) {
      notification("Mahsulot turini kiriting");
      return;
    }
    // if(!selectedChildType) {
    //   notification("Mahsulot turini kiriting")
    //   return
    // }
    const completeData = {
      ...formData,
      warehouseId: selectedWarehouse,
      eventId: selectedEvent,
      typeId: selectedType,
      childTypeId: selectedChildType,
    };

    try {
      const res = await $api.post("/products/create", completeData);
      if (res.status === 201) {
        handleClose();
        notification("Muvofaqiyatli qo'shildi", "success");
        toggleIsAddModal();
        setType("create-product")
        setText("Yana mahsulot qo'shmoqchimisiz?")
      }
    } catch (error) {
      notification(error?.response?.data?.message);
      return;
    }
  };

  // Toggle functions for each dropdown
  const toggleDropdown = (setter, fetchFn, condition) => {
    setter((prev) => {
      if (!prev && condition) {
        fetchFn();
      }
      return !prev;
    });
  };

  const toggleWarehouseDropdown = () =>
    toggleDropdown(
      setShowWarehouseDropdown,
      () => {
        setWarehouseSearch("");
        setWarehousePage(1);
        fetchWarehouses();
      },
      true
    );

  const toggleEventDropdown = () =>
    toggleDropdown(
      setShowEventDropdown,
      () => {
        setEventSearch("");
        setEventPage(1);
        fetchEvents();
      },
      true
    );

  const toggleTypeDropdown = () =>
    toggleDropdown(
      setShowTypeDropdown,
      () => {
        setTypeSearch("");
        setTypePage(1);
        fetchTypes();
      },
      true
    );

  const toggleChildTypeDropdown = () =>
    toggleDropdown(
      setShowChildTypeDropdown,
      () => {
        setChildTypeSearch("");
        setChildTypePage(1);
        if (selectedType) fetchChildTypes();
      },
      selectedType !== null
    );

  // Custom select component for paginated selects
  const CustomSelect = ({
    value,
    placeholder,
    showDropdown,
    toggleDropdown,
    selectedItem,
    items,
    loading,
    search,
    setSearch,
    hasMore,
    loadMore,
    onSelect,
    searchPlaceholder,
    displayField = "name",
    akk = false,
    disabled = false,
  }) => (
    <div className="relative mb-4">
      <div
        onClick={!disabled ? toggleDropdown : undefined}
        className={`flex items-center justify-between border border-gray-300 rounded-md p-2 ${
          disabled ? "bg-gray-100" : "cursor-pointer hover:border-gray-400"
        } transition-colors`}
      >
        <span className={value ? "text-black" : "text-gray-500"}>
          {value || placeholder}
        </span>

        <ChevronDown
          size={20}
          className={`transition-transform ${
            showDropdown ? "rotate-180" : ""
          } ${disabled ? "text-gray-400" : ""}`}
        />
      </div>

      {showDropdown && !disabled && (
        <ClickAwayListener onClickAway={toggleDropdown}>
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-hidden">
            <div className="p-2 border-b border-gray-200">
              <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                size="small"
                fullWidth
                autoFocus
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "gray" },
                    "&:hover fieldset": { borderColor: "gray" },
                    "&.Mui-focused fieldset": { borderColor: "gray" },
                  },
                }}
              />
            </div>

            {loading && (
              <div className="flex justify-center p-2">
                <CircularProgress size={24} />
              </div>
            )}

            <div className="max-h-60 overflow-y-auto">
              {items.length > 0
                ? items.map((item) => (
                    <MenuItem
                      key={item.id}
                      onClick={() => {
                        onSelect(item.id); // Ensure this is correctly updating the value
                        toggleDropdown(); // Close the dropdown after selection
                      }}
                      selected={selectedItem === item.id}
                      sx={{
                        backgroundColor:
                          selectedItem === item.id ? "#f5f5f5" : "white",
                        fontWeight: selectedItem === item.id ? "600" : "normal",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      {akk
                        ? `Yuk xati raqami - #${item["event_number"]}`
                        : item[displayField]}
                    </MenuItem>
                  ))
                : !loading && (
                    <p className="text-center p-3 text-gray-500">
                      Ma'lumot topilmadi
                    </p>
                  )}

              {hasMore && items.length > 0 && (
                <div className="p-2 border-t border-gray-200 text-center">
                  <Button
                    size="small"
                    onClick={loadMore}
                    disabled={loading}
                    sx={{
                      color: "#249B73",
                      "&:hover": {
                        backgroundColor: "rgba(36, 155, 115, 0.08)",
                      },
                    }}
                  >
                    Ko'proq yuklash
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div className="flex items-center justify-between pb-8">
          <p className="text-xl uppercase">Mahsulot qo'shish</p>
          <button
            onClick={handleClose}
            className="w-8 h-8 hover:bg-[#f4f1f1] cursor-pointer flex items-center justify-center"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 1-ustun */}
          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <TextField
              name="name"
              label="Nomi"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              size="small"
              required
            />

            {/* Quantity */}
            <TextField
              name="quantity"
              label="Miqdori"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              fullWidth
              size="small"
              required
            />

            {/* Price */}
            <TextField
              name="price"
              label="Narxi"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              size="small"
              required
            />

            {/* Expiration Date */}
            <TextField
              name="expiration_date"
              label="Yaroqlilik muddati"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.expiration_date}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            {/* Unit */}
            <FormControl fullWidth size="small">
              <InputLabel>Birlik</InputLabel>
              <Select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                label="Birlik"
                required
              >
                {units.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Warehouse select */}
            <CustomSelect
              value={
                selectedWarehouse
                  ? warehouses.find((w) => w.id === selectedWarehouse)?.name
                  : ""
              }
              placeholder="Omborxonalar"
              showDropdown={showWarehouseDropdown}
              toggleDropdown={toggleWarehouseDropdown}
              selectedItem={selectedWarehouse}
              items={warehouses}
              loading={warehouseLoading}
              search={warehouseSearch}
              setSearch={setWarehouseSearch}
              hasMore={hasMoreWarehouses}
              loadMore={() => setWarehousePage((p) => p + 1)}
              onSelect={setSelectedWarehouse}
              searchPlaceholder="Omborxona qidirish"
            />
            <CustomSelect
              value={
                selectedEvent && events.length > 0
                  ? events.find((e) => e.id === selectedEvent)?.event_number ||
                    ""
                  : "Yuk xati"
              }
              placeholder="Yuk xati"
              showDropdown={showEventDropdown}
              toggleDropdown={toggleEventDropdown}
              selectedItem={selectedEvent}
              items={events}
              loading={eventLoading}
              search={eventSearch}
              setSearch={setEventSearch}
              hasMore={hasMoreEvents}
              loadMore={() => setEventPage((p) => p + 1)}
              onSelect={setSelectedEvent}
              searchPlaceholder="Yuk xati qidirish"
              akk={true}
            />

            {/* Type select */}
            <CustomSelect
              value={
                selectedType
                  ? types.find((t) => t.id === selectedType)?.product_type
                  : ""
              }
              placeholder="Mahsulot turi"
              showDropdown={showTypeDropdown}
              toggleDropdown={toggleTypeDropdown}
              selectedItem={selectedType}
              items={types}
              loading={typeLoading}
              search={typeSearch}
              setSearch={setTypeSearch}
              hasMore={hasMoreTypes}
              loadMore={() => setTypePage((p) => p + 1)}
              onSelect={setSelectedType}
              searchPlaceholder="Type qidirish"
              displayField="product_type"
            />

            {/* Child Type select */}
            <CustomSelect
              value={
                selectedChildType
                  ? childTypes.find((ct) => ct.id === selectedChildType)?.name
                  : ""
              }
              placeholder={
                selectedType ? "Qannday mahsulot" : "Qannday mahsulot"
              }
              showDropdown={showChildTypeDropdown}
              toggleDropdown={toggleChildTypeDropdown}
              selectedItem={selectedChildType}
              items={childTypes}
              loading={childTypeLoading}
              search={childTypeSearch}
              setSearch={setChildTypeSearch}
              hasMore={hasMoreChildTypes}
              loadMore={() => setChildTypePage((p) => p + 1)}
              onSelect={setSelectedChildType}
              searchPlaceholder="Child Type qidirish"
              disabled={!selectedType}
            />

            {/* Description */}
            <div className="col-span-2">
              <TextareaAutosize
                name="description"
                value={formData.description}
                onChange={handleChange}
                minRows={3}
                className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-end mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-500 cursor-pointer border border-gray-300 px-5 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="text-white cursor-pointer bg-[#249B73] px-5 py-1.5 rounded-md hover:bg-[#1e8262] transition-colors"
            >
              Saqlash
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
