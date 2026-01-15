// // src/screens/User/NoticeDetailScreen.jsx
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Share,
//   Linking,
//   ActivityIndicator,
//   Dimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
// import * as WebBrowser from "expo-web-browser";
// import CustomHeader from "../../components/CustomHeader";

// const { width, height } = Dimensions.get("window");

// export default function NoticeDetailScreen({ route, navigation }) {
//   const { notice } = route.params;
//   const [downloading, setDownloading] = useState(false);
//   const [pdfViewerVisible, setPdfViewerVisible] = useState(false);

//   // Get category icon
//   const getCategoryIcon = (category) => {
//     const icons = {
//       Announcement: "megaphone",
//       Academic: "school",
//       Event: "calendar",
//       Holiday: "sunny",
//       Exam: "document-text",
//       Result: "trophy",
//       Admission: "person-add",
//       Other: "information-circle",
//     };
//     return icons[category] || "newspaper";
//   };

//   // Get category color
//   const getCategoryColor = (category) => {
//     const colors = {
//       Announcement: { bg: "bg-blue-500", light: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
//       Academic: { bg: "bg-purple-500", light: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
//       Event: { bg: "bg-green-500", light: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" },
//       Holiday: { bg: "bg-orange-500", light: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
//       Exam: { bg: "bg-red-500", light: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400" },
//       Result: { bg: "bg-yellow-500", light: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400" },
//       Admission: { bg: "bg-indigo-500", light: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400" },
//       Other: { bg: "bg-gray-500", light: "bg-gray-100 dark:bg-gray-700", text: "text-gray-600 dark:text-gray-400" },
//     };
//     return colors[category] || colors.Other;
//   };

//   const colors = getCategoryColor(notice.category);

//   // Format date
//   const formatFullDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // Handle PDF View
//   const handleViewPDF = async () => {
//     if (!notice.pdfFileId) {
//       Alert.alert("No PDF", "This notice doesn't have an attached PDF");
//       return;
//     }

//     try {
//       // In production: Fetch PDF from Google Drive using pdfFileId
//       // const driveUrl = `https://drive.google.com/file/d/${notice.pdfFileId}/view`;
      
//       // For now, simulate opening PDF
//       Alert.alert(
//         "View PDF",
//         "In production, this would open the PDF viewer",
//         [
//           { text: "Cancel", style: "cancel" },
//           {
//             text: "Open",
//             onPress: async () => {
//               // Simulate PDF opening
//               // In production: Use WebBrowser or PDF viewer component
//               // await WebBrowser.openBrowserAsync(driveUrl);
//               Alert.alert("PDF Viewer", "PDF would open here in production");
//             },
//           },
//         ]
//       );
//     } catch (error) {
//       Alert.alert("Error", "Failed to open PDF");
//     }
//   };

//   // Handle PDF Download
//   const handleDownloadPDF = async () => {
//     if (!notice.pdfFileId) {
//       Alert.alert("No PDF", "This notice doesn't have an attached PDF");
//       return;
//     }

//     setDownloading(true);

//     try {
//       // In production: Download from Google Drive
//       // 1. Get download URL from Google Drive API
//       // 2. Download file to local storage
//       // 3. Save to Downloads folder

//       // Simulate download
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       Alert.alert(
//         "Success",
//         `${notice.pdfFileName || "Notice.pdf"} has been downloaded`,
//         [
//           {
//             text: "OK",
//             onPress: () => {
//               // In production: Open file or show in file manager
//             },
//           },
//         ]
//       );
//     } catch (error) {
//       Alert.alert("Error", "Failed to download PDF");
//     } finally {
//       setDownloading(false);
//     }
//   };

//   // Handle Share
//   const handleShare = async () => {
//     try {
//       await Share.share({
//         message: `${notice.title}\n\n${notice.description}\n\nPosted on: ${formatFullDate(notice.createdAt)}`,
//         title: notice.title,
//       });
//     } catch (error) {
//       Alert.alert("Error", "Failed to share notice");
//     }
//   };

//   // Handle Bookmark
//   const handleBookmark = () => {
//     Alert.alert("Bookmarked", "Notice has been bookmarked");
//     // In production: Save to bookmarks in database
//   };

//   return (
//     <View className="flex-1 bg-gray-50 dark:bg-gray-900">
//       <CustomHeader
//         title="Notice Details"
//         showBack
//         showMenu
//         rightButton={
//           <View className="flex-row">
//             <TouchableOpacity onPress={handleBookmark} className="mr-3">
//               <Ionicons name="bookmark-outline" size={24} color="#6B7280" />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={handleShare}>
//               <Ionicons name="share-social-outline" size={24} color="#6B7280" />
//             </TouchableOpacity>
//           </View>
//         }
//       />

//       <ScrollView className="flex-1">
//         {/* Header Card */}
//         <View className={`${colors.bg} p-6 shadow-lg`}>
//           <View className="flex-row items-start mb-4">
//             <View className="bg-white/20 w-16 h-16 rounded-2xl items-center justify-center mr-4">
//               <Ionicons
//                 name={getCategoryIcon(notice.category)}
//                 size={32}
//                 color="white"
//               />
//             </View>
//             <View className="flex-1">
//               <View className="bg-white/20 px-3 py-1 rounded-full self-start mb-2">
//                 <Text className="text-white text-xs font-bold uppercase">
//                   {notice.category || "Notice"}
//                 </Text>
//               </View>
//               <Text className="text-white text-sm opacity-90">
//                 {formatFullDate(notice.createdAt)}
//               </Text>
//             </View>
//           </View>

//           <Text className="text-white text-2xl font-bold leading-tight">
//             {notice.title}
//           </Text>
//         </View>

//         {/* Content Section */}
//         <View className="px-6 py-6">
//           {/* Description */}
//           {notice.description && (
//             <View className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-4 shadow-sm">
//               <View className="flex-row items-center mb-3">
//                 <Ionicons name="document-text-outline" size={20} color="#6B7280" />
//                 <Text className="text-gray-700 dark:text-gray-300 font-bold ml-2">
//                   Description
//                 </Text>
//               </View>
//               <Text className="text-gray-700 dark:text-gray-300 leading-6">
//                 {notice.description}
//               </Text>
//             </View>
//           )}

//           {/* Full Content (if available) */}
//           {notice.content && (
//             <View className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-4 shadow-sm">
//               <View className="flex-row items-center mb-3">
//                 <Ionicons name="reader-outline" size={20} color="#6B7280" />
//                 <Text className="text-gray-700 dark:text-gray-300 font-bold ml-2">
//                   Full Details
//                 </Text>
//               </View>
//               <Text className="text-gray-700 dark:text-gray-300 leading-7">
//                 {notice.content}
//               </Text>
//             </View>
//           )}

//           {/* PDF Attachment */}
//           {notice.pdfFileId && (
//             <View className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-4 shadow-sm">
//               <View className="flex-row items-center mb-4">
//                 <Ionicons name="attach" size={20} color="#6B7280" />
//                 <Text className="text-gray-700 dark:text-gray-300 font-bold ml-2">
//                   Attachment
//                 </Text>
//               </View>

//               <View className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
//                 <View className="flex-row items-center mb-3">
//                   <View className="bg-green-500 w-12 h-12 rounded-xl items-center justify-center">
//                     <Ionicons name="document-text" size={24} color="white" />
//                   </View>
//                   <View className="flex-1 ml-3">
//                     <Text className="text-gray-800 dark:text-white font-bold">
//                       {notice.pdfFileName || "Notice Document.pdf"}
//                     </Text>
//                     <View className="flex-row items-center mt-1">
//                       <Text className="text-gray-600 dark:text-gray-400 text-sm">
//                         PDF Document
//                       </Text>
//                       {notice.pdfFileSize && (
//                         <>
//                           <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
//                           <Text className="text-gray-600 dark:text-gray-400 text-sm">
//                             {(notice.pdfFileSize / 1024).toFixed(1)} MB
//                           </Text>
//                         </>
//                       )}
//                     </View>
//                   </View>
//                 </View>

//                 {/* Action Buttons */}
//                 <View className="flex-row">
//                   <TouchableOpacity
//                     onPress={handleViewPDF}
//                     className="flex-1 bg-green-500 rounded-lg py-3 mr-2 flex-row items-center justify-center"
//                   >
//                     <Ionicons name="eye" size={18} color="white" />
//                     <Text className="text-white font-semibold ml-2">View PDF</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     onPress={handleDownloadPDF}
//                     disabled={downloading}
//                     className="flex-1 bg-white dark:bg-gray-700 border border-green-500 rounded-lg py-3 flex-row items-center justify-center"
//                   >
//                     {downloading ? (
//                       <ActivityIndicator color="#10B981" />
//                     ) : (
//                       <>
//                         <Ionicons name="download" size={18} color="#10B981" />
//                         <Text className="text-green-600 dark:text-green-400 font-semibold ml-2">
//                           Download
//                         </Text>
//                       </>
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           )}

