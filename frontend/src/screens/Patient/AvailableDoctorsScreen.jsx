import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DoctorCard from "@/src/components/Cards/DoctorCard";
import NavLayout from "@/src/components/Navbar/NavLayout";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const doctorsData = [
  {
    name: "Dr. Arjun Sharma",
    specialty: "Cardiologist",
    rating: 4.9,
    isOnline: true,
    nextAvailable: "2:30 PM",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Dr. Priya Mehta",
    specialty: "Dermatologist",
    rating: 4.8,
    isOnline: false,
    nextAvailable: "Tomorrow 10 AM",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Dr. Rajesh Kumar",
    specialty: "General Physician",
    rating: 4.7,
    isOnline: true,
    nextAvailable: "Available",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
  },
  {
    name: "Dr. Sneha Gupta",
    specialty: "Pediatrician",
    rating: 4.9,
    isOnline: true,
    nextAvailable: "1:00 PM",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Dr. Amit Patel",
    specialty: "Orthopedic",
    rating: 4.6,
    isOnline: false,
    nextAvailable: "3:00 PM",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Dr. Kavya Singh",
    specialty: "Gynecologist",
    rating: 4.8,
    isOnline: true,
    nextAvailable: "Available",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
  },
];

const specialties = [
  "Cardiologist",
  "Dermatologist",
  "General Physician",
  "Pediatrician",
  "Orthopedic",
  "Gynecologist",
];
const ratings = [4, 4.5, 5];

// Calculate dynamic modal height based on content
const MODAL_BASE_HEIGHT = 450;
const MAX_MODAL_HEIGHT = SCREEN_HEIGHT * 0.85;

