/* =========================================================
   MOTORHEAD — seed data
   Swap this file for API calls when a backend is ready.
   ========================================================= */

const MH_CATEGORIES = ["All", "Bikes", "Cars", "Overland", "EV", "Builds", "Questions", "Trips"];

const MH_POSTS = [
  {
    id: "p1",
    name: "Aarav Mehta",
    handle: "@aaravrides",
    location: "Mumbai, India",
    initials: "AM",
    category: "Bikes",
    time: "2h",
    scene: "sunset",
    seed: 11,
    media: true,
    body: [
      "Took the Himalayan up to Malshej Ghat before sunrise. Fog so thick the headlight just turned into a wall of white. By 7am the valley opened up and there were maybe four of us on the whole pass.",
      "Bike's at 41,000 km now. Third chain, second set of tyres, zero regrets. If you're riding this road, start at 4am and stop at the chai stall past the second tunnel — the one with the blue tarpaulin."
    ],
    likes: 342,
    comments: 28
  },
  {
    id: "p2",
    name: "Nadia Okafor",
    handle: "@nadia.drives",
    location: "Lagos, Nigeria",
    initials: "NO",
    category: "Cars",
    time: "5h",
    scene: "dusk",
    seed: 23,
    media: true,
    body: [
      "Twelve years, one Corolla, 310,000 km. My father bought it new in 2013 and handed me the keys last month. The AC still works. The radio still works. The driver's window does not.",
      "Planning a Lagos → Accra run in December with my brother. Anyone done the coastal route recently? Looking for fuel stops that are actually open after dark."
    ],
    likes: 517,
    comments: 64
  },
  {
    id: "p3",
    name: "Tomás Herrera",
    handle: "@altiplano.tomas",
    location: "La Paz, Bolivia",
    initials: "TH",
    category: "Overland",
    time: "8h",
    scene: "desert",
    seed: 37,
    media: true,
    body: [
      "Nine days across the Salar de Uyuni in a 1997 Land Cruiser that has never once started on the first try. The trick is to talk to it. I'm not joking.",
      "At 4,800 m the engine loses about a third of its power and you learn to plan every climb. Also learned that a spare fuel filter is worth more than gold out there. Full route notes in my trip log."
    ],
    likes: 289,
    comments: 41
  },
  {
    id: "p4",
    name: "Yuki Tanaka",
    handle: "@yuki.wrench",
    location: "Osaka, Japan",
    initials: "YT",
    category: "Builds",
    time: "11h",
    scene: "neon",
    seed: 53,
    media: true,
    body: [
      "Finished the CB400 restomod. Took fourteen months, two donor bikes and a lot of arguments with the inspection office.",
      "Kept the original frame and clocks, rebuilt everything else. It's not fast, it's not loud, and it is exactly what I wanted. First shakedown run is the Ise coast this weekend."
    ],
    likes: 401,
    comments: 37
  },
  {
    id: "p5",
    name: "Sofia Lindqvist",
    handle: "@sofia.north",
    location: "Reykjavík, Iceland",
    initials: "SL",
    category: "EV",
    time: "1d",
    scene: "ice",
    seed: 67,
    media: true,
    body: [
      "Ring Road, counter-clockwise, in an EV. Everyone told me the charging network would be the problem. It wasn't. The wind was.",
      "Crossed the sands at 60 km/h with the wheel at a 15-degree angle just to go straight. Chargers every 80–120 km on the south coast, thinner up north — plan around Höfn and you're fine."
    ],
    likes: 233,
    comments: 19
  },
  {
    id: "p6",
    name: "Kofi Mensah",
    handle: "@kofi.overland",
    location: "Accra, Ghana",
    initials: "KM",
    category: "Questions",
    time: "1d",
    scene: "forest",
    seed: 71,
    media: false,
    body: [
      "Crossing into Togo and Benin next month on a DR650. Customs paperwork is where I keep hearing different stories — carnet needed or not for a 30-day stay?",
      "If you've done the border at Aflao recently, I'd genuinely appreciate the real version, not the forum version from 2019."
    ],
    likes: 96,
    comments: 52
  },
  {
    id: "p7",
    name: "Lucía Fernández",
    handle: "@lucia.moto",
    location: "Bogotá, Colombia",
    initials: "LF",
    category: "Bikes",
    time: "2d",
    scene: "sunset",
    seed: 83,
    media: true,
    body: [
      "Sunday morning club run up to La Calera. 22 bikes, three new riders, one flat tyre, and a breakfast that took two hours because nobody wanted to leave.",
      "That's the whole point, honestly. The road is great. The table afterwards is better."
    ],
    likes: 178,
    comments: 22
  },
  {
    id: "p8",
    name: "Elias Braun",
    handle: "@elias.garage",
    location: "Berlin, Germany",
    initials: "EB",
    category: "Cars",
    time: "2d",
    scene: "dusk",
    seed: 97,
    media: true,
    body: [
      "Bought a 1989 Golf Mk2 for €900 with a dead clutch and a suspicious amount of rust in the floorpan. Welded in new metal over two weekends.",
      "It now does 1,200 km a month as my actual daily. Old cars are not reliable. They are predictable, which is a different and better thing."
    ],
    likes: 312,
    comments: 45
  },
  {
    id: "p9",
    name: "Priya Nair",
    handle: "@priya.rides",
    location: "Kochi, India",
    initials: "PN",
    category: "Trips",
    time: "3d",
    scene: "forest",
    seed: 101,
    media: true,
    body: [
      "Ten days, 2,400 km, Kerala to Goa on a 350. Rode through rain for six of them and stopped counting leeches at some point.",
      "Wrote the whole thing up — roads, homestays, the mechanic in Mangalore who fixed my clutch in 40 minutes for the price of a meal. Link in the trip log."
    ],
    likes: 264,
    comments: 31
  }
];

const MH_TRIPS = [
  {
    id: "t1",
    from: "Nairobi",
    to: "Mombasa",
    route: "Nairobi → Mombasa",
    region: "East Africa",
    country: "Kenya",
    author: "Wanjiru Kamau",
    initials: "WK",
    vehicle: "Kawasaki Versys 650",
    distance: 485,
    days: 4,
    scene: "sunset",
    seed: 131,
    summary: "Escarpment switchbacks, red dust, and a coast that smells like salt and diesel.",
    story: [
      "We left Nairobi at 5:40am, which is the only sensible time to leave Nairobi. The city was still grey and the road out towards Athi River was empty enough to pretend we had it to ourselves.",
      "The first real test is the escarpment. Long sweeping bends, trucks doing 20 km/h in the middle of both lanes, and a view that opens up so suddenly you have to consciously stop looking at it. We stopped at a viewpoint where a man was selling boiled maize out of a wheelbarrow and charged us tourist prices with a completely straight face.",
      "Day two put us on the road to Voi. Heat comes at you from below and above. We started riding in two-hour blocks with forced water stops, which is the only way that stretch works. Somewhere past Mtito Andei the tarmac turns into a patchwork of repairs and you learn to read the road like a language.",
      "The last run into Mombasa is the reward. Baobabs, then palms, then the smell of the ocean. We pulled into the old town with the bikes filthy and the chain howling, and ate grilled fish on the street for about the price of a coffee back home.",
      "Four days, 485 km, one puncture, zero arguments. Would do it again tomorrow."
    ],
    highlights: ["Tsavo red dust", "Voi fuel stop", "Fort Jesus at sunset"]
  },
  {
    id: "t2",
    from: "Lisbon",
    to: "Marrakesh",
    route: "Lisbon → Marrakesh",
    region: "Europe / North Africa",
    country: "Portugal → Morocco",
    author: "Diogo Almeida",
    initials: "DA",
    vehicle: "BMW R 1250 GS",
    distance: 1420,
    days: 9,
    scene: "desert",
    seed: 149,
    summary: "A ferry, two borders, and the best mountain pass nobody talks about.",
    story: [
      "The plan was simple: ride south through Portugal, take the ferry from Tarifa, and keep going until the road ran out. It took nine days and one very expensive recovery truck.",
      "Southern Spain in late September is still brutal at midday. We rode from 7am to 11am, hid, then rode again from 4pm until dark. That rhythm carried us all the way to the coast and made the whole trip feel less like a race.",
      "Crossing at Tarifa is the easy part. The hills behind Tangier are where it gets interesting — new tarmac, no traffic, and villages where the road narrows to a single lane and someone's donkey is always the priority.",
      "The Tizi n'Tichka pass into Marrakesh is the one I'd come back for. Hairpin after hairpin, then a plateau that looks like another planet. We hit it at golden hour with the whole valley below us and I genuinely forgot to take a photo, which is the highest compliment I can give a road.",
      "Morocco is not a place you 'conquer' in nine days. It's a place that politely tells you to come back with more time."
    ],
    highlights: ["Tarifa ferry", "Tizi n'Tichka pass", "Aït Benhaddou"]
  },
  {
    id: "t3",
    from: "Osaka",
    to: "Cape Sōya",
    route: "Osaka → Cape Sōya",
    region: "East Asia",
    country: "Japan",
    author: "Yuki Tanaka",
    initials: "YT",
    vehicle: "Honda CB400",
    distance: 3100,
    days: 16,
    scene: "neon",
    seed: 167,
    summary: "Sixteen days north, chasing a summer that gets colder every hundred kilometres.",
    story: [
      "Japan rewards slow travel. The expressways are fast and boring; the national routes are slow and full of everything worth seeing. I took the second option the whole way.",
      "The first week was the Japan everyone photographs — temples, rice paddies, vending machines in the middle of nowhere. The second week was the Japan that actually stuck with me: fishing towns on the Sea of Japan coast where the only restaurant closes at 6pm and the owner decides whether to serve you based on how wet you look.",
      "Somewhere in Aomori the temperature dropped ten degrees in a day. I bought gloves at a hardware store, which turned out to be the best purchase of the entire trip.",
      "Cape Sōya is not dramatic. It's a wind-blasted gravel car park at the top of a country, with a sign and a lot of sky. I sat there for an hour and then rode back to the nearest town for ramen. Perfect ending."
    ],
    highlights: ["Sea of Japan coast", "Aomori forests", "Cape Sōya"]
  },
  {
    id: "t4",
    from: "Cape Town",
    to: "Windhoek",
    route: "Cape Town → Windhoek",
    region: "Southern Africa",
    country: "South Africa → Namibia",
    author: "Thabo Nkosi",
    initials: "TN",
    vehicle: "Toyota Hilux 2.4",
    distance: 1780,
    days: 7,
    scene: "desert",
    seed: 181,
    summary: "Gravel roads, a broken shock, and the clearest night sky I have ever stood under.",
    story: [
      "The N7 north is a road that makes you feel small in the best way. Straight for hours, koppies on the horizon, and a sky that keeps getting bigger the further you go.",
      "We crossed at Vioolsdrift with a boot full of water and a spare shock absorber that turned out to be the smartest thing we packed. The shock went on day three, on corrugated gravel outside Springbok, and we changed it on the roadside in about forty minutes with one socket set and a lot of optimism.",
      "Namibia is a country built on wrong turns that turn out to be right. We took a detour to see the Quiver trees and ended up at a farm stay where the owner's daughter made us dinner and refused to take money for it.",
      "The last night, outside Windhoek, we slept on the roof of the Hilux because it was too hot inside. Woke up at 3am to the Milky Way and absolutely no sound at all. That's the part I'd tell anyone to go find."
    ],
    highlights: ["N7 north", "Quiver trees", "Kalahari night sky"]
  },
  {
    id: "t5",
    from: "Ho Chi Minh City",
    to: "Hanoi",
    route: "Saigon → Hanoi",
    region: "Southeast Asia",
    country: "Vietnam",
    author: "Linh Pham",
    initials: "LP",
    vehicle: "Honda Winner X",
    distance: 1900,
    days: 12,
    scene: "forest",
    seed: 193,
    summary: "The coast road, the Hải Vân pass, and more roadside coffee than is medically advisable.",
    story: [
      "Everyone tells you to take the Ho Chi Minh Road for the scenery and the coast for the food. I took a bit of both and spent twelve days never once wishing I was somewhere else.",
      "The Hải Vân pass is the famous one and it deserves it. Fifty kilometres of switchbacks above the sea, with cloud sitting on the road at the top. I rode it twice in one day just because I could.",
      "What I didn't expect was how good the small roads are. Between Quy Nhơn and Hội An there are stretches where the map shows nothing at all and you end up riding past salt flats and fishing boats for hours without seeing another vehicle.",
      "Vietnam on a small bike is a masterclass in travelling light. One bag, one raincoat, and a willingness to stop whenever something looks interesting. I came home with a tan, a repaired exhaust, and about four hundred photos of coffee."
    ],
    highlights: ["Hải Vân pass", "Quy Nhơn coast", "Hội An at dawn"]
  },
  {
    id: "t6",
    from: "Anchorage",
    to: "Deadhorse",
    route: "Anchorage → Deadhorse",
    region: "North America",
    country: "USA",
    author: "Marguerite Roy",
    initials: "MR",
    vehicle: "Ford F-150 4x4",
    distance: 1300,
    days: 6,
    scene: "ice",
    seed: 211,
    summary: "The Dalton Highway, a cracked windscreen, and sunlight at 2am.",
    story: [
      "The Dalton is not a road you drive, it's a road you negotiate with. Gravel, mud, and truck traffic that owns the right of way at all times.",
      "We took it slow, which is the only correct speed. Two windscreens cracked in our convoy within the first hundred kilometres — flying gravel is just part of the deal. Bring spare wiper fluid and a healthy respect for anyone driving a fuel tanker.",
      "The Arctic Circle sign is a photo stop. The Brooks Range is the actual reward: bare mountains, no trees, and a colour of light I don't have a word for. We saw a grizzly from about four hundred metres and it was entirely uninterested in us.",
      "At Deadhorse the sun never really set. We stood outside at 2am in full daylight, watching the pipeline disappear north, and ate the worst sandwich of my life with total contentment."
    ],
    highlights: ["Dalton Highway", "Brooks Range", "Arctic Circle sign"]
  }
];

