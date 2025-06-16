const productsData = [
    {
      id: "1",
      url: "images/products/1.jpg",
      resUrl: "../images/products/1res.jpg",
      price: "₹61,990.00",
      value: "61,990",
      accValue: "61990",
      discount: "-46%",
      mrp: "₹1,15,668.00",
      name: "Lenovo ThinkBook 14 Intel Core i5 11th Gen 14 inch (35.56cm) FHD IPS Thin & Light Laptop (16GB RAM/512GB SSD/Windows 11 Home/MS Office 2021/FPR/Intel Iris Xe Graphics Mineral Grey/1.4 kg), 20VDA0TLIH",
      category: "electronics",
      points: [
        "ThinkBook 14 Reliability tested on 12 MIL-STD-810H Methods and 22 Procedures | Body Material: Aluminium | Surface Treatment: Anodizing sandblasting | Built to withstand rugged usage and can handle accidental knocks, drops, and even spills",
        "Processor: 11th Gen Intel Core i5-1135G7, 2.4 Ghz base clock, 4.2 Ghz max boost clock, 4 Cores, 8 MB Cache | Memory: 16GB (8GB soldered + 8GB SO-DIMM) RAM DDR4-3200 MHz upgradable upto 40 GB | Storage: 512GB SSD M.2",
        "Operating System: Preloaded Windows 11 Home with Lifetime Validity | Pre-installed software: Microsoft Office Home & Student 2021",
        "Display: 14-inch (35.56 cm) screen with (1920X1080) Full HD IPS 250 nits Antiglare display | Graphics: Integrated Intel Iris Xe Graphics comes with DirectX 12 enables amazing graphics | Monitor Support: Supports up to 4 independent displays",
        "Ports: 2x USB 3.2 Gen 1 (1x Always On), 1x USB-C 3.2 Gen 2 (support data transfer, PD 3.0 and DP 1.4), 1x Thunderbolt 4 / USB4 40Gbps (support data transfer, PD 3.0 and DP 1.4), 1x HDMI 1.4b, 1x Card reader, 1x Ethernet (RJ-45), 1x Headphone / microphone combo jack (3.5mm)"
      ]
    },
    {
      id: "2",
      url: "images/products/2.jpg",
      resUrl: "../images/products/2res.jpg",
      price: "₹39,499.00",
      name: "Samsung Galaxy S20 FE 5G (Cloud Navy, 8GB RAM, 128GB Storage) with No Cost EMI & Additional Exchange Offers",
      category: "electronics",
      resUrl: "../images/products/2res.jpg",
      value: "39,499",
      accValue: "39499",
      discount: "-47%",
      mrp: "₹74,999.00",
      points: [
        "5G Ready powered by Qualcomm Snapdragon 865 Octa-Core processor, 8GB RAM, 128GB internal memory expandable up to 1TB, Android 11.0 operating system and dual SIM",
        "Triple Rear Camera Setup - 12MP (Dual Pixel) OIS F1.8 Wide Rear Camera + 8MP OIS Tele Camera + 12MP Ultra Wide | 30X Space Zoom, Single Take & Night Mode | 32MP F2.2 Front Punch Hole Camera",
        "6.5-inch(16.40 centimeters) Infinity-O Super AMOLED Display with 120Hz Refresh rate, 1080 x 2400 (FHD+) Resolution",
        "4500 mAh battery (Non -removable) with Super Fast Charging, FAst Wireless Charging & Finger Print sensor",
        "IP68 Rated, MicroSD Card Slot (Expandable upto 1 TB), Dual Nano Sim, Hybrid Sim Slot, 5G+5G Dual stand by"
      ]
    },
    {
      id: "3",
      url: "images/products/3.jpg",
      price: "₹21,900.00",
      name: "New Apple AirPods Pro with MagSafe Charging Case",
      category: "electronics",
      resUrl: "../images/products/3res.jpg",
      value: "21,900",
      accValue: "21900",
      discount: "-12%",
      mrp: "₹24,900.00",
      points: [
        "Active Noise Cancellation blocks outside noise, so you can immerse yourself in music",
        "Transparency mode for hearing and interacting with the world around you",
        "Spatial audio with dynamic head tracking places sound all around you",
        "Adaptive EQ automatically tunes music to your ears",
        "Three sizes of soft, tapered silicone tips for a customisable fit"
      ]
    },
    {
      id: "4",
      url: "images/products/4.jpg",
      price: "₹1,299.00",
      name: "boAt Airdopes 121v2 True Wireless Earbuds with Upto 14 Hours Playback, Lightweight Earbuds, 8MM Drivers, LED Indicators and Multifunction Controls(Active Black)",
      category: "electronics",
      resUrl: "../images/products/4res.jpg",
      value: "1,299",
      accValue: "1299",
      discount: "-57%",
      mrp: "₹2,990.00",
      points: [
        "Playback- Airdopes 121v2 offers a nonstop playback of up to 3.5H with each charge and an additional 10.5H playtime with the included charging case",
        "Lightweight- With a dual tone finish on a lightweight ergonomic design weighing just around 4g per earbud, get ready to groove in full flow with Airdopes 121v2v2 TWS earbuds",
        "Drivers- It possesses powerful 8mm drivers that pump out immersive auditory experience all day long",
        "Battery Indicator- Its carry cum charge case also has the battery LED indicator that shows the remaining power for the case",
        "Controls- The true wireless earbuds offer easy access multifunction button controls with stereo calling feature for an overall seamless user experience."
      ]
    },
    {
      id: "5",
      url: "images/products/5.jpg",
      price: "₹999.00",
      name: "Classic Mosquito Net for Double Bed, Embroidery, King Size, Polyester, Strong 30GSM, PVC Coated Steel (L200cm X W200cm X H145cm) Foldable for Double Bed - King Size, Blue",
      category: "home",
      resUrl: "../images/products/5res.jpg",
      value: "999",
      accValue: "999",
      discount: "-50%",
      mrp: "₹2,000.00",
      points: [
        "Size of Double bed is 200cm X 200cm X 145cm (i.e. 6.56ft X 6.56ft X 4.75ft) can Easily accommodate bed for King size, Super King size bed. Suitable for 2 Adults & 1 Child.",
        "Easily Washable (steel wires are corrosion resistant), Self-Supporting, No Requirement to nail the wall.",
        "Pops up in an Instant and Automatically, Can be folded in less than 30 Seconds.",
        "Storage Bag Included at free of cost, comes with patches to cover the future accidental holes in the mosquito net, Provided with large Zipper gates on two Sides with inner and outer runner for easy and convenient Entry and Exit.",
        "Easy to fold, Easy to carry, it offers a healthy environment to sleep in."
      ]
    },
    {
      id: "6",
      url: "images/products/6.jpg",
      price: "₹2,097.00",
      name: "crocs Unisex-Adult Bayaband Clog",
      category: "fashion",
      resUrl: "../images/products/6res.jpg",
      value: "2,097",
      accValue: "2097",
      discount: "-40%",
      mrp: "₹3,495.00",
      points: [
        "Sole: Ethylene Vinyl Acetate",
        "Sole: Ethylene Vinyl Acetate",
        "Shoe Width: Regular",
        "Outer Material: EVA. Washes off with soap and water",
        "Closure Type: Slip On"
      ]
    },
    {
      id: "7",
      url: "images/products/7.jpg",
      price: "₹1,619.00",
      name: "INDO ERA Women's Viscose Embroidered Straight Kurta Palazzo With Dupatta Set",
      category: "fashion",
      resUrl: "../images/products/7res.jpg",
      value: "1,619",
      accValue: "1619",
      discount: "-60%",
      mrp: "₹3,999.00",
      points: [
        "Care Instructions: Dry Clean Only",
        "Fit Type: Regular",
        "Print & Pattern : Solid ; Package Contant : Kurta, Palazzo With Dupatta",
      ]
    },
    {
      id: "8",
      url: "images/products/8.jpg",
      price: "₹2,884.00",
      name: "QUBO Smart Cam 360 | 1080p Full HD Wi-Fi Camera | Trust of Hero Group | 360° Deg Coverage with Pan & Tilt | Intruder Alarm | Full Color in Low Light | Two Way Talk | Alexa & OK Google | Made in India",
      category: "electronics",
      resUrl: "../images/products/8res.jpg",
      value: "2,884",
      accValue: "2884",
      discount: "-28%",
      mrp: "₹3,990.00",
      points: [
        "PROUDLY INDIAN: Qubo Smart Cam 360 is Designed & Made in INDIA. Engineered for the Security Needs of the Indian Market.",
        "TRUST OF HERO GROUP: Our Round-the-Clock Customer Service & Wide field Network not only resolves your all concerns & queries but rather ensures complete peace of mind for Lifetime.",
        "360 COVERAGE: Multi-Directional rotation of the lens ensures that there are no blind spots. NOTE: Qubo Smart Cam 360 is designed to be used indoors only.",
        "THEFT PROOF CLOUD STORAGE: Secure all your recordings on cloud storage based in India. Your private home moments stay with you even if the device is stolen.",
        "PERSON DETECTION WITH INTRUDER ALARM : Advanced AI capabilities that can smartly detect & notify whenever a person is detected. You can also ring an automatic loud siren in case of an intrusion."
      ]
    },
    {
      id: "9",
      url: "images/products/9.jpg",
      price: "₹1,299.00",
      name: "TIMEX Analog Men's Watch",
      category: "fashion",
      resUrl: "../images/products/9res.jpg",
      value: "1,299",
      accValue: "1299",
      discount: "-19%",
      mrp: "₹1,595.00",
      points: [
        "Case Shape: Round, Dial Glass Material: Mineral, Band material: Leather",
        "Watch Movement Type: Quartz, Watch Display Type: Analog",
        "Case Material: Brass, Case Diameter: 40 millimeters, Brass Bezel ; Case Thickness: 8.8mm",
        "Water Resistance Depth: 30 meters, Buckle Clasp",
        "Ideal for birthday, anniversary and wedding gift"
      ]
    },
    {
      id: "10",
      url: "images/products/10.jpg",
      price: "₹429.00",
      name: "Yogabar Dark Chocolate & Cranberry Muesli 700g - Breakfast Cereal with 83% Nuts & Seeds, Dried Fruits, & Whole Grains - Vegan & Gluten Free Snack",
      category: "beauty",
      resUrl: "../images/products/10res.jpg",
      value: "429",
      accValue: "429",
      discount: "-14%",
      mrp: "₹499.00",
      points: [
        "Whole grains: Quinoa, Oats and Brown Rice",
        "Made from 100% natural ingredients",
        "Rich in nuts and dried fruits: almonds, raisins, dried cranberries rich in seeds: pumpkin, chia and flax",
        "Antioxidant rich dark chocolate + cranberry",
        "Slow-roasted, slow ground in small batches for superior flavour"
      ]
    },
    {
      id: "11",
      url: "images/products/11.jpg",
      price: "₹358.00",
      name: "Integriti Men Sweatshirt",
      category: "fashion",
      resUrl: "../images/products/11res.jpg",
      value: "358",
      accValue: "358",
      discount: "-86%",
      mrp: "₹2,499.00",
      points: [
        "Care Instructions: Machine Wash",
        "Fit Type: Modern",
        "Hooded,Long Sleeve,Print",
        "Sweatshirt",
        "Package Dimensions: 10.7 L x 39.6 H x 38.0 W (centimeters)"
      ]
    },
    {
      id: "12",
      url: "images/products/12.jpg",
      price: "₹630.00",
      name: "Harpa Synthetic a-line Dress (GR5759_Navy_Small)",
      category: "fashion",
      resUrl: "../images/products/12res.jpg",
      value: "630",
      accValue: "630",
      discount: "-70%",
      mrp: "₹2,099.00",
      points: [
        "Care Instructions: Hand Wash Only",
        "Color name: pink",
        "100% Polyester",
        "Hand wash; A-line",
        "Sleeveless"
      ]
    },
    {
      id: "13",
      url: "images/products/13.jpg",
      price: "₹3,999.00",
      name: "boAt Stone 1200 14W Bluetooth Speaker with Upto 9 Hours Battery, RGB LEDs, IPX7 and TWS Feature(Blue)",
      category: "electronics",
      resUrl: "../images/products/13res.jpg",
      value: "3,999",
      accValue: "3999",
      discount: "-43%",
      mrp: "₹6,990.00",
      points: [
        "It delivers a powerful 14W stereo sound for a complete immersive experience.",
        "Stone 1200 provides a battery time of upto 9 hours without its RGB LEDs and upto 7 hours with it(@60% volume) with a charging time of 4 hours.",
        "Carry your splashproof speakers to anywhere with IPX7 splash & water shield leaving behind the tension of water running over",
        "Add a second speaker with our TWS technology and enjoy sound, twice as powerful, Battery Capacity (mAh) - 3600 mAh, Playback Time - 9 hours, Charging Time - 4 hours, Standby Time 360 hours",
        "Its 360-degree ergonomic design makes it ideal to be carried around anywhere you go. It also comes with a carry strap making it very convenient for you to carry it around."
      ]
    },
    {
      id: "14",
      price: "₹699.00",
      value: "699",
      accValue: "699",
      discount: "-53%",
      mrp: "₹1,499",
      url: "images/products/14.jpg",
      category: "home",
      resUrl: "../images/products/14res.jpg",
      name: "Interiocrafts Cast Iron Degchi Style Dhoop and Tealight Candle Holder",
      points: [
        "✔ It can be used as a dhoop dani with the lid on and candle holder with votive stand. A perfect item for your pooja mandir.",
        "✔ The chic functionality of this beautiful votive candle and dhoop holder is inimitable.",
        "✔ Rajasthan is famous for its handicrafts and the creativity of the artists can clearly be seen with use of artifacts.",
        "✔ It will not get heated up while use;It is easy to hold for doing 'Dhuni' in your entire house.",
        "✔ It can be used for inserting loban, bakhoor, samarni dhoop incense sticks",
      ]
    },
    {
      id: "15",
      price: "₹499.00",
      url: "images/products/15.jpg",
      name: "Urban Born Cast Iron Metal Flower vase for Home Decor and Living Room Vintage Antique Decor (Gold, 15 x 15 x 15 cm)",
      category: "home",
      resUrl: "../images/products/15res.jpg",
      value: "499",
      accValue: "499",
      discount: "-50%",
      mrp: "₹1,000.00",
      points: [
        "This flower vase is made from one Piece of Iron with unique Decorative design.",
        "Item size : HXW : 15 x 15 cm / Finish- Gold",
        "Package contains -1pc Flower vase without Flowers.Good-quality and stylish products.Flowers are for illustration purpose not with Vase.",
        "This flower vase is made from one Piece of Iron with unique Decorative design.",
        "Great for gifting purposes in Diwali, Birthday, Anniversary, Corporate party etc."
      ]
    },
    {
      id: "16",
      price: "₹999.00",
      url: "images/products/16.jpg",
      name: "Livpure Smart Solid Window Polyester 5 feet Curtains with tieback( Beige ) Set",
      category: "home",
      resUrl: "../images/products/16res.jpg",
      value: "999",
      accValue: "999",
      discount: "-33%",
      mrp: "₹1,499.00",
      points: [
        "Color: Beige Size: 5 Feet Material: Polyester Package Contents: 2 Window Curtains Attached tiebacks: Yes (Velcro) Window Curtain Dimensions: 152.4 x 132 CM. | 60 x 52 INCH",
        "Blackout: Blocks 95% sunlight from passing through the curtains Noise reduction: Blocks most of the street noise & keeps the inside undisturbed UV protection: Blocks UV rays from sunlight to pass through into your home Temperature insulation: Blocks heat transfer and helps in maintaining the AC efficiency",
        "Unique 3-Weave Technology: Livpure curtains are made using Triple Weave Technology with three layers of fabric strongly interwoven to ensure effective blackout, protection from the UV rays and insulate your home",
        "Hanging Style: These curtains are easy to install and come with high quality eyelet rings Eyelet Rings: Detachable with 1.5 in inner diameter for the curtain to fit nicely Wash Care: Hands & Machine washable after removing the eyelets, Do not bleed color",
        "Product color may slightly vary due to photographic lighting sources or your monitor settings"
      ]
    },
    {
      id: "17",
      price: "₹1,399.00",
      url: "images/products/17.jpg",
      name: "NEW LEAF 220 GSM All-Season Printed Super Soft Light Weight Cotton Comforter Set with 1 Bedsheet 2 Pillow Covers (Double, Blue, Orange) -4 Pieces",
      category: "home",
      resUrl: "../images/products/17res.jpg",
      value: "1,399",
      accValue: "1399",
      discount: "-72%",
      mrp: "₹4,999.00",
      points: [
        "The king size quilt set includes - 1pc Bedsheet 1 quilt (100 inch x 90 inch), 2pcs cover ( 18 inch x 28 inch)",
        "New Embroidered artwork makes the quilts much more durable and lightweight rather than the traditional stitching technique.",
        "The cover and filling are made of 100% Microfiber.",
        "The geometric classic pattern is easy to match your bedroom decor, offering you an elegant and classic feeling.",
        "Machine wash cold, gentle cycle, only non-chlorine bleach when needed, tumble dry low, steam if needed, do not iron. No shrinkage, No colour fading and No unravelling after washing."
      ]
    },
    {
      id: "18",
      price: "₹329.00",
      url: "images/products/18.jpg",
      name: "Kaameri Bazaar Bronze Color Metal Bird cage Tea Light Holder with Butter Pot tealight Glass for Home Décor",
      category: "home",
      resUrl: "../images/products/18res.jpg",
      value: "329",
      accValue: "329",
      discount: "-63%",
      mrp: "₹899.00",
      points: [
        "This Diwali Light Your home with this beautiful Bird Cage Tealight Holder",
        "This stunning Kaameri Bazaar Tealight Holder makes for a perfect addition to your home.",
        "BENEFITS: They can accent your home or office for the right decor. Perfect for adding a decorative touch to any room's decor",
        "Made from high quality material, Durable and Long lasting",
        "Ideal For: Decoration, Gifting, Diwali Decoration, Christmas Party Decoration, Home Decor, Candle Light Dinner"
      ]
    },
    {
      id: "19",
      price: "₹549.00",
      url: "images/products/19.jpg",
      name: "The Vintage Artefacts Donut White, Ceramic Pot and vase Handcrafted, Round Shaped (vase)",
      category: "home",
      resUrl: "../images/products/19res.jpg",
      value: "549",
      accValue: "549",
      discount: "-63%",
      mrp: "₹1,499.00",
      points: [
        "This Diwali Light Your home with this beautiful Bird Cage Tealight Holder",
        "This stunning Kaameri Bazaar Tealight Holder makes for a perfect addition to your home.",
        "BENEFITS: They can accent your home or office for the right decor. Perfect for adding a decorative touch to any room's decor",
        "Made from high quality material, Durable and Long lasting",
        "Ideal For: Decoration, Gifting, Diwali Decoration, Christmas Party Decoration, Home Decor, Candle Light Dinner"
      ]
    },
    {
      id: "20",
      price: "₹1,499.00",
      url: "images/products/20.jpg",
      name: "JH Gallery Handcrafted and Emboss Painted Colorful Wood Elephant Shape Garden Table (8 Inches Height, Red)",
      category: "home",
      resUrl: "../images/products/20res.jpg",
      value: "1,499",
      accValue: "1499",
      discount: "-44%",
      mrp: "₹1,499.00",
      points: [
        "JH Gallery Presents Hand crafted Or Hand Painted decorative wooden small Elephant Stool Multicolored which widely used in worldwide to decor balcony, office stool, living room, side table. It is traditional item made up of mango wood and MDF also.",
        "Package Content -One Wooden Elephant Statue Table Cum Stool/Handcrafted with Artistic Painting",
        "Perfect For Decor as Table It's very suitable for gifting as it comes in best packaging as well. Perfect for using end table nightstand, kids step stool, night stand, keeping your planters, as a stand",
        "Care Instruction : table away from warmth , heat and sunshine. Use dry/wet cotton cloth to remove dirt.",
        "100% Handmade :- Handmade by recognized Artisans from JH Gallery Rajasthan, product created under Make in INDIA"
      ]
    }
  ]
  
  module.exports = productsData;