export default function AvailableDoctorsScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState(doctorsData);
  const [showFilterOverlay, setShowFilterOverlay] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Animation refs
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Update modal height when screen orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      // Handle orientation change if needed
    });
    return () => subscription?.remove();
  }, []);

  const openFilterOverlay = () => {
    setShowFilterOverlay(true);

    // Reset animation values
    slideAnim.setValue(SCREEN_HEIGHT);
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);

    // Start animations
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeFilterOverlay = () => {
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
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowFilterOverlay(false);
    });
  };

  const handleSearch = (text) => {
    setSearch(text);
    filterDoctors(text, selectedSpecialty, selectedRating, onlyOnline);
  };

  const filterDoctors = (
    searchText = "",
    specialty = null,
    rating = null,
    online = false
  ) => {
    const filtered = doctorsData.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchText.toLowerCase()) ||
        d.specialty.toLowerCase().includes(searchText.toLowerCase());
      const matchesSpecialty = specialty ? d.specialty === specialty : true;
      const matchesRating = rating ? d.rating >= rating : true;
      const matchesOnline = online ? d.isOnline === true : true;
      return (
        matchesSearch && matchesSpecialty && matchesRating && matchesOnline
      );
    });
    setFilteredDoctors(filtered);
  };

  const applyFilter = () => {
    filterDoctors(search, selectedSpecialty, selectedRating, onlyOnline);
    closeFilterOverlay();
  };

  const clearFilter = () => {
    setSelectedSpecialty(null);
    setSelectedRating(null);
    setOnlyOnline(false);
    filterDoctors(search);
    closeFilterOverlay();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedSpecialty) count++;
    if (selectedRating) count++;
    if (onlyOnline) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <NavLayout title="Available Doctors" showAiChat={true}>
      <View className="flex-1 bg-slate-50 dark:bg-gray-900">
        {/* Search & Filter Header */}
        <View className="px-4 pt-4 pb-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <View className="flex-row items-center space-x-3">
            {/* Search Bar */}
            <View className="flex-1 flex-row rounded-2xl px-4 items-center bg-gray-100 dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
              <Ionicons name="search-outline" size={20} color="#6B7280" />
              <TextInput
                className="ml-3 flex-1 text-gray-900 dark:text-white text-base py-3"
                placeholder="Search doctors or specialties..."
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={handleSearch}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
                underlineColorAndroid="transparent"
                selectionColor="#3B82F6"
              />
              {search.length > 0 && (
                <TouchableOpacity
                  onPress={() => handleSearch("")}
                  className="ml-2 p-1"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close-circle" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Button */}
            <TouchableOpacity
              className="bg-blue-500 dark:bg-blue-600 px-4 py-3 rounded-2xl shadow-lg flex-row items-center relative border border-blue-400 dark:border-blue-500"
              onPress={openFilterOverlay}
              style={{
                shadowColor: "#3B82F6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <MaterialIcons name="tune" size={20} color="white" />
              <Text className="ml-2 text-white font-semibold">Filter</Text>
              {activeFiltersCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-xs font-bold">
                    {activeFiltersCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Active Filters Display */}
          {(selectedSpecialty || selectedRating || onlyOnline) && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-3"
            >
              <View className="flex-row space-x-2">
                {selectedSpecialty && (
                  <View className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full flex-row items-center border border-blue-200 dark:border-blue-800">
                    <Text className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                      {selectedSpecialty}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedSpecialty(null);
                        filterDoctors(search, null, selectedRating, onlyOnline);
                      }}
                      className="ml-2"
                    >
                      <Ionicons name="close" size={14} color="#3B82F6" />
                    </TouchableOpacity>
                  </View>
                )}
                {selectedRating && (
                  <View className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full flex-row items-center border border-green-200 dark:border-green-800">
                    <Text className="text-green-700 dark:text-green-300 text-sm font-medium">
                      {selectedRating}+ Rating
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedRating(null);
                        filterDoctors(
                          search,
                          selectedSpecialty,
                          null,
                          onlyOnline
                        );
                      }}
                      className="ml-2"
                    >
                      <Ionicons name="close" size={14} color="#10B981" />
                    </TouchableOpacity>
                  </View>
                )}
                {onlyOnline && (
                  <View className="bg-orange-100 dark:bg-orange-900 px-3 py-1 rounded-full flex-row items-center border border-orange-200 dark:border-orange-800">
                    <Text className="text-orange-700 dark:text-orange-300 text-sm font-medium">
                      Online Only
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setOnlyOnline(false);
                        filterDoctors(
                          search,
                          selectedSpecialty,
                          selectedRating,
                          false
                        );
                      }}
                      className="ml-2"
                    >
                      <Ionicons name="close" size={14} color="#F97316" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Results Count */}
        <View className="px-4 py-3 bg-white dark:bg-gray-900">
          <Text className="text-gray-600 dark:text-gray-400 text-sm">
            {filteredDoctors.length}{" "}
            {filteredDoctors.length === 1 ? "doctor" : "doctors"} found
          </Text>
        </View>

        {/* Doctor List */}
        <ScrollView
          className="flex-1 px-4 bg-slate-50 dark:bg-gray-900"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc, i) => (
              <DoctorCard
                key={`${doc.name}-${i}`}
                {...doc}
                onPress={() =>
                  navigation.navigate("DoctorDetails", { doctor: doc })
                }
              />
            ))
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="search" size={64} color="#9CA3AF" />
              <Text className="text-gray-500 dark:text-gray-400 text-lg font-medium mt-4 mb-2">
                No doctors found
              </Text>
              <Text className="text-gray-400 dark:text-gray-500 text-center px-8">
                Try adjusting your search criteria or filters
              </Text>
              {(selectedSpecialty || selectedRating || onlyOnline) && (
                <TouchableOpacity
                  onPress={clearFilter}
                  className="bg-blue-500 dark:bg-blue-600 px-6 py-3 rounded-2xl mt-6 shadow-lg"
                >
                  <Text className="text-white font-semibold">
                    Clear All Filters
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>

        {/* Fixed Filter Overlay */}
        {showFilterOverlay && (
          <View className="absolute inset-0 z-50">
            {/* Solid Backdrop */}
            <Animated.View 
              style={{ opacity: fadeAnim }}
              className="absolute inset-0 bg-black/70"
            />

            {/* Modal Container */}
            <KeyboardAvoidingView
              className="flex-1 justify-end"
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <Pressable
                className="flex-1"
                onPress={closeFilterOverlay}
              />
              
              <Animated.View
                style={{ 
                  transform: [{ translateY: slideAnim }],
                  maxHeight: SCREEN_HEIGHT * 0.85 
                }}
                className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl border-t-4 border-gray-200 dark:border-gray-600"
              >
                {/* Modal Handle */}
                <View className="items-center pt-4 pb-2">
                  <View className="w-16 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                </View>

                {/* Modal Content */}
                <ScrollView
                  className="px-6 pb-8"
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {/* Header */}
                  <View className="flex-row items-center justify-between mb-6">
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                      🔍 Filter Doctors
                    </Text>
                    <TouchableOpacity
                      onPress={closeFilterOverlay}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 shadow-sm"
                    >
                      <Ionicons name="close" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  {/* Specialty Filter */}
                  <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      🩺 Medical Specialty
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {specialties.map((specialty) => (
                        <TouchableOpacity
                          key={specialty}
                          onPress={() =>
                            setSelectedSpecialty(
                              specialty === selectedSpecialty
                                ? null
                                : specialty
                            )
                          }
                          className={`px-4 py-2 rounded-2xl border-2 shadow-sm ${
                            selectedSpecialty === specialty
                              ? "bg-blue-500 border-blue-500"
                              : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                          }`}
                        >
                          <Text
                            className={`text-sm font-medium ${
                              selectedSpecialty === specialty
                                ? "text-white"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {specialty}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Rating Filter */}
                  <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      ⭐ Minimum Rating
                    </Text>
                    <View className="flex-row space-x-3">
                      {ratings.map((rating) => (
                        <TouchableOpacity
                          key={rating}
                          onPress={() =>
                            setSelectedRating(
                              rating === selectedRating ? null : rating
                            )
                          }
                          className={`flex-1 px-4 py-3 rounded-2xl border-2 flex-row items-center justify-center shadow-sm ${
                            selectedRating === rating
                              ? "bg-green-500 border-green-500"
                              : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                          }`}
                        >
                          <MaterialIcons
                            name="star"
                            size={16}
                            color={
                              selectedRating === rating
                                ? "white"
                                : "#FCD34D"
                            }
                          />
                          <Text
                            className={`ml-1 font-medium ${
                              selectedRating === rating
                                ? "text-white"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {rating}+
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Online Toggle */}
                  <View className="mb-8">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      🟢 Availability Status
                    </Text>
                    <View className="bg-white dark:bg-gray-700 p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 flex-row justify-between items-center shadow-sm">
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          Available Now
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Show only doctors who are currently online
                        </Text>
                      </View>
                      <Switch
                        trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
                        thumbColor={onlyOnline ? "#ffffff" : "#f3f4f6"}
                        onValueChange={setOnlyOnline}
                        value={onlyOnline}
                      />
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row space-x-4 mb-6">
                    <TouchableOpacity
                      className="flex-1 bg-gray-200 dark:bg-gray-700 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                      onPress={clearFilter}
                    >
                      <Text className="text-center text-gray-700 dark:text-gray-300 font-semibold text-base">
                        Clear All
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-blue-500 dark:bg-blue-600 py-4 rounded-2xl shadow-lg"
                      onPress={applyFilter}
                    >
                      <Text className="text-center text-white font-semibold text-base">
                        Apply Filters
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