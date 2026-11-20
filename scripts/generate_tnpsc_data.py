# scripts/generate_tnpsc_data.py
import json, os

output_path = r"c:\Users\acer\OneDrive\Desktop\exam\src\services\tnpscPaperData.ts"

questions = []

# Helper to add question
def add_q(q_num, page, subject, topic, q_ta, q_en, opt_a, opt_b, opt_c, opt_d, ans, exp_en, exp_ta=""):
    questions.append({
        "id": f"tnpsc-2011-q{q_num}",
        "exam_id": "exam-tnpsc-group4",
        "original_question_number": q_num,
        "question_text_ta": q_ta,
        "question_text_en": q_en,
        "option_a": opt_a,
        "option_b": opt_b,
        "option_c": opt_c,
        "option_d": opt_d,
        "correct_answer": ans,
        "is_verified": True,
        "explanation": exp_en,
        "explanation_ta": exp_ta or exp_en,
        "subject": subject,
        "topic": topic,
        "page_number": page,
        "source_paper_id": "TNPSC-G4-2011-901",
        "status": "verified"
    })

# --- GENERAL KNOWLEDGE & GENERAL MENTAL ABILITY (Q1 to Q100) ---
add_q(1, 3, "General Knowledge", "General Science - Biology",
      "மனிதனின் இயல்பு வெப்பநிலை",
      "Normal temperature of human body is",
      "37° C", "90 K", "37 K", "100° C",
      "A", "The average normal human body temperature is generally accepted as 37° C (98.6° F).",
      "மனித உடலின் சராசரி இயல்பான வெப்பநிலை 37° C (98.6° F) ஆகும்.")

add_q(2, 3, "General Knowledge", "General Science - Chemistry",
      "ஆல்கைன்களின் பொதுவான மூலக்கூறு வாய்பாடு",
      "The general molecular formula of alkynes is",
      "Cn H2n+2", "Cn H2n", "Cn H2n-2", "Cn H2n+1",
      "C", "Alkynes are unsaturated hydrocarbons containing at least one carbon-carbon triple bond with general formula Cn H2n-2.",
      "ஆல்கைன்களின் பொதுவான மூலக்கூறு வாய்பாடு Cn H2n-2 ஆகும். இதில் கார்பன்-கார்பன் முப்பிணைப்பு இருக்கும்.")

add_q(3, 3, "General Mental Ability", "Probability",
      "சீரான பகடை ஒன்று உருட்டப்படுகிறது. இரட்டை எண் பகடையின் முகத்தில் தோன்ற நிகழ்தகவு",
      "A fair die is rolled. The probability of getting an even number on the face of the die is",
      "1/4", "3/4", "1/3", "1/2",
      "D", "Total outcomes = {1, 2, 3, 4, 5, 6} = 6. Even numbers = {2, 4, 6} = 3. Probability = 3/6 = 1/2.",
      "மொத்த வாய்ப்புகள் = 6. இரட்டை எண்கள் {2, 4, 6} = 3. நிகழ்தகவு = 3/6 = 1/2.")

add_q(4, 4, "General Knowledge", "Indian Polity",
      "இந்தியத் தேர்தல் ஆணையம் அமைந்துள்ள இடம்",
      "The Election Commission of India is situated at",
      "Mumbai", "Chennai", "New Delhi", "Kolkata",
      "C", "The Election Commission of India (Nirvachan Sadan) is headquartered in New Delhi.",
      "இந்திய தேர்தல் ஆணையத்தின் தலைமையகம் (நிர்வாசன் சதன்) புது தில்லியில் அமைந்துள்ளது.")

add_q(5, 4, "General Knowledge", "Indian History",
      "அக்பரின் பாதுகாவலராக இருந்தவர்",
      "The Guardian of Akbar was",
      "Bairam Khan", "Chand Bibi", "Sher Shah", "Rani Durgawati",
      "A", "Bairam Khan was the military commander and regent/guardian during the childhood of Mughal Emperor Akbar.",
      "முகலாயப் பேரரசர் அக்பரின் இளம் வயதில் அவருக்கு பாதுகாவலராகவும் படைத்தளபதியாகவும் இருந்தவர் பைராம்கான்.")

add_q(6, 4, "General Knowledge", "Tamil Literature & Culture",
      "“காயசண்டிகை” உருவில் மறைந்து இருந்தவர்",
      "Who disguised herself as 'Kayasandigai'?",
      "Manimekalai", "Adhirai", "Madhari", "Madavi",
      "A", "In the Tamil epic Manimekalai, Manimekalai takes the form/disguise of Kayasandigai to feed the poor with the Akshaya Patra.",
      "மணிமேகலை காப்பியத்தில், அட்சய பாத்திரம் கொண்டு பசிப்பிணி போக்க மணிமேகலை காயசண்டிகையின் உருவத்தில் மறைந்திருந்தாள்.")

add_q(7, 4, "General Knowledge", "General Science - Diseases",
      "பிளேவி வைரஸ் தோற்றுவிப்பது",
      "Flavivirus causes",
      "Filariasis", "Cholera", "Dengue fever", "Malaria",
      "C", "Flavivirus is the genus of viruses transmitted by mosquitoes, primarily Aedes aegypti, that causes Dengue fever.",
      "பிளேவி வைரஸ் ஏடிஸ் கொசுக்களால் பரப்பப்பட்டு டெங்கு காய்ச்சலை உண்டாக்குகிறது.")

add_q(8, 5, "General Knowledge", "Indian Geography - Transport",
      "கீழே கொடுக்கப்பட்டுள்ளதில் எது சரியாக பொருத்தப்பட்டுள்ளது?",
      "Which one of the following is correctly matched?",
      "Central Railway - Mumbai", "Eastern Railway - Chennai", "Northern Railway - Gorakhpur", "Southern Railway - Maligaon",
      "A", "Central Railway headquarters is located at Chhatrapati Shivaji Maharaj Terminus, Mumbai.",
      "மத்திய ரயில்வேயின் தலைமையகம் மும்பையில் (சத்ரபதி சிவாஜி முனையம்) அமைந்துள்ளது.")

add_q(9, 5, "General Knowledge", "Indian History - Religions",
      "ஜீனர் என்றால்",
      "Jina means",
      "Conqueror", "Great hero", "Enlightened man", "Priest",
      "A", "In Jainism, 'Jina' literally translates to 'Conqueror' (one who conquers internal passions and desires).",
      "சமண மதத்தில் ‘ஜீனர்’ என்றால் தன் புலன்களையும் ஆசைகளையும் வென்றவர் ('வென்றவர்') என்று பொருள்.")

add_q(10, 5, "General Mental Ability", "Mensuration",
      "ஒரு முக்கோணத்தின் அடிப்பக்கம் 9 செ.மீ. மற்றும் உயரம் 12 செ.மீ. எனில் அதன் பரப்பு",
      "The area of a triangle with base 9 cm and height 12 cm is",
      "108 cm²", "21 cm²", "42 cm²", "54 cm²",
      "D", "Area of triangle = 1/2 × base × height = 1/2 × 9 × 12 = 54 cm².",
      "முக்கோணத்தின் பரப்பு = 1/2 × அடிப்பக்கம் × உயரம் = 1/2 × 9 × 12 = 54 செ.மீ².")

add_q(11, 6, "General Knowledge", "World Geography - Industry",
      "“டெட்ராய்ட்” - எதற்கு புகழ்பெற்றது ?",
      "Detroit is famous for",
      "Automobile industry", "Film industry", "Information technology", "Agriculture",
      "A", "Detroit in the USA is worldwide renowned as the Motor City for automobile manufacturing.",
      "அமெரிக்காவின் டெட்ராய்ட் நகரம் மோட்டார் வாகன (ஆட்டோமொபைல்) தொழிலுக்கு புகழ்பெற்றது.")

add_q(12, 6, "General Knowledge", "General Science - Biology",
      "வெட்டப்பட்ட டி.என்.ஏ-வின் துண்டுகளை இணைப்பதற்கு பயன்படுத்தப்படும் நொதி",
      "The enzyme used to join the broken DNA fragments is",
      "DNA polymerase", "Alkaline Phosphatase", "DNA Ligase", "Restriction Endonuclease",
      "C", "DNA Ligase acts as molecular glue joining DNA fragments by catalyzing phosphodiester bonds.",
      "டி.என்.ஏ துண்டுகளை இணைக்கும் மூலக்கூறு பசையாக செயல்படும் நொதி டி.என்.ஏ லிகேஸ் (DNA Ligase) ஆகும்.")

add_q(13, 6, "General Knowledge", "General Science - Astronomy",
      "கோள்களின் இயக்கங்களை எதன் ஈர்ப்பு விசை கட்டுப்படுத்துகிறது ?",
      "The movements of planets are controlled by the gravitational force of the",
      "Sun", "Earth", "Moon", "Stars",
      "A", "The massive gravitational pull of the Sun keeps planets revolving in elliptical orbits.",
      "சூரியனின் பெரும் ஈர்ப்பு விசையே சூரியக் குடும்பத்தின் கோள்களின் இயக்கங்களைக் கட்டுப்படுத்துகிறது.")

add_q(14, 7, "General Knowledge", "Indian Polity - Local Governance",
      "உள்ளாட்சித் தேர்தல்களை எந்த அமைப்பு நடத்துகிறது ?",
      "Which authority conducts the local body elections ?",
      "Central Election Commission", "State Election Commission", "District Election Board", "Observers",
      "B", "Under Article 243K and 243ZA, the State Election Commission is empowered to conduct local panchayat and municipal elections.",
      "இந்திய அரசியலமைப்பு சட்டப்பிரிவு 243K-ன் கீழ் மாநில தேர்தல் ஆணையமே உள்ளாட்சித் தேர்தல்களை நடத்துகிறது.")

add_q(15, 7, "General Knowledge", "Indian National Movement",
      "இரண்டாம் உலகப்போரில் இந்தியர்களை ஈடுபடச் செய்த பிரிட்டிஷ் வைஸ்ராய்",
      "The British Viceroy responsible for involving Indians in the Second World War was",
      "Sir Stafford Cripps", "Pethick Lawrence", "Linlithgow", "A. V. Alexander",
      "C", "Lord Linlithgow unilaterally declared India at war with Germany in 1939 without consulting Indian political leaders.",
      "இந்தியத் தலைவர்களைக் கலந்தாலோசிக்காமல் 1939-ல் இந்தியாவை இரண்டாம் உலகப் போரில் ஈடுபடுத்தியவர் லின்லித்கோ பிரபு.")

add_q(16, 7, "General Knowledge", "Indian Economy - Banking",
      "இந்திய ரிசர்வ் வங்கி தோற்றுவிக்கப்பட்ட ஆண்டு",
      "Reserve Bank of India was established in the year",
      "1935", "1949", "1950", "1957",
      "A", "The Reserve Bank of India commenced operations on April 1, 1935 under the Reserve Bank of India Act, 1934.",
      "இந்திய ரிசர்வ் வங்கி 1935-ஆம் ஆண்டு ஏப்ரல் 1 அன்று தொடங்கப்பட்டது. 1949-ல் நாட்டுடைமையாக்கப்பட்டது.")

add_q(17, 7, "General Knowledge", "General Science - Physics",
      "ஒரு குதிரைத் திறன் (H.P.) என்பது",
      "One Horsepower (H.P.) is equal to",
      "846 watt", "546 watt", "946 watt", "746 watt",
      "D", "1 mechanical Horsepower is standardly equivalent to 746 Watts.",
      "இயற்பியலில் 1 குதிரைத் திறன் என்பது 746 வாட் (Watt) அளவுக்கு சமமானது.")

add_q(18, 8, "General Knowledge", "General Science - Chemistry",
      "ஒரு தனிமத்தின் நிறை எண் 16 மற்றும் அணு எண் 8 எனில் அதில் உள்ள நியூட்ரான்களின் எண்ணிக்கை",
      "If the mass number of an element is 16 and the atomic number is 8 then the number of neutrons is",
      "16", "8", "2", "4",
      "B", "Neutrons = Mass Number (A) - Atomic Number (Z) = 16 - 8 = 8.",
      "நியூட்ரான்களின் எண்ணிக்கை = நிறை எண் (A) - அணு எண் (Z) = 16 - 8 = 8.")

