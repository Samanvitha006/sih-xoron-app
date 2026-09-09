/**
 * XORON i18n Translation Dictionary
 * Languages:
 *   - en: English (First-class option)
 *   - as: Assamese (অসমীয়া)
 *   - bn: Bengali (বাংলা)
 *   - brx: Bodo (बड़ो)
 *   - mni: Manipuri / Meitei (মৈতৈলোন্)
 *   - ne: Nepali (नेपाली)
 */

const I18N = {
  currentLang: 'as', // Default to Assamese for NER, user can toggle to English or others anytime

  translations: {
    en: {
      appName: 'XORON',
      appTagline: 'Cognitive Care in the Language of Home',
      sihBadge: 'Smart India Hackathon 2026 | PS: SIH26003',
      
      // Nav & Modes
      navPatient: 'Patient App',
      navCaregiver: 'Caregiver Command Centre',
      navAsha: 'ASHA Health Worker Portal',
      navWidget: 'Home-Screen Widget',
      navSih: 'SIH 2026 Pitch & Research',
      
      // Patient Header & Orientation
      welcomeAita: 'Welcome home, Aita!',
      subtitleOrientation: 'Today is Tuesday, 8th September • Peaceful Morning in Dispur, Guwahati',
      btnPlayDailySession: 'Play Today\'s 3 Games',
      btnDailySessionSub: '10 mins • Zero anxiety • Culturally familiar',
      btnOpenChatbot: 'Ask Memory Companion',
      btnReminiscence: 'Family Story Vault',
      btnWhoIsThis: 'Who is This?',
      
      // Reality Orientation Widget
      realityTitle: 'Today Is...',
      realityDay: 'Tuesday',
      realityDate: '8 September 2026',
      realitySeason: 'Autumn / Bohag memories',
      realityTimeOfDay: 'Morning Chai Time',
      
      // Reminders Section
      remindersTitle: 'Daily Routine & Medication',
      btnAcknowledge: 'I Took It',
      reminderNext: 'Next Reminder',
      reminderDueIn: 'Due in',
      
      // Chatbot Section
      chatTitle: 'Xoron Sathi - AI Memory Companion',
      chatSubtitle: 'Ask me anything about your family, home, or daily routine',
      chatPlaceholder: 'Speak or type your question...',
      btnSpeak: 'Press to Speak',
      chatListening: 'Listening to your voice...',
      chipWhoDaughter: 'Who is my daughter?',
      chipWhereAmI: 'Where am I right now?',
      chipNextMed: 'What is my next medicine?',
      chipTellStory: 'Tell me a Bihu story',
      chipFeelingWorried: 'I feel a bit worried',
      
      // Reminiscence Section
      reminiscenceTitle: 'Our Story - Family Reminiscence Vault',
      reminiscenceSubtitle: 'Cherished memories, family voices, and timeless moments',
      btnPlayVoice: 'Listen to Family Voice',
      btnAddMemory: 'Add New Memory',
      
      // 11 Cognitive Games Titles
      gameHubTitle: '11 Adaptive Cognitive Mini-Games',
      gameHubSubtitle: 'Evidence-based cognitive training inspired by North Eastern culture',
      g1Title: '1. Who is This?',
      g1Desc: 'Family face and relationship recall with voice hints',
      g2Title: '2. Our Story',
      g2Desc: 'Reminiscence narrative and photo timeline',
      g3Title: '3. Today is...',
      g3Desc: 'Reality orientation and temporal grounding',
      g4Title: '4. Textile & Pattern Match',
      g4Desc: 'Match traditional Gamusa, Mekhela Sador & Dokhona patterns',
      g5Title: '5. Sounds of Home',
      g5Desc: 'Auditory memory of Bihu Dhol, Pepa & morning rain',
      g6Title: '6. Market Basket',
      g6Desc: 'Remember regional ingredients: Kazi Nemu, Joha rice, Jolpan',
      g7Title: '7. Festival Sequence',
      g7Desc: 'Put seasonal celebrations in harmonious order',
      g8Title: '8. Daily Routine Sorting',
      g8Desc: 'Executive function: Tea, Tulsi prayer, Medicine & Walk',
      g9Title: '9. Shadow & Utensil Match',
      g9Desc: 'Match traditional Xorai, Bota & brass vessels',
      g10Title: '10. Folk Song Completion',
      g10Desc: 'Complete beloved evergreen melodies and folk lyrics',
      g11Title: '11. Gentle Flower Tap',
      g11Desc: 'Sustained attention tapping blooming Kopou orchids',
      
      // Errorless Learning Feedback
      feedbackGood: 'Wonderful, you are doing so well!',
      feedbackGentleHint: 'Take your time. Notice this gentle highlight...',
      feedbackComplete: 'Session completed with peace and joy!',
      
      // Caregiver Dashboard
      cgTitle: 'Caregiver Command Centre',
      cgPatientProfile: 'Patient Profile & Stage',
      cgLongitudinalTrends: 'Cognitive Trends (14-Day Trajectory)',
      cgReactionTime: 'Reaction Time & Cue-Fading Biomarker',
      cgAdherence: 'Medication & Routine Adherence',
      cgAddFamilyMember: 'Add Member to Living Memory Bank',
      cgExportReport: 'Export Clinical Assessment (PDF)',
      
      // ASHA Portal
      ashaTitle: 'ASHA & Community Health Worker Cohort View',
      ashaSubtitle: 'Monitoring rural elderly dementia patients across Dispur & Kamrup cluster',
      ashaPatientList: 'Village Patient Registry',
      ashaFlagAlert: 'Requires Home Visit / Attention'
    },
    
    as: {
      appName: 'স্মৰণ (XORON)',
      appTagline: 'ঘৰুৱা ভাষাৰে মৰমৰ স্মৃতি যতন',
      sihBadge: 'স্মাৰ্ট ইণ্ডিয়া হেকথন ২০২৬ | সমস্যা ক্ৰমাংক: SIH26003',
      
      // Nav & Modes
      navPatient: 'আইতাৰ পৃষ্ঠা',
      navCaregiver: 'পৰিয়ালৰ তদাৰক ডেশ্বব’ৰ্ড',
      navAsha: 'আশা (ASHA) স্বাস্থ্যকৰ্মী ক’ৰ্ট',
      navWidget: 'ম’বাইল উইজেট',
      navSih: 'SIH ২০২৬ প্ৰকল্প পৰিচয়',
      
      // Patient Header & Orientation
      welcomeAita: 'আইতা, ঘৰলৈ স্বাগতম!',
      subtitleOrientation: 'আজি মঙলবাৰ, ৮ ছেপ্টেম্বৰ • দিছপুৰ, গুৱাহাটীৰ এটি শান্ত পুৱা',
      btnPlayDailySession: 'আজিৰ ৩টা খেল খেলক',
      btnDailySessionSub: '১০ মিনিট • কোনো শংকা নাই • আপোন পৰিৱেশ',
      btnOpenChatbot: 'স্মৰণ সংগীক সুধক',
      btnReminiscence: 'আমাৰ কাহিনীৰ ভঁৰাল',
      btnWhoIsThis: 'কোনে এইজন?',
      
      // Reality Orientation Widget
      realityTitle: 'আজি হৈছে...',
      realityDay: 'মঙলবাৰ',
      realityDate: '৮ ছেপ্টেম্বৰ ২০২৬',
      realitySeason: 'শৰৎ / বিহুৰ স্মৃতি',
      realityTimeOfDay: 'ৰাতিপুৱাৰ চাহৰ সময়',
      
      // Reminders Section
      remindersTitle: 'দৈনন্দিন নিয়ম আৰু ঔষধৰ জাননী',
      btnAcknowledge: 'মই খালোঁ',
      reminderNext: 'পৰৱৰ্তী নিয়ম',
      reminderDueIn: 'সময় বাকী',
      
      // Chatbot Section
      chatTitle: 'স্মৰণ সংগী - এআই স্মৃতি সহায়ক',
      chatSubtitle: 'পৰিয়াল, ঘৰ বা ঔষধৰ বিষয়ে যিকোনো কথা মোক সুধিব পাৰে',
      chatPlaceholder: 'কওক বা লিখক...',
      btnSpeak: 'কথা কওক',
      chatListening: 'আপোনাৰ কথা শুনি আছোঁ...',
      chipWhoDaughter: 'মোৰ জীয়াৰী কোন?',
      chipWhereAmI: 'মই এতিয়া ক’ত আছোঁ?',
      chipNextMed: 'মোৰ পৰৱৰ্তী ঔষধ কি?',
      chipTellStory: 'বিহুৰ এটি স্মৃতি কওক',
      chipFeelingWorried: 'মোৰ অলপ ভয় লাগিছে',
      
      // Reminiscence Section
      reminiscenceTitle: 'আমাৰ কাহিনী - পাৰিবাৰিক স্মৃতি ভঁৰাল',
      reminiscenceSubtitle: 'মৰমৰ মানুহ, আপোন মাত আৰু পাহৰিব নোৱাৰা দিনবোৰ',
      btnPlayVoice: 'আপোন মাত শুনক',
      btnAddMemory: 'নতুন স্মৃতি যোগ কৰক',
      
      // 11 Cognitive Games Titles
      gameHubTitle: '১১টা সাংস্কৃতিক সংবেদনশীল খেল',
      gameHubSubtitle: 'অসম আৰু উত্তৰ-পূবৰ লোকসংস্কৃতিৰে স্মৃতি সুৰক্ষা',
      g1Title: '১. কোনে এইজন?',
      g1Desc: 'পৰিয়ালৰ ফটো আৰু মৰমৰ মাত চিনি পোৱা',
      g2Title: '২. আমাৰ কাহিনী',
      g2Desc: 'পুৰণি দিনৰ স্মৃতি আৰু সুৰৰ ভ্ৰমণ',
      g3Title: '৩. আজি কি বাৰ?',
      g3Desc: 'দিন, বাৰ আৰু সময়ৰ শান্ত ধাৰণা',
      g4Title: '৪. গামোচা আৰু কাপোৰৰ আৰ্হি',
      g4Desc: 'ফুলাম গামোচা আৰু মেখেলা চাদৰৰ আৰ্হি মিলোৱা',
      g5Title: '৫. ঘৰৰ সুৰ আৰু মাত',
      g5Desc: 'ঢোল, পেঁপা আৰু বৰষুণৰ চিনাকি মাত',
      g6Title: '৬. বজাৰৰ মোনা',
      g6Desc: 'কাজী নেমু, জোহা চাউল আৰু জলপান মনত ৰখা',
      g7Title: '৭. উৎসৱৰ ক্ৰম সজোৱা',
      g7Desc: 'ৰঙালী, কাতি আৰু মাঘ বিহুৰ ক্ৰম',
      g8Title: '৮. পুৱাৰ নিত্য নিয়ম',
      g8Desc: 'চাহ খোৱা, তুলসী তলত চাকি আৰু ঔষধ লোৱা',
      g9Title: '৯. শৰাই আৰু ছাঁ মিলোৱা',
      g9Desc: 'কাঁহ-পিতলৰ শৰাই, বটা আৰু বাতিৰ আকৃতি',
      g10Title: '১০. গানৰ ফাঁকি সম্পূৰ্ণ কৰা',
      g10Desc: 'ভূপেন মামাৰ গীত আৰু চিনাকি লোকগীতৰ সুৰ',
      g11Title: '১১. কপৌ ফুলৰ আলতো পৰশ',
      g11Desc: 'ফুলি থকা কপৌ ফুলত আলফুলে আঙুলিৰ পৰশ',
      
      // Errorless Learning Feedback
      feedbackGood: 'বৰ ধুনীয়া! আপুনি বৰ সুন্দৰকৈ কৰিছে।',
      feedbackGentleHint: 'একো চিন্তা নাই, আহক এইটো মন কৰোঁ...',
      feedbackComplete: 'আজিৰ খেলা সুকলমে সমাপ্ত হ’ল!',
      
      // Caregiver Dashboard
      cgTitle: 'তদাৰককাৰীৰ কমাণ্ড চেণ্টাৰ',
      cgPatientProfile: 'আইতাৰ স্বাস্থ্য পৰিচয়',
      cgLongitudinalTrends: 'স্মৃতি আৰু মনোযোগৰ প্ৰগতি (১৪ দিন)',
      cgReactionTime: 'সঁহাৰি সময় আৰু সংকেত বিশ্লেষণ',
      cgAdherence: 'ঔষধ গ্ৰহণৰ শতকৰা হাৰ',
      cgAddFamilyMember: 'স্মৃতি ভঁৰালত পৰিয়ালৰ সদস্য যোগ',
      cgExportReport: 'চিকিৎসকৰ বাবে প্ৰতিবেদন ডাউনল’ড',
      
      // ASHA Portal
      ashaTitle: 'আশা (ASHA) স্বাস্থ্যকৰ্মী পৰিদৰ্শন পৃষ্ঠা',
      ashaSubtitle: 'দিছপুৰ আৰু কামৰূপ জিলাৰ ডিমেনচিয়া ৰোগী নিৰীক্ষণ',
      ashaPatientList: 'গাঁও/ৱাৰ্ডৰ ৰোগী তালিকা',
      ashaFlagAlert: 'ঘৰলৈ গৈ পৰিদৰ্শনৰ প্ৰয়োজন'
    },
    
    bn: {
      appName: 'স্মরণ (XORON)',
      appTagline: 'চেনা ভাষায় মমতাময় স্মৃতি যত্ন',
      sihBadge: 'স্মার্ট ইন্ডিয়া হ্যাকাথন ২০২৬ | পিএস: SIH26003',
      navPatient: 'রোগীর অ্যাপ',
      navCaregiver: 'কেয়ারগিভার ড্যাশবোর্ড',
      navAsha: 'আশা স্বাস্থ্যকর্মী পোর্টাল',
      navWidget: 'হোম-স্ক্রিন উইজেট',
      navSih: 'SIH ২০২৬ উপস্থাপনা',
      welcomeAita: 'স্বাগতম, দিদিমা!',
      subtitleOrientation: 'আজ মঙ্গলবার, ৮ সেপ্টেম্বর • শান্ত সকাল, দিসপুর গুয়াহাটি',
      btnPlayDailySession: 'আজকের ৩টি খেলা শুরু করুন',
      btnDailySessionSub: '১০ মিনিট • কোনো উদ্বেগ নেই • আপন পরিবেশ',
      btnOpenChatbot: 'স্মরণ সঙ্গীকে জিজ্ঞাসা করুন',
      btnReminiscence: 'পারিবারিক স্মৃতি ভাণ্ডার',
      btnWhoIsThis: 'ইনি কে?',
      realityTitle: 'আজকের দিন...',
      realityDay: 'মঙ্গলবার',
      realityDate: '৮ সেপ্টেম্বর ২০২৬',
      realitySeason: 'শরতের মনোরম আবহাওয়া',
      realityTimeOfDay: 'সকালের চা পানের সময়',
      remindersTitle: 'ওষুধ ও দৈনন্দিন নিয়ম',
      btnAcknowledge: 'ওষুধ খেয়েছি',
      reminderNext: 'পরবর্তী ওষুধ',
      reminderDueIn: 'বাকি সময়',
      chatTitle: 'স্মরণ সঙ্গী - এআই স্মৃতি সহায়ক',
      chatSubtitle: 'পরিবার, বাড়ি বা ওষুধ সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন',
      chatPlaceholder: 'বলুন বা লিখুন...',
      btnSpeak: 'কথা বলুন',
      chatListening: 'শুনছি...',
      chipWhoDaughter: 'আমার মেয়ে কে?',
      chipWhereAmI: 'আমি এখন কোথায়?',
      chipNextMed: 'আমার পরের ওষুধ কি?',
      chipTellStory: 'বিহুর একটি গল্প বলুন',
      chipFeelingWorried: 'আমার একটু ভয় লাগছে',
      reminiscenceTitle: 'আমাদের গল্প - পারিবারিক স্মৃতি',
      reminiscenceSubtitle: 'প্রিয়জনদের মুখ, কণ্ঠ এবং মধুর স্মৃতি',
      btnPlayVoice: 'পরিবারের কণ্ঠ শুনুন',
      btnAddMemory: 'নতুন স্মৃতি যুক্ত করুন',
      gameHubTitle: '১১টি মানিয়ে নেওয়া মস্তিষ্কের খেলা',
      gameHubSubtitle: 'উত্তর-পূর্ব ভারতের সংস্কৃতির সাথে স্মৃতি সুরক্ষা',
      g1Title: '১. ইনি কে?',
      g1Desc: 'পরিবারের মুখ ও সম্পর্কের স্মৃতি',
      g2Title: '২. আমাদের গল্প',
      g2Desc: 'পুরনো দিনের স্মৃতি ও ছবির ভ্রমণ',
      g3Title: '৩. আজ কি বার?',
      g3Desc: 'সময় ও দিনের শান্ত অনুভূতি',
      g4Title: '৪. শাড়ি ও কাপড়ের নকশা মেলানো',
      g4Desc: 'গামোচা ও মেখলা চাদরের সুন্দর নকশা',
      g5Title: '৫. চেনা সুর ও শব্দ',
      g5Desc: 'ঢোল, বাঁশি ও বৃষ্টির মধুর শব্দ',
      g6Title: '৬. বাজারের ঝুড়ি',
      g6Desc: 'লেবু, চাল ও জলখাবার মনে রাখা',
      g7Title: '৭. উৎসবের ক্রম',
      g7Desc: 'ঋতুভিত্তিক উৎসবের সুন্দর ক্রম',
      g8Title: '৮. সকালের নিয়ম',
      g8Desc: 'চা, তুলসীতলায় প্রদীপ ও ওষুধ',
      g9Title: '৯. থালা ও ছায়া মেলানো',
      g9Desc: 'ঐতিহ্যবাহী কাঁসার পাত্রের নকশা',
      g10Title: '১০. গানের কলি মেলানো',
      g10Desc: 'ভূপেন হাজারিকা ও চেনা লোকগীতি',
      g11Title: '১১. শান্ত অর্কিড ফুল ছোঁয়া',
      g11Desc: 'ধীরে সুস্থে ফুটন্ত ফুলে হাত রাখা',
      feedbackGood: 'খুব সুন্দর! আপনি খুব ভালো করছেন।',
      feedbackGentleHint: 'কোনো তাড়াহুড়ো নেই, এটি লক্ষ্য করুন...',
      feedbackComplete: 'আজকের খেলা খুব সুন্দরভাবে শেষ হলো!',
      cgTitle: 'কেয়ারগিভার কমান্ড সেন্টার',
      cgPatientProfile: 'রোগীর স্বাস্থ্য পরিচয়',
      cgLongitudinalTrends: 'স্মৃতি ও মনোযোগের অগ্রগতি (১৪ দিন)',
      cgReactionTime: 'সাড়া দেবার গতি ও সহায়তার হিসাব',
      cgAdherence: 'ওষুধ গ্রহণের নিয়মমাফিক হার',
      cgAddFamilyMember: 'স্মৃতিভাণ্ডারে সদস্য যোগ',
      cgExportReport: 'ডাক্তারি রিপোর্ট ডাউনলোড',
      ashaTitle: 'আশা স্বাস্থ্যকর্মী পরিদর্শন ড্যাশবোর্ড',
      ashaSubtitle: 'দিসপুর অঞ্চলের বয়স্ক ডিমেনশিয়া রোগীদের যত্ন',
      ashaPatientList: 'গ্রামের রোগীর তালিকা',
      ashaFlagAlert: 'বাড়িতে গিয়ে দেখার প্রয়োজন'
    },
    
    brx: {
      appName: 'स्मरण (XORON)',
      appTagline: 'गावनि रावाव गोसोखांथि सामलायनाय',
      sihBadge: 'स्मार्ट इंडिया हेकाथोन 2026 | PS: SIH26003',
      navPatient: 'आइतानि एप',
      navCaregiver: 'केयरगिभार देशबर्ड',
      navAsha: 'आशा (ASHA) हेन्थ वर्किस',
      navWidget: 'मोबाइल विगेट',
      navSih: 'SIH 2026 विजन',
      welcomeAita: 'आइता, नोआव बरायबाय!',
      subtitleOrientation: 'दिनै मंगलबार, 8 सेप्टेम्बर • फुंनि साहा समाव',
      btnPlayDailySession: 'दिनैनि 3 गेलेमु गेलेदो',
      btnDailySessionSub: '10 मिनिट • जेबो गियो गैलिया',
      btnOpenChatbot: 'स्मरण संगी सोंदो',
      btnReminiscence: 'नखरनि गोसोखांथि बाखो',
      btnWhoIsThis: 'बे सोर?',
      realityTitle: 'दिनै सान...',
      realityDay: 'मंगलबार',
      realityDate: '8 सेप्टेम्बर 2026',
      realitySeason: 'मोजां बोथोर',
      realityTimeOfDay: 'फुंनि साहा लोंनाय सम',
      remindersTitle: 'दिनैनि मुलि आरो नेम',
      btnAcknowledge: 'आं लोंबाय',
      reminderNext: 'उननि मुलि',
      reminderDueIn: 'सम उनाव',
      chatTitle: 'स्मरण संगी - एआई संगी',
      chatSubtitle: 'नखर आरो मुलिनि सोमोन्दै सोंदो',
      chatPlaceholder: 'बुंदो एबा लिरदो...',
      btnSpeak: 'रायलायदो',
      chatListening: 'खोनासंन्दों...',
      chipWhoDaughter: 'आंनि फिसायजो सोर?',
      chipWhereAmI: 'आं दा बबेयाव?',
      chipNextMed: 'आंनि उननि मुलिया मा?',
      chipTellStory: 'बिहुनि गोसोखांथि बुंदो',
      chipFeelingWorried: 'आं खम गिदों',
      reminiscenceTitle: 'जोंनि सल\' - नखरनि गोसोखांथि',
      reminiscenceSubtitle: 'अनजाथाव मानसि आरो खुगा सुरां',
      btnPlayVoice: 'खुगा सुरां खोनासं',
      btnAddMemory: 'गोदान गोसोखांथि सोनाय',
      gameHubTitle: '11 गेलेमुफोर',
      gameHubSubtitle: 'गोसो सानस्रिखौ गोहो गोनां खालामनाय',
      g1Title: '1. बे सोर?',
      g1Desc: 'नखरनि मानसि सिनायनाय',
      g2Title: '2. जोंनि सल\'',
      g2Desc: 'गोजाम समनि सल\'',
      g3Title: '3. दिनै मा बार?',
      g3Desc: 'सान आरो समनि मिथिनाय',
      g4Title: '4. दखना आरो गामसा दानाय',
      g4Desc: 'दखनानि सिन मिलिनाय',
      g5Title: '5. नोनि सोदोब',
      g5Desc: 'दख\'ना, खाम आरो सिफुंनि सोदोब',
      g6Title: '6. हातियारि थलि',
      g6Desc: 'थाखुर, मायरं गोसोआव लाखिनाय',
      g7Title: '7. बैसागु फारि',
      g7Desc: 'बैसागु आरो फाराब फारि',
      g8Title: '8. फुंनि नेम',
      g8Desc: 'साहा लोंनाय, मुलि लोंनाय',
      g9Title: '9. सराय सिन मिलिनाय',
      g9Desc: 'खौसे बासन सिन',
      g10Title: '10. रोजाबनाय फारि',
      g10Desc: 'गाहाम मेथाय सुरां',
      g11Title: '11. बिबार थुनाय',
      g11Desc: 'कपौ बिबार थुनाय',
      feedbackGood: 'जोबोद मोजां! नोंथां मोजां खालामदों।',
      feedbackGentleHint: 'लासै लासै, बेखौ नायदो...',
      feedbackComplete: 'दिनैनि गेलेमुआ मोजाङै जोबबाय!',
      cgTitle: 'केयरगिभार देशबर्ड',
      cgPatientProfile: 'आइतानि सावस्रि',
      cgLongitudinalTrends: 'गोसोखांथि दिदोम (14 सान)',
      cgReactionTime: 'सोरगिदिं समनि फारि',
      cgAdherence: 'मुलि लोंनायनि हार',
      cgAddFamilyMember: 'नखरनि मानसि सोनाय',
      cgExportReport: 'दाक्थोरनि रिपोर्ट डाउनलोड',
      ashaTitle: 'आशा (ASHA) देहा हेफाजाब',
      ashaSubtitle: 'दिसपुरनि बेमारि नायदिंनाय',
      ashaPatientList: 'गामिनि बेमारि फारि',
      ashaFlagAlert: 'नोआव थांना नायनो गोनां'
    },
    
    mni: {
      appName: 'স্মরণ (XORON)',
      appTagline: 'য়ুমগী লোনদা নীংশিংবা য়োকখৎপা',
      sihBadge: 'স্মার্ট ইন্দিয়া হেকাথন ২০২৬ | পিএস: SIH26003',
      navPatient: 'আইতাগী এপ',
      navCaregiver: 'কেয়ারগিভর দেশবোর্ড',
      navAsha: 'আশা ৱার্কার পোর্টাল',
      navWidget: 'মোবাইল ৱিজেত',
      navSih: 'SIH ২০২৬ প্রজেক্ট',
      welcomeAita: 'আইতা, য়ুমদা তরানিংবা ওকচরি!',
      subtitleOrientation: 'ঙসি য়ুমশাকৈশা, ৮ সেপ্তেম্বর • অয়ুক্কী চা থকপগী মতম',
      btnPlayDailySession: 'ঙসিগী শান্নপোৎ ৩ শান্নসি',
      btnDailySessionSub: 'মিনিট ১০ • কিকনিঙাই লৈতে',
      btnOpenChatbot: 'স্মরণ সংগীবু হংবিউ',
      btnReminiscence: 'ইমুংগী নীংশিং মপুং',
      btnWhoIsThis: 'মসি কনানো?',
      realityTitle: 'ঙসিদি...',
      realityDay: 'য়ুমশাকৈশা',
      realityDate: '৮ সেপ্তেম্বর ২০২৬',
      realitySeason: 'ফজরবা নুমিৎ',
      realityTimeOfDay: 'অয়ুক্কী চা থকপগী মতম',
      remindersTitle: 'হীদাক অমসুং নুমিৎ চুপ্পগী থবক',
      btnAcknowledge: 'হীদাক চারবনি',
      reminderNext: 'তুংগী হীদাক',
      reminderDueIn: 'ৱাৎলিবা মতম',
      chatTitle: 'স্মরণ সংগী - এআই নীংশিং লমজিংবা',
      chatSubtitle: 'ইমুং মনুং অমসুং হীদাক্কী মতাংদা হংবিউ',
      chatPlaceholder: 'ঙাংবিউ নত্রগা ইবিউ...',
      btnSpeak: 'ৱা ঙাংবিউ',
      chatListening: 'তাবা য়ারি...',
      chipWhoDaughter: 'ঐগী মচানুপী কনানো?',
      chipWhereAmI: 'ঐ হৌজিক কদাইদা লৈরি?',
      chipNextMed: 'ঐগী তুংগী হীদাক করিনো?',
      chipTellStory: 'বিহুগী ৱারী অমা তাবিউ',
      chipFeelingWorried: 'ঐ খরা কিই',
      reminiscenceTitle: 'ঐখোয়গী ৱারী - ইমুংগী নীংশিংবা',
      reminiscenceSubtitle: 'নুংশিরবা মীওইশিং অমসুং মখোয়গী খোন্থোক',
      btnPlayVoice: 'ইমুংগী খোন্থোক তাবীয়ু',
      btnAddMemory: 'অনৌবা নীংশিংবা হাপচিনবা',
      gameHubTitle: 'শান্নপোৎ ১১',
      gameHubSubtitle: 'নীংশিংবা হেনগৎহনবা শান্নপোৎ',
      g1Title: '১. মসি কনানো?',
      g1Desc: 'ইমুংগী মীওই মশক খঙদোকপা',
      g2Title: '২. ঐখোয়গী ৱারী',
      g2Desc: 'অরিবা মতমগী ৱারী',
      g3Title: '৩. ঙসি করি নুমিৎনো?',
      g3Desc: 'নুমিৎ অমসুং মতম খঙবা',
      g4Title: '৪. ফী-রোলগী নকশা',
      g4Desc: 'ফanek অমসুং গামোচাগী নকশা',
      g5Title: '৫. য়ুমগী মখোল',
      g5Desc: 'পেনা, পুং অমসুং নোংগী মখোল',
      g6Title: '৬. কৈথেলগী পৈলা',
      g6Desc: 'চাম্প্রা, চেং নীংশিংবা',
      g7Title: '৭. কুহ্মৈগী মতম',
      g7Desc: 'কুহ্মৈগী মথং মনাও',
      g8Title: '৮. অয়ুক্কী থবক',
      g8Desc: 'চা থকপা, হীদাক চাবা',
      g9Title: '৯. থারি নকশা',
      g9Desc: 'লৈবাক্কী শরাই নকশা',
      g10Title: '১০. ঈশৈ লোইশিনবা',
      g10Desc: 'নুংশিরবা ঈশৈগী শকপা',
      g11Title: '১১. লৈরাং থুবা',
      g11Desc: 'কপৌ লৈরাং তপ্না থুবা',
      feedbackGood: 'য়াম্না ফরে! নহাক্না ফনা তৌরি।',
      feedbackGentleHint: 'তপ্না তৌসি, মসি য়েংসি...',
      feedbackComplete: 'ঙসিগী শান্নবা লোইরে!',
      cgTitle: 'কেয়ারগিভর দেশবোর্ড',
      cgPatientProfile: 'আইতাগী হকশেল',
      cgLongitudinalTrends: 'নীংশিংবগী খোঙজেল (নুমিৎ ১৪)',
      cgReactionTime: 'পাউখুম পীবগী মতম',
      cgAdherence: 'হীদাক চাবগী চাং',
      cgAddFamilyMember: 'ইমুংগী মী হাপচিনবা',
      cgExportReport: 'দোক্তরগী রিপোর্ত',
      ashaTitle: 'আশা হকশেল ৱার্কার পোর্টাল',
      ashaSubtitle: 'দিশপুরগী অনাবশিং য়েংশিনবা',
      ashaPatientList: 'অনাবগী মিং',
      ashaFlagAlert: 'য়ুমদা চৎতুনা য়েংবা মথৌ তাই'
    },
    
    ne: {
      appName: 'स्मरण (XORON)',
      appTagline: 'आफ्नै भाषामा मायालु स्मरण हेरचाह',
      sihBadge: 'स्मार्ट इन्डिया ह्याकाथन २०२६ | PS: SIH26003',
      navPatient: 'हजुरआमाको पृष्ठ',
      navCaregiver: 'हेरचाहकर्ता ड्यासबोर्ड',
      navAsha: 'आशा (ASHA) स्वास्थ्यकर्मी पोर्टल',
      navWidget: 'मोबाइल विजेट',
      navSih: 'SIH २०२६ परिचय',
      welcomeAita: 'हजुरआमा, घरमा स्वागत छ!',
      subtitleOrientation: 'आज मंगलबार, ८ सेप्टेम्बर • बिहानको चियाको शान्त समय',
      btnPlayDailySession: 'आजका ३ खेलहरू खेल्नुहोस्',
      btnDailySessionSub: '१० मिनेट • कुनै चिन्ता छैन • आफ्नै वातावरण',
      btnOpenChatbot: 'स्मरण साथीलाई सोध्नुहोस्',
      btnReminiscence: 'पारिवारिक सम्झनाको भण्डार',
      btnWhoIsThis: 'उहाँ को हुनुहुन्छ?',
      realityTitle: 'आजको दिन...',
      realityDay: 'मंगलबार',
      realityDate: '८ सेप्टेम्बर २०२६',
      realitySeason: 'रमाइलो शरद ऋतु',
      realityTimeOfDay: 'बिहानको चियाको समय',
      remindersTitle: 'दैनिक तालिका र औषधि',
      btnAcknowledge: 'मैले औषधि खाएँ',
      reminderNext: 'पछिल्लो औषधि',
      reminderDueIn: 'बाँकी समय',
      chatTitle: 'स्मरण साथी - एआई स्मरण सहायक',
      chatSubtitle: 'परिवार, घर वा औषधिको बारेमा केही पनि सोध्नुहोस्',
      chatPlaceholder: 'बोल्नुहोस् वा लेख्नुहोस्...',
      btnSpeak: 'बोल्नुहोस्',
      chatListening: 'सुन्दै छु...',
      chipWhoDaughter: 'मेरी छोरी को हुन्?',
      chipWhereAmI: 'म अहिले कहाँ छु?',
      chipNextMed: 'मेरो अर्को औषधि कुन हो?',
      chipTellStory: 'रमाइलो सम्झना सुनाउनुहोस्',
      chipFeelingWorried: 'मलाई अलिकति डर लाग्यो',
      reminiscenceTitle: 'हाम्रो कथा - पारिवारिक सम्झना',
      reminiscenceSubtitle: 'आफ्ना मान्छेहरू, उनीहरूको आवाज र पुराना रमाइला दिनहरू',
      btnPlayVoice: 'परिवारको आवाज सुन्नुहोस्',
      btnAddMemory: 'नयाँ सम्झना थप्नुहोस्',
      gameHubTitle: '११ अनुकूलित खेलहरू',
      gameHubSubtitle: 'पूर्वाञ्चल संस्कृतिको साथ मानसिक स्वास्थ्य',
      g1Title: '१. उहाँ को हुनुहुन्छ?',
      g1Desc: 'परिवारका सदस्य र अनुहार सम्झने',
      g2Title: '२. हाम्रो कथा',
      g2Desc: 'पुराना दिनका मीठा सम्झनाहरू',
      g3Title: '३. आज के बार हो?',
      g3Desc: 'दिन, मिति र समयको शान्त अनुभव',
      g4Title: '४. ढाका र लुगाको बुट्टा',
      g4Desc: 'गामोचा र ढाका टोपीको बुट्टा मिलाउने',
      g5Title: '५. घरका परिचित आवाजहरू',
      g5Desc: 'मादल, बाँसुरी र पानीको मधुर आवाज',
      g6Title: '६. बजारको झोला',
      g6Desc: 'कागती, चामल र खाजा सम्झने',
      g7Title: '७. चाडपर्वको क्रम',
      g7Desc: 'दशैं, तिहार र बिहुको क्रम मिलाउने',
      g8Title: '८. बिहानको नित्यकर्म',
      g8Desc: 'चिया, पूजा र औषधि खाने समय',
      g9Title: '९. भाँडाकुँडाको छायाँ मिलाउने',
      g9Desc: 'तामा र काँसका परम्परागत भाँडा',
      g10Title: '१०. लोकगीत पूरा गर्ने',
      g10Desc: 'चर्चित लोकगीतका धुनहरू',
      g11Title: '११. सुनगाभाको स्पर्श',
      g11Desc: 'फुलिरहेका सुनगाभामा बिस्तारै हात राख्ने',
      feedbackGood: 'धेरै राम्रो! तपाईंले उत्कृष्ट गर्दै हुनुहुन्छ।',
      feedbackGentleHint: 'नआत्तिनुहोस्, यता हेर्नुहोस्...',
      feedbackComplete: 'आजको खेल आनन्दपूर्वक सम्पन्न भयो!',
      cgTitle: 'हेरचाहकर्ता कमान्ड सेन्टर',
      cgPatientProfile: 'हजुरआमाको स्वास्थ्य विवरण',
      cgLongitudinalTrends: 'स्मरण र ध्यानको प्रगति (१४ दिन)',
      cgReactionTime: 'प्रतिक्रिया समय र संकेत विश्लेषण',
      cgAdherence: 'औषधि सेवनको नियमितता',
      cgAddFamilyMember: 'परिवारका सदस्य थप्नुहोस्',
      cgExportReport: 'चिकित्सक रिपोर्ट डाउनलोड',
      ashaTitle: 'आशा (ASHA) स्वास्थ्यकर्मी पोर्टल',
      ashaSubtitle: 'दिसपुर क्षेत्रका डिमेन्सिया बिरामीको रेखदेख',
      ashaPatientList: 'गाउँका बिरामीको सूची',
      ashaFlagAlert: 'घरमै पुगेर भेट्नुपर्ने'
    }
  },

  t(key) {
    const langDict = this.translations[this.currentLang] || this.translations['en'];
    return langDict[key] || this.translations['en'][key] || key;
  },

  setLanguage(langCode) {
    if (this.translations[langCode]) {
      this.currentLang = langCode;
      localStorage.setItem('xoron_lang', langCode);
      this.updateDOM();
      return true;
    }
    return false;
  },

  getRealTimeOrientation(lang = null) {
    const activeLang = lang || this.currentLang || 'as';
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, ...
    const dateNum = now.getDate();
    const monthIdx = now.getMonth();
    const year = now.getFullYear();
    const hours = now.getHours();

    const days = [
      { en: 'Sunday', as: 'দেওবাৰ', bn: 'রবিবার', brx: 'रबिबार', mni: 'নোংমাইজিং', ne: 'आइतबार' },
      { en: 'Monday', as: 'সোমবাৰ', bn: 'সোমবার', brx: 'समबार', mni: 'নিংথৌকাবা', ne: 'सोमबार' },
      { en: 'Tuesday', as: 'মঙলবাৰ', bn: 'মঙ্গলবার', brx: 'मंगलबार', mni: 'লৈপাকপোকপা', ne: 'मंगलबार' },
      { en: 'Wednesday', as: 'বুধবাৰ', bn: 'বুধবার', brx: 'बुधबार', mni: 'য়ুমশাকৈশা', ne: 'बुधबार' },
      { en: 'Thursday', as: 'বৃহস্পতিবাৰ', bn: 'বৃহস্পতিবার', brx: 'बृहस्पतिबार', mni: 'শগোলসেন', ne: 'बिहीबार' },
      { en: 'Friday', as: 'শুক্ৰবাৰ', bn: 'শুক্রবার', brx: 'सुक्रबार', mni: 'ইরাই', ne: 'शुक्रबार' },
      { en: 'Saturday', as: 'শনিবাৰ', bn: 'শনিবার', brx: 'सनिबार', mni: 'থাংজা', ne: 'शनिबार' }
    ];

    const months = [
      { en: 'January', as: 'জানুৱাৰী', bn: 'জানুয়ারি', brx: 'जानुवारी', mni: 'জানুৱারী', ne: 'जनवरी' },
      { en: 'February', as: 'ফেব্ৰুৱাৰী', bn: 'ফেব্রুয়ারি', brx: 'फेब्रुवारी', mni: 'ফেব্রুৱারী', ne: 'फेब्रुअरी' },
      { en: 'March', as: 'মাৰ্চ', bn: 'মার্চ', brx: 'मार्स', mni: 'মার্চ', ne: 'मार्च' },
      { en: 'April', as: 'এপ্ৰিল', bn: 'এপ্রিল', brx: 'एप्रिल्', mni: 'এপ্রিল', ne: 'अप्रिल' },
      { en: 'May', as: 'মে’', bn: 'মে', brx: 'मे', mni: 'মে', ne: 'मे' },
      { en: 'June', as: 'জুন', bn: 'জুন', brx: 'जुन', mni: 'জুন', ne: 'जुन' },
      { en: 'July', as: 'জুলাই', bn: 'জুলাই', brx: 'जुलाइ', mni: 'জুলাই', ne: 'जुलाई' },
      { en: 'August', as: 'আগষ্ট', bn: 'আগস্ট', brx: 'अगस्त', mni: 'আগস্ট', ne: 'अगस्ट' },
      { en: 'September', as: 'ছেপ্টেম্বৰ', bn: 'সেপ্টেম্বর', brx: 'सेप्तेम्बर', mni: 'সেপ্টেম্বর', ne: 'सेप्टेम्बर' },
      { en: 'October', as: 'অক্টোবৰ', bn: 'অক্টোবর', brx: 'अक्तोबर', mni: 'অক্টোবর', ne: 'अक्टोबर' },
      { en: 'November', as: 'নৱেম্বৰ', bn: 'নভেম্বর', brx: 'नबेम्बर', mni: 'নভেম্বর', ne: 'नोभेम्बर' },
      { en: 'December', as: 'ডিচেম্বৰ', bn: 'ডিসেম্বর', brx: 'दिसेम्बर', mni: 'ডিসেম্বর', ne: 'डिसेम्बर' }
    ];

    const dayObj = days[dayOfWeek] || days[3];
    const monthObj = months[monthIdx] || months[8];
    const dayName = dayObj[activeLang] || dayObj.en;
    const monthName = monthObj[activeLang] || monthObj.en;

    const toRegionalDigits = (num, l) => {
      if (l === 'as' || l === 'bn') {
        const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return String(num).split('').map(d => digits[parseInt(d, 10)] || d).join('');
      }
      return String(num);
    };

    const regionalDate = toRegionalDigits(dateNum, activeLang);
    const regionalYear = toRegionalDigits(year, activeLang);

    // Real-Time Time of Day Period
    let timeOfDayEn = "Morning Chai Time";
    let timeOfDayAs = "ৰাতিপুৱাৰ চাহৰ সময়";
    let timeOfDayBn = "সকালের চা পানের সময়";
    let timeOfDayPeriod = "Peaceful Morning in Dispur, Guwahati";
    let timeOfDayPeriodAs = "দিছপুৰ, গুৱাহাটীৰ এটি শান্ত পুৱা";
    let timeOfDayPeriodBn = "শান্ত সকাল, দিসপুর গুয়াহাটি";
    let periodIcon = "☀️";

    if (hours >= 12 && hours < 16) {
      timeOfDayEn = "Calm Afternoon Rest";
      timeOfDayAs = "দুপৰীয়াৰ শান্ত বিশ্ৰাম";
      timeOfDayBn = "দুপুরের শান্ত বিশ্রাম";
      timeOfDayPeriod = "Gentle Afternoon at Home in Dispur";
      timeOfDayPeriodAs = "ঘৰুৱা পৰিৱেশত দুপৰীয়াৰ জিৰণি";
      timeOfDayPeriodBn = "বাড়িতে দুপুরের শান্ত পরিবেশ";
      periodIcon = "🌤️";
    } else if (hours >= 16 && hours < 20) {
      timeOfDayEn = "Evening Family Tea Time";
      timeOfDayAs = "গধূলিৰ পৰিয়াল আৰু চাহৰ সময়";
      timeOfDayBn = "সন্ধ্যার পারিবারিক মিলন";
      timeOfDayPeriod = "Soothing Twilight Evening with Family";
      timeOfDayPeriodAs = "গধূলিৰ শান্ত চাকি আৰু পৰিয়ালৰ সময়";
      timeOfDayPeriodBn = "সন্ধ্যার মনোরম পরিবেশ";
      periodIcon = "🌆";
    } else if (hours >= 20 || hours < 5) {
      timeOfDayEn = "Peaceful Night & Rest";
      timeOfDayAs = "নিশাৰ নিৰিবিলি বিশ্ৰাম";
      timeOfDayBn = "রাতের নিশ্চিন্ত বিশ্রাম";
      timeOfDayPeriod = "Cozy & Safe Night in Warm Home";
      timeOfDayPeriodAs = "নিশাৰ বিশ্ৰাম, আপুনি নিৰাপদে আছে";
      timeOfDayPeriodBn = "শান্ত রাত, আপনি নিরাপদে আছেন";
      periodIcon = "🌙";
    }

    const timeOfDay = activeLang === 'as' ? timeOfDayAs : (activeLang === 'bn' ? timeOfDayBn : timeOfDayEn);
    const timePeriodText = activeLang === 'as' ? timeOfDayPeriodAs : (activeLang === 'bn' ? timeOfDayPeriodBn : timeOfDayPeriod);

    let subtitleOrientation = "";
    if (activeLang === 'as') {
      subtitleOrientation = `আজি ${dayName}, ${regionalDate} ${monthName} • ${timePeriodText}`;
    } else if (activeLang === 'bn') {
      subtitleOrientation = `আজ ${dayName}, ${regionalDate} ${monthName} • ${timePeriodText}`;
    } else {
      const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"], v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };
      subtitleOrientation = `Today is ${dayName}, ${getOrdinal(dateNum)} ${monthName} • ${timePeriodText}`;
    }

    return {
      dayOfWeek,
      dayName,
      monthName,
      dateNum,
      year,
      regionalDate,
      regionalYear,
      timeOfDay,
      timePeriodText,
      periodIcon,
      subtitleOrientation,
      realityDate: `${regionalDate} ${monthName} ${regionalYear}`
    };
  },

  updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (val) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Real-Time Dynamic Temporal Grounding Overrides (Guarantees Real-Time Date & Day)
    const live = this.getRealTimeOrientation(this.currentLang);
    const subEl = document.querySelector('[data-i18n="subtitleOrientation"]');
    if (subEl) subEl.textContent = live.subtitleOrientation;

    const dayEl = document.querySelector('[data-i18n="realityDay"]');
    if (dayEl) dayEl.textContent = live.dayName;

    const dateEl = document.querySelector('[data-i18n="realityDate"]');
    if (dateEl) dateEl.textContent = live.realityDate;

    const todEl = document.querySelector('[data-i18n="realityTimeOfDay"]');
    if (todEl) todEl.textContent = live.timeOfDay;

    // Update active state in language selector pills
    document.querySelectorAll('.lang-pill').forEach(btn => {
      if (btn.getAttribute('data-lang') === this.currentLang) {
        btn.classList.add('active-lang');
      } else {
        btn.classList.remove('active-lang');
      }
    });
  }
};

// Periodic orientation updater (every 60s)
setInterval(() => {
  if (window.I18N) {
    const live = window.I18N.getRealTimeOrientation();
    const subEl = document.querySelector('[data-i18n="subtitleOrientation"]');
    if (subEl) subEl.textContent = live.subtitleOrientation;
  }
}, 60000);

window.I18N = I18N;