const MH_VEHICLES = [
  {
    id: "v1",
    name: "Royal Enfield Himalayan",
    year: 2021,
    owner: "Aarav Mehta",
    location: "Mumbai, India",
    type: "Adventure",
    odometer: 41200,
    scene: "sunset",
    seed: 227,
    mods: ["Bash plate", "Aux lights", "Sump guard"]
  },
  {
    id: "v2",
    name: "Toyota Corolla E170",
    year: 2013,
    owner: "Nadia Okafor",
    location: "Lagos, Nigeria",
    type: "Daily",
    odometer: 310500,
    scene: "dusk",
    seed: 239,
    mods: ["Stock everything", "Working AC"]
  },
  {
    id: "v3",
    name: "Land Cruiser 80 Series",
    year: 1997,
    owner: "Tomás Herrera",
    location: "La Paz, Bolivia",
    type: "Overland",
    odometer: 486000,
    scene: "desert",
    seed: 251,
    mods: ["Long-range tank", "Roof tent", "Dual battery"]
  },
  {
    id: "v4",
    name: "Honda CB400 Super Four",
    year: 1996,
    owner: "Yuki Tanaka",
    location: "Osaka, Japan",
    type: "Restomod",
    odometer: 88000,
    scene: "neon",
    seed: 263,
    mods: ["Frame-off rebuild", "Custom seat", "Öhlins rear"]
  },
  {
    id: "v5",
    name: "Volkswagen Golf Mk2",
    year: 1989,
    owner: "Elias Braun",
    location: "Berlin, Germany",
    type: "Project",
    odometer: 244000,
    scene: "forest",
    seed: 277,
    mods: ["Welded floorpans", "New clutch", "Coilovers"]
  },
  {
    id: "v6",
    name: "Kawasaki Versys 650",
    year: 2019,
    owner: "Wanjiru Kamau",
    location: "Nairobi, Kenya",
    type: "Touring",
    odometer: 67500,
    scene: "sunset",
    seed: 281,
    mods: ["Panniers", "Heated grips", "Crash bars"]
  },
  {
    id: "v7",
    name: "Tesla Model 3 LR",
    year: 2022,
    owner: "Sofia Lindqvist",
    location: "Reykjavík, Iceland",
    type: "EV",
    odometer: 96000,
    scene: "ice",
    seed: 293,
    mods: ["Winter tyres", "Mud flaps"]
  },
  {
    id: "v8",
    name: "Suzuki DR650",
    year: 2015,
    owner: "Kofi Mensah",
    location: "Accra, Ghana",
    type: "Dual-sport",
    odometer: 52000,
    scene: "forest",
    seed: 307,
    mods: ["Bark busters", "Extended tank", "Luggage rack"]
  }
];