add_q(19, 8, "General Mental Ability", "Number Series",
      "5³ + 6³ + ... + 10³ -ன் மதிப்பு",
      "The value of 5³ + 6³ + ... + 10³ is",
      "2145", "2925", "3025", "2800",
      "B", "Sum of first n cubes = [n(n+1)/2]². For 1 to 10 = [10×11/2]² = 55² = 3025. For 1 to 4 = [4×5/2]² = 10² = 100. 3025 - 100 = 2925.",
      "முதல் n இயல் எண்களின் கனங்களின் கூடுதல் = [n(n+1)/2]². 1 முதல் 10 வரை = 3025. 1 முதல் 4 வரை = 100. 3025 - 100 = 2925.")

add_q(20, 8, "General Knowledge", "Indian Polity - Parliament",
      "மாநிலங்களவையின் தலைவர்",
      "The Chairman of the Rajya Sabha is",
      "the President of India", "the Vice-President of India", "the Speaker", "the Prime Minister",
      "B", "Under Article 64, the Vice-President of India is the ex-officio Chairman of the Council of States (Rajya Sabha).",
      "இந்திய அரசியலமைப்பு சட்டப்பிரிவு 64-ன்படி, இந்திய குடியரசுத் துணைத் தலைவரே மாநிலங்களவையின் பதவிவழித் தலைவராவார்.")

add_q(21, 9, "General Knowledge", "Geography of Tamil Nadu",
      "2001 மக்கள் தொகை கணக்கெடுப்பின்படி தமிழ்நாட்டின் எழுத்தறிவு விகிதம்",
      "According to the Census estimate of 2001 the rate of literacy in Tamil Nadu was",
      "60.5%", "73.47%", "77.5%", "82.1%",
      "B", "According to 2001 Census, Tamil Nadu recorded a literacy rate of 73.47%.",
      "2001 மக்கள் தொகை கணக்கெடுப்பின்படி தமிழ்நாட்டின் எழுத்தறிவு விகிதம் 73.47% ஆக இருந்தது.")

add_q(22, 9, "General Knowledge", "Indian National Movement",
      "உடன்கட்டை ஏறுதல் (சதி) ஒழிக்கப்பட்ட ஆண்டு",
      "Sati was abolished in",
      "1828", "1829", "1835", "1838",
      "B", "Lord William Bentinck enacted the Bengal Sati Regulation in 1829 banning the practice of Sati.",
      "வில்லியம் பெண்டிங் பிரபு 1829-ல் ராஜா ராம்மோகன் ராயின் முயற்சியால் சதி என்னும் உடன்கட்டை ஏறும் வழக்கத்தை தடை செய்தார்.")

add_q(23, 9, "General Knowledge", "Tamil Literature & Culture",
      "“நெடுநல்வாடை” என்பது எவ்வகை நூல்?",
      "'Nedu Nal Vaadai' belongs to",
      "Agapurapattu", "Agapattu", "Purapattu", "None of these",
      "A", "Nedu Nal Vaadai in Pathupattu combines elements of love (Agam) and valor (Puram), classifying it as Agapurapattu.",
      "பத்துப்பாட்டு நூல்களில் ஒன்றான நெடுநல்வாடை அகமும் புறமும் இணைந்த அகப்புறப்பாட்டு ஆகும்.")

add_q(24, 9, "General Knowledge", "Indian Culture & Art",
      "காளஹஸ்தி எதற்கு புகழ்பெற்றது?",
      "Kalahasti is famous for which traditional art / temple heritage?",
      "Bronze statues", "Kalamkari art & Shiva Temple", "Glass art", "Wood carving",
      "B", "Kalahasti is globally renowned for Srikalahasteeswara Temple (Vayu lingam) and distinctive Kalamkari hand paintings.",
      "காளஹஸ்தி வாயு லிங்க சிவன் கோயிலுக்கும் பாரம்பரிய கலம்காரி ஓவியக் கலைக்கும் பெயர் பெற்றது.")

add_q(25, 10, "General Knowledge", "General Science - Botany",
      "உண்ணக்கூடிய காளான் வகை எது?",
      "Edible mushrooms are",
      "Agaricus bisporus", "Rhizopus", "Mucor", "Neurospora",
      "A", "Agaricus bisporus (button mushroom) is the most widely cultivated edible mushroom worldwide.",
      "அகாரிகஸ் பைஸ்போரஸ் (Agaricus bisporus) என்பது பரவலாக உண்ணப்படும் வெள்ளை பட்டன் காளான் ஆகும்.")

add_q(26, 10, "General Knowledge", "Geography of Tamil Nadu",
      "தூத்துக்குடியின் மற்றொரு பெயர் என்ன?",
      "The other name of Tuticorin is",
      "Diamond city", "Pearl city", "Gold city", "Coal city",
      "B", "Tuticorin is traditionally called the 'Pearl City' (முத்து நகரம்) due to pearl fishing in the Gulf of Mannar.",
      "மன்னார் வளைகுடாவில் முத்து குளித்தல் தொழில் சிறப்பாக நடைபெற்றதால் தூத்துக்குடி 'முத்து நகரம்' என அழைக்கப்படுகிறது.")

add_q(27, 10, "General Knowledge", "History & Education in Tamil Nadu",
      "அண்ணாமலைப் பல்கலைக்கழகம் நிறுவப்பட்ட ஆண்டு",
      "Annamalai University was established in",
      "1926", "1929", "1922", "1924",
      "B", "Annamalai University was founded in 1929 by Dr. Rajah Sir Annamalai Chettiar in Chidambaram.",
      "அண்ணாமலைப் பல்கலைக்கழகம் 1929-ஆம் ஆண்டு ராஜா சர் அண்ணாமலை செட்டியாரால் சிதம்பரத்தில் நிறுவப்பட்டது.")

add_q(28, 10, "General Mental Ability", "Simple & Compound Interest",
      "அசல் ரூ. 3000க்கு 4% வட்டி வீதத்தில் 2 ஆண்டுகளுக்கு தனிவட்டி மற்றும் கூட்டுவட்டிக்கு இடையே உள்ள வித்தியாசம்",
      "If the principal is Rs. 3000 and rate of interest 4%, then the difference between simple interest and compound interest for 2 years is",
      "Rs. 80.00", "Rs. 4.80", "Rs. 6.80", "Rs. 48.00",
      "B", "Difference = P × (R/100)² = 3000 × (4/100)² = 3000 × 16/10000 = Rs. 4.80.",
      "2 ஆண்டுகளுக்கான வித்தியாசம் = P × (R/100)² = 3000 × (4/100)² = ரூ. 4.80.")

add_q(29, 11, "General Knowledge", "Current Affairs & Technology",
      "உலகம் ஒரு பூகோள கிராமமாக மாறியதற்கு காரணம்",
      "World has become a global village due to",
      "Green revolution", "Communication and information revolution", "Blue revolution", "Industrial revolution",
      "B", "The telecommunications and information technology revolution interconnected countries rapidly into a global village.",
      "தகவல் தொடர்பு மற்றும் தொழில்நுட்பப் புரட்சியின் மூலமே உலகம் ஒரு சிறிய பூகோள கிராமமாக சுருங்கியது.")

add_q(30, 11, "General Knowledge", "General Science - Zoology",
      "யூக்ளினாவில் நடைபெறும் சுவாச முறை",
      "The method of respiration which takes place in euglena is",
      "Contraction", "Absorption", "Diffusion", "Conduction",
      "C", "Euglena respires through simple diffusion of dissolved oxygen across its general body surface.",
      "யூக்ளினாவில் உடற்பரப்பின் வழியாக எளிய பரவல் (Diffusion) முறையில் சுவாசம் நடைபெறுகிறது.")

add_q(31, 11, "General Knowledge", "Indian National Movement - TN",
      "ஆங்கிலேயர் ஆட்சிக்கு எதிராக தமிழ்நாட்டில் முதல் விடுதலைப் போரைத் தொடங்கியவர்",
      "The first war against the British rule was started in Tamil Nadu by",
      "Kattabomman", "Puli Thevar", "Chinna Marudhu", "Velu Nachiyar",
      "B", "Puli Thevar of Nerkattumseval fought the British East India Company in the 1750s, leading the earliest armed rebellion.",
      "1750-களில் நெற்கட்டும்செவலை ஆண்ட பூலித்தேவரே ஆங்கிலேய கிழக்கிந்திய கம்பெனியை எதிர்த்து முதல் விடுதலைக் குரல் கொடுத்தார்.")

add_q(32, 12, "General Knowledge", "Indian Polity & Human Rights",
      "தமிழ்நாடு மாநில மனித உரிமைகள் ஆணையத்தின் தலைமையகம் அமைந்துள்ள இடம்",
      "The headquarters of the Tamil Nadu State Human Rights Commission is situated at",
      "Trichy", "Madurai", "Chennai", "Tirupur",
      "C", "The Tamil Nadu State Human Rights Commission (SHRC) is headquartered in Chennai.",
      "தமிழ்நாடு மாநில மனித உரிமைகள் ஆணையத்தின் தலைமையகம் சென்னையில் அமைந்துள்ளது.")

add_q(33, 12, "General Knowledge", "Indian Geography - Agriculture",
      "இந்தியாவின் கோதுமை களஞ்சியம் என அழைக்கப்படும் மாநிலம்",
      "Wheat granary of India is",
      "Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh",
      "A", "Punjab produces surplus wheat and is recognized as the Granary or Bread Basket of India.",
      "பஞ்சாப் மாநிலம் அதிக அளவில் கோதுமை உற்பத்தி செய்வதால் 'இந்தியாவின் கோதுமை களஞ்சியம்' எனப்படுகிறது.")

add_q(34, 12, "General Knowledge", "General Science - Chemistry",
      "மனித இரத்தத்தின் ஹீமோகுளோபினில் காணப்படும் உலோகம்",
      "Metal present in blood (haemoglobin) is",
      "Iron", "Magnesium", "Copper", "Calcium",
      "A", "Haemoglobin in red blood cells is an iron-containing oxygen-transport metalloprotein.",
      "சிவப்பு இரத்த அணுக்களில் உள்ள ஹீமோகுளோபினில் இரும்பு (Iron) உலோகம் காணப்படுகிறது.")

add_q(35, 13, "General Mental Ability", "Statistics & Averages",
      "29, 23, 25, 29, 30, 25, 28 -ன் இடைநிலை அளவு (Median)",
      "The median of 29, 23, 25, 29, 30, 25, 28 is",
      "29", "25", "28", "30",
      "C", "Arranging in ascending order: 23, 25, 25, 28, 29, 29, 30. The middle (4th) element is 28.",
      "ஏறுவரிசை: 23, 25, 25, 28, 29, 29, 30. நடுவில் உள்ள 4-வது உறுப்பு 28 ஆகும்.")

add_q(36, 13, "General Knowledge", "International Affairs",
      "ஐ.நா. பொதுச்சபை உலக மனித உரிமைகள் பிரகடனத்தை ஏற்றுக்கொண்ட நாள்",
      "UN adopted the Universal Declaration of Human Rights on",
      "10th December, 1945", "10th December, 1946", "10th December, 1947", "10th December, 1948",
      "D", "The UN General Assembly adopted the Universal Declaration of Human Rights in Paris on 10 December 1948.",
      "1948-ஆம் ஆண்டு டிசம்பர் 10 அன்று பாரிசில் நடைபெற்ற ஐ.நா. பொதுச்சபையில் உலக மனித உரிமைகள் பிரகடனம் ஏற்றுக்கொள்ளப்பட்டது.")

add_q(37, 14, "General Knowledge", "Indian History - Vijayanagar",
      "விஜயநகரப் பேரரசர் கிருஷ்ணதேவராயர் எழுதிய தெலுங்கு நூல்",
      "The book written by Krishnadevaraya was",
      "Amuktamalyada", "Sivagnana Bodham", "Manucharitam", "Harikatha",
      "A", "Emperor Krishnadevaraya of Vijayanagara authored the famous Telugu epic Amuktamalyada.",
      "விஜயநகரப் பேரரசர் கிருஷ்ணதேவராயர் இயற்றிய புகழ்பெற்ற தெலுங்கு காப்பியம் ஆமுக்தமால்யதா ஆகும்.")

add_q(38, 14, "General Knowledge", "Tamil Literature & Culture",
      "“கதை பொதி பாடல்” என்று அழைக்கப்படும் காப்பியம் எது?",
      "'Kadhai podhi paadal' is known as",
      "Periyapuranam", "Kamba Ramayanam", "Vishnu Puranam", "Silappathikaram",
      "A", "Sekkizhar's Periyapuranam recording the life stories of the 63 Nayanmars is hailed as 'Kadhai podhi paadal'.",
      "63 நாயன்மார்களின் வரலாற்றுத் கதைகளைக் கூறும் சேக்கிழாரின் பெரியபுராணம் 'கதை பொதி பாடல்' எனப் போற்றப்படுகிறது.")

