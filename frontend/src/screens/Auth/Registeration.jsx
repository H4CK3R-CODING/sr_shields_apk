import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RegistrationPage = () => {
  const [selectedRole, setSelectedRole] = useState('patient');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Patient specific
    dateOfBirth: '',
    gender: '',
    emergencyContact: '',
    medicalHistory: '',
    // Doctor specific
    licenseNumber: '',
    specialization: '',
    hospital: '',
    experience: '',
    qualifications: '',
    consultationFee: '',
    // Medical Staff specific
    staffId: '',
    department: '',
    position: '',
    // Common address fields
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const roles = [
    { key: 'patient', label: 'Patient', icon: 'person-outline' },
    { key: 'doctor', label: 'Doctor', icon: 'medical-outline' },
    { key: 'medical', label: 'Medical Staff', icon: 'business-outline' },
  ];

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  
  const specializations = [
    'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
    'Dermatology', 'Psychiatry', 'Surgery', 'Oncology', 'Radiology',
  ];

  const departments = [
    'Emergency', 'ICU', 'Surgery', 'Pediatrics', 'Cardiology', 
    'Neurology', 'Orthopedics', 'Laboratory', 'Radiology', 'Pharmacy',
  ];

  // Responsive calculations
  const isSmallScreen = screenWidth < 360;
  const isMediumScreen = screenWidth >= 360 && screenWidth < 414;
  const isLargeScreen = screenWidth >= 414;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFormData(prev => ({
      ...prev,
      // Reset role-specific fields
      dateOfBirth: '',
      gender: '',
      emergencyContact: '',
      medicalHistory: '',
      licenseNumber: '',
      specialization: '',
      hospital: '',
      experience: '',
      qualifications: '',
      consultationFee: '',
      staffId: '',
      department: '',
      position: '',
    }));
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    const commonRequiredFields = ['firstName', 'lastName', 'email', 'phone', 'password'];
    let roleSpecificFields = [];

    switch (selectedRole) {
      case 'patient':
        roleSpecificFields = ['dateOfBirth', 'gender'];
        break;
      case 'doctor':
        roleSpecificFields = ['licenseNumber', 'specialization'];
        break;
      case 'medical':
        roleSpecificFields = ['staffId', 'department', 'position'];
        break;
    }

    const requiredFields = [...commonRequiredFields, ...roleSpecificFields];
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!formData[field] || !formData[field].toString().trim()) {
        errors[field] = 'This field is required';
      }
    });

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Date of birth validation for patients
    if (selectedRole === 'patient' && formData.dateOfBirth) {
      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
      if (!dateRegex.test(formData.dateOfBirth)) {
        errors.dateOfBirth = 'Please enter date in MM/DD/YYYY format';
      }
    }

    // Experience validation for doctors
    if (selectedRole === 'doctor' && formData.experience && isNaN(formData.experience)) {
      errors.experience = 'Please enter a valid number';
    }

    // Consultation fee validation for doctors
    if (selectedRole === 'doctor' && formData.consultationFee && isNaN(formData.consultationFee)) {
      errors.consultationFee = 'Please enter a valid amount';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const registrationData = {
        ...formData,
        role: selectedRole,
        timestamp: new Date().toISOString()
      };
      
      Alert.alert(
        'Success', 
        `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} registration submitted successfully!`,
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Registration Data:', registrationData);
              // Reset form after successful submission
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
                dateOfBirth: '',
                gender: '',
                emergencyContact: '',
                medicalHistory: '',
                licenseNumber: '',
                specialization: '',
                hospital: '',
                experience: '',
                qualifications: '',
                consultationFee: '',
                staffId: '',
                department: '',
                position: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
              });
              setFormErrors({});
            }
          }
        ]
      );
    } else {
      Alert.alert('Error', 'Please correct the highlighted fields');
    }
  };

  const CustomTextInput = ({ 
    label, 
    placeholder, 
    value, 
    onChangeText, 
    required = false, 
    keyboardType = 'default', 
    multiline = false, 
    numberOfLines = 1,
    secureTextEntry = false,
    autoCapitalize = 'sentences',
    icon,
    rightElement,
    fieldName
  }) => {
    const hasError = formErrors[fieldName];
    
    return (
      <View className={`${multiline ? 'mb-6' : 'mb-4'}`}>
        <View className="flex-row items-center mb-2">
          {icon && (
            <Ionicons
              name={icon}
              size={16}
              color="#9CA3AF"
              style={{ marginRight: 8 }}
            />
          )}
          <Text className={`${isSmallScreen ? 'text-sm' : 'text-base'} font-medium ${hasError ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {label} {required && <Text className="text-red-500">*</Text>}
          </Text>
        </View>
        <View className="relative">
          <TextInput
            className={`${isSmallScreen ? 'px-3 py-2.5' : 'px-4 py-3'} ${rightElement ? 'pr-12' : ''} ${isSmallScreen ? 'text-sm' : 'text-base'} text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 border ${hasError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:border-blue-500`}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={numberOfLines}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            style={{ 
              minHeight: multiline ? (isSmallScreen ? 60 : 80) : (isSmallScreen ? 40 : 48),
              textAlignVertical: multiline ? 'top' : 'center'
            }}
          />
          {rightElement && (
            <View className={`absolute right-3 ${isSmallScreen ? 'top-2.5' : 'top-3'}`}>
              {rightElement}
            </View>
          )}
        </View>
        {hasError && (
          <Text className="text-red-500 text-sm mt-1">{hasError}</Text>
        )}
      </View>
    );
  };

  const GenderSelector = () => (
    <View className="mb-4">
      <Text className={`${isSmallScreen ? 'text-sm' : 'text-base'} font-medium mb-2 ${formErrors.gender ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
        Gender <Text className="text-red-500">*</Text>
      </Text>
      <View className="flex-row flex-wrap">
        {genderOptions.map((gender) => (
          <TouchableOpacity
            key={gender}
            className={`mr-2 mb-2 px-3 py-2 rounded-full border ${
              formData.gender === gender
                ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
            }`}
            onPress={() => handleInputChange('gender', gender)}
            activeOpacity={0.7}
          >
            <Text
              className={`${isSmallScreen ? 'text-sm' : 'text-base'} ${
                formData.gender === gender
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {gender}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {formErrors.gender && (
        <Text className="text-red-500 text-sm mt-1">{formErrors.gender}</Text>
      )}
    </View>
  );

  const PasswordStrengthIndicator = ({ password }) => {
    const getStrength = () => {
      if (password.length < 6) return { level: 0, text: 'Too short', color: '#EF4444' };
      if (password.length < 8) return { level: 2, text: 'Fair', color: '#F59E0B' };
      if (password.length < 10) return { level: 3, text: 'Good', color: '#3B82F6' };
      return { level: 4, text: 'Strong', color: '#10B981' };
    };

    const strength = getStrength();

    return (
      <View className="mb-2">
        <View className="flex-row space-x-1">
          {[...Array(4)].map((_, i) => (
            <View
              key={i}
              className="flex-1 h-1 rounded"
              style={{
                backgroundColor: i < strength.level ? strength.color : '#D1D5DB'
              }}
            />
          ))}
        </View>
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Password strength: {strength.text}
        </Text>
      </View>
    );
  };

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case 'patient':
        return (
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center mb-4">
              <Ionicons name="medical" size={24} color="#3B82F6" style={{ marginRight: 8 }} />
              <Text className={`${isSmallScreen ? 'text-base' : 'text-lg'} font-semibold text-gray-800 dark:text-white`}>
                Patient Information
              </Text>
            </View>
            
            <View className={screenWidth > 360 ? "flex-row space-x-4 mb-4" : "mb-4"}>
              <View className={screenWidth > 360 ? "flex-1" : "mb-4"}>
                <CustomTextInput
                  label="Date of Birth"
                  placeholder="MM/DD/YYYY"
                  value={formData.dateOfBirth}
                  onChangeText={(text) => handleInputChange('dateOfBirth', text)}
                  required={true}
                  icon="calendar-outline"
                  fieldName="dateOfBirth"
                />
              </View>
              
              <View className={screenWidth > 360 ? "flex-1" : ""}>
                <GenderSelector />
              </View>
            </View>

            <CustomTextInput
              label="Emergency Contact"
              placeholder="Emergency contact number"
              value={formData.emergencyContact}
              onChangeText={(text) => handleInputChange('emergencyContact', text)}
              keyboardType="phone-pad"
              icon="call-outline"
              fieldName="emergencyContact"
            />

            <CustomTextInput
              label="Medical History"
              placeholder="Brief medical history (optional)"
              value={formData.medicalHistory}
              onChangeText={(text) => handleInputChange('medicalHistory', text)}
              multiline={true}
              numberOfLines={3}
              icon="document-text-outline"
              fieldName="medicalHistory"
            />
          </View>
        );

      case 'doctor':
        return (
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center mb-4">
              <Ionicons name="school" size={24} color="#3B82F6" style={{ marginRight: 8 }} />
              <Text className={`${isSmallScreen ? 'text-base' : 'text-lg'} font-semibold text-gray-800 dark:text-white`}>
                Professional Information
              </Text>
            </View>
            
            <CustomTextInput
              label="Medical License Number"
              placeholder="Enter license number"
              value={formData.licenseNumber}
              onChangeText={(text) => handleInputChange('licenseNumber', text)}
              required={true}
              icon="card-outline"
              fieldName="licenseNumber"
            />

            <CustomTextInput
              label="Specialization"
              placeholder="Enter specialization"
              value={formData.specialization}
              onChangeText={(text) => handleInputChange('specialization', text)}
              required={true}
              icon="medical-outline"
              fieldName="specialization"
            />

            <View className={screenWidth > 360 ? "flex-row space-x-4" : ""}>
              <View className={screenWidth > 360 ? "flex-1" : ""}>
                <CustomTextInput
                  label="Hospital/Clinic"
                  placeholder="Current workplace"
                  value={formData.hospital}
                  onChangeText={(text) => handleInputChange('hospital', text)}
                  icon="business-outline"
                  fieldName="hospital"
                />
              </View>
              
              <View className={screenWidth > 360 ? "flex-1" : ""}>
                <CustomTextInput
                  label="Experience (years)"
                  placeholder="Years"
                  value={formData.experience}
                  onChangeText={(text) => handleInputChange('experience', text)}
                  keyboardType="numeric"
                  icon="time-outline"
                  fieldName="experience"
                />
              </View>
            </View>

            <CustomTextInput
              label="Qualifications"
              placeholder="Degrees, certifications"
              value={formData.qualifications}
              onChangeText={(text) => handleInputChange('qualifications', text)}
              multiline={true}
              numberOfLines={2}
              icon="ribbon-outline"
              fieldName="qualifications"
            />

            <CustomTextInput
              label="Consultation Fee ($)"
              placeholder="Enter consultation fee"
              value={formData.consultationFee}
              onChangeText={(text) => handleInputChange('consultationFee', text)}
              keyboardType="numeric"
              icon="card-outline"
              fieldName="consultationFee"
            />
          </View>
        );

      case 'medical':
        return (
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center mb-4">
              <Ionicons name="people" size={24} color="#3B82F6" style={{ marginRight: 8 }} />
              <Text className={`${isSmallScreen ? 'text-base' : 'text-lg'} font-semibold text-gray-800 dark:text-white`}>
                Staff Information
              </Text>
            </View>
            
            <CustomTextInput
              label="Staff ID"
              placeholder="Enter staff ID"
              value={formData.staffId}
              onChangeText={(text) => handleInputChange('staffId', text)}
              required={true}
              icon="id-card-outline"
              fieldName="staffId"
            />

            <View className={screenWidth > 360 ? "flex-row space-x-4" : ""}>
              <View className={screenWidth > 360 ? "flex-1" : ""}>
                <CustomTextInput
                  label="Department"
                  placeholder="Enter department"
                  value={formData.department}
                  onChangeText={(text) => handleInputChange('department', text)}
                  required={true}
                  icon="business-outline"
                  fieldName="department"
                />
              </View>
              
              <View className={screenWidth > 360 ? "flex-1" : ""}>
                <CustomTextInput
                  label="Position"
                  placeholder="Job position"
                  value={formData.position}
                  onChangeText={(text) => handleInputChange('position', text)}
                  required={true}
                  icon="briefcase-outline"
                  fieldName="position"
                />
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar 
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} 
        backgroundColor="#F9FAFB" 
      />
      <ScrollView 
        className={`flex-1 ${isSmallScreen ? 'px-3 py-4' : isMediumScreen ? 'px-4 py-5' : 'px-5 py-6'}`}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View className={`${isSmallScreen ? 'mb-6' : 'mb-8'} mt-4`}>
          <View className="items-center mb-4">
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-full p-4 mb-4"
              style={{
                borderRadius: 24,
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Ionicons name="person-add" size={32} color="white" />
            </LinearGradient>
          </View>
          <Text className={`${isSmallScreen ? 'text-2xl' : 'text-3xl'} font-bold text-gray-800 dark:text-white text-center mb-2`}>
            Create Account
          </Text>
          <Text className={`${isSmallScreen ? 'text-sm' : 'text-base'} text-gray-600 dark:text-gray-300 text-center`}>
            Join our healthcare platform today
          </Text>
        </View>

        {/* Progress Indicator */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-600 dark:text-gray-400">Registration Progress</Text>
            <Text className="text-sm text-blue-600 dark:text-blue-400 font-medium">Step 1 of 1</Text>
          </View>
          <View className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <View className="bg-blue-600 h-2 rounded-full w-full" />
          </View>
        </View>

        {/* Role Selection */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <Text className={`${isSmallScreen ? 'text-base' : 'text-lg'} font-semibold text-gray-800 dark:text-white mb-4`}>
            Register as
          </Text>
          <View className={screenWidth < 360 ? "space-y-2" : "flex-row space-x-2"}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.key}
                className={`${screenWidth < 360 ? 'w-full mb-2' : 'flex-1'} flex-row items-center justify-center py-3 px-4 rounded-xl border-2 ${
                  selectedRole === role.key
                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                }`}
                onPress={() => handleRoleChange(role.key)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={role.icon}
                  size={isSmallScreen ? 18 : 20}
                  color={selectedRole === role.key ? '#3B82F6' : '#9CA3AF'}
                  style={{ marginRight: 8 }}
                />
                <Text
                  className={`font-medium ${isSmallScreen ? 'text-sm' : 'text-base'} ${
                    selectedRole === role.key
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {role.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Personal Information Section */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <Ionicons name="person" size={24} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text className={`${isSmallScreen ? 'text-base' : 'text-lg'} font-semibold text-gray-800 dark:text-white`}>
              Personal Information
            </Text>
          </View>
          
          <View className={screenWidth > 360 ? "flex-row space-x-4" : ""}>
            <View className={screenWidth > 360 ? "flex-1" : ""}>
              <CustomTextInput
                label="First Name"
                placeholder="Enter first name"
                value={formData.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
                required={true}
                autoCapitalize="words"
                fieldName="firstName"
              />
            </View>
            
            <View className={screenWidth > 360 ? "flex-1" : ""}>
              <CustomTextInput
                label="Last Name"
                placeholder="Enter last name"
                value={formData.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
                required={true}
                autoCapitalize="words"
                fieldName="lastName"
              />
            </View>
          </View>

          <CustomTextInput
            label="Email Address"
            placeholder="Enter email address"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            required={true}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
            fieldName="email"
          />

          <CustomTextInput
            label="Phone Number"
            placeholder="Enter phone number"
            value={formData.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
            required={true}
            keyboardType="phone-pad"
            icon="call-outline"
            fieldName="phone"
          />
        </View>

        {/* Security Section */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <Ionicons name="lock-closed" size={24} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text className={`${isSmallScreen ? 'text-base' : 'text-lg'} font-semibold text-gray-800 dark:text-white`}>
              Security Information
            </Text>
          </View>
          
          <CustomTextInput
            label="Password"
            placeholder="Enter password (min 6 characters)"
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            required={true}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            fieldName="password"
            rightElement={
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            }
          />

          <CustomTextInput
            label="Confirm Password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
            required={true}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            fieldName="confirmPassword"
            rightElement={
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            }
          />
          
          {/* Password Strength Indicator */}
          <PasswordStrengthIndicator password={formData.password} />
        </View>

        {/* Role-Specific Fields */}
        {renderRoleSpecificFields()}

        {/* Address Information Section */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <Ionicons name="location" size={24} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text className={`${isSmallScreen ? 'text-base' : 'text-lg'} font-semibold text-gray-800 dark:text-white`}>
              Address Information
            </Text>
          </View>
          
          <CustomTextInput
            label="Address"
            placeholder="Enter full address"
            value={formData.address}
            onChangeText={(text) => handleInputChange('address', text)}
            multiline={true}
            numberOfLines={2}
            icon="home-outline"
            fieldName="address"
          />

          <View className={screenWidth > 360 ? "flex-row space-x-4" : ""}>
            <View className={screenWidth > 360 ? "flex-1" : ""}>
              <CustomTextInput
                label="City"
                placeholder="Enter city"
                value={formData.city}
                onChangeText={(text) => handleInputChange('city', text)}
                autoCapitalize="words"
                fieldName="city"
              />
            </View>
            
            <View className={screenWidth > 360 ? "flex-1" : ""}>
              <CustomTextInput
                label="State"
                placeholder="Enter state"
                value={formData.state}
                onChangeText={(text) => handleInputChange('state', text)}
                autoCapitalize="words"
                fieldName="state"
              />
            </View>
          </View>

          <CustomTextInput
            label="ZIP Code"
            placeholder="Enter ZIP code"
            value={formData.zipCode}
            onChangeText={(text) => handleInputChange('zipCode', text)}
            keyboardType="numeric"
            fieldName="zipCode"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="rounded-xl mb-6 active:scale-95"
          onPress={handleSubmit}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#3B82F6', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-xl py-4"
            style={{
              borderRadius: 24,
              shadowColor: '#3B82F6',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons 
                name="checkmark-circle-outline" 
                size={24} 
                color="white" 
                style={{ marginRight: 8 }} 
              />
              <Text className={`text-white text-center ${isSmallScreen ? 'text-base' : 'text-lg'} font-semibold`}>
                Register as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Login Link */}
        <View className="flex-row justify-center items-center mb-8">
          <Text className={`${isSmallScreen ? 'text-sm' : 'text-base'} text-gray-600 dark:text-gray-400`}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => {
              // Navigate to login screen
              console.log('Navigate to Sign In');
            }}
          >
            <Text className={`${isSmallScreen ? 'text-sm' : 'text-base'} text-blue-600 dark:text-blue-400 font-semibold`}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <View className="items-center mb-6">
          <Text className={`${isSmallScreen ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400 text-center px-4`}>
            By registering, you agree to our{' '}
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => console.log('Open Terms of Service')}
            >
              <Text className="text-blue-600 dark:text-blue-400">Terms of Service</Text>
            </TouchableOpacity>
            {' '}and{' '}
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => console.log('Open Privacy Policy')}
            >
              <Text className="text-blue-600 dark:text-blue-400">Privacy Policy</Text>
            </TouchableOpacity>
          </Text>
        </View>

        {/* Help Section */}
        <View className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-4 border border-blue-200 dark:border-blue-800">
          <View className="flex-row items-center mb-2">
            <Ionicons name="help-circle-outline" size={20} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text className={`${isSmallScreen ? 'text-sm' : 'text-base'} font-medium text-blue-800 dark:text-blue-200`}>
              Need Help?
            </Text>
          </View>
          <Text className={`${isSmallScreen ? 'text-xs' : 'text-sm'} text-blue-700 dark:text-blue-300`}>
            Having trouble with registration? Contact our support team at support@healthcare.com or call 1-800-HEALTH.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegistrationPage;