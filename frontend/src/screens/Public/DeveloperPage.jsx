// DeveloperPage.jsx - Professional Developer Portfolio Page
import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import NavLayout from "@/src/components/Navbar/NavLayout";

const { width } = Dimensions.get("window");

export default function DeveloperPage() {
  const services = [
    {
      icon: "phone-portrait",
      title: "Mobile App Development",
      description: "Native iOS & Android apps with React Native and Flutter",
      color: "#3B82F6",
    },
    {
      icon: "globe",
      title: "Web Development",
      description:
        "Responsive websites with modern frameworks and technologies",
      color: "#10B981",
    },
    {
      icon: "server",
      title: "Backend Solutions",
      description: "Scalable APIs and database architecture for your business",
      color: "#8B5CF6",
    },
    {
      icon: "analytics",
      title: "UI/UX Design",
      description: "Beautiful and intuitive user interfaces that convert",
      color: "#F59E0B",
    },
  ];

  const techStack = [
    { name: "React Native", icon: "logo-react", color: "#61DAFB" },
    { name: "React.js", icon: "logo-react", color: "#61DAFB" },
    { name: "Node.js", icon: "logo-nodejs", color: "#339933" },
    { name: "JavaScript", icon: "logo-javascript", color: "#F7DF1E" },
    { name: "MongoDB", icon: "server", color: "#47A248" },
    { name: "Firebase", icon: "flame", color: "#FFCA28" },
  ];

  const stats = [
    { value: "13+", label: "Projects Completed" },
    { value: "10+", label: "Happy Clients" },
    { value: "2+", label: "Years Experience" },
    // { value: "100%", label: "Satisfaction Rate" },
  ];

  const handleContact = (type) => {
    switch (type) {
      case "email":
        Linking.openURL("mailto:gauravrathour0786@gmail.com");
        break;
      case "phone":
        Linking.openURL("tel:+919306341448");
        break;
      case "whatsapp":
        Linking.openURL("https://wa.me/+919306341448");
        break;
      case "github":
        Linking.openURL("https://github.com/H4CK3R-CODING");
        break;
      case "twitter":
        Linking.openURL("https://x.com/Gaurav965393421");
        break;
      case "linkedin":
        Linking.openURL(
          "https://www.linkedin.com/in/gaurav-rathour-85b878264/"
        );
        break;
    }
  };

  return (
    <NavLayout title={"Developer"}>
      <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <LinearGradient
          colors={["#f8fafc", "#ffffff", "#e2e8f0"]}
          className="flex-1 dark:hidden"
        />

        <LinearGradient
          colors={["#020617", "#020617", "#0f172a"]}
          className="absolute inset-0 hidden dark:flex"
        />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center px-6 py-12">
            {/* PROFILE IMAGE */}
            <View className="items-center mb-8">
              <View className="relative shadow-2xl">
                <View
                  className="p-1 rounded-[28px] bg-blue-600 dark:bg-gradient-to-r dark:from-blue-500 dark:to-cyan-400"
                  style={{ borderRadius: 28 }}
                >
                  <Image
                    source={{
                      uri: "https://firebasestorage.googleapis.com/v0/b/portfolio-22162.appspot.com/o/SR_Shields%2FDSC_5421%20(1).jpg?alt=media&token=ca491eb2-bad0-48ab-9e5f-75aec6f1318d",
                    }}
                    className="w-44 h-44 rounded-[24px]"
                    style={{ borderRadius: 24 }}
                  />
                </View>

                {/* VERIFIED BADGE */}
                <View className="absolute -bottom-3 -right-3 w-12 h-12 items-center justify-center bg-green-600 dark:bg-green-500 shadow-xl rounded-[14px]">
                  <Ionicons name="shield-checkmark" size={24} color="white" />
                </View>
              </View>

              {/* STATUS */}
              <View className="flex-row items-center mt-4 px-4 py-1 rounded-full bg-green-100 dark:bg-green-500/10">
                <View className="w-2 h-2 rounded-full mr-2 bg-green-600 dark:bg-green-400" />
                <Text className="text-xs font-semibold text-green-700 dark:text-green-400">
                  Available for Projects
                </Text>
              </View>
            </View>

            {/* NAME */}
            <Text className="text-4xl font-extrabold text-center tracking-wide text-gray-900 dark:text-white">
              Gaurav Rathour
            </Text>

            {/* ROLE */}
            <Text className="text-lg font-semibold text-center mt-2 text-blue-600 dark:text-blue-400">
              Software Development Engineer
            </Text>

            {/* BIO */}
            <Text className="text-center leading-6 mt-6 max-w-xl self-center text-gray-600 dark:text-gray-400">
              Transforming ideas into powerful digital solutions. I specialize
              in building high-performance mobile apps and scalable web
              platforms that drive business growth and deliver exceptional user
              experiences.
            </Text>

            {/* SOCIAL BUTTONS */}
            <View className="flex-row justify-center gap-4 mt-8">
              {[
                { icon: "logo-linkedin", color: "#0A66C2", type: "linkedin" },
                { icon: "logo-github", color: "#000000", type: "github" },
                { icon: "logo-twitter", color: "#1DA1F2", type: "twitter" },
                { icon: "mail", color: "#EA4335", type: "email" },
              ].map((social, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleContact(social.type)}
                  activeOpacity={0.8}
                  className="w-14 h-14 items-center justify-center rounded-[16px] border bg-white dark:bg-white/5 border-gray-200 dark:border-white/10"
                >
                  <Ionicons
                    name={social.icon}
                    size={24}
                    color={social.type === "github" ? undefined : social.color}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* STATS */}
            <View className="flex-row flex-wrap justify-center gap-4 mt-10">
              {stats.map((stat, index) => (
                <View
                  key={index}
                  className="px-8 py-4 min-w-[120px] items-center rounded-[16px] border bg-white dark:bg-white/5 border-gray-200 dark:border-white/10"
                >
                  <Text className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {stat.value}
                  </Text>
                  <Text className="text-xs mt-1 tracking-wide uppercase text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Services Section */}
        <View className="px-6 py-8">
          <View className="flex-row items-center mb-6">
            <View className="bg-blue-500 w-1 h-8 mr-3" />
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Services I Offer
            </Text>
          </View>

          {services.map((service, index) => (
            <View
              key={index}
              className="bg-white dark:bg-gray-800 p-6 mb-4 shadow-md border border-gray-100 dark:border-gray-700"
              style={{ borderRadius: 16 }}
            >
              <View className="flex-row items-start">
                <View
                  style={{
                    backgroundColor: service.color + "15",
                    borderRadius: 14,
                  }}
                  className="w-16 h-16 items-center justify-center mr-4"
                >
                  <Ionicons
                    name={service.icon}
                    size={32}
                    color={service.color}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 leading-5">
                    {service.description}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Tech Stack */}
        <View className="px-6 py-4 bg-white dark:bg-gray-800">
          <View className="flex-row items-center mb-6">
            <View className="bg-purple-500 w-1 h-8 mr-3" />
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Tech Stack
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {techStack.map((tech, index) => (
              <View
                key={index}
                className="bg-gray-50 dark:bg-gray-700 px-5 py-4 flex-row items-center border border-gray-200 dark:border-gray-600"
                style={{ borderRadius: 12 }}
              >
                <Ionicons name={tech.icon} size={24} color={tech.color} />
                <Text className="text-gray-800 dark:text-gray-200 font-semibold ml-2">
                  {tech.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Why Choose Me */}
        <View className="px-6 py-8">
          <View className="flex-row items-center mb-6">
            <View className="bg-green-500 w-1 h-8 mr-3" />
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Why Choose Me?
            </Text>
          </View>

          <View
            className="bg-white dark:bg-gray-800 p-6 shadow-md border border-gray-100 dark:border-gray-700"
            style={{ borderRadius: 16 }}
          >
            {[
              {
                icon: "cash",
                title: "Effective Pricing",
                desc: "Competitive rates that fit your budget without compromising quality",
              },
              {
                icon: "flash",
                title: "Fast Delivery",
                desc: "Quick turnaround time while maintaining high standards",
              },
              {
                icon: "shield-checkmark",
                title: "Quality Guaranteed",
                desc: "Clean code, best practices, and thorough testing",
              },
              {
                icon: "headset",
                title: "24/7 Support",
                desc: "Ongoing support and maintenance after project completion",
              },
            ].map((item, index) => (
              <View key={index} className={index !== 3 ? "mb-6" : ""}>
                <View className="flex-row items-start">
                  <View
                    className="bg-green-100 dark:bg-green-900/30 w-12 h-12 items-center justify-center mr-4"
                    style={{ borderRadius: 10 }}
                  >
                    <Ionicons name={item.icon} size={24} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-400 leading-5">
                      {item.desc}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View
          className="px-6 py-10 bg-blue-600 dark:bg-blue-700 mx-6 mb-8 shadow-xl"
          style={{ borderRadius: 20 }}
        >
          <View className="items-center">
            <View
              className="bg-white/20 w-24 h-24 items-center justify-center mb-5"
              style={{ borderRadius: 16 }}
            >
              <Ionicons name="rocket" size={48} color="white" />
            </View>
            <Text className="text-3xl font-bold text-white mb-4 text-center">
              Ready to Start Your Project?
            </Text>
            <Text className="text-blue-100 text-center mb-8 leading-6 px-4 text-base">
              Let's discuss your ideas and create something amazing together.
              Get a free consultation and quote today!
            </Text>

            <View className="w-full space-y-4 gap-2">
              <TouchableOpacity
                onPress={() => handleContact("email")}
                className="bg-white py-5 px-6 flex-row items-center justify-center shadow-lg"
                style={{ borderRadius: 14 }}
                activeOpacity={0.8}
              >
                <Ionicons name="mail" size={26} color="#3B82F6" />
                <Text className="text-blue-600 font-bold text-lg ml-3">
                  Send Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleContact("whatsapp")}
                className="bg-green-500 py-5 px-6 flex-row items-center justify-center shadow-lg"
                style={{ borderRadius: 14 }}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-whatsapp" size={26} color="white" />
                <Text className="text-white font-bold text-lg ml-3">
                  Chat on WhatsApp
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleContact("phone")}
                className="bg-white/20 border-2 border-white py-5 px-6 flex-row items-center justify-center"
                style={{ borderRadius: 14 }}
                activeOpacity={0.8}
              >
                <Ionicons name="call" size={26} color="white" />
                <Text className="text-white font-bold text-lg ml-3">
                  Call Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Testimonial Badge */}
        {/* <View className="px-6 pb-10">
          <View
            className="bg-white dark:bg-gray-800 p-8 shadow-lg border border-gray-100 dark:border-gray-700"
            style={{ borderRadius: 16 }}
          >
            <View className="items-center">
              <View className="flex-row mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons key={star} name="star" size={28} color="#F59E0B" />
                ))}
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                Trusted by Businesses Worldwide
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center leading-6 mb-4">
                "Exceptional work quality and professional service. Delivered
                our mobile app ahead of schedule with features that exceeded our
                expectations!"
              </Text>
              <Text className="text-blue-600 dark:text-blue-400 font-semibold">
                - Sarah Johnson, CEO TechStart
              </Text>
            </View>
          </View>
        </View> */}

        {/* Bottom Spacer */}
        <View className="h-4" />
      </ScrollView>
    </NavLayout>
  );
}