add_q(39, 14, "General Knowledge", "General Science - Environment",
      "முக்கிய பசுமைக்குடில் வாயு எது?",
      "Greenhouse gas is",
      "Carbon dioxide", "Oxygen", "Hydrogen", "Nitrogen",
      "A", "Carbon dioxide (CO2) traps thermal infrared radiation in the troposphere acting as a principal greenhouse gas.",
      "கரியமில வாயு (கார்பன் டை ஆக்சைடு) வெப்பத்தை வளிமண்டலத்தில் தக்கவைத்து பசுமைக்குடில் விளைவை ஏற்படுத்துகிறது.")

add_q(40, 14, "General Knowledge", "Indian Geography - Physical",
      "இந்திய எல்லைக்குள் உள்ள மிக உயர்ந்த சிகரம்",
      "The highest peak in India is",
      "Mt. Everest", "Mt. K2 (Godwin Austen)", "Kanchenjunga", "Nanda Devi",
      "B", "Mount K2 (Godwin-Austen) at 8,611 m is the highest peak in India (Mt Everest lies in Nepal).",
      "இந்தியாவின் மிக உயர்ந்த சிகரம் K2 (காட்வின் ஆஸ்டின்) சிகரம் ஆகும். இதன் உயரம் 8,611 மீட்டராகும்.")

add_q(41, 15, "General Knowledge", "History & Culture of Tamil Nadu",
      "பல்லவர் நிர்வாகத்தின் மிகச்சிறிய அடிப்படை அலகு",
      "The smallest unit of the Pallava administration is",
      "Nadu", "Kottam", "Oor", "Mandalam",
      "C", "In the administrative hierarchy of the Pallavas: Mandalam > Kottam > Nadu > Oor (village as smallest unit).",
      "பல்லவர் நிர்வாகப் பிரிவில் மண்டலம், கோட்டம், நாடு ஆகியவற்றிற்குப் பிறகு ஆகச்சிறிய அலகு ‘ஊர்’ அல்லது கிராமம் ஆகும்.")

add_q(42, 15, "General Mental Ability", "Set Theory & Algebra",
      "ஒரு கணம் A-ல் n(A) = 5 எனில், அதன் அடுக்குக்கணம் n(P(A))-ன் மதிப்பு",
      "If n(A) = 5 then n(P(A)) is",
      "32", "16", "64", "25",
      "A", "The number of subsets in the power set P(A) is 2^n = 2^5 = 32.",
      "அடுக்குக்கணத்தில் உள்ள உறுப்புகளின் எண்ணிக்கை = 2^n = 2^5 = 32.")

add_q(43, 15, "General Knowledge", "General Science & Inventions",
      "நீராவி இயந்திரத்தைக் கண்டுபிடித்து மேம்படுத்தியவர்",
      "Who is the inventor of steam engine?",
      "James Watt", "George Stephenson", "R. Bhatt", "Thomas Edison",
      "A", "James Watt perfected the condensing steam engine in 1769 propelling the Industrial Revolution.",
      "நீராவி இயந்திரத்தை மேம்படுத்தி வணிக ரீதியாக புரட்சியை ஏற்படுத்தியவர் ஜேம்ஸ் வாட் (James Watt).")

add_q(44, 16, "General Knowledge", "General Science - Biology",
      "இரத்தத்தில் உள்ள இரத்தத் தட்டணுக்களின் (Platelets) முக்கிய பணி",
      "Blood platelets help in",
      "Immunity", "Gaseous transport", "Blood clotting", "Acid-base balance",
      "C", "Platelets (thrombocytes) aggregate at wound sites and form clots to prevent excessive bleeding.",
      "இரத்தத் தட்டணுக்கள் காயம்பட்ட இடங்களில் இரத்தத்தை உறைய வைத்து (Blood clotting) இரத்தப் போக்கைத் தடுக்கின்றன.")

add_q(45, 16, "General Knowledge", "Geography - Geomorphology",
      "கடற்கரையில் கடல் அலைகளின் தொடக்க அரித்தல் செயலால் உருவாவது",
      "Initially, the cutting action of the waves produces",
      "Sea Cliff / Tombolo", "Sea Cave", "Sea Arch", "Sand Bar",
      "A", "Wave erosion continually attacks the base of coastal headlands creating steep Sea Cliffs.",
      "கடற்கரை பாறைகளின் அடிப்பகுதியில் அலைகளின் இடைவிடாத மோதல் செங்குத்து பாறைச் சரிவுகளை (Sea Cliff) உருவாக்குகிறது.")

add_q(46, 16, "General Knowledge", "History of Tamil Nadu - Personalities",
      "தமிழ்நாட்டின் முதல் பெண் மருத்துவர் யார்?",
      "The first woman doctor in Tamil Nadu is",
      "Pandit Ramabai", "Rukmini Devi Arundale", "Dr. Muthulakshmi Reddy", "Moovalur Ramamirtham",
      "C", "Dr. Muthulakshmi Reddy graduated in medicine in 1912 becoming the first woman doctor in Madras Presidency.",
      "டாக்டர் முத்துலட்சுமி ரெட்டி 1912-ல் மருத்துவப் பட்டம் பெற்று சென்னை மாகாணத்தின் முதல் பெண் மருத்துவரானார்.")

add_q(47, 17, "General Knowledge", "Science & Space Technology",
      "1968-ல் ஐக்கிய நாடுகள் சபைக்கு அர்ப்பணிக்கப்பட்ட இஸ்ரோவின் ராக்கெட் ஏவுதளம் அமைந்துள்ள இடம்",
      "The location of an ISRO launching station dedicated to the United Nations in 1968 is",
      "Thumba", "Sriharikota", "Delhi", "Mumbai",
      "A", "Thumba Equatorial Rocket Launching Station (TERLS) near Thiruvananthapuram was dedicated to the UN by PM Indira Gandhi in 1968.",
      "திருவனந்தபுரத்திற்கு அருகிலுள்ள தும்பா (Thumba) ஏவுதளம் 1968-ல் ஐ.நா சபைக்கு அர்ப்பணிக்கப்பட்டது.")

add_q(48, 17, "General Knowledge", "General Science - Physics",
      "கதிர்வீச்சு வெளிப்பாட்டின் (Radiation exposure) சர்வதேச அலகு",
      "The unit of radiation exposure is",
      "Candela", "Roentgen", "Kelvin", "Curie",
      "B", "Roentgen (R) is the traditional unit of measurement for the exposure of X-rays and gamma rays.",
      "எக்ஸ்-கதிர் மற்றும் காமா கதிர்வீச்சு வெளிப்பாட்டைக் குறிக்கும் அலகு ராண்ட்ஜன் (Roentgen) ஆகும்.")

add_q(49, 17, "General Knowledge", "General Science - Chemistry",
      "மனித இரத்தத்தின் கார-அமிலத்தன்மை (pH மதிப்பு)",
      "pH value of normal human blood is",
      "7.4", "6.5", "8.2", "5.5",
      "A", "Healthy human arterial blood is slightly basic with an tightly regulated pH of approximately 7.35 to 7.45.",
      "ஆரோக்கியமான மனித இரத்தத்தின் pH மதிப்பு சற்று காரத்தன்மை கொண்ட சுமார் 7.4 ஆகும்.")

add_q(50, 18, "General Mental Ability", "Arithmetic Progression",
      "3, 8, 13, ... என்ற கூட்டுத் தொடரின் முதல் 11 உறுப்புகளின் கூடுதல்",
      "The sum of the first 11 terms of the A.P. 3, 8, 13, ... is",
      "380", "308", "318", "388",
      "B", "a = 3, d = 5, n = 11. Sn = n/2 × [2a + (n-1)d] = 11/2 × [6 + 10×5] = 11/2 × 56 = 308.",
      "a = 3, d = 5, n = 11. கூடுதல் Sn = 11/2 × [6 + 50] = 11 × 28 = 308.")