//           {/* Additional Information */}
//           {(notice.contactEmail || notice.contactPhone || notice.department) && (
//             <View className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-4 shadow-sm">
//               <View className="flex-row items-center mb-4">
//                 <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
//                 <Text className="text-gray-700 dark:text-gray-300 font-bold ml-2">
//                   Contact Information
//                 </Text>
//               </View>

//               {notice.department && (
//                 <View className="flex-row items-center mb-3">
//                   <Ionicons name="business-outline" size={18} color="#9CA3AF" />
//                   <Text className="text-gray-700 dark:text-gray-300 ml-3">
//                     {notice.department}
//                   </Text>
//                 </View>
//               )}

//               {notice.contactEmail && (
//                 <TouchableOpacity
//                   onPress={() => Linking.openURL(`mailto:${notice.contactEmail}`)}
//                   className="flex-row items-center mb-3"
//                 >
//                   <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
//                   <Text className="text-blue-600 dark:text-blue-400 ml-3 underline">
//                     {notice.contactEmail}
//                   </Text>
//                 </TouchableOpacity>
//               )}

//               {notice.contactPhone && (
//                 <TouchableOpacity
//                   onPress={() => Linking.openURL(`tel:${notice.contactPhone}`)}
//                   className="flex-row items-center"
//                 >
//                   <Ionicons name="call-outline" size={18} color="#9CA3AF" />
//                   <Text className="text-blue-600 dark:text-blue-400 ml-3 underline">
//                     {notice.contactPhone}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}

//           {/* Metadata */}
//           <View className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
//             <View className="flex-row items-center justify-between mb-3">
//               <View className="flex-row items-center">
//                 <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
//                 <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">
//                   Published
//                 </Text>
//               </View>
//               <Text className="text-gray-800 dark:text-white font-semibold">
//                 {formatFullDate(notice.createdAt)}
//               </Text>
//             </View>

//             <View className="flex-row items-center justify-between mb-3">
//               <View className="flex-row items-center">
//                 <Ionicons name="time-outline" size={16} color="#9CA3AF" />
//                 <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">
//                   Time
//                 </Text>
//               </View>
//               <Text className="text-gray-800 dark:text-white font-semibold">
//                 {formatTime(notice.createdAt)}
//               </Text>
//             </View>

//             <View className="flex-row items-center justify-between">
//               <View className="flex-row items-center">
//                 <Ionicons name="eye-outline" size={16} color="#9CA3AF" />
//                 <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">
//                   Views
//                 </Text>
//               </View>
//               <Text className="text-gray-800 dark:text-white font-semibold">
//                 {notice.views || 0} views
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Bottom Padding */}
//         <View className="h-6" />
//       </ScrollView>

//       {/* Bottom Action Bar */}
//       <View className="bg-white dark:bg-gray-800 px-6 py-4 shadow-lg flex-row">
//         <TouchableOpacity
//           onPress={handleShare}
//           className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg py-3 mr-2 flex-row items-center justify-center"
//         >
//           <Ionicons name="share-social" size={20} color="#6B7280" />
//           <Text className="text-gray-700 dark:text-gray-300 font-semibold ml-2">
//             Share
//           </Text>
//         </TouchableOpacity>

//         {notice.pdfFileId && (
//           <TouchableOpacity
//             onPress={handleDownloadPDF}
//             disabled={downloading}
//             className="flex-1 bg-green-500 rounded-lg py-3 flex-row items-center justify-center"
//           >
//             {downloading ? (
//               <ActivityIndicator color="white" />
//             ) : (
//               <>
//                 <Ionicons name="download" size={20} color="white" />
//                 <Text className="text-white font-semibold ml-2">Download PDF</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// }