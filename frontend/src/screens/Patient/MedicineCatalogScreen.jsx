import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import NavLayout from "@/src/components/Navbar/NavLayout";
import useAuthStore from "@/src/state/authStore";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// Sample medicine data
const medicinesData = [
  {
    id: 1,
    name: "Paracetamol",
    genericName: "Acetaminophen",
    brand: "Crocin",
    category: "Pain Relief",
    dosage: "500mg",
    form: "Tablet",
    price: 25.5,
    originalPrice: 30.0,
    discount: 15,
    inStock: true,
    stockCount: 150,
    rating: 4.6,
    reviews: 342,
    prescriptionRequired: false,
    description:
      "Used for fever and mild to moderate pain relief. Safe for most adults when used as directed.",
    activeIngredients: ["Paracetamol 500mg"],
    sideEffects: ["Nausea", "Stomach upset (rare)"],
    dosageInstructions:
      "1-2 tablets every 4-6 hours. Maximum 8 tablets in 24 hours.",
    manufacturer: "GSK Pharmaceuticals",
    expiryDate: "2025-12-31",
    image: "https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=PAR",
  },
  {
    id: 2,
    name: "Amoxicillin",
    genericName: "Amoxicillin Trihydrate",
    brand: "Amoxil",
    category: "Antibiotic",
    dosage: "250mg",
    form: "Capsule",
    price: 85.0,
    originalPrice: 100.0,
    discount: 15,
    inStock: true,
    stockCount: 75,
    rating: 4.4,
    reviews: 218,
    prescriptionRequired: true,
    description:
      "Broad-spectrum antibiotic used to treat bacterial infections including respiratory tract infections.",
    activeIngredients: ["Amoxicillin Trihydrate 250mg"],
    sideEffects: ["Diarrhea", "Nausea", "Skin rash", "Allergic reactions"],
    dosageInstructions:
      "1 capsule three times daily for 7-10 days or as prescribed by doctor.",
    manufacturer: "Cipla Ltd",
    expiryDate: "2025-08-15",
    image: "https://via.placeholder.com/100x100/059669/FFFFFF?text=AMX",
  },
  {
    id: 3,
    name: "Omeprazole",
    genericName: "Omeprazole",
    brand: "Prilosec",
    category: "Antacid",
    dosage: "20mg",
    form: "Capsule",
    price: 45.75,
    originalPrice: 55.0,
    discount: 17,
    inStock: true,
    stockCount: 200,
    rating: 4.7,
    reviews: 156,
    prescriptionRequired: false,
    description:
      "Proton pump inhibitor used to treat acid reflux, heartburn, and stomach ulcers.",
    activeIngredients: ["Omeprazole 20mg"],
    sideEffects: ["Headache", "Diarrhea", "Stomach pain", "Nausea"],
    dosageInstructions:
      "1 capsule daily before breakfast, preferably in the morning.",
    manufacturer: "Dr. Reddy's Labs",
    expiryDate: "2025-11-20",
    image: "https://via.placeholder.com/100x100/DC2626/FFFFFF?text=OME",
  },
  {
    id: 4,
    name: "Metformin",
    genericName: "Metformin Hydrochloride",
    brand: "Glucophage",
    category: "Diabetes",
    dosage: "500mg",
    form: "Tablet",
    price: 120.0,
    originalPrice: 140.0,
    discount: 14,
    inStock: false,
    stockCount: 0,
    rating: 4.5,
    reviews: 289,
    prescriptionRequired: true,
    description:
      "Anti-diabetic medication used to control blood sugar levels in type 2 diabetes.",
    activeIngredients: ["Metformin Hydrochloride 500mg"],
    sideEffects: ["Nausea", "Diarrhea", "Metallic taste", "Stomach upset"],
    dosageInstructions:
      "1-2 tablets twice daily with meals or as prescribed by doctor.",
    manufacturer: "Sun Pharmaceutical",
    expiryDate: "2025-09-10",
    image: "https://via.placeholder.com/100x100/7C3AED/FFFFFF?text=MET",
  },
  {
    id: 5,
    name: "Cetirizine",
    genericName: "Cetirizine Hydrochloride",
    brand: "Zyrtec",
    category: "Antihistamine",
    dosage: "10mg",
    form: "Tablet",
    price: 35.25,
    originalPrice: 42.0,
    discount: 16,
    inStock: true,
    stockCount: 300,
    rating: 4.8,
    reviews: 412,
    prescriptionRequired: false,
    description: "Antihistamine used to treat allergies, hay fever, and hives.",
    activeIngredients: ["Cetirizine Hydrochloride 10mg"],
    sideEffects: ["Drowsiness", "Dry mouth", "Fatigue", "Dizziness"],
    dosageInstructions: "1 tablet once daily, preferably in the evening.",
    manufacturer: "Johnson & Johnson",
    expiryDate: "2025-07-25",
    image: "https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=CET",
  },
  {
    id: 6,
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    brand: "Advil",
    category: "Pain Relief",
    dosage: "400mg",
    form: "Tablet",
    price: 28.9,
    originalPrice: 35.0,
    discount: 17,
    inStock: true,
    stockCount: 180,
    rating: 4.3,
    reviews: 267,
    prescriptionRequired: false,
    description:
      "Non-steroidal anti-inflammatory drug (NSAID) for pain, fever, and inflammation.",
    activeIngredients: ["Ibuprofen 400mg"],
    sideEffects: ["Stomach upset", "Dizziness", "Headache", "Drowsiness"],
    dosageInstructions:
      "1 tablet every 6-8 hours with food. Maximum 3 tablets daily.",
    manufacturer: "Pfizer Inc",
    expiryDate: "2025-10-05",
    image: "https://via.placeholder.com/100x100/EF4444/FFFFFF?text=IBU",
  },
];