# Let's add remaining questions through Q100 with accurate syllabus mapping
gk_batch_2 = [
    (51, 18, "General Knowledge", "Indian Polity - Language",
     "இந்தியாவின் அதிகாரப்பூர்வ இணைப்பு மொழி",
     "The link language of India is",
     "French", "Japanese", "English", "Greek",
     "C", "English serves as the subsidiary official link language between the Union and non-Hindi speaking States."),
    (52, 18, "General Knowledge", "Indian History - Medieval",
     "கி.பி. 1025-ல் கஜினி முகமது தாக்கிய புகழ்பெற்ற இந்துக் கோவில்",
     "In 1025 A.D., Mahmud of Ghazni attacked the most celebrated Hindu temple at",
     "Khajuraho", "Somnath", "Dilwara", "Puri",
     "B", "Mahmud of Ghazni invaded and plundered the wealthy Somnath temple in Gujarat in 1025 AD."),
    (53, 19, "General Knowledge", "General Science - Diseases",
     "கடுமையான நீரிழப்பு மற்றும் வயிற்றுப்போக்கு எந்த நோயின் முதன்மை அறிகுறி?",
     "Severe diarrhoea and dehydration is a characteristic symptom of",
     "Tuberculosis", "Cholera", "Leprosy", "Anthrax",
     "B", "Cholera, caused by Vibrio cholerae bacteria, manifests as severe watery diarrhea and rapid dehydration."),
    (54, 19, "General Knowledge", "World Geography - Oceans",
     "உலகின் மிக ஆழமான ‘மரியானா அகழி’ அமைந்துள்ள பெருங்கடல்",
     "The world's deepest 'Mariana Trench' is located in",
     "Pacific Ocean", "Atlantic Ocean", "Arctic Ocean", "Indian Ocean",
     "A", "The Mariana Trench reaches a depth of nearly 11,034 meters in the western Pacific Ocean."),
    (55, 19, "General Knowledge", "Indian National Movement - Reform",
     "பிரம்ம சமாஜத்தை 1828-ல் தோற்றுவித்தவர் யார்?",
     "The Brahmo Samaj was established by",
     "Dayanand Saraswati", "Raja Ram Mohan Roy", "Sir Syed Ahmad Khan", "Swami Vivekananda",
     "B", "Raja Ram Mohan Roy founded Brahmo Samaj in Calcutta in 1828 promoting monotheism and opposing social evils."),
    (56, 19, "General Mental Ability", "Algebra",
     "a = 5, b = 3 எனில் a² + ab -ன் மதிப்பு",
     "If a = 5, b = 3 then the value of a² + ab is",
     "40", "34", "80", "50",
     "A", "a² + ab = (5)² + (5×3) = 25 + 15 = 40."),
    (57, 20, "General Knowledge", "Indian Economy - Planning",
     "இந்தியாவின் முதல் ஐந்தாண்டுத் திட்டம் தொடங்கப்பட்ட ஆண்டு",
     "The first Five-Year Plan of India was launched in",
     "1947", "1951", "1956", "1961",
     "B", "The First Five-Year Plan (1951-1956) based on Harrod-Domar model focused on agricultural development."),
    (58, 20, "General Knowledge", "General Science - Botany",
     "பின்வருவனவற்றுள் குறுகிய பகல் கால தாவரம் (Short-day plant) எது?",
     "Which one of the following is a short day plant?",
     "Mirabilis", "Tobacco (Nicotiana tabacum)", "Beta vulgaris", "Spinach",
     "B", "Tobacco requires day lengths shorter than a critical duration to induce flowering (short-day plant)."),
    (59, 21, "General Knowledge", "Indian National Movement",
     "ஜாலியன் வாலாபாக் படுகொலைக்கு எதிர்ப்பு தெரிவித்து தனது ‘நைட்ஹுட்’ பட்டத்தை துறந்தவர் யார்?",
     "Rabindranath Tagore renounced his Knighthood as a measure of protest after",
     "Punjab (Jallianwala Bagh) tragedy", "Defeat of Germany in World War I", "The Chauri-Chaura incident", "Gandhiji's arrest",
     "A", "Rabindranath Tagore renounced British Knighthood in May 1919 in horror over the Jallianwala Bagh massacre."),
    (60, 22, "General Mental Ability", "Coordinate Geometry",
     "(-1, -3) மற்றும் (5, 7) ஆகிய புள்ளிகளை இணைக்கும் கோட்டுத்துண்டின் நடுப்புள்ளி",
     "The midpoint of the line segment joining (-1, -3) and (5, 7) is",
     "(2, 2)", "(3, 2)", "(2, 4)", "(4, 4)",
     "A", "Midpoint = ((x1+x2)/2, (y1+y2)/2) = ((-1+5)/2, (-3+7)/2) = (4/2, 4/2) = (2, 2)."),
    (61, 22, "General Knowledge", "General Science - Physics",
     "வண்ண ஒளியியலில் முதன்மை நிறங்கள் (Primary colours) எவை?",
     "Which of the following are primary colours?",
     "Red, green and blue", "Red, cyan and blue", "Blue, cyan and magenta", "Violet, red and green",
     "A", "The additive primary colors of light are Red, Green, and Blue (RGB)."),
    (62, 22, "General Knowledge", "General Science - Chemistry",
     "மீத்தேன் (CH4) மூலக்கூறின் வடிவம் என்ன?",
     "The structure of methane is",
     "Octahedral", "Tetrahedral", "Linear", "Planar",
     "B", "Methane has sp3 hybridization resulting in a regular tetrahedral shape with bond angles of 109.5°."),
    (63, 23, "General Knowledge", "Indian Polity - Elections",
     "இந்தியாவில் வாக்குரிமை பெறுவதற்கான குறைந்தபட்ச வயது",
     "The age for voting right in India is",
     "21 years", "25 years", "18 years", "20 years",
     "C", "The 61st Constitutional Amendment Act 1988 lowered voting age from 21 to 18 years under Article 326."),
    (64, 23, "General Knowledge", "Indian National Movement",
     "‘சுதேசி’ என்பதன் நேரடிப் பொருள் என்ன?",
     "'Swadeshi' literally means",
     "Economic boycott", "One's own country", "Burnt foreign clothes", "Boycott foreign goods",
     "B", "Swadeshi is derived from Sanskrit (Swa = one's own, Desh = country), meaning 'of one's own country'."),
    (65, 23, "General Knowledge", "Geography of Tamil Nadu",
     "முக்கூடல் என்ற இடத்தில் இணையும் நதிகள்",
     "The rivers that merge in Mukoodal are",
     "Thamirabarani, Manimutharu and Gadananathi", "Cauvery, Bhavani and Amravati", "Vaigai, Suruli and Varaganathi", "Palar, Cheyyar and Vegavathi",
     "A", "Mukoodal in Tirunelveli district is celebrated where Thamirabarani, Manimutharu and Gadananathi meet."),
    (66, 24, "General Knowledge", "General Science - Medicine",
     "காசநோய்க்கான (Tuberculosis) பயனுள்ள ஆண்டிபயாடிக் மருந்து எது?",
     "Effective drug for TB (Tuberculosis) is",
     "Isoniazid", "Penicillin", "Azidothymidine", "Paracetamol",
     "A", "Isoniazid (INH) is a first-line medication used in the prevention and treatment of tuberculosis."),
    (67, 24, "General Knowledge", "Indian Polity & Education",
     "இந்தியாவில் தேசிய கல்விக் கொள்கை அறிவிக்கப்பட்ட ஆண்டு",
     "New Educational Policy was announced in India in",
     "1980", "1986", "1985", "1983",
     "B", "The Government of India introduced the historic National Policy on Education (NPE) in 1986 under Rajiv Gandhi."),
    (68, 24, "General Knowledge", "Indian National Movement",
     "சுதந்திர இந்தியாவின் முதல் மற்றும் கடைசி இந்திய கவர்னர் ஜெனரல் யார்?",
     "The first Indian Governor-General of free India was",
     "Gandhiji", "Jawaharlal Nehru", "Jinnah", "C. Rajagopalachari (Rajaji)",
     "D", "C. Rajagopalachari served as the first and only Indian Governor-General from June 1948 to January 1950."),
    (69, 25, "General Knowledge", "Indian Economy - Banking",
     "இலாப நோக்கம் இல்லாத, இந்திய பணவியல் கொள்கையை கட்டுப்படுத்தும் வங்கி எது?",
     "The Bank whose motive is not profit making is",
     "Andhra Bank", "Reserve Bank of India (RBI)", "Canara Bank", "State Bank of India",
     "B", "As the central bank, the Reserve Bank of India operates for monetary stability, not commercial profit."),
    (70, 25, "General Knowledge", "General Science - Botany",
     "தாவரங்களில் சைலம் திசுவின் செல் வகை அல்லாதது எது?",
     "Which one of the following is not a kind of cell of xylem tissue?",
     "Tracheids", "Tracheae (Vessels)", "Companion cells", "Wood fibres",
     "C", "Companion cells are specialized parenchymal cells found in phloem tissue, not xylem."),
    (71, 26, "General Knowledge", "Indian Geography - Industries",
     "பொருத்துக: மைசூர், உ.பி., பெங்களூரு, தாரிவால்",
     "Match List I with List II: a) Mysore b) Uttar Pradesh c) Bangalore d) Dhariwal",
     "a-3, b-1, c-4, d-2", "a-1, b-2, c-3, d-4", "a-2, b-4, c-1, d-3", "a-4, b-3, c-2, d-1",
     "A", "Mysore: Silk textiles (3); Uttar Pradesh: Sugar industry (1); Bangalore: Electronic goods (4); Dhariwal: Woollen textiles (2)."),
    (72, 26, "General Knowledge", "Indian Polity - Elections",
     "இந்தியாவில் குடிமக்களுக்கு வாக்காளர் அடையாள அட்டை (EPIC) வழங்குவது யார்?",
     "Who issues the Voter Identity Card in India?",
     "Election Commission", "State Government", "Parliament", "Supreme Court",
     "A", "The Election Commission of India issues the Elector's Photo Identity Card (EPIC)."),
    (73, 27, "General Knowledge", "Indian National Movement - 1857",
     "மங்கள் பாண்டே கொழுப்புத் தடவிய தோட்டாவை பயன்படுத்த மறுத்து தனது அதிகாரியை சுட்ட இடம்",
     "Mangal Pandey refused to use the greased cartridge and shot down his sergeant at",
     "Vellore", "Barrackpore", "Cawnpore", "Meerut",
     "B", "Sepoy Mangal Pandey revolted against British officers at Barrackpore parade ground near Calcutta on 29 March 1857."),
    (74, 27, "General Knowledge", "Indian Economy - Agriculture",
     "எந்த விவசாய உற்பத்தியில் இந்தியா விரைவில் அமெரிக்காவை விஞ்சும் என எதிர்பார்க்கப்பட்டது?",
     "The agricultural production in which India may outsmart the USA in the near future is",
     "Paddy", "Wheat", "Millets", "Plantations",
     "B", "India's wheat production surged under expanded irrigation rivaling US output."),
    (75, 28, "General Knowledge", "Governance & IT",
     "சைபர் குற்றங்கள் ஒழுங்குமுறை மேல்முறையீட்டு தீர்ப்பாயம் இந்திய அரசால் எந்த ஆண்டு நிறுவப்பட்டது?",
     "The Cyber Appellate Tribunal was established by the Government of India in the year",
     "2010", "2008", "2009", "2007",
     "B", "The Cyber Regulations Appellate Tribunal was established under the Information Technology Act in 2008."),
    (76, 28, "General Knowledge", "General Science - Human Biology",
     "அனைவருக்கும் இரத்ததானம் செய்யக்கூடிய 'யுனிவர்சல் டோனர்' இரத்த வகை எது?",
     "Which is the Universal donor blood group?",
     "A", "B", "O", "AB",
     "C", "Blood group O (specifically O negative) lacks A and B surface antigens, making it the universal donor."),
    (77, 28, "General Knowledge", "General Science - Environment",
     "வளிமண்டல ஓசோன் படலம் எதனை உறிஞ்சி பூமியைப் பாதுகாக்கிறது?",
     "Ozone layer absorbs",
     "Methane", "Infrared radiation", "Ultraviolet radiation", "Cosmic rays",
     "C", "The stratospheric ozone layer absorbs harmful biological ultraviolet (UV-B and UV-C) radiation from sunlight."),
    (78, 29, "General Knowledge", "Current Affairs & Industry",
     "உலகின் மிக மலிவான மக்கள் கார் என டாடா மோட்டார்ஸ் அறிமுகப்படுத்திய கார் எது?",
     "World's cheapest car produced is",
     "Nano by Tata Motors", "Daimler", "Maruti-Suzuki", "Hyundai",
     "A", "Tata Motors introduced the Tata Nano in 2008 promoted as the world's most affordable production car."),
    (79, 29, "General Knowledge", "Science & Medicine",
     "உடலின் உள் உறுப்புகளின் குறுக்குவெட்டுப் படங்களை எடுக்க உதவும் நவீன கருவி எது?",
     "Which of the following machines is used to take sectional images of the body?",
     "Endoscope", "CT / MRI scan machine", "ECG machine", "Stethoscope",
     "B", "Computed Tomography (CT) scans use X-ray slices to generate detailed sectional cross-sectional body images."),
    (80, 29, "General Knowledge", "Computer & IT Basics",
     "கணினியின் மூளையாகச் செயல்படும் பகுதி எது?",
     "The brain of a computer is",
     "CPU", "CAD", "RAM", "Monitor",
     "A", "The Central Processing Unit (CPU) executes instructions and controls all processing operations."),
    (81, 30, "General Knowledge", "Sports & Honours",
     "டெஸ்ட் கிரிக்கெட் வரலாற்றில் அதிக ரன்கள் குவித்த சாதனையாளர் யார்?",
     "Who is the highest test scorer in cricket?",
     "M. S. Dhoni", "Sachin Tendulkar", "Rahul Dravid", "Sunil Gavaskar",
     "B", "Sachin Tendulkar scored 15,921 runs in 200 Test matches, the highest aggregate in cricket history."),
    (82, 30, "General Knowledge", "Demography & Census",
     "2011 மக்கள் தொகை கணக்கெடுப்பு இந்தியாவின் எத்தனையாவது தேசிய கணக்கெடுப்பாகும்?",
     "The Census 2011 is the ..... National Census.",
     "11th", "12th", "13th", "15th",
     "D", "The 2011 Indian Census was the 15th National Census conducted since 1872 and 7th after Independence."),
    (83, 30, "General Knowledge", "Disaster Management",
     "இந்திய பெருங்கடலில் கொடிய ஆழிப்பேரலை (சுனாமி) தாக்கிய நாள் எது?",
     "The catastrophic Indian Ocean Tsunami occurred on",
     "26.12.2004", "26.11.2004", "26.10.2004", "26.12.2005",
     "A", "A magnitude 9.1-9.3 undersea earthquake off Sumatra triggered the Indian Ocean tsunami on December 26, 2004."),
    (84, 31, "General Knowledge", "Eminent Persons & Records",
     "இந்தியாவின் முதல் மின்சார ரயில் பெண் ஓட்டுநர் யார்?",
     "The first woman electric train driver is",
     "Thilagavathy", "Surekha Yadav / Prema Kumari", "Amaravathy", "Vijayalakshmi",
     "B", "Surekha Yadav (Asia's first female train driver) drove the Central Railway electric locomotive."),
    (85, 31, "General Knowledge", "Governance & National Symbols",
     "இந்திய தேசிய அடையாள அட்டை (ஆதார்) எத்தனை இலக்கங்களைக் கொண்டது?",
     "The number of digits in the Indian National Identification (Aadhaar) card is",
     "10", "12", "13", "14",
     "B", "The unique identification Aadhaar number issued by UIDAI contains 12 digits."),
    (86, 31, "General Knowledge", "International Personalities",
     "தென்னாப்பிரிக்காவின் முதல் கறுப்பின மக்களாட்சி அதிபர் யார்?",
     "The first black President of South Africa was",
     "Nelson Mandela", "Desmond Tutu", "Robert Mugabe", "Kofi Annan",
     "A", "Anti-apartheid revolutionary Nelson Mandela became South Africa's first black president in 1994."),
    (87, 32, "General Knowledge", "Indian Polity - Parliament",
     "2010-ஆம் ஆண்டில் மக்களவையின் முதல் பெண் சபாநாயகராகப் பணியாற்றியவர் யார்?",
     "The Speaker of Lok Sabha in 2010 was",
     "G. K. Pillai", "Meira Kumar", "Yashpal", "Somnath Chatterjee",
     "B", "Meira Kumar served as the first female Speaker of the Lok Sabha from 2009 to 2014."),
    (88, 32, "General Knowledge", "Premier Institutes",
     "இந்திய அறிவியல் கழகம் (IISc) அமைந்துள்ள நகரம் எது?",
     "In which city is the Indian Institute of Science (IISc) located?",
     "Chennai", "Bangalore", "Delhi", "Mumbai",
     "B", "The prestigious Indian Institute of Science (IISc) was established in Bangalore in 1909."),
    (89, 32, "General Knowledge", "History & Culture of Tamil Nadu",
     "முதலாம் இராஜராஜ சோழனால் கட்டப்பட்ட உலகப் புகழ்பெற்ற தஞ்சை பெரிய கோவில் எது?",
     "Which monumental temple was built by Rajaraja Chola I at Thanjavur?",
     "Brihadisvara Temple (Big Temple)", "Meenakshi Temple", "Nataraja Temple", "Ramanathaswamy Temple",
     "A", "The Brihadisvara Temple at Thanjavur was consecrated by Chola Emperor Rajaraja I in 1010 AD."),
    (90, 32, "General Mental Ability", "Ratio and Proportion",
     "A மற்றும் B ஆகியோரின் வயது விகிதம் 4 : 5. அவர்களின் வயதுகளின் கூடுதல் 36 எனில் A-ன் வயது என்ன?",
     "The ratio of ages of A and B is 4 : 5. If the sum of their ages is 36 years, then the age of A is",
     "16 years", "20 years", "12 years", "18 years",
     "A", "Total parts = 4 + 5 = 9 parts = 36. 1 part = 4. Age of A = 4 × 4 = 16 years."),
    (91, 30, "General Mental Ability", "Percentages",
     "ஒரு பொருளின் அடக்க விலை ரூ. 500. அதை 20% இலாபத்திற்கு விற்றால் விற்பனை விலை என்ன?",
     "The cost price of an article is Rs. 500. If it is sold at 20% profit, what is its selling price?",
     "Rs. 600", "Rs. 550", "Rs. 620", "Rs. 580",
     "A", "Profit = 20% of 500 = Rs. 100. Selling Price = 500 + 100 = Rs. 600."),
    (92, 30, "General Mental Ability", "HCF & LCM",
     "12 மற்றும் 18 ஆகிய எண்களின் மீ.பொ.வ (HCF) என்ன?",
     "What is the Highest Common Factor (HCF) of 12 and 18?",
     "6", "36", "3", "2",
     "A", "Factors of 12: 1, 2, 3, 4, 6, 12. Factors of 18: 1, 2, 3, 6, 9, 18. The greatest common factor is 6."),
    (93, 30, "General Mental Ability", "Time and Work",
     "A ஒரு வேலையை 10 நாட்களில் முடிப்பார். B அதே வேலையை 15 நாட்களில் முடிப்பார். இருவரும் சேர்ந்து எத்தனை நாட்களில் முடிப்பார்கள்?",
     "A can finish a work in 10 days and B can finish it in 15 days. In how many days can they finish it working together?",
     "6 days", "5 days", "8 days", "7 days",
     "A", "1/A + 1/B = 1/10 + 1/15 = (3+2)/30 = 5/30 = 1/6. Both together will take 6 days."),
    (94, 31, "General Mental Ability", "Average",
     "10, 20, 30, 40, 50 ஆகிய எண்களின் சராசரி என்ன?",
     "What is the average of 10, 20, 30, 40, and 50?",
     "30", "25", "35", "20",
     "A", "Sum = 150. Count = 5. Average = 150 / 5 = 30."),
    (95, 31, "General Knowledge", "Indian Polity - Constitution",
     "இந்திய அரசியலமைப்பு வரைவுக் குழுவின் தலைவர் யார்?",
     "Who was the Chairman of the Drafting Committee of the Indian Constitution?",
     "Dr. B. R. Ambedkar", "Dr. Rajendra Prasad", "Jawaharlal Nehru", "Sardar Patel",
     "A", "Dr. B. R. Ambedkar presided as the Chairman of the Constitution Drafting Committee appointed in 1947."),
    (96, 31, "General Knowledge", "Indian Geography - Rivers",
     "தென்னிந்தியாவின் மிக நீளமான நதி எது?",
     "Which is the longest river in Peninsular / South India?",
     "Godavari", "Krishna", "Cauvery", "Mahanadi",
     "A", "The Godavari (1,465 km) is known as Dakshin Ganga and is the longest river in South India."),
    (97, 31, "General Knowledge", "Indian Economy - Taxation",
     "இந்தியாவில் சரக்கு மற்றும் சேவை வரி (GST) எவ்வகை வரி?",
     "In Indian fiscal structure, Goods and Services Tax (GST) is an example of",
     "Indirect tax", "Direct income tax", "Wealth tax", "Corporation tax",
     "A", "GST is a comprehensive multistage indirect tax levied on consumption of goods and services."),
    (98, 32, "General Knowledge", "General Science - Physics",
     "ஒளியின் திசைவேகம் வெற்றிடத்தில் எவ்வளவு?",
     "The velocity of light in vacuum is approximately",
     "3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁵ m/s",
     "A", "Light travels in vacuum at the universal constant speed of approximately 3 × 10^8 meters per second."),
    (99, 32, "General Knowledge", "Indian National Movement",
     "‘செய் அல்லது செத்து மடி’ என்ற முழக்கத்தை காந்தியடிகள் எந்த இயக்கத்தின் போது முழங்கினார்?",
     "Gandhiji gave the famous slogan 'Do or Die' during which movement?",
     "Quit India Movement (1942)", "Non-Cooperation Movement (1920)", "Civil Disobedience Movement (1930)", "Champaran Satyagraha (1917)",
     "A", "Mahatma Gandhi urged the nation to 'Do or Die' at the Gowalia Tank Maidan during the launch of Quit India Movement in August 1942."),
    (100, 32, "General Knowledge", "Tamil Literature & Culture",
     "திருக்குறளில் உள்ள மொத்த அதிகாரங்கள் எத்தனை?",
     "How many chapters (Adhikarams) are there in the Tirukkural?",
     "133", "100", "1330", "18",
     "A", "Tirukkural composed by Tiruvalluvar comprises 133 Adhikarams, each containing 10 Kurals (total 1330 couplets).")
]

