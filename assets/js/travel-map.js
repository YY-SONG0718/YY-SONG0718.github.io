/* Travel map. Lights up the places listed in _data/places.yml on a dark Leaflet map.
   The page embeds the places as JSON in #travel-places. This script resolves missing
   coordinates against the built-in city list, draws one glowing marker per place, and
   fills the counters and the place list below the map. */
(function () {
  // Built-in lookup table for places written as a bare name in places.yml.
  // Each row is [name, country, lat, lon].
  const CITIES = [
    // ======== Europe ========
    // Albania
    ["Tirana", "Albania", 41.3275, 19.8187],
    // Andorra
    ["Andorra la Vella", "Andorra", 42.5063, 1.5218],
    // Austria
    ["Vienna", "Austria", 48.2082, 16.3738],
    ["Salzburg", "Austria", 47.8095, 13.055],
    ["Innsbruck", "Austria", 47.2692, 11.4041],
    ["Graz", "Austria", 47.0707, 15.4395],
    ["Hallstatt", "Austria", 47.5622, 13.6493],
    // Belarus
    ["Minsk", "Belarus", 53.9006, 27.559],
    // Belgium
    ["Brussels", "Belgium", 50.8503, 4.3517],
    ["Antwerp", "Belgium", 51.2194, 4.4025],
    ["Ghent", "Belgium", 51.0543, 3.7174],
    ["Bruges", "Belgium", 51.2093, 3.2247],
    ["Leuven", "Belgium", 50.8798, 4.7005],
    // Bosnia and Herzegovina
    ["Sarajevo", "Bosnia and Herzegovina", 43.8563, 18.4131],
    // Bulgaria
    ["Sofia", "Bulgaria", 42.6977, 23.3219],
    // Croatia
    ["Zagreb", "Croatia", 45.815, 15.9819],
    ["Dubrovnik", "Croatia", 42.6507, 18.0944],
    ["Split", "Croatia", 43.5081, 16.4402],
    // Cyprus
    ["Nicosia", "Cyprus", 35.1856, 33.3823],
    ["Limassol", "Cyprus", 34.7071, 33.0226],
    // Czechia
    ["Prague", "Czechia", 50.0755, 14.4378],
    ["Brno", "Czechia", 49.1951, 16.6068],
    ["Český Krumlov", "Czechia", 48.8127, 14.3175],
    // Denmark
    ["Copenhagen", "Denmark", 55.6761, 12.5683],
    ["Aarhus", "Denmark", 56.1629, 10.2039],
    // Estonia
    ["Tallinn", "Estonia", 59.437, 24.7536],
    // Faroe Islands
    ["Tórshavn", "Faroe Islands", 62.0079, -6.79],
    // Finland
    ["Helsinki", "Finland", 60.1699, 24.9384],
    ["Tampere", "Finland", 61.4978, 23.761],
    ["Turku", "Finland", 60.4518, 22.2666],
    ["Rovaniemi", "Finland", 66.5039, 25.7294],
    // France
    ["Paris", "France", 48.8566, 2.3522],
    ["Nice", "France", 43.7102, 7.262],
    ["Lyon", "France", 45.764, 4.8357],
    ["Marseille", "France", 43.2965, 5.3698],
    ["Bordeaux", "France", 44.8378, -0.5792],
    ["Toulouse", "France", 43.6047, 1.4442],
    ["Strasbourg", "France", 48.5734, 7.7521],
    ["Lille", "France", 50.6292, 3.0573],
    ["Rouen", "France", 49.4432, 1.0999],
    ["Nantes", "France", 47.2184, -1.5536],
    ["Montpellier", "France", 43.6108, 3.8767],
    ["Avignon", "France", 43.9493, 4.8055],
    ["Annecy", "France", 45.8992, 6.1294],
    ["Chamonix", "France", 45.9237, 6.8694],
    // Germany
    ["Berlin", "Germany", 52.52, 13.405],
    ["Munich", "Germany", 48.1351, 11.582],
    ["Frankfurt", "Germany", 50.1109, 8.6821],
    ["Hamburg", "Germany", 53.5511, 9.9937],
    ["Cologne", "Germany", 50.9375, 6.9603],
    ["Dresden", "Germany", 51.0504, 13.7373],
    ["Leipzig", "Germany", 51.3397, 12.3731],
    ["Stuttgart", "Germany", 48.7758, 9.1829],
    ["Düsseldorf", "Germany", 51.2277, 6.7735],
    ["Nuremberg", "Germany", 49.4521, 11.0767],
    ["Heidelberg", "Germany", 49.3988, 8.6724],
    ["Freiburg", "Germany", 47.999, 7.8421],
    ["Bonn", "Germany", 50.7374, 7.0982],
    ["Bielefeld", "Germany", 52.0302, 8.5325],
    ["Hannover", "Germany", 52.3759, 9.732],
    ["Bremen", "Germany", 53.0793, 8.8017],
    ["Potsdam", "Germany", 52.3906, 13.0645],
    ["Weimar", "Germany", 50.9795, 11.3235],
    ["Rothenburg ob der Tauber", "Germany", 49.3776, 10.179],
    ["Regensburg", "Germany", 49.0134, 12.1016],
    ["Würzburg", "Germany", 49.7913, 9.9534],
    ["Trier", "Germany", 49.7596, 6.6439],
    ["Aachen", "Germany", 50.7753, 6.0839],
    ["Münster", "Germany", 51.9607, 7.6261],
    ["Mainz", "Germany", 49.9929, 8.2473],
    ["Garmisch-Partenkirchen", "Germany", 47.4921, 11.0955],
    // Greece
    ["Athens", "Greece", 37.9838, 23.7275],
    ["Santorini", "Greece", 36.3932, 25.4615],
    ["Thessaloniki", "Greece", 40.6401, 22.9444],
    ["Chania", "Greece", 35.5138, 24.018],
    ["Rhodes", "Greece", 36.4341, 28.2176],
    ["Mykonos", "Greece", 37.4467, 25.3289],
    ["Corfu", "Greece", 39.6243, 19.9217],
    ["Zakynthos", "Greece", 37.787, 20.899],
    // Hungary
    ["Budapest", "Hungary", 47.4979, 19.0402],
    // Iceland
    ["Reykjavik", "Iceland", 64.1466, -21.9426],
    // Ireland
    ["Dublin", "Ireland", 53.3498, -6.2603],
    ["Cork", "Ireland", 51.8985, -8.4756],
    ["Galway", "Ireland", 53.2707, -9.0568],
    // Italy
    ["Rome", "Italy", 41.9028, 12.4964],
    ["Milan", "Italy", 45.4642, 9.19],
    ["Venice", "Italy", 45.4408, 12.3155],
    ["Florence", "Italy", 43.7696, 11.2558],
    ["Naples", "Italy", 40.8518, 14.2681],
    ["Turin", "Italy", 45.0703, 7.6869],
    ["Bologna", "Italy", 44.4949, 11.3426],
    ["Genoa", "Italy", 44.4056, 8.9463],
    ["Verona", "Italy", 45.4384, 10.9916],
    ["Pisa", "Italy", 43.7228, 10.4017],
    ["Siena", "Italy", 43.3188, 11.3308],
    ["Palermo", "Italy", 38.1157, 13.3615],
    ["Catania", "Italy", 37.5079, 15.083],
    ["Bari", "Italy", 41.1171, 16.8719],
    ["La Spezia", "Italy", 44.1025, 9.8241],
    ["Sorrento", "Italy", 40.6263, 14.3758],
    ["Cagliari", "Italy", 39.2238, 9.1217],
    ["Trieste", "Italy", 45.6495, 13.7768],
    ["Padua", "Italy", 45.4064, 11.8768],
    ["Como", "Italy", 45.8081, 9.0852],
    // Latvia
    ["Riga", "Latvia", 56.9496, 24.1052],
    // Liechtenstein
    ["Vaduz", "Liechtenstein", 47.141, 9.5209],
    // Lithuania
    ["Vilnius", "Lithuania", 54.6872, 25.2797],
    // Luxembourg
    ["Luxembourg", "Luxembourg", 49.6116, 6.1319],
    // Malta
    ["Valletta", "Malta", 35.8989, 14.5146],
    // Moldova
    ["Chișinău", "Moldova", 47.0105, 28.8638],
    // Monaco
    ["Monaco", "Monaco", 43.7384, 7.4246],
    // Montenegro
    ["Podgorica", "Montenegro", 42.4304, 19.2594],
    ["Kotor", "Montenegro", 42.4247, 18.7712],
    // Netherlands
    ["Amsterdam", "Netherlands", 52.3676, 4.9041],
    ["Rotterdam", "Netherlands", 51.9244, 4.4777],
    ["Utrecht", "Netherlands", 52.0907, 5.1214],
    ["The Hague", "Netherlands", 52.0705, 4.3007],
    ["Eindhoven", "Netherlands", 51.4416, 5.4697],
    ["Leiden", "Netherlands", 52.1601, 4.497],
    ["Delft", "Netherlands", 52.0116, 4.3571],
    ["Maastricht", "Netherlands", 50.8514, 5.691],
    ["Groningen", "Netherlands", 53.2194, 6.5665],
    // North Macedonia
    ["Skopje", "North Macedonia", 41.9973, 21.428],
    // Norway
    ["Oslo", "Norway", 59.9139, 10.7522],
    ["Bergen", "Norway", 60.3913, 5.3221],
    ["Tromsø", "Norway", 69.6492, 18.9553],
    // Poland
    ["Warsaw", "Poland", 52.2297, 21.0122],
    ["Krakow", "Poland", 50.0647, 19.945],
    ["Gdańsk", "Poland", 54.352, 18.6466],
    ["Wrocław", "Poland", 51.1079, 17.0385],
    ["Poznań", "Poland", 52.4064, 16.9252],
    // Portugal
    ["Lisbon", "Portugal", 38.7223, -9.1393],
    ["Porto", "Portugal", 41.1579, -8.6291],
    ["Faro", "Portugal", 37.0194, -7.9322],
    ["Coimbra", "Portugal", 40.2033, -8.4103],
    ["Sintra", "Portugal", 38.7979, -9.39],
    ["Funchal", "Portugal", 32.6669, -16.9241],
    // Romania
    ["Bucharest", "Romania", 44.4268, 26.1025],
    // Russia
    ["Moscow", "Russia", 55.7558, 37.6173],
    ["Saint Petersburg", "Russia", 59.9311, 30.3609],
    // San Marino
    ["San Marino", "San Marino", 43.9424, 12.4578],
    // Serbia
    ["Belgrade", "Serbia", 44.7866, 20.4489],
    // Slovakia
    ["Bratislava", "Slovakia", 48.1486, 17.1077],
    // Slovenia
    ["Ljubljana", "Slovenia", 46.0569, 14.5058],
    ["Lake Bled", "Slovenia", 46.3683, 14.1146],
    // Spain
    ["Madrid", "Spain", 40.4168, -3.7038],
    ["Barcelona", "Spain", 41.3874, 2.1686],
    ["Seville", "Spain", 37.3891, -5.9845],
    ["Valencia", "Spain", 39.4699, -0.3763],
    ["Bilbao", "Spain", 43.263, -2.935],
    ["Granada", "Spain", 37.1773, -3.5986],
    ["Málaga", "Spain", 36.7213, -4.4214],
    ["San Sebastián", "Spain", 43.3183, -1.9812],
    ["Palma", "Spain", 39.5696, 2.6502],
    ["Córdoba", "Spain", 37.8882, -4.7794],
    ["Toledo", "Spain", 39.8628, -4.0273],
    ["Salamanca", "Spain", 40.9701, -5.6635],
    ["Santiago de Compostela", "Spain", 42.8782, -8.5448],
    // Sweden
    ["Stockholm", "Sweden", 59.3293, 18.0686],
    ["Gothenburg", "Sweden", 57.7089, 11.9746],
    ["Malmö", "Sweden", 55.605, 13.0038],
    // Switzerland
    ["Zurich", "Switzerland", 47.3769, 8.5417],
    ["Geneva", "Switzerland", 46.2044, 6.1432],
    ["Bern", "Switzerland", 46.948, 7.4474],
    ["Basel", "Switzerland", 47.5596, 7.5886],
    ["Lucerne", "Switzerland", 47.0502, 8.3093],
    ["Lausanne", "Switzerland", 46.5197, 6.6323],
    ["Interlaken", "Switzerland", 46.6863, 7.8632],
    ["Zermatt", "Switzerland", 46.0207, 7.7491],
    ["Lugano", "Switzerland", 46.0037, 8.9511],
    ["St. Moritz", "Switzerland", 46.4908, 9.8355],
    // Turkey
    ["Istanbul", "Turkey", 41.0082, 28.9784],
    ["Ankara", "Turkey", 39.9334, 32.8597],
    ["Antalya", "Turkey", 36.8969, 30.7133],
    ["Izmir", "Turkey", 38.4237, 27.1428],
    ["Göreme", "Turkey", 38.6431, 34.8289],
    // Ukraine
    ["Kyiv", "Ukraine", 50.4501, 30.5234],
    ["Lviv", "Ukraine", 49.8397, 24.0297],
    ["Odesa", "Ukraine", 46.4825, 30.7233],
    // United Kingdom
    ["London", "United Kingdom", 51.5074, -0.1278],
    ["Manchester", "United Kingdom", 53.4808, -2.2426],
    ["Edinburgh", "United Kingdom", 55.9533, -3.1883],
    ["Oxford", "United Kingdom", 51.752, -1.2577],
    ["Bristol", "United Kingdom", 51.4545, -2.5879],
    ["Liverpool", "United Kingdom", 53.4084, -2.9916],
    ["Glasgow", "United Kingdom", 55.8642, -4.2518],
    ["Birmingham", "United Kingdom", 52.4862, -1.8904],
    ["Leeds", "United Kingdom", 53.8008, -1.5491],
    ["York", "United Kingdom", 53.96, -1.0873],
    ["Bath", "United Kingdom", 51.3811, -2.359],
    ["Belfast", "United Kingdom", 54.5973, -5.9301],
    ["Cardiff", "United Kingdom", 51.4816, -3.1791],
    ["Brighton", "United Kingdom", 50.8225, -0.1372],
    ["Newcastle upon Tyne", "United Kingdom", 54.9783, -1.6178],
    ["Inverness", "United Kingdom", 57.4778, -4.2247],
    ["Penzance", "United Kingdom", 50.1186, -5.5371],
    ["St Ives", "United Kingdom", 50.2114, -5.4807],
    // ======== Middle East ========
    // Israel
    ["Tel Aviv", "Israel", 32.0853, 34.7818],
    ["Jerusalem", "Israel", 31.7683, 35.2137],
    // Jordan
    ["Amman", "Jordan", 31.9539, 35.9106],
    // Lebanon
    ["Beirut", "Lebanon", 33.8938, 35.5018],
    // Qatar
    ["Doha", "Qatar", 25.2854, 51.531],
    // Saudi Arabia
    ["Riyadh", "Saudi Arabia", 24.7136, 46.6753],
    // United Arab Emirates
    ["Dubai", "United Arab Emirates", 25.2048, 55.2708],
    ["Abu Dhabi", "United Arab Emirates", 24.4539, 54.3773],
    // ======== Africa ========
    // Egypt
    ["Cairo", "Egypt", 30.0444, 31.2357],
    // Ethiopia
    ["Addis Ababa", "Ethiopia", 9.03, 38.74],
    // Ghana
    ["Accra", "Ghana", 5.6037, -0.187],
    // Kenya
    ["Nairobi", "Kenya", -1.2921, 36.8219],
    // Morocco
    ["Marrakesh", "Morocco", 31.6295, -7.9811],
    ["Casablanca", "Morocco", 33.5731, -7.5898],
    // Nigeria
    ["Lagos", "Nigeria", 6.5244, 3.3792],
    // South Africa
    ["Cape Town", "South Africa", -33.9249, 18.4241],
    ["Johannesburg", "South Africa", -26.2041, 28.0473],
    // Tanzania
    ["Zanzibar", "Tanzania", -6.1659, 39.2026],
    // ======== Asia ========
    // Bangladesh
    ["Dhaka", "Bangladesh", 23.8103, 90.4125],
    // Cambodia
    ["Phnom Penh", "Cambodia", 11.5564, 104.9282],
    ["Siem Reap", "Cambodia", 13.3671, 103.8448],
    // China
    ["Beijing", "China", 39.9042, 116.4074],
    ["Shanghai", "China", 31.2304, 121.4737],
    ["Hong Kong", "China", 22.3193, 114.1694],
    ["Guangzhou", "China", 23.1291, 113.2644],
    ["Shenzhen", "China", 22.5431, 114.0579],
    ["Chengdu", "China", 30.5728, 104.0668],
    ["Xi'an", "China", 34.3416, 108.9398],
    ["Macau", "China", 22.1987, 113.5439],
    ["Hangzhou", "China", 30.2741, 120.1551],
    ["Nanjing", "China", 32.0603, 118.7969],
    ["Suzhou", "China", 31.2989, 120.5853],
    ["Wuhan", "China", 30.5928, 114.3055],
    ["Chongqing", "China", 29.563, 106.5516],
    ["Tianjin", "China", 39.0842, 117.2009],
    ["Qingdao", "China", 36.0671, 120.3826],
    ["Xiamen", "China", 24.4798, 118.0894],
    ["Kunming", "China", 25.0389, 102.7183],
    ["Lijiang", "China", 26.8721, 100.2299],
    ["Dali", "China", 25.6065, 100.2676],
    ["Guilin", "China", 25.2736, 110.29],
    ["Yangshuo", "China", 24.7785, 110.4966],
    ["Harbin", "China", 45.8038, 126.535],
    ["Shenyang", "China", 41.8057, 123.4315],
    ["Dalian", "China", 38.914, 121.6147],
    ["Changsha", "China", 28.2282, 112.9388],
    ["Zhengzhou", "China", 34.7466, 113.6254],
    ["Jinan", "China", 36.6512, 117.1201],
    ["Hefei", "China", 31.8206, 117.2272],
    ["Fuzhou", "China", 26.0745, 119.2965],
    ["Nanning", "China", 22.817, 108.3665],
    ["Lhasa", "China", 29.652, 91.1721],
    ["Ürümqi", "China", 43.8256, 87.6168],
    ["Lanzhou", "China", 36.0611, 103.8343],
    ["Xining", "China", 36.6171, 101.7782],
    ["Yinchuan", "China", 38.4872, 106.2309],
    ["Hohhot", "China", 40.8414, 111.7519],
    ["Changchun", "China", 43.8171, 125.3235],
    ["Jilin", "China", 43.8378, 126.5494],
    ["Shijiazhuang", "China", 38.0428, 114.5149],
    ["Taiyuan", "China", 37.8706, 112.5489],
    ["Guiyang", "China", 26.647, 106.6302],
    ["Haikou", "China", 20.044, 110.1999],
    ["Sanya", "China", 18.2528, 109.5119],
    ["Zhuhai", "China", 22.271, 113.5767],
    ["Ningbo", "China", 29.8683, 121.544],
    ["Wuxi", "China", 31.4912, 120.3119],
    ["Shaoxing", "China", 30.0023, 120.581],
    ["Huangshan", "China", 29.7147, 118.3376],
    ["Zhangjiajie", "China", 29.117, 110.4792],
    ["Dunhuang", "China", 40.1421, 94.662],
    ["Kashgar", "China", 39.4704, 75.9898],
    ["Nanchang", "China", 28.682, 115.8579],
    ["Wenzhou", "China", 27.9938, 120.6994],
    ["Dongguan", "China", 23.0207, 113.7518],
    ["Foshan", "China", 23.0218, 113.1219],
    ["Luoyang", "China", 34.6197, 112.454],
    ["Datong", "China", 40.0768, 113.3001],
    ["Pingyao", "China", 37.2015, 112.1763],
    ["Qufu", "China", 35.5967, 116.991],
    ["Yantai", "China", 37.4638, 121.4479],
    ["Weihai", "China", 37.5128, 122.1201],
    // India
    ["Mumbai", "India", 19.076, 72.8777],
    ["Delhi", "India", 28.7041, 77.1025],
    ["Bengaluru", "India", 12.9716, 77.5946],
    ["Jaipur", "India", 26.9124, 75.7873],
    ["Kolkata", "India", 22.5726, 88.3639],
    ["Chennai", "India", 13.0827, 80.2707],
    // Indonesia
    ["Jakarta", "Indonesia", -6.2088, 106.8456],
    ["Bali (Denpasar)", "Indonesia", -8.6705, 115.2126],
    // Japan
    ["Tokyo", "Japan", 35.6762, 139.6503],
    ["Osaka", "Japan", 34.6937, 135.5023],
    ["Kyoto", "Japan", 35.0116, 135.7681],
    ["Sapporo", "Japan", 43.0618, 141.3545],
    ["Yokohama", "Japan", 35.4437, 139.638],
    // Malaysia
    ["Kuala Lumpur", "Malaysia", 3.139, 101.6869],
    // Nepal
    ["Kathmandu", "Nepal", 27.7172, 85.324],
    // Pakistan
    ["Islamabad", "Pakistan", 33.6844, 73.0479],
    ["Karachi", "Pakistan", 24.8607, 67.0011],
    // Philippines
    ["Manila", "Philippines", 14.5995, 120.9842],
    // Singapore
    ["Singapore", "Singapore", 1.3521, 103.8198],
    // South Korea
    ["Seoul", "South Korea", 37.5665, 126.978],
    ["Busan", "South Korea", 35.1796, 129.0756],
    // Sri Lanka
    ["Colombo", "Sri Lanka", 6.9271, 79.8612],
    // Taiwan
    ["Taipei", "Taiwan", 25.033, 121.5654],
    // Thailand
    ["Bangkok", "Thailand", 13.7563, 100.5018],
    ["Chiang Mai", "Thailand", 18.7883, 98.9853],
    ["Phuket", "Thailand", 7.8804, 98.3923],
    // Vietnam
    ["Hanoi", "Vietnam", 21.0278, 105.8342],
    ["Ho Chi Minh City", "Vietnam", 10.8231, 106.6297],
    // ======== Oceania ========
    // Australia
    ["Sydney", "Australia", -33.8688, 151.2093],
    ["Melbourne", "Australia", -37.8136, 144.9631],
    ["Brisbane", "Australia", -27.4698, 153.0251],
    ["Perth", "Australia", -31.9505, 115.8605],
    ["Cairns", "Australia", -16.9186, 145.7781],
    ["Adelaide", "Australia", -34.9285, 138.6007],
    // New Zealand
    ["Auckland", "New Zealand", -36.8485, 174.7633],
    ["Wellington", "New Zealand", -41.2865, 174.7762],
    ["Queenstown", "New Zealand", -45.0312, 168.6626],
    // ======== North America ========
    // Canada
    ["Toronto", "Canada", 43.6532, -79.3832],
    ["Vancouver", "Canada", 49.2827, -123.1207],
    ["Montreal", "Canada", 45.5017, -73.5673],
    ["Ottawa", "Canada", 45.4215, -75.6972],
    ["Calgary", "Canada", 51.0447, -114.0719],
    // Cuba
    ["Havana", "Cuba", 23.1136, -82.3666],
    // Mexico
    ["Mexico City", "Mexico", 19.4326, -99.1332],
    ["Cancún", "Mexico", 21.1619, -86.8515],
    ["Guadalajara", "Mexico", 20.6597, -103.3496],
    // United States
    ["New York", "United States", 40.7128, -74.006],
    ["Los Angeles", "United States", 34.0522, -118.2437],
    ["San Francisco", "United States", 37.7749, -122.4194],
    ["Chicago", "United States", 41.8781, -87.6298],
    ["Las Vegas", "United States", 36.1699, -115.1398],
    ["Seattle", "United States", 47.6062, -122.3321],
    ["Boston", "United States", 42.3601, -71.0589],
    ["Washington, D.C.", "United States", 38.9072, -77.0369],
    ["Miami", "United States", 25.7617, -80.1918],
    ["Austin", "United States", 30.2672, -97.7431],
    ["New Orleans", "United States", 29.9511, -90.0715],
    ["Honolulu", "United States", 21.3069, -157.8583],
    ["Denver", "United States", 39.7392, -104.9903],
    ["San Diego", "United States", 32.7157, -117.1611],
    ["Portland", "United States", 45.5152, -122.6784],
    // ======== South America ========
    // Argentina
    ["Buenos Aires", "Argentina", -34.6037, -58.3816],
    // Bolivia
    ["La Paz", "Bolivia", -16.4897, -68.1193],
    // Brazil
    ["Rio de Janeiro", "Brazil", -22.9068, -43.1729],
    ["São Paulo", "Brazil", -23.5505, -46.6333],
    // Chile
    ["Santiago", "Chile", -33.4489, -70.6693],
    // Colombia
    ["Bogotá", "Colombia", 4.711, -74.0721],
    ["Cartagena", "Colombia", 10.391, -75.4794],
    // Ecuador
    ["Quito", "Ecuador", -0.1807, -78.4678],
    // Peru
    ["Lima", "Peru", -12.0464, -77.0428],
    ["Cusco", "Peru", -13.532, -71.9675],
    // Uruguay
    ["Montevideo", "Uruguay", -34.9011, -56.1645],
  ];

  const dataEl = document.getElementById("travel-places");
  const mapEl = document.getElementById("travel-map");
  if (!dataEl || !mapEl || typeof L === "undefined") return;

  // Compare names without accents, punctuation or a bracketed suffix, so that
  // "Dusseldorf" finds "Düsseldorf" and "Bali" finds "Bali (Denpasar)".
  function normalize(s) {
    return String(s || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s*\(.*\)\s*$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }
  function lookup(name, country) {
    const n = normalize(name);
    const hits = CITIES.filter((c) => normalize(c[0]) === n);
    if (!hits.length) return null;
    if (country) {
      const exact = hits.find((c) => normalize(c[1]) === normalize(country));
      if (exact) return exact;
    }
    return hits[0];
  }

  // Resolve every entry to {name, country, lat, lon, journalUrl, journalTitle}.
  const places = [];
  const unresolved = [];
  const seen = new Set();
  JSON.parse(dataEl.textContent).forEach((p) => {
    let { name, country, lat, lon } = p;
    if (typeof lat !== "number" || typeof lon !== "number") {
      const hit = lookup(name, country);
      if (!hit) {
        unresolved.push(name || "(unnamed)");
        return;
      }
      country = country || hit[1];
      lat = hit[2];
      lon = hit[3];
    }
    // A place listed twice in places.yml counts once.
    const key = normalize(name) + "|" + normalize(country);
    if (seen.has(key)) return;
    seen.add(key);
    places.push({ name: name || "", country: country || "", lat, lon, journalUrl: p.journalUrl || "", journalTitle: p.journalTitle || "" });
  });

  const map = L.map(mapEl, { worldCopyJump: true, minZoom: 2, maxZoom: 12, scrollWheelZoom: false }).setView([25, 10], 2);
  // Esri's dark canvas needs no API key. The base layer carries land and water, the
  // reference layer carries the place names.
  const esri = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/";
  const esriAttribution = "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ";
  L.tileLayer(esri + "World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16, attribution: esriAttribution }).addTo(map);
  L.tileLayer(esri + "World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16, pane: "overlayPane" }).addTo(map);

  const icon = L.divIcon({
    className: "citylight",
    html: '<div class="pulse"></div><div class="core"></div>',
    iconSize: [7, 7],
    iconAnchor: [3.5, 3.5],
  });

  function flyTo(p) {
    map.flyTo([p.lat, p.lon], 6, { duration: 1.2 });
  }

  places.forEach((p) => {
    const m = L.marker([p.lat, p.lon], { icon }).addTo(map);
    const label = p.name + (p.country ? ", " + p.country : "") + (p.journalUrl ? " — click to read the journal" : "");
    m.bindTooltip(label, { className: "citytip", direction: "top", offset: [0, -6] });
    m.on("click", () => {
      if (p.journalUrl) window.location.href = p.journalUrl;
      else flyTo(p);
    });
  });

  // Counters and list.
  document.getElementById("travel-city-count").textContent = places.length;
  document.getElementById("travel-country-count").textContent = new Set(places.map((p) => p.country).filter(Boolean)).size;

  const list = document.getElementById("travel-place-list");
  list.innerHTML = "";
  [...places]
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((p) => {
      const el = document.createElement("div");
      el.className = "travel-place";
      el.innerHTML = '<span class="g"></span><div class="info"><div class="nm"></div><div class="co"></div></div>';
      el.querySelector(".nm").textContent = p.name;
      el.querySelector(".co").textContent = p.country;
      if (p.journalUrl) {
        const a = document.createElement("a");
        a.className = "journal";
        a.href = p.journalUrl;
        a.textContent = p.journalTitle || "Journal";
        el.appendChild(a);
      }
      el.querySelector(".info").addEventListener("click", () => flyTo(p));
      el.querySelector(".g").addEventListener("click", () => flyTo(p));
      list.appendChild(el);
    });

  if (unresolved.length) {
    const note = document.createElement("p");
    note.className = "travel-unresolved";
    note.textContent = "No coordinates found for: " + unresolved.join(", ") + ". Add lat and lon in _data/places.yml.";
    list.appendChild(note);
    console.warn("travel-map: unresolved places", unresolved);
  }

  if (places.length) {
    map.fitBounds(
      places.map((p) => [p.lat, p.lon]),
      { padding: [40, 40], maxZoom: 4 }
    );
  }
})();