const MH_CREWS = [
  { name: "Coast Riders", city: "Mombasa, KE", members: 412, focus: "Sunday coastal runs" },
  { name: "Altiplano Overland", city: "La Paz, BO", members: 188, focus: "High-altitude expeditions" },
  { name: "Kanto Wrench Club", city: "Tokyo, JP", members: 640, focus: "Builds & restomods" },
  { name: "Ring Road EV", city: "Reykjavík, IS", members: 96, focus: "Cold-weather EV travel" }
];

const MH_TRENDING = [
  { route: "Manali → Leh", country: "India", riders: "1.2k riding this month" },
  { route: "Route 66", country: "USA", riders: "840 riding this month" },
  { route: "Garden Route", country: "South Africa", riders: "610 riding this month" },
  { route: "Hải Vân Pass", country: "Vietnam", riders: "490 riding this month" }
];

const MH_MARKERS = [
  { name: "Reykjavík", lat: 64, lon: -22 },
  { name: "Berlin", lat: 52.5, lon: 13.4 },
  { name: "Mumbai", lat: 19, lon: 72.9 },
  { name: "Osaka", lat: 34.7, lon: 135.5 },
  { name: "Nairobi", lat: -1.3, lon: 36.8 },
  { name: "Cape Town", lat: -33.9, lon: 18.4 },
  { name: "Bogotá", lat: 4.7, lon: -74 },
  { name: "Mexico City", lat: 19.4, lon: -99.1 },
  { name: "Sydney", lat: -33.9, lon: 151.2 },
  { name: "Anchorage", lat: 61.2, lon: -149.9 }
];

const MH_REGIONS = [
  { label: "Europe", riders: 48200 },
  { label: "South Asia", riders: 39100 },
  { label: "North America", riders: 35700 },
  { label: "Africa", riders: 21400 },
  { label: "South America", riders: 17800 },
  { label: "Oceania", riders: 9600 }
];

/* Top-level `const` bindings are not window properties, so expose the data
   explicitly for the app layer (and for anyone poking at the console). */
Object.assign(window, {
  MH_CATEGORIES,
  MH_POSTS,
  MH_TRIPS,
  MH_VEHICLES,
  MH_CREWS,
  MH_TRENDING,
  MH_MARKERS,
  MH_REGIONS
});