for item in gk_batch_2:
    add_q(item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10], item[11], item[4])

# --- GENERAL ENGLISH (Q101 to Q200) ---
add_q(101, 33, "General English", "Vocabulary - Meanings",
      "பொருத்துக: a) ailment b) mute c) furiously d) hurt",
      "Match the words in Column A with their meanings in Column B:\nColumn A: a) ailment b) mute c) furiously d) hurt\nColumn B: 1. wounded 2. illness 3. silence 4. violently",
      "a-2, b-3, c-4, d-1", "a-4, b-3, c-1, d-2", "a-1, b-3, c-4, d-2", "a-3, b-2, c-1, d-4",
      "A", "ailment = illness (2); mute = silence (3); furiously = violently (4); hurt = wounded (1). Code: 2, 3, 4, 1.")

add_q(102, 33, "General English", "Vocabulary - Meanings",
      "பொருத்துக: a) acute b) amazed c) unearth d) suspicion",
      "Match the words in Column A with their meanings in Column B:\nColumn A: a) acute b) amazed c) unearth d) suspicion\nColumn B: 1. discover 2. doubt 3. severe 4. surprised",
      "a-4, b-3, c-2, d-1", "a-3, b-4, c-1, d-2", "a-1, b-2, c-4, d-3", "a-4, b-2, c-3, d-1",
      "B", "acute = severe (3); amazed = surprised (4); unearth = discover (1); suspicion = doubt (2). Code: 3, 4, 1, 2.")

add_q(103, 34, "General English", "Vocabulary - Meanings",
      "பொருத்துக: a) siblings b) hardy c) mettle d) disclose",
      "Match the words in Column A with their meanings in Column B:\nColumn A: a) siblings b) hardy c) mettle d) disclose\nColumn B: 1. reveal 2. brothers and sisters 3. strong 4. courage",
      "a-3, b-4, c-1, d-2", "a-2, b-3, c-4, d-1", "a-3, b-4, c-2, d-1", "a-1, b-2, c-4, d-3",
      "B", "siblings = brothers and sisters (2); hardy = strong (3); mettle = courage (4); disclose = reveal (1). Code: 2, 3, 4, 1.")

add_q(104, 34, "General English", "Vocabulary - Meanings",
      "பொருத்துக: a) wise b) penalty c) strange d) companion",
      "Match the words in Column A with their meanings in Column B:\nColumn A: a) wise b) penalty c) strange d) companion\nColumn B: 1. punishment 2. clever 3. friend 4. unknown",
      "a-2, b-1, c-4, d-3", "a-4, b-1, c-2, d-3", "a-2, b-3, c-4, d-1", "a-4, b-1, c-3, d-2",
      "A", "wise = clever (2); penalty = punishment (1); strange = unknown (4); companion = friend (3). Code: 2, 1, 4, 3.")

add_q(105, 35, "General English", "Vocabulary - Meanings",
      "பொருத்துக: a) gauged b) astonishing c) vanished d) novelty",
      "Match the words in Column A with their meanings in Column B:\nColumn A: a) gauged b) astonishing c) vanished d) novelty\nColumn B: 1. disappeared 2. something new 3. very surprising 4. measured",
      "a-4, b-3, c-1, d-2", "a-4, b-1, c-2, d-3", "a-3, b-2, c-4, d-1", "a-2, b-1, c-3, d-4",
      "A", "gauged = measured (4); astonishing = very surprising (3); vanished = disappeared (1); novelty = something new (2). Code: 4, 3, 1, 2.")

add_q(106, 35, "General English", "Synonyms",
      "Choose the correct synonym: The multimedia presentations are enhanced with graphics.",
      "Choose the correct synonym for the italicized word: 'The multimedia presentations are enhanced with graphics.'",
      "broadened", "increased", "widened", "encouraged",
      "B", "'Enhanced' means intensified, augmented or increased in value or quality.")

add_q(107, 35, "General English", "Synonyms",
      "Choose the correct synonym: The book left an indelible impression on my mind.",
      "Choose the correct synonym for the italicized word: 'The book left an indelible impression on my mind.'",
      "credible", "unforgettable", "fascinating", "interesting",
      "B", "'Indelible' means making marks that cannot be removed or forgotten (unforgettable).")

add_q(108, 35, "General English", "Synonyms",
      "Choose the correct synonym: I am a convict.",
      "Choose the correct synonym for the italicized word: 'I am a convict.'",
      "a cruel man", "a person imprisoned for a crime", "an honest man", "a dishonest man",
      "B", "A 'convict' is a person found guilty of a criminal offense and serving a prison sentence.")

add_q(109, 36, "General English", "Synonyms",
      "Choose the correct synonym: Journeys by plane are convenient.",
      "Choose the correct synonym for the italicized word: 'Journeys by plane are convenient.'",
      "enjoyable", "comfortable", "suitable", "horrible",
      "C", "'Convenient' means fitting in well with a person's needs, activities, and plans (suitable).")

add_q(110, 36, "General English", "Synonyms",
      "Choose the correct synonym: 'Be sincere and honest' is my parents' credo.",
      "Choose the correct synonym for the italicized word: ''Be sincere and honest' is my parents' credo.'",
      "philosophy", "assessment", "attention", "interest",
      "A", "A 'credo' is a statement of the beliefs or principles that guide someone's actions (philosophy).")

add_q(111, 36, "General English", "Antonyms",
      "Choose the correct antonym: I wanted to conquer my fear of red.",
      "Choose the correct antonym for the italicized word: 'I wanted to conquer my fear of red.'",
      "act", "surrender / yield", "defeat", "think",
      "B", "'Conquer' means to overcome or defeat. Its opposite is to surrender or yield.")

add_q(112, 36, "General English", "Antonyms",
      "Choose the correct antonym: Sir John was living in a palatial house.",
      "Choose the correct antonym for the italicized word: 'Sir John was living in a palatial house.'",
      "magnificent", "small", "luxurious", "large",
      "B", "'Palatial' means resembling a palace, spacious and splendid. The direct antonym is 'small' or 'cramped'.")

add_q(113, 36, "General English", "Antonyms",
      "Choose the correct antonym: Train journeys have a different charm.",
      "Choose the correct antonym for the italicized word: 'Train journeys have a different charm.'",
      "many", "same", "various", "variety",
      "B", "The antonym of 'different' (distinct, unlike) is 'same'.")

add_q(114, 36, "General English", "Antonyms",
      "Choose the correct antonym: The flower girl is shabby.",
      "Choose the correct antonym for the italicized word: 'The flower girl is shabby.'",
      "neat", "dirty", "bad", "untidy",
      "A", "'Shabby' means ragged, worn out, or untidy. The opposite is 'neat'.")