const categories = [
  "All",
  "Pain Relief",
  "Antibiotic",
  "Antacid",
  "Diabetes",
  "Antihistamine",
];

export default function MedicineCatalogScreen({ navigation }) {
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState(medicinesData);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [cart, setCart] = useState([]);
  const [sortBy, setSortBy] = useState("name"); // name, price, rating
  const [showPrescriptionOnly, setShowPrescriptionOnly] = useState(false);

  // Animation refs
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSearch = (text) => {
    setSearch(text);
    filterMedicines(text, selectedCategory, showPrescriptionOnly, sortBy);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    filterMedicines(search, category, showPrescriptionOnly, sortBy);
  };

  const filterMedicines = (
    searchText = "",
    category = "All",
    prescriptionOnly = false,
    sort = "name"
  ) => {
    let filtered = medicinesData.filter((medicine) => {
      const matchesSearch =
        medicine.name.toLowerCase().includes(searchText.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(searchText.toLowerCase()) ||
        medicine.brand.toLowerCase().includes(searchText.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory =
        category === "All" || medicine.category === category;
      const matchesPrescription = prescriptionOnly
        ? medicine.prescriptionRequired
        : true;

      return matchesSearch && matchesCategory && matchesPrescription;
    });

    // Sort medicines
    filtered.sort((a, b) => {
      switch (sort) {
        case "price":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredMedicines(filtered);
  };

  const openMedicineDetails = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDetails(true);

    slideAnim.setValue(SCREEN_HEIGHT);
    fadeAnim.setValue(0);

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMedicineDetails = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowDetails(false);
      setSelectedMedicine(null);
    });
  };

  const addToCart = (medicine) => {
    if (!medicine.inStock) {
      Alert.alert("Out of Stock", "This medicine is currently not available.");
      return;
    }

    if (medicine.prescriptionRequired) {
      Alert.alert(
        "Prescription Required",
        "This medicine requires a valid prescription. Please consult with your doctor first.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Find Doctor",
            onPress: () => navigation.navigate("AvailableDoctors"),
          },
        ]
      );
      return;
    }

    const existingItem = cart.find((item) => item.id === medicine.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }

    Alert.alert(
      "Added to Cart",
      `${medicine.name} has been added to your cart.`
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const MedicineCard = ({ medicine }) => (
    <TouchableOpacity
      onPress={() => openMedicineDetails(medicine)}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-lg border border-gray-200 dark:border-gray-700"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View className="flex-row">
        {/* Medicine Image */}
        <View className="mr-4">
          <Image
            source={{ uri: medicine.image }}
            className="w-16 h-16 rounded-xl"
            resizeMode="cover"
          />
          {medicine.discount > 0 && (
            <View className="absolute -top-2 -right-2 bg-red-500 rounded-full px-2 py-1">
              <Text className="text-white text-xs font-bold">
                {medicine.discount}%
              </Text>
            </View>
          )}
        </View>

        {/* Medicine Info */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                {medicine.name}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {medicine.brand} • {medicine.dosage}
              </Text>
            </View>
            {medicine.prescriptionRequired && (
              <View className="bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded-full">
                <Text className="text-orange-700 dark:text-orange-300 text-xs font-medium">
                  Rx
                </Text>
              </View>
            )}
          </View>

          <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {medicine.category} • {medicine.form}
          </Text>

          {/* Rating */}
          <View className="flex-row items-center mb-3">
            <Ionicons name="star" size={14} color="#FCD34D" />
            <Text className="text-sm text-gray-700 dark:text-gray-300 ml-1">
              {medicine.rating} ({medicine.reviews} reviews)
            </Text>
          </View>

          {/* Price and Stock */}
          <View className="flex-row items-center justify-between">
            <View>
              <View className="flex-row items-center">
                <Text className="text-lg font-bold text-green-600 dark:text-green-400">
                  ₹{medicine.price}
                </Text>
                {medicine.originalPrice > medicine.price && (
                  <Text className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                    ₹{medicine.originalPrice}
                  </Text>
                )}
              </View>
              <Text
                className={`text-xs ${medicine.inStock ? "text-green-600" : "text-red-600"}`}
              >
                {medicine.inStock
                  ? `${medicine.stockCount} in stock`
                  : "Out of stock"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => addToCart(medicine)}
              disabled={!medicine.inStock}
              className={`px-4 py-2 rounded-xl ${
                medicine.inStock
                  ? "bg-blue-500 dark:bg-blue-600"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <Text
                className={`font-semibold ${
                  medicine.inStock ? "text-white" : "text-gray-500"
                }`}
              >
                {medicine.inStock ? "Add to Cart" : "Out of Stock"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <NavLayout title="Medicine Catalog" showAiChat={true}>
      <View className="flex-1 bg-slate-50 dark:bg-gray-900">
        {/* Header with Cart */}
        <View className="px-4 pt-4 pb-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              💊 Medicines
            </Text>

            {/* Cart Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Cart")}
              className="bg-blue-500 dark:bg-blue-600 p-3 rounded-2xl shadow-lg relative"
            >
              <Ionicons name="cart" size={20} color="white" />
              {getCartItemCount() > 0 && (
                <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center">
                  <Text className="text-white text-xs font-bold">
                    {getCartItemCount()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="flex-row rounded-2xl px-4 items-center bg-gray-100 dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
            <Ionicons name="search-outline" size={20} color="#6B7280" />
            <TextInput
              className="ml-3 flex-1 text-gray-900 dark:text-white text-base py-3"
              placeholder="Search medicines, brands, categories..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={handleSearch}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {search.length > 0 && (
              <TouchableOpacity
                onPress={() => handleSearch("")}
                className="ml-2 p-1"
              >
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Options */}
          <View className="flex-row items-center justify-between mb-2">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-1"
            >
              <View className="flex-row space-x-2">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => handleCategorySelect(category)}
                    className={`px-4 py-2 rounded-full border ${
                      selectedCategory === category
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedCategory === category
                          ? "text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Sort Button */}
            <TouchableOpacity
              className="ml-3 bg-gray-200 dark:bg-gray-700 p-2 rounded-xl"
              onPress={() => {
                const nextSort =
                  sortBy === "name"
                    ? "price"
                    : sortBy === "price"
                      ? "rating"
                      : "name";
                setSortBy(nextSort);
                filterMedicines(
                  search,
                  selectedCategory,
                  showPrescriptionOnly,
                  nextSort
                );
              }}
            >
              <MaterialIcons name="sort" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Results Count */}
          <Text className="text-gray-600 dark:text-gray-400 text-sm">
            {filteredMedicines.length} medicines found • Sorted by {sortBy}
          </Text>
        </View>

        {/* Medicine List */}
        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <FontAwesome5 name="pills" size={64} color="#9CA3AF" />
              <Text className="text-gray-500 dark:text-gray-400 text-lg font-medium mt-4 mb-2">
                No medicines found
              </Text>
              <Text className="text-gray-400 dark:text-gray-500 text-center px-8">
                Try adjusting your search criteria or category
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Medicine Details Modal */}
        {showDetails && selectedMedicine && (
          <View className="absolute inset-0 z-50">
            <Animated.View
              style={{ opacity: fadeAnim }}
              className="absolute inset-0 bg-black/70"
            />

            <KeyboardAvoidingView
              className="flex-1 justify-end"
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <Pressable className="flex-1" onPress={closeMedicineDetails} />

              <Animated.View
                style={{
                  transform: [{ translateY: slideAnim }],
                  maxHeight: SCREEN_HEIGHT * 0.9,
                }}
                className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl border-t-4 border-gray-200 dark:border-gray-600"
              >
                {/* Handle */}
                <View className="items-center pt-4 pb-2">
                  <View className="w-16 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                </View>

                <ScrollView
                  className="px-6 pb-8"
                  showsVerticalScrollIndicator={false}
                >
                  {/* Header */}
                  <View className="flex-row items-start justify-between mb-6">
                    <View className="flex-1">
                      <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {selectedMedicine.name}
                      </Text>
                      <Text className="text-lg text-gray-600 dark:text-gray-400">
                        {selectedMedicine.brand}
                      </Text>
                      <Text className="text-sm text-gray-500 dark:text-gray-400">
                        Generic: {selectedMedicine.genericName}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={closeMedicineDetails}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
                    >
                      <Ionicons name="close" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  {/* Medicine Image and Basic Info */}
                  <View className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 mb-6">
                    <View className="flex-row items-center">
                      <Image
                        source={{ uri: selectedMedicine.image }}
                        className="w-20 h-20 rounded-xl mr-4"
                        resizeMode="cover"
                      />
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-800 dark:text-gray-200">
                          {selectedMedicine.dosage} • {selectedMedicine.form}
                        </Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Category: {selectedMedicine.category}
                        </Text>
                        <View className="flex-row items-center">
                          <Ionicons name="star" size={16} color="#FCD34D" />
                          <Text className="text-sm text-gray-700 dark:text-gray-300 ml-1">
                            {selectedMedicine.rating} (
                            {selectedMedicine.reviews} reviews)
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Price Section */}
                  <View className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 mb-6">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      💰 Pricing
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ₹{selectedMedicine.price}
                        </Text>
                        {selectedMedicine.originalPrice >
                          selectedMedicine.price && (
                          <View className="flex-row items-center">
                            <Text className="text-sm text-gray-500 dark:text-gray-400 line-through">
                              ₹{selectedMedicine.originalPrice}
                            </Text>
                            <Text className="text-sm text-green-600 dark:text-green-400 ml-2 font-medium">
                              Save ₹
                              {(
                                selectedMedicine.originalPrice -
                                selectedMedicine.price
                              ).toFixed(2)}
                            </Text>
                          </View>
                        )}
                      </View>
                      {selectedMedicine.discount > 0 && (
                        <View className="bg-red-500 rounded-full px-3 py-2">
                          <Text className="text-white font-bold">
                            {selectedMedicine.discount}% OFF
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Description */}
                  <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      📋 Description
                    </Text>
                    <Text className="text-gray-700 dark:text-gray-300 leading-6">
                      {selectedMedicine.description}
                    </Text>
                  </View>

                  {/* Active Ingredients */}
                  <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      🧪 Active Ingredients
                    </Text>
                    {selectedMedicine.activeIngredients.map(
                      (ingredient, index) => (
                        <Text
                          key={index}
                          className="text-gray-700 dark:text-gray-300 mb-1"
                        >
                          • {ingredient}
                        </Text>
                      )
                    )}
                  </View>

                  {/* Dosage Instructions */}
                  <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      📝 Dosage Instructions
                    </Text>
                    <Text className="text-gray-700 dark:text-gray-300 leading-6">
                      {selectedMedicine.dosageInstructions}
                    </Text>
                  </View>

                  {/* Side Effects */}
                  <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      ⚠️ Possible Side Effects
                    </Text>
                    {selectedMedicine.sideEffects.map((effect, index) => (
                      <Text
                        key={index}
                        className="text-gray-700 dark:text-gray-300 mb-1"
                      >
                        • {effect}
                      </Text>
                    ))}
                  </View>

                  {/* Manufacturer Info */}
                  <View className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-6">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      🏭 Manufacturer Information
                    </Text>
                    <Text className="text-gray-700 dark:text-gray-300 mb-1">
                      Manufacturer: {selectedMedicine.manufacturer}
                    </Text>
                    <Text className="text-gray-700 dark:text-gray-300">
                      Expiry Date:{" "}
                      {new Date(
                        selectedMedicine.expiryDate
                      ).toLocaleDateString()}
                    </Text>
                  </View>

                  {/* Stock Status */}
                  <View
                    className={`${selectedMedicine.inStock ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"} rounded-2xl p-4 mb-6`}
                  >
                    <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      📦 Availability
                    </Text>
                    <Text
                      className={`font-medium ${selectedMedicine.inStock ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {selectedMedicine.inStock
                        ? `✅ In Stock (${selectedMedicine.stockCount} units available)`
                        : "❌ Currently Out of Stock"}
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row space-x-4 mb-6">
                    <TouchableOpacity
                      onPress={() => addToCart(selectedMedicine)}
                      disabled={!selectedMedicine.inStock}
                      className={`flex-1 px-4 py-3 rounded-2xl items-center justify-center ${
                        selectedMedicine.inStock
                          ? "bg-blue-500 dark:bg-blue-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <Text
                        className={`text-white font-semibold ${
                          selectedMedicine.inStock ? "" : "text-gray-500"
                        }`}
                      >
                        {selectedMedicine.inStock
                          ? "Add to Cart"
                          : "Out of Stock"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={closeMedicineDetails}
                      className="flex-1 px-4 py-3 rounded-2xl items-center justify-center bg-gray-200 dark:bg-gray-700"
                    >
                      <Text className="text-gray-700 dark:text-gray-300 font-semibold">
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </Animated.View>
            </KeyboardAvoidingView>
          </View>
        )}
      </View>
    </NavLayout>
  );
}
