import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // Common
      app_name: "AgroSakhi 3.0",
      greeting: "Good day",
      location: "Location",
      language: "Language",
      language_selector: "Select language",
      
      // Navigation
      nav_home: "Home",
      nav_devices: "Devices",
      nav_market: "Market",
      nav_learn: "Learn",
      nav_dashboard: "Dashboard",
      
      // Weather
      weather_title: "Today's Weather",
      weather_condition_sunny: "Sunny",
      weather_condition_cloudy: "Cloudy",
      weather_condition_rainy: "Rainy",
      weather_humidity: "Humidity",
      weather_forecast: "5-Day Forecast",
      
      // Farm Health
      farm_health: "Farm Health",
      view_all: "View all",
      soil_moisture: "Soil Moisture",
      soil_temperature: "Soil Temp",
      light_level: "Light Level",
      soil_ph: "Soil pH",
      status_good: "Good",
      status_high: "High",
      status_low: "Low",
      
      // Tasks
      tasks_title: "Today's Tasks",
      add_task: "Add New Task",
      
      // Crop Recommendations
      crop_recommendations: "Crop Recommendations",
      crop_recommendation_subtitle: "Based on your soil conditions and local climate:",
      view_all_recommendations: "View All Recommendations",
      match: "Match",
      
      // IoT Devices
      devices_title: "IoT Devices",
      your_devices: "Your Devices",
      add_device: "Add Device",
      battery: "Battery",
      online: "Online",
      offline: "Offline",
      low_signal: "Low Signal",
      
      // Sensor Readings
      sensor_readings: "Sensor Readings",
      time_range_day: "Day",
      time_range_week: "Week",
      time_range_month: "Month",
      min: "Min",
      max: "Max",
      average: "Average",
      view_all_sensor_data: "View All Sensor Data",
      
      // Alert Settings
      alert_settings: "Alert Settings",
      low_moisture_alert: "Low Moisture Alert",
      high_temperature_alert: "High Temperature Alert",
      pest_detection_alert: "Pest Detection Alert",
      low_battery_alert: "Low Battery Alert",
      customize_alerts: "Customize Alerts",
      
      // Marketplace
      marketplace_title: "AgroChain Marketplace",
      market_summary: "Market Summary",
      today_msp: "Today's MSP",
      market_price: "Market Price",
      price_trend: "Price Trend",
      
      // Blockchain
      blockchain_traceability: "Blockchain Traceability",
      harvest_recorded: "Harvest Recorded",
      quality_check: "Quality Check",
      market_listing: "Market Listing",
      view_traceability: "View Full Traceability",
      
      // Marketplace Listings
      marketplace: "Marketplace",
      new_listing: "New Listing",
      available: "available",
      verified_organic: "Verified Organic",
      fresh_harvest: "Fresh Harvest",
      blockchain_certified: "Blockchain Certified",
      above_msp: "above MSP",
      contact_seller: "Contact Seller",
      view_all_listings: "View All Listings",
      
      // Learning
      learning_title: "SakhiShakti Academy",
      your_learning: "Your Learning",
      current_course: "Current Course",
      courses_completed: "Courses Completed",
      topics_mastered: "Topics Mastered",
      learning_points: "Learning Points",
      
      // Learning Recommendations
      recommended_for_you: "Recommended For You",
      lessons: "lessons",
      hours: "hours",
      farmers_enrolled: "farmers enrolled",
      start_course: "Start",
      
      // Community Learning
      community_learning: "Community Learning",
      join: "Join",
      register: "Register",
      view_all_community: "View All Community Activities",
      
      // Farm Dashboard
      farm_dashboard: "Farm Dashboard",
      farm_summary: "Farm Summary",
      hectares: "hectares",
      active_crops: "active crops",
      
      // Dashboard Stats
      total_crops: "Total Crops",
      active_iot_devices: "Active IoT Devices",
      projected_harvest: "Projected Harvest",
      est_revenue: "Est. Revenue",
      
      // Crop Status
      crop_status: "Crop Status",
      add_crop: "Add Crop",
      area: "Area",
      planted: "Planted",
      harvest_in: "Harvest In",
      days: "days",
      growth_cycle: "Growth Cycle",
      complete: "Complete",
      needs_attention: "Needs Attention",
      
      // Weather Forecast
      weather_forecast_extended: "10-Day Weather Forecast",
      rainfall_forecast: "Rainfall Forecast",
      
      // Voice Assistant
      voice_assistant: "AgriDidi AI™ Assistant",
      listening: "Listening...",
      speak_now: "Speak now or ask a question",
      try_saying: "Try saying:",
      sample_command_1: "\"Check soil moisture in wheat field\"",
      sample_command_2: "\"What is the weather forecast for tomorrow?\"",
      sample_command_3: "\"Create a task to apply fertilizer\"",
      cancel: "Cancel",
      submit: "Submit"
    }
  },
  hi: {
    translation: {
      // Common
      app_name: "अग्रोसखी 2.0",
      greeting: "नमस्कार",
      location: "स्थान",
      
      // Navigation
      nav_home: "होम",
      nav_devices: "उपकरण",
      nav_market: "बाज़ार",
      nav_learn: "सीखें",
      nav_dashboard: "डैशबोर्ड",
      
      // Weather
      weather_title: "आज का मौसम",
      weather_condition_sunny: "धूप",
      weather_condition_cloudy: "बादल",
      weather_condition_rainy: "वर्षा",
      weather_humidity: "नमी",
      weather_forecast: "5-दिन का पूर्वानुमान",
      
      // Farm Health
      farm_health: "खेत की स्थिति",
      view_all: "सभी देखें",
      soil_moisture: "मिट्टी की नमी",
      soil_temperature: "मिट्टी का तापमान",
      light_level: "प्रकाश स्तर",
      soil_ph: "मिट्टी का पीएच",
      status_good: "अच्छा",
      status_high: "उच्च",
      status_low: "कम",
      
      // Tasks
      tasks_title: "आज के कार्य",
      add_task: "नया कार्य जोड़ें",
      
      // Crop Recommendations
      crop_recommendations: "फसल अनुशंसाएँ",
      crop_recommendation_subtitle: "आपकी मिट्टी और स्थानीय जलवायु के आधार पर:",
      view_all_recommendations: "सभी अनुशंसाएँ देखें",
      match: "मिलान",
      
      // IoT Devices
      devices_title: "IoT उपकरण",
      your_devices: "आपके उपकरण",
      add_device: "उपकरण जोड़ें",
      battery: "बैटरी",
      online: "ऑनलाइन",
      offline: "ऑफलाइन",
      low_signal: "कमजोर सिग्नल",
      
      // Sensor Readings
      sensor_readings: "सेंसर रीडिंग",
      time_range_day: "दिन",
      time_range_week: "सप्ताह",
      time_range_month: "महीना",
      min: "न्यूनतम",
      max: "अधिकतम",
      average: "औसत",
      view_all_sensor_data: "सभी सेंसर डेटा देखें",
      
      // Alert Settings
      alert_settings: "अलर्ट सेटिंग्स",
      low_moisture_alert: "कम नमी अलर्ट",
      high_temperature_alert: "उच्च तापमान अलर्ट",
      pest_detection_alert: "कीट पता अलर्ट",
      low_battery_alert: "कम बैटरी अलर्ट",
      customize_alerts: "अलर्ट अनुकूलित करें",
      
      // Marketplace
      marketplace_title: "अग्रोचेन बाज़ार",
      market_summary: "बाज़ार सारांश",
      today_msp: "आज का MSP",
      market_price: "बाज़ार मूल्य",
      price_trend: "मूल्य प्रवृत्ति",
      
      // Blockchain
      blockchain_traceability: "ब्लॉकचेन ट्रेसेबिलिटी",
      harvest_recorded: "फसल कटाई दर्ज",
      quality_check: "गुणवत्ता जाँच",
      market_listing: "बाज़ार लिस्टिंग",
      view_traceability: "पूरी ट्रेसेबिलिटी देखें",
      
      // Marketplace Listings
      marketplace: "बाज़ार",
      new_listing: "नई लिस्टिंग",
      available: "उपलब्ध",
      verified_organic: "प्रमाणित जैविक",
      fresh_harvest: "ताजा फसल",
      blockchain_certified: "ब्लॉकचेन प्रमाणित",
      above_msp: "MSP से ऊपर",
      contact_seller: "विक्रेता से संपर्क करें",
      view_all_listings: "सभी लिस्टिंग देखें",
      
      // Learning
      learning_title: "सखीशक्ति अकादमी",
      your_learning: "आपका अध्ययन",
      current_course: "वर्तमान पाठ्यक्रम",
      courses_completed: "पूरे किए पाठ्यक्रम",
      topics_mastered: "मास्टर किए विषय",
      learning_points: "अध्ययन अंक",
      
      // Learning Recommendations
      recommended_for_you: "आपके लिए अनुशंसित",
      lessons: "पाठ",
      hours: "घंटे",
      farmers_enrolled: "किसान नामांकित",
      start_course: "शुरू करें",
      
      // Community Learning
      community_learning: "सामुदायिक अध्ययन",
      join: "शामिल हों",
      register: "पंजीकरण करें",
      view_all_community: "सभी सामुदायिक गतिविधियां देखें",
      
      // Farm Dashboard
      farm_dashboard: "खेत डैशबोर्ड",
      farm_summary: "खेत सारांश",
      hectares: "हेक्टेयर",
      active_crops: "सक्रिय फसलें",
      
      // Dashboard Stats
      total_crops: "कुल फसलें",
      active_iot_devices: "सक्रिय IoT उपकरण",
      projected_harvest: "अनुमानित फसल",
      est_revenue: "अनुमानित आय",
      
      // Crop Status
      crop_status: "फसल स्थिति",
      add_crop: "फसल जोड़ें",
      area: "क्षेत्र",
      planted: "बोया गया",
      harvest_in: "कटाई में",
      days: "दिन",
      growth_cycle: "विकास चक्र",
      complete: "पूर्ण",
      needs_attention: "ध्यान की आवश्यकता है",
      
      // Weather Forecast
      weather_forecast_extended: "10-दिन का मौसम पूर्वानुमान",
      rainfall_forecast: "वर्षा पूर्वानुमान",
      
      // Voice Assistant
      voice_assistant: "अग्रिदीदी AI™ सहायक",
      listening: "सुन रहा है...",
      speak_now: "अब बोलें या प्रश्न पूछें",
      try_saying: "ये कहकर देखें:",
      sample_command_1: "\"गेहूं के खेत में मिट्टी की नमी जांचें\"",
      sample_command_2: "\"कल का मौसम पूर्वानुमान क्या है?\"",
      sample_command_3: "\"खाद लगाने का कार्य बनाएं\"",
      cancel: "रद्द करें",
      submit: "जमा करें"
    }
  },
  // Additional Indian languages
  ta: {
    translation: {
      // Common
      app_name: "அக்ரோசாகி 3.0",
      greeting: "வணக்கம்",
      location: "இடம்",
      language: "மொழி",
      language_selector: "மொழியைத் தேர்ந்தெடுக்கவும்",
      
      // Navigation
      nav_home: "முகப்பு",
      nav_devices: "சாதனங்கள்",
      nav_market: "சந்தை",
      nav_learn: "கற்றல்",
      nav_dashboard: "டாஷ்போர்டு",
      
      // Voice Assistant
      voice_assistant: "அக்ரிதிதி AI™ உதவியாளர்",
      listening: "கேட்கிறது...",
      speak_now: "பேசுங்கள் அல்லது கேள்வி கேளுங்கள்",
      try_saying: "இவ்வாறு சொல்லி பாருங்கள்:",
      cancel: "ரத்து",
      submit: "சமர்ப்பி"
    }
  },
  te: {
    translation: {
      // Common
      app_name: "అగ్రోసాఖి 3.0",
      greeting: "నమస్కారం",
      location: "ప్రదేశం",
      language: "భాష",
      language_selector: "భాషను ఎంచుకోండి",
      
      // Navigation
      nav_home: "హోమ్",
      nav_devices: "పరికరాలు",
      nav_market: "మార్కెట్",
      nav_learn: "నేర్చుకోండి",
      nav_dashboard: "డాష్బోర్డ్",
      
      // Voice Assistant
      voice_assistant: "అగ్రిదిది AI™ సహాయకుడు",
      listening: "వింటున్నాను...",
      speak_now: "ఇప్పుడు మాట్లాడండి లేదా ప్రశ్న అడగండి",
      try_saying: "ఇలా చెప్పండి:",
      cancel: "రద్దు",
      submit: "సమర్పించు"
    }
  },
  kn: {
    translation: {
      // Common
      app_name: "ಅಗ್ರೋಸಾಖಿ 3.0",
      greeting: "ನಮಸ್ಕಾರ",
      location: "ಸ್ಥಳ",
      language: "ಭಾಷೆ",
      language_selector: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      
      // Navigation
      nav_home: "ಮುಖಪುಟ",
      nav_devices: "ಸಾಧನಗಳು",
      nav_market: "ಮಾರುಕಟ್ಟೆ",
      nav_learn: "ಕಲಿಕೆ",
      nav_dashboard: "ಡ್ಯಾಶ್ಬೋರ್ಡ್",
      
      // Voice Assistant
      voice_assistant: "ಅಗ್ರಿದಿದಿ AI™ ಸಹಾಯಕ",
      listening: "ಆಲಿಸುತ್ತಿದೆ...",
      speak_now: "ಈಗ ಮಾತನಾಡಿ ಅಥವಾ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ",
      try_saying: "ಹೀಗೆ ಹೇಳಿ ನೋಡಿ:",
      cancel: "ರದ್ದುಮಾಡಿ",
      submit: "ಸಲ್ಲಿಸು"
    }
  },
  ml: {
    translation: {
      // Common
      app_name: "അഗ്രോസഖി 3.0",
      greeting: "നമസ്കാരം",
      location: "സ്ഥലം",
      language: "ഭാഷ",
      language_selector: "ഭാഷ തിരഞ്ഞെടുക്കുക",
      
      // Navigation
      nav_home: "ഹോം",
      nav_devices: "ഉപകരണങ്ങൾ",
      nav_market: "മാർക്കറ്റ്",
      nav_learn: "പഠനം",
      nav_dashboard: "ഡാഷ്ബോർഡ്",
      
      // Voice Assistant
      voice_assistant: "അഗ്രിദിദി AI™ അസിസ്റ്റന്റ്",
      listening: "കേൾക്കുന്നു...",
      speak_now: "ഇപ്പോൾ സംസാരിക്കുക അല്ലെങ്കിൽ ചോദ്യം ചോദിക്കുക",
      try_saying: "ഇങ്ങനെ പറഞ്ഞു നോക്കൂ:",
      cancel: "റദ്ദാക്കുക",
      submit: "സമർപ്പിക്കുക"
    }
  },
  mr: {
    translation: {
      // Common
      app_name: "अग्रोसखी 3.0",
      greeting: "नमस्कार",
      location: "स्थान",
      language: "भाषा",
      language_selector: "भाषा निवडा",
      
      // Navigation
      nav_home: "मुख्यपृष्ठ",
      nav_devices: "उपकरणे",
      nav_market: "बाजार",
      nav_learn: "शिका",
      nav_dashboard: "डॅशबोर्ड",
      
      // Voice Assistant
      voice_assistant: "अग्रिदिदी AI™ सहाय्यक",
      listening: "ऐकत आहे...",
      speak_now: "आता बोला किंवा प्रश्न विचारा",
      try_saying: "असे म्हणून पहा:",
      cancel: "रद्द करा",
      submit: "सबमिट करा"
    }
  },
  gu: {
    translation: {
      // Common
      app_name: "અગ્રોસાખી 3.0",
      greeting: "નમસ્કાર",
      location: "સ્થાન",
      language: "ભાષા",
      language_selector: "ભાષા પસંદ કરો",
      
      // Navigation
      nav_home: "હોમ",
      nav_devices: "ઉપકરણો",
      nav_market: "બજાર",
      nav_learn: "શીખો",
      nav_dashboard: "ડેશબોર્ડ",
      
      // Voice Assistant
      voice_assistant: "અગ્રિદીદી AI™ સહાયક",
      listening: "સાંભળે છે...",
      speak_now: "હવે બોલો અથવા પ્રશ્ન પૂછો",
      try_saying: "આ રીતે કહી જુઓ:",
      cancel: "રદ કરો",
      submit: "સબમિટ કરો"
    }
  },
  pa: {
    translation: {
      // Common
      app_name: "ਅਗਰੋਸਾਖੀ 3.0",
      greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
      location: "ਸਥਾਨ",
      language: "ਭਾਸ਼ਾ",
      language_selector: "ਭਾਸ਼ਾ ਚੁਣੋ",
      
      // Navigation
      nav_home: "ਹੋਮ",
      nav_devices: "ਉਪਕਰਣ",
      nav_market: "ਮਾਰਕੀਟ",
      nav_learn: "ਸਿੱਖੋ",
      nav_dashboard: "ਡੈਸ਼ਬੋਰਡ",
      
      // Voice Assistant
      voice_assistant: "ਅਗਰੀਦੀਦੀ AI™ ਸਹਾਇਕ",
      listening: "ਸੁਣ ਰਿਹਾ ਹੈ...",
      speak_now: "ਹੁਣ ਬੋਲੋ ਜਾਂ ਸਵਾਲ ਪੁੱਛੋ",
      try_saying: "ਇਹ ਕਹਿ ਕੇ ਦੇਖੋ:",
      cancel: "ਰੱਦ ਕਰੋ",
      submit: "ਜਮ੍ਹਾਂ ਕਰੋ"
    }
  },
  or: {
    translation: {
      // Common
      app_name: "ଆଗ୍ରୋସାଖୀ 3.0",
      greeting: "ନମସ୍କାର",
      location: "ସ୍ଥାନ",
      language: "ଭାଷା",
      language_selector: "ଭାଷା ଚୟନ କରନ୍ତୁ",
      
      // Navigation
      nav_home: "ହୋମ୍",
      nav_devices: "ଉପକରଣ",
      nav_market: "ବଜାର",
      nav_learn: "ଶିଖନ୍ତୁ",
      nav_dashboard: "ଡ୍ୟାସବୋର୍ଡ",
      
      // Voice Assistant
      voice_assistant: "ଆଗ୍ରିଦିଦି AI™ ସହାୟକ",
      listening: "ଶୁଣୁଛି...",
      speak_now: "ଏବେ କୁହନ୍ତୁ କିମ୍ବା ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ",
      try_saying: "ଏହା କହି ଦେଖନ୍ତୁ:",
      cancel: "ବାତିଲ୍",
      submit: "ଦାଖଲ"
    }
  },
  bn: {
    translation: {
      // Common
      app_name: "অ্যাগ্রোসাখী 3.0",
      greeting: "নমস্কার",
      location: "অবস্থান",
      language: "ভাষা",
      language_selector: "ভাষা নির্বাচন করুন",
      
      // Navigation
      nav_home: "হোম",
      nav_devices: "ডিভাইস",
      nav_market: "বাজার",
      nav_learn: "শিখুন",
      nav_dashboard: "ড্যাশবোর্ড",
      
      // Voice Assistant
      voice_assistant: "অ্যাগ্রিদিদি AI™ সহকারী",
      listening: "শুনছি...",
      speak_now: "এখন বলুন বা প্রশ্ন করুন",
      try_saying: "এভাবে বলে দেখুন:",
      cancel: "বাতিল",
      submit: "জমা দিন"
    }
  },
  as: {
    translation: {
      // Common
      app_name: "এগ্ৰোছাখী 3.0",
      greeting: "নমস্কাৰ",
      location: "স্থান",
      language: "ভাষা",
      language_selector: "ভাষা বাছনি কৰক",
      
      // Navigation
      nav_home: "হোম",
      nav_devices: "ডিভাইচ",
      nav_market: "বজাৰ",
      nav_learn: "শিকক",
      nav_dashboard: "ডেশ্বৰ্ড",
      
      // Voice Assistant
      voice_assistant: "এগ্ৰিদিদি AI™ সহায়ক",
      listening: "শুনি আছে...",
      speak_now: "এতিয়া কওক বা প্ৰশ্ন সোধক",
      try_saying: "এনেকৈ কৈ চাওক:",
      cancel: "বাতিল",
      submit: "দাখিল কৰক"
    }
  },
  sa: {
    translation: {
      // Common
      app_name: "अग्रोसखी 3.0",
      greeting: "नमस्कारः",
      location: "स्थानम्",
      language: "भाषा",
      language_selector: "भाषां चिनुत",
      
      // Navigation
      nav_home: "गृहम्",
      nav_devices: "उपकरणानि",
      nav_market: "विपणिः",
      nav_learn: "शिक्षा",
      nav_dashboard: "फलकम्",
      
      // Voice Assistant
      voice_assistant: "अग्रिदिदि AI™ सहायकः",
      listening: "श्रृण्वन्...",
      speak_now: "अधुना वदतु अथवा प्रश्नं पृच्छतु",
      try_saying: "एवं वदतु:",
      cancel: "निरस्तु",
      submit: "समर्पयतु"
    }
  }
};

export async function initializeI18n() {
  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false, // React already escapes by default
      },
      detection: {
        order: ["navigator", "htmlTag", "path", "localStorage"],
        caches: ["localStorage"],
      },
    });
  
  return i18n;
}

export default i18n;