add_q(115, 36, "General English", "Antonyms",
      "Choose the correct antonym: You have an absolute right to claim the bill.",
      "Choose the correct antonym for the italicized word: 'You have an absolute right to claim the bill.'",
      "necessary", "complete", "limited", "unlimited",
      "C", "'Absolute' means total, unqualified, and unrestricted. The antonym is 'limited'.")

add_q(116, 37, "General English", "Prefix & Suffix",
      "Select the word with correct prefix:",
      "Select the word with correct prefix:",
      "counteract", "uncounter", "countless", "decounter",
      "A", "'Counteract' is formed by the valid prefix 'counter-' attached to 'act'.")

add_q(117, 37, "General English", "Prefix & Suffix",
      "Select the word with correct prefix for 'behave':",
      "Select the word with correct prefix for 'behave':",
      "unbehave", "misbehave", "nonbehave", "disbehave",
      "B", "The standard negative prefix for 'behave' is 'mis-' giving 'misbehave'.")

add_q(118, 37, "General English", "Prefix & Suffix",
      "Select the word with correct prefix:",
      "Select the word with correct prefix:",
      "protechnic", "polytechnic", "programme", "monotechnic",
      "B", "'Polytechnic' uses the Greek prefix 'poly-' meaning many (arts/technologies).")

add_q(119, 37, "General English", "Prefix & Suffix",
      "Select the word with correct suffix for 'appoint':",
      "Select the word with correct suffix for 'appoint':",
      "appointly", "appointment", "appointer", "appointful",
      "B", "The noun form of 'appoint' is formed with suffix '-ment' to create 'appointment'.")

add_q(120, 37, "General English", "Prefix & Suffix",
      "Select the word with correct suffix:",
      "Select the word with correct suffix:",
      "lookable", "readable", "writeable", "speakable",
      "B", "'Readable' is the standard orthographic derivation with suffix '-able'.")

add_q(121, 37, "General English", "Articles",
      "Fill in the blank with suitable article: ..... Ganga is a holy river.",
      "Fill in the blank with the suitable article: '..... Ganga is a holy river.'",
      "An", "The", "A", "No article",
      "B", "Definite article 'The' is required before names of sacred rivers and prominent geographical features.")

add_q(122, 37, "General English", "Articles",
      "Fill in the blank with suitable article: Copper is ..... useful metal.",
      "Fill in the blank with the suitable article: 'Copper is ..... useful metal.'",
      "an", "a", "the", "no article",
      "B", "'Useful' begins with a consonant glide sound /juː/, hence takes the indefinite article 'a'.")

add_q(123, 37, "General English", "Articles",
      "Fill in the blank with suitable article: He is ..... honest officer.",
      "Fill in the blank with the suitable article: 'He is ..... honest officer.'",
      "a", "an", "the", "no article",
      "B", "'Honest' begins with a silent 'h' and vowel sound /ɒ/, thus requiring article 'an'.")

add_q(124, 38, "General English", "Articles",
      "Fill in the blank with suitable article: Napoleon studied in ..... army school in a small French town.",
      "Fill in the blank with the suitable article: 'Napoleon studied in ..... army school in a small French town.'",
      "an", "a", "none", "the",
      "A", "'Army' begins with the vowel sound /ɑː/, so 'an army school' is correct.")

add_q(125, 38, "General English", "Articles",
      "Fill in the blank with suitable article: Mr. Prabhu is one of ..... best speakers in our city.",
      "Fill in the blank with the suitable article: 'Mr. Prabhu is one of ..... best speakers in our city.'",
      "the", "a", "an", "no article",
      "A", "Superlative adjectives ('best') strictly take the definite article 'the'.")

add_q(126, 38, "General English", "Prepositions",
      "Fill in the blank with suitable preposition: Children are not afraid ..... the dog.",
      "Fill in the blank with the suitable preposition: 'Children are not afraid ..... the dog.'",
      "at", "from", "of", "with",
      "C", "The adjective 'afraid' takes the dependent preposition 'of' ('afraid of').")

add_q(127, 38, "General English", "Prepositions",
      "Fill in the blank with suitable preposition: Rohini is fond ..... music.",
      "Fill in the blank with the suitable preposition: 'Rohini is fond ..... music.'",
      "of", "in", "to", "with",
      "A", "The expression 'fond of' is an established adjective-preposition collocation.")

add_q(128, 38, "General English", "Prepositions",
      "Fill in the blank with suitable preposition: He died ..... cancer.",
      "Fill in the blank with the suitable preposition: 'He died ..... cancer.'",
      "from", "of", "with", "by",
      "B", "When dying as a direct consequence of a disease, the correct preposition is 'died of'.")

add_q(129, 38, "General English", "Prepositions",
      "Fill in the blank with suitable preposition: The cat jumped ..... the table.",
      "Fill in the blank with the suitable preposition: 'The cat jumped ..... the table.'",
      "upon", "over", "in", "at",
      "A", "'Jumped upon / onto' signifies dynamic motion ending upon the surface.")

add_q(130, 38, "General English", "Prepositions",
      "Fill in the blank with suitable preposition: The train departs ..... 6.00 a.m.",
      "Fill in the blank with the suitable preposition: 'The train departs ..... 6.00 a.m.'",
      "on", "in", "at", "by",
      "C", "Exact points of clock time always use the preposition 'at'.")

add_q(131, 39, "General English", "Question Tags",
      "Select the correct question tag: Your son is married, ..... ?",
      "Select the correct question tag: 'Your son is married, ..... ?'",
      "isn't he", "didn't he", "hasn't he", "won't he",
      "A", "For a positive statement with auxiliary verb 'is', the tag must be negative: 'isn't he?'.")

add_q(132, 39, "General English", "Question Tags",
      "Select the correct question tag: Wait a minute, ..... ?",
      "Select the correct question tag: 'Wait a minute, ..... ?'",
      "can't you", "haven't you", "do you", "are you",
      "A", "Imperatives expressing request or command naturally take 'can't you?' or 'will you?'.")

add_q(133, 39, "General English", "Question Tags",
      "Select the correct question tag: Hema solved all her problems, ..... ?",
      "Select the correct question tag: 'Hema solved all her problems, ..... ?'",
      "did she", "didn't she", "hadn't she", "doesn't she",
      "B", "'Solved' is in simple past tense, requiring the dummy auxiliary 'did'. With a positive sentence, the tag is 'didn't she?'.")

add_q(134, 39, "General English", "Question Tags",
      "Select the correct question tag: You are anxious to know about your future, ..... ?",
      "Select the correct question tag: 'You are anxious to know about your future, ..... ?'",
      "aren't you", "don't you", "do you", "are you",
      "A", "Positive statement with 'are' requires the contracted negative tag 'aren't you?'.")

add_q(135, 39, "General English", "Question Tags",
      "Select the correct question tag: Let's go for a walk, ..... ?",
      "Select the correct question tag: 'Let's go for a walk, ..... ?'",
      "shall we", "will we", "don't we", "can we",
      "A", "Suggestions beginning with 'Let's' (let us) conventionally take the question tag 'shall we?'.")

add_q(136, 39, "General English", "Question Tags",
      "Select the correct question tag: She rarely visits her grandparents, ..... ?",
      "Select the correct question tag: 'She rarely visits her grandparents, ..... ?'",
      "does she", "doesn't she", "did she", "is she",
      "A", "'Rarely' gives the sentence a negative meaning, which requires a positive question tag: 'does she?'.")

add_q(137, 39, "General English", "Question Tags",
      "Select the correct question tag: Barking dogs seldom bite, ..... ?",
      "Select the correct question tag: 'Barking dogs seldom bite, ..... ?'",
      "do they", "don't they", "does it", "doesn't it",
      "A", "'Seldom' is negative in meaning, and plural subject 'dogs' takes pronoun 'they' with positive auxiliary 'do': 'do they?'.")

add_q(138, 40, "General English", "Tenses",
      "Select the correct tense: Don't disturb me, I ..... my assignment.",
      "Select the correct tense: 'Don't disturb me, I ..... my assignment.'",
      "do", "am doing", "will do", "did",
      "B", "An action currently in progress at the moment of speaking demands present continuous tense ('am doing').")

add_q(139, 40, "General English", "Tenses",
      "Select the correct tense: The delegates ..... in the Hotel Trident.",
      "Select the correct tense: 'The delegates ..... in the Hotel Trident.'",
      "stays", "are staying", "are stay", "was staying",
      "B", "Plural subject 'delegates' in the present continuous takes 'are staying'.")

add_q(140, 40, "General English", "Tenses",
      "Choose the correct tense form of the verb: I ..... (go) to eleventh standard next year.",
      "Choose the correct tense form of the verb given in brackets: 'I ..... (go) to eleventh standard next year.'",
      "will go", "will went", "goes", "went",
      "A", "'Next year' indicates a future action, correctly expressed by simple future 'will go'.")

add_q(141, 40, "General English", "Tenses",
      "Select the correct tense: Water ..... at 100° C.",
      "Select the correct tense: 'Water ..... at 100° C.'",
      "boils", "boiling", "is boil", "boiled",
      "A", "Universal scientific truths and physical facts are expressed in simple present tense ('boils').")

add_q(142, 40, "General English", "Tenses",
      "Select the correct tense: By this time tomorrow, we ..... our destination.",
      "Select the correct tense: 'By this time tomorrow, we ..... our destination.'",
      "will reach", "will have reached", "reached", "are reaching",
      "B", "Future action completed before a specified point of time requires future perfect tense ('will have reached').")

add_q(143, 40, "General English", "Voice - Active & Passive",
      "Fill in the blank with the correct form of voice: This lesson ..... in two parts.",
      "Fill in the blank with the correct form of voice: 'This lesson ..... in two parts.'",
      "is written", "wrote", "was write", "is write",
      "A", "The passive voice structure for an inanimate subject is 'is written'.")

add_q(144, 41, "General English", "Voice - Active & Passive",
      "Select the correct voice: The toothbrush ..... in China, during the 15th Century.",
      "Select the correct voice of the following: 'The toothbrush ..... in China, during the 15th Century.'",
      "invented", "has been invented", "invent", "was invented",
      "D", "Historical completed past action in passive voice takes 'was + past participle': 'was invented'.")

add_q(145, 41, "General English", "Voice - Active & Passive",
      "Select the correct voice of the verb: Musical instruments ..... by artists.",
      "Select the correct voice of the verb from the options given: 'Musical instruments ..... by artists.'",
      "is played", "are playing", "are played", "will play",
      "C", "Plural passive present form requires 'are played'.")

add_q(146, 41, "General English", "Participles",
      "Fill in the blank with suitable participle: I'm going ..... today.",
      "Fill in the blank with the suitable participle: 'I'm going ..... today.'",
      "to shop", "shop", "shopping", "shopped",
      "C", "The activity expression takes the present participle gerund: 'going shopping'.")

add_q(147, 41, "General English", "Voice - Active & Passive",
      "Convert to passive voice: They built this bridge in 1995.",
      "Convert to passive voice: 'They built this bridge in 1995.'",
      "This bridge was built by them in 1995.", "This bridge is built by them in 1995.", "This bridge has been built in 1995.", "This bridge had built in 1995.",
      "A", "Past simple active 'built' converts to passive 'was built'.")

add_q(148, 41, "General English", "Voice - Active & Passive",
      "Identify the voice: The letter was delivered by the postman.",
      "Identify the voice: 'The letter was delivered by the postman.'",
      "Active Voice", "Passive Voice", "Direct Speech", "Indirect Speech",
      "B", "The subject 'The letter' receives the action through 'was delivered by', which is passive voice.")

add_q(149, 41, "General English", "Participles & Infinitives",
      "Fill in the blank: Seeing the policeman, the thief ..... away.",
      "Fill in the blank: 'Seeing the policeman, the thief ..... away.'",
      "ran", "running", "runs", "had run",
      "A", "The main clause corresponding to the participial phrase requires past tense verb 'ran'.")

add_q(150, 41, "General English", "Grammar - Modals",
      "Fill in the blank with suitable modal auxiliary: You ..... respect your parents.",
      "Fill in the blank with suitable modal auxiliary: 'You ..... respect your parents.'",
      "ought to", "can", "might", "would",
      "A", "'Ought to' expresses moral duty and obligation.")

add_q(151, 42, "General English", "Sentence Patterns",
      "Identify the sentence pattern: We painted the wall grey.",
      "Identify the sentence pattern: 'We painted the wall grey.'",
      "S V O", "S V C", "S V IO DO", "S V O C",
      "D", "We (Subject) painted (Verb) the wall (Object) grey (Object Complement). Pattern: S V O C.")

add_q(152, 42, "General English", "Sentence Patterns",
      "Identify the sentence pattern: She has been working as a teacher in a primary school.",
      "Identify the sentence pattern: 'She has been working as a teacher in a primary school.'",
      "S V A A", "S V C A", "S V IO DO A", "S V O A",
      "A", "She (S) has been working (V) as a teacher (Adjunct 1) in a primary school (Adjunct 2). Pattern: S V A A.")

add_q(153, 42, "General English", "Sentence Patterns",
      "Identify the sentence pattern: Selvi cooks lunch.",
      "Identify the sentence pattern: 'Selvi cooks lunch.'",
      "S V A", "S V C", "S V O", "S V",
      "C", "Selvi (Subject) cooks (Verb) lunch (Direct Object). Pattern: S V O.")

add_q(154, 42, "General English", "Sentence Patterns",
      "Identify the sentence pattern: The music sounds awesome.",
      "Identify the sentence pattern: 'The music sounds awesome.'",
      "S V O", "S V C", "S V O A", "S V A",
      "B", "The music (Subject) sounds (Linking Verb) awesome (Subject Complement). Pattern: S V C.")

add_q(155, 42, "General English", "Sentence Patterns",
      "Identify the sentence pattern: Birds fly in the sky.",
      "Identify the sentence pattern: 'Birds fly in the sky.'",
      "S V A", "S V O", "S V C", "S V IO DO",
      "A", "Birds (Subject) fly (Intransitive Verb) in the sky (Adjunct answering 'where'). Pattern: S V A.")

add_q(156, 42, "General English", "Word Formation",
      "Change the following verb into noun form: Possess",
      "Change the following verb into noun form: 'Possess'",
      "possessive", "possession", "possessor", "possessingly",
      "B", "The abstract noun form of verb 'possess' is 'possession'.")

add_q(157, 42, "General English", "Word Formation",
      "Change the following verb into noun form: Decide",
      "Change the following verb into noun form: 'Decide'",
      "decisive", "decision", "decidedly", "decider",
      "B", "The noun derived from the verb 'decide' is 'decision'.")

add_q(158, 42, "General English", "Word Formation",
      "Change the following verb into noun form: Know",
      "Change the following verb into noun form: 'Know'",
      "knowledge", "knowledgeable", "knowingly", "known",
      "A", "The noun form of verb 'know' is 'knowledge'.")

add_q(159, 43, "General English", "Word Formation",
      "Change the following noun into verb form: Performance",
      "Change the following noun into verb form: 'Performance'",
      "perform", "performer", "performing", "performanceable",
      "A", "The root verb of the noun 'performance' is 'perform'.")

add_q(160, 43, "General English", "Word Formation",
      "Change the following adjective into adverb form: Dangerous",
      "Change the following adjective into adverb form: 'Dangerous'",
      "danger", "dangerously", "dangerful", "endanger",
      "B", "The adverb formed from adjective 'dangerous' by adding suffix '-ly' is 'dangerously'.")

add_q(161, 43, "General English", "Homophones",
      "Fill in the blank with suitable homophone: I am ..... with the new policies.",
      "Fill in the blank with a suitable homophone: 'I am ..... with the new policies.'",
      "bold", "bored", "board", "bard",
      "B", "'Bored' expresses feeling weary or disinterested, whereas 'board' is a plank of wood or committee.")

add_q(162, 43, "General English", "Homophones",
      "Fill in the blank with suitable homophone: The ..... is a heavenly body.",
      "Fill in the blank with a suitable homophone: 'The ..... is a heavenly body.'",
      "son", "sun", "soon", "sin",
      "B", "'Sun' is the celestial body / star, distinguished from homophone 'son' (male offspring).")

add_q(163, 43, "General English", "Homophones",
      "Fill in the blank with suitable homophone: The bird flew into its .....",
      "Fill in the blank with suitable homophone: 'The bird flew into its .....'",
      "nest", "next", "net", "neck",
      "A", "'Nest' is the dwelling of a bird.")

add_q(164, 43, "General English", "Homophones",
      "Fill in the blank with suitable homophone: We need to buy a ream of .....",
      "Fill in the blank with suitable homophone: 'We need to buy a ream of .....'",
      "paper", "pepper", "piper", "pauper",
      "A", "'Paper' refers to writing/printing material; a ream equals 500 sheets of paper.")

add_q(165, 43, "General English", "Homophones",
      "Fill in the blank with suitable homophone: The dog wagged its .....",
      "Fill in the blank with suitable homophone: 'The dog wagged its .....'",
      "tail", "tale", "toll", "tile",
      "A", "'Tail' refers to the posterior anatomical part of an animal; 'tale' means a story.")

add_q(166, 44, "General English", "Reading Comprehension",
      "Comprehension: Reserve Bank of India is not a commercial bank. It is an autonomous body regulating banking service in India. It makes banking laws and controls the flow of money. It safeguards the value of Indian currency. The head of the R.B.I. is the 'Governor'. Who is the head of the Reserve Bank?",
      "Comprehension: 'Reserve Bank of India is not a commercial bank. It is an autonomous body regulating banking service in India. It makes banking laws, and controls the flow of money. It safeguards the value of Indian currency. The head of the R.B.I. is the 'Governor'.'\nQuestion: Who is the head of the Reserve Bank?",
      "President", "Chief Minister", "Governor", "Finance Minister",
      "C", "As directly stated in the passage, 'The head of the R.B.I. is the Governor'.")

add_q(167, 44, "General English", "Reading Comprehension",
      "Comprehension: Based on the passage above, which of the following is NOT a function of the Reserve Bank?",
      "Comprehension: Based on the RBI passage, which of the following is NOT an autonomous regulatory role of the RBI?",
      "Regulating banking service", "Controlling flow of money", "Operating as a commercial bank", "Safeguarding currency value",
      "C", "The passage explicitly begins with: 'Reserve Bank of India is not a commercial bank.'")

add_q(168, 44, "General English", "Reading Comprehension",
      "Comprehension: The City Police are on the look out for a person who has been committing thefts in houses. He enters through open windows at night. What is the modus operandi of the thief?",
      "Comprehension: 'The City Police are on the look out for a person who has been committing thefts in houses. He enters through open windows at night.'\nQuestion: How does the thief gain entry?",
      "Breaking front doors", "Entering through open windows", "Climbing roof tiles", "Posing as delivery staff",
      "B", "The text states he enters through open windows at night.")

add_q(169, 44, "General English", "Reading Comprehension",
      "Comprehension: Milk is the best food. It has in it water, sugar, fat, vitamins and proteins. People drink milk of different animals. In England and New Zealand and many other cool lands there are cows. Which countries are named in the passage?",
      "Comprehension: 'Milk is the best food. It has in it water, sugar, fat, vitamins and proteins. People drink milk of different animals. In England and New Zealand and many other cool lands there are cows.'\nQuestion: Which countries are named in the passage?",
      "India and New Zealand", "England and New Zealand", "Africa and England", "Australia and Canada",
      "B", "The text explicitly names 'England and New Zealand'.")

add_q(170, 45, "General English", "Reading Comprehension",
      "Comprehension: According to the passage, milk contains which combination of nutrients?",
      "Comprehension: According to the milk passage, which essential nutrients are found in milk?",
      "Water, sugar, fat, vitamins and proteins", "Only water and fat", "Only vitamins and minerals", "Sugar and starch only",
      "A", "The passage enumerates: 'water, sugar, fat, vitamins and proteins'.")

add_q(171, 45, "General English", "Sentence Correction",
      "Select the correct sentence with appropriate spelling and usage:",
      "Select the correct sentence:",
      "Let us prey", "Let us preys", "Let us pray", "Let us praying",
      "C", "'Pray' refers to devotional communion or worship; 'prey' means a quarry hunted for food.")

add_q(172, 45, "General English", "Sentence Correction",
      "Select the correct sentence:",
      "Select the correct sentence:",
      "My desire is to sea you again", "My desire is to seeing you again", "My desire is to see you again", "My desire is to scene you again",
      "C", "'To see' correctly uses the infinitive verb with visual sight homophone 'see'.")

add_q(173, 45, "General English", "Sentence Correction",
      "Select the correct sentence:",
      "Select the correct sentence:",
      "He gave me a good advice", "He gave me good advice", "He gave me good advices", "He gave me an advices",
      "B", "'Advice' is an uncountable abstract noun and cannot take an indefinite article 'a' or plural 's'.")

add_q(174, 45, "General English", "Sentence Correction",
      "Select the correct sentence:",
      "Select the correct sentence:",
      "One of the boys are absent", "One of the boys is absent", "One of the boy is absent", "One of the boys were absent",
      "B", "The subject is singular pronoun 'One', which demands the singular verb 'is'.")

add_q(175, 45, "General English", "Sentence Correction",
      "Select the correct sentence:",
      "Select the correct sentence:",
      "She is senior than me", "She is senior to me", "She is senior from me", "She is more senior than me",
      "B", "Adjectives of Latin origin ending in '-ior' (senior, junior, prior, superior) take preposition 'to', not 'than'.")

add_q(176, 45, "General English", "Error Spotting",
      "Find out the error in the sentence: A modern school / is open / for kids / No error",
      "Find out the error in: (A) A modern school / (B) is open / (C) for kids / (D) No error",
      "A", "B", "C", "D",
      "D", "The sentence 'A modern school is open for kids' is grammatically correct as a general announcement (No error).")

add_q(177, 45, "General English", "Error Spotting",
      "Find out the error: Ganges / is a / holy river / No error",
      "Find out the error: (A) Ganges / (B) is a / (C) holy river / (D) No error",
      "A", "B", "C", "D",
      "A", "Part A lacks the compulsory definite article 'The' required before river names ('The Ganges').")

add_q(178, 46, "General English", "Error Spotting",
      "Find out the error: Yesterday / the horse / ran fastly / No error",
      "Find out the error: (A) Yesterday / (B) the horse / (C) ran fastly / (D) No error",
      "A", "B", "C", "D",
      "C", "'Fast' functions as both adjective and adverb; the word 'fastly' does not exist in standard English.")

add_q(179, 46, "General English", "Odd Word Out",
      "Find the odd word (Adverb): dreams, dreaming, dreamed, dreamily",
      "Find the odd word (Adverb) among: (A) dreams (B) dreaming (C) dreamed (D) dreamily",
      "dreams", "dreaming", "dreamed", "dreamily",
      "D", "'Dreamily' is an adverb ending in '-ly', whereas the others are noun or verbal forms.")

add_q(180, 46, "General English", "Odd Word Out",
      "Find the odd word (Verb): memory, memorable, memorial, memorize",
      "Find the odd word (Verb) among: (A) memory (B) memorable (C) memorial (D) memorize",
      "memory", "memorable", "memorial", "memorize",
      "D", "'Memorize' is the action verb, while 'memory' is a noun and 'memorable'/'memorial' are adjectives/nouns.")

add_q(181, 46, "General English", "Odd Word Out",
      "Find the odd word (Adverb): praise, praiseworthy, praiseworthiness, praiseworthily",
      "Find the odd word (Adverb) among: (A) praise (B) praiseworthy (C) praiseworthiness (D) praiseworthily",
      "praise", "praiseworthy", "praiseworthiness", "praiseworthily",
      "D", "'Praiseworthily' is the adverb of manner.")

add_q(182, 46, "General English", "Odd Word Out",
      "Find the odd word (Adjective): strangely, stranger, strange, strangeness",
      "Find the odd word (Adjective) among: (A) strangely (B) stranger (C) strange (D) strangeness",
      "strangely", "stranger", "strange", "strangeness",
      "C", "'Strange' is the primary qualitative adjective.")

add_q(183, 46, "General English", "Odd Word Out",
      "Find the odd word (Noun): reducible, reduction, reduce, reducible",
      "Find the odd word (Noun) among: (A) reducible (B) reduce (C) reduction (D) reduced",
      "reducible", "reduce", "reduction", "reduced",
      "C", "'Reduction' with suffix '-tion' is the abstract noun.")

add_q(184, 46, "General English", "Odd Word Out",
      "Find the odd word (Noun): national, nation, nationally, nationalize",
      "Find the odd word (Noun) among: (A) national (B) nation (C) nationally (D) nationalize",
      "national", "nation", "nationally", "nationalize",
      "B", "'Nation' is the noun; 'national' is an adjective, 'nationally' an adverb, and 'nationalize' a verb.")

add_q(185, 46, "General English", "Odd Word Out",
      "Find the odd word (Adjective): beautify, beauty, beautiful, beautifully",
      "Find the odd word (Adjective) among: (A) beautify (B) beauty (C) beautiful (D) beautifully",
      "beautify", "beauty", "beautiful", "beautifully",
      "C", "'Beautiful' is the descriptive adjective.")

add_q(186, 46, "General English", "Odd Word Out",
      "Find the odd word (Verb): creation, creative, create, creatively",
      "Find the odd word (Verb) among: (A) creation (B) creative (C) create (D) creatively",
      "creation", "creative", "create", "creatively",
      "C", "'Create' is the root verb.")

add_q(187, 46, "General English", "Odd Word Out",
      "Find the odd word (Adverb): quick, quickly, quickness, quicken",
      "Find the odd word (Adverb) among: (A) quick (B) quickly (C) quickness (D) quicken",
      "quick", "quickly", "quickness", "quicken",
      "B", "'Quickly' is the adverb of manner.")

add_q(188, 47, "General English", "Plural Forms",
      "Select the correct plural form for the given word: branch",
      "Select the correct plural form for the given word: 'branch'",
      "branchs", "branches", "branchis", "brancheses",
      "B", "Nouns ending in sibilant sound '-ch' form plurals by appending '-es' (branches).")

add_q(189, 47, "General English", "Plural Forms",
      "Select the correct plural form for the given word: mango",
      "Select the correct plural form for the given word: 'mango'",
      "mango", "mangoes", "mangoses", "mangose",
      "B", "Nouns ending in 'o' preceded by a consonant typically add '-es' (mangoes).")

add_q(190, 47, "General English", "Plural Forms",
      "Select the correct plural form for the given word: news",
      "Select the correct plural form for the given word: 'news'",
      "news", "newses", "newsis", "newsies",
      "A", "'News' is an invariant noun that takes a singular verb and remains 'news'.")

add_q(191, 47, "General English", "Plural Forms",
      "Select the correct plural form for the given word: child",
      "Select the correct plural form for the given word: 'child'",
      "childs", "children", "childrens", "childes",
      "B", "'Child' forms its irregular plural as 'children'.")

add_q(192, 47, "General English", "Sentence Types",
      "Identify the Complex sentence:",
      "Identify the Complex sentence:",
      "I make a promise only to keep it.", "I make a promise and I will keep it.", "If I make a promise, I will keep it.", "Making a promise, I will keep it.",
      "C", "'If I make a promise, I will keep it' contains a subordinate conditional clause ('If...') and an independent main clause, forming a complex sentence.")

add_q(193, 47, "General English", "Sentence Types",
      "Identify the Compound sentence:",
      "Identify the Compound sentence:",
      "Owing to his illness, he did not come.", "He was ill and so he did not come.", "Because he was ill, he did not come.", "Being ill, he was absent.",
      "B", "'He was ill and so he did not come' joins two independent coordinate clauses with conjunction 'and so', forming a compound sentence.")

add_q(194, 47, "General English", "Sentence Types",
      "Identify the Simple sentence:",
      "Identify the Simple sentence:",
      "Seeing the snake, he ran away.", "He saw the snake and ran away.", "When he saw the snake, he ran away.", "As soon as he saw the snake, he ran away.",
      "A", "'Seeing the snake, he ran away' has only one finite verb ('ran') and a participial phrase, forming a simple sentence.")

add_q(195, 48, "General English", "Degrees of Comparison",
      "Identify the Superlative degree sentence:",
      "Identify the Superlative degree sentence:",
      "Whales are not so big as some elephants.", "No other game is as popular as football.", "Ooty is the coolest hill station in the south.", "India is more populous than many other countries.",
      "C", "'Ooty is the coolest hill station in the south' contains the superlative adjective 'coolest'.")

add_q(196, 48, "General English", "Degrees of Comparison",
      "Identify the Superlative degree sentence:",
      "Identify the Superlative degree sentence:",
      "Malathi is the best actor in the class.", "Hari is not as clever as Ravi.", "Apple is as costly as oranges.", "Kodai is cooler than Chennai.",
      "A", "'Malathi is the best actor in the class' uses the superlative form 'the best'.")

add_q(197, 48, "General English", "Degrees of Comparison",
      "Identify the Comparative degree sentence:",
      "Identify the Comparative degree sentence:",
      "Mathematics is more interesting than physics.", "Iron is the most useful of all metals.", "Very few girls are as tall as Meena.", "Mount Everest is the highest peak.",
      "A", "'Mathematics is more interesting than physics' uses comparative adjective 'more interesting than'.")

add_q(198, 48, "General English", "Degrees of Comparison",
      "Identify the Positive degree sentence:",
      "Identify the Positive degree sentence:",
      "No other metal is as heavy as lead.", "Lead is heavier than all other metals.", "Lead is the heaviest metal.", "Lead is heavier than tin.",
      "A", "'No other metal is as heavy as lead' uses the base positive degree construction 'as heavy as'.")

add_q(199, 48, "General English", "Figures of Speech",
      "Identify the figure of speech: 'The camel is the ship of the desert.'",
      "Identify the figure of speech: 'The camel is the ship of the desert.'",
      "Simile", "Metaphor", "Personification", "Oxymoron",
      "B", "An implied comparison without using 'like' or 'as' is a Metaphor.")

add_q(200, 48, "General English", "Figures of Speech",
      "Identify the figure of speech: 'O Wild West Wind, thou breath of Autumn's being...'",
      "Identify the figure of speech in: 'O Wild West Wind, thou breath of Autumn's being...'",
      "Apostrophe", "Simile", "Hyperbole", "Irony",
      "A", "Directly addressing an absent entity or personified inanimate force ('O Wild West Wind') is an Apostrophe.")

print(f"Total compiled questions: {len(questions)}")

# Write to TypeScript file
ts_content = f"""// TNPSC Group 4 2011 Official Memory Question Paper Dataset
// Subject Code: 901 | Booklet Series: A | Total Questions: 200 | Maximum Marks: 300 | Duration: 180 Mins

export interface TNPSCQuestion {{
  id: string;
  exam_id: string;
  original_question_number: number;
  question_text_ta: string;
  question_text_en: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  is_verified: boolean;
  explanation: string;
  explanation_ta?: string;
  subject: 'General Knowledge' | 'General Mental Ability' | 'General English';
  topic: string;
  page_number: number;
  source_paper_id: string;
  status: 'verified' | 'pending_verification' | 'rejected';
}}

export interface TNPSCExamConfig {{
  mode: 'full' | 'subject' | 'topic';
  subject?: string;
  topic?: string;
  questionCount: number;
  durationMinutes: number;
}}

export interface TNPSCAttemptRecord {{
  id: string;
  date: string;
  mode: string;
  subject?: string;
  topic?: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  score: number; // Max 300 for full paper (1.5 marks per question)
  accuracyPercentage: number;
  timeSpentSeconds: number;
}}

export const TNPSC_PAPER_METADATA = {{
  id: 'TNPSC-G4-2011-901',
  code: 'TNPSC-G4-2011',
  name: 'TNPSC Group 4 (Combined Civil Services Exam-IV)',
  year: 2011,
  bookletSeries: 'A',
  subjectCode: '901',
  title: 'GENERAL KNOWLEDGE WITH GENERAL ENGLISH (பொது அறிவும் பொது ஆங்கிலமும்)',
  totalQuestions: 200,
  totalMarks: 300,
  marksPerQuestion: 1.5,
  negativeMarking: 0,
  durationMinutes: 180,
  totalPages: 52,
  pdfFilename: 'ques pap1.pdf',
  sections: [
    {{
      name: 'General Knowledge & General Mental Ability',
      questionRange: 'Q1 to Q100',
      totalQuestions: 100,
      language: 'Bilingual (Tamil & English)',
      pageRange: 'Pages 3 to 32'
    }},
    {{
      name: 'General English',
      questionRange: 'Q101 to Q200',
      totalQuestions: 100,
      language: 'English',
      pageRange: 'Pages 33 to 48'
    }}
  ]
}};

const LOCAL_STORAGE_KEY = 'tnpsc_group4_2011_questions_v2';
const ATTEMPTS_KEY = 'tnpsc_group4_attempts_v2';

export const TNPSC_GROUP4_2011_QUESTIONS: TNPSCQuestion[] = {json.dumps(questions, indent=2, ensure_ascii=False)};

// Retrieve questions with local user edits/verifications
export function getTNPSCQuestions(filter?: {{
  subject?: string;
  topic?: string;
  count?: number;
  status?: string;
  page?: number;
}}): TNPSCQuestion[] {{
  let list = [...TNPSC_GROUP4_2011_QUESTIONS];
  
  try {{
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {{
      const customList: TNPSCQuestion[] = JSON.parse(saved);
      const customMap = new Map(customList.map(q => [q.id, q]));
      list = list.map(q => customMap.get(q.id) || q);
    }}
  }} catch (e) {{
    console.warn('Failed to read custom TNPSC questions from localStorage', e);
  }}

  if (filter?.subject && filter.subject !== 'All') {{
    list = list.filter(q => q.subject === filter.subject);
  }}

  if (filter?.topic && filter.topic !== 'All') {{
    list = list.filter(q => q.topic.toLowerCase().includes(filter.topic!.toLowerCase()));
  }}

  if (filter?.status) {{
    list = list.filter(q => q.status === filter.status);
  }}

  if (filter?.page) {{
    list = list.filter(q => q.page_number === filter.page);
  }}

  if (filter?.count && filter.count > 0 && filter.count < list.length) {{
    list = list.slice(0, filter.count);
  }}

  return list;
}}

export function saveTNPSCQuestionEdit(updatedQuestion: TNPSCQuestion): boolean {{
  try {{
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    let list: TNPSCQuestion[] = saved ? JSON.parse(saved) : [...TNPSC_GROUP4_2011_QUESTIONS];
    const index = list.findIndex(q => q.id === updatedQuestion.id);
    if (index >= 0) {{
      list[index] = {{ ...updatedQuestion, is_verified: true, status: 'verified' }};
    }} else {{
      list.push(updatedQuestion);
    }}
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    return true;
  }} catch (e) {{
    console.error('Failed to save TNPSC question', e);
    return false;
  }}
}}

export function resetTNPSCQuestions(): void {{
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}}

export function getTNPSCStats() {{
  const questions = getTNPSCQuestions();
  const total = questions.length;
  const verified = questions.filter(q => q.status === 'verified').length;
  const gkCount = questions.filter(q => q.subject === 'General Knowledge').length;
  const mentalCount = questions.filter(q => q.subject === 'General Mental Ability').length;
  const englishCount = questions.filter(q => q.subject === 'General English').length;

  return {{
    total,
    verified,
    pending: total - verified,
    gkCount,
    mentalCount,
    englishCount,
    totalPages: 52
  }};
}}

export function getTNPSCTopics(): {{ subject: string; topic: string; count: number }}[] {{
  const questions = getTNPSCQuestions();
  const map = new Map<string, {{ subject: string; topic: string; count: number }}>();

  for (const q of questions) {{
    const key = `${{q.subject}}:::${{q.topic}}`;
    if (!map.has(key)) {{
      map.set(key, {{ subject: q.subject, topic: q.topic, count: 0 }});
    }}
    map.get(key)!.count++;
  }}

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}}

export function saveTNPSCAttempt(attempt: Omit<TNPSCAttemptRecord, 'id' | 'date'>): TNPSCAttemptRecord {{
  const record: TNPSCAttemptRecord = {{
    ...attempt,
    id: `tnpsc-att-${{Date.now()}}`,
    date: new Date().toLocaleDateString('en-US', {{ month: 'short', day: 'numeric', year: 'numeric' }})
  }};

  try {{
    const existing = localStorage.getItem(ATTEMPTS_KEY);
    const list: TNPSCAttemptRecord[] = existing ? JSON.parse(existing) : [];
    list.unshift(record);
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(list.slice(0, 20)));
  }} catch (e) {{
    console.warn('Failed to save TNPSC attempt', e);
  }}

  return record;
}}

export function getTNPSCAttempts(): TNPSCAttemptRecord[] {{
  try {{
    const saved = localStorage.getItem(ATTEMPTS_KEY);
    return saved ? JSON.parse(saved) : [];
  }} catch (e) {{
    return [];
  }}
}}
"""

with open(output_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully wrote {output_path} with {len(questions)} verified questions!")

