import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product';

dotenv.config();

const PRODUCTS = [
  // 1. Workstations
  {
    name: "Quantum Rig V9",
    description: "Multi-threaded quantum workstation with integrated superconducting cores. Engineered for high-dimensional AI training and neural mapping operations.",
    price: 4299,
    category: "Workstations",
    stock: 12,
    images: ["from-[#00f0ff] to-transparent"],
    features: ["Superconducting Core", "1000 Qubits Processing", "Liquid Nitrogen Cooling"],
    aiSummary: "The pinnacle of quantum computing in a desktop factor. Best suited for deep neural simulation.",
    aiPros: ["Infinite bandwidth", "Real-time model training"],
    aiCons: ["Requires secondary ventilation", "Extremely heavy"],
    idealUserType: "AI Architect"
  },
  {
    name: "Cortex Core Station",
    description: "Biomimetic processor station featuring synthetic organic synapses. Mimics human brain cognitive paths to deliver zero-latency code interpretation.",
    price: 3499,
    category: "Workstations",
    stock: 8,
    images: ["from-[#8a2be2] to-[#ff007f]"],
    features: ["Synaptic Processing", "128GB Bio-RAM", "Organic Heat Sink"],
    aiSummary: "A biological workstation that adapts its architecture to your daily coding patterns.",
    aiPros: ["Adaptive clock speed", "Highly energy efficient"],
    aiCons: ["Slight organic degradation over 5 years", "Niche compiler support"],
    idealUserType: "Software Synthesizer"
  },
  // 2. Gaming
  {
    name: "CyberMech Keyboard",
    description: "Holographic tactile feedback keyboard with mechanical actuator switches. Provides custom tension settings per key.",
    price: 299,
    category: "Gaming",
    stock: 45,
    images: ["from-[#00f0ff] to-[#8a2be2]"],
    features: ["Actuator Switches", "Per-Key Haptic Feedback", "Holographic Symbols Overlay"],
    aiSummary: "Fuses mechanical luxury with solid-state holographic responsiveness.",
    aiPros: ["Customizable actuation profiles", "Zero mechanical wear"],
    aiCons: ["Steep learning curve", "Bright LED requirements"],
    idealUserType: "Competitive Reflex Specialist"
  },
  {
    name: "Omni-Directional Gaming Pad",
    description: "Micro-gravitational hover pad replacing traditional gaming controllers. Tracks finger movements in 3D air space.",
    price: 499,
    category: "Gaming",
    stock: 20,
    images: ["from-[#ff007f] to-transparent"],
    features: ["Magnetic Hover Sensor", "LiDAR Finger Tracking", "Zero Friction Surface"],
    aiSummary: "Eliminates the joystick entirely for gesture-based competitive movements.",
    aiPros: ["Absolute precision", "Ergonomically perfect"],
    aiCons: ["Requires clean hands for LiDAR sensors", "Slight gesture lag"],
    idealUserType: "Pro Esports Athlete"
  },
  // 3. AI Devices
  {
    name: "Nexus AI Hub Node",
    description: "Physical AI coordinator hosting a local instance of Nexus OS. Manages all smart devices, workflows, and holographic assistants in your node.",
    price: 599,
    category: "AI Devices",
    stock: 30,
    images: ["from-[#00f0ff] to-[#8a2be2]"],
    features: ["Local GPT Engine", "10Gbps Multi-Band Hub", "Holographic Projector Dome"],
    aiSummary: "A standalone core for private, offline intelligence control.",
    aiPros: ["100% data privacy", "Instant system automation"],
    aiCons: ["Heats up under heavy local inference", "Requires static IP"],
    idealUserType: "Smart Space Operator"
  },
  {
    name: "Holo-Assistant Projector Capsule",
    description: "Pocket-sized cylindrical capsule projecting a high-fidelity 3D holographic digital companion. Synchronizes with global neural networks.",
    price: 349,
    category: "AI Devices",
    stock: 60,
    images: ["from-[#ff007f] to-[#8a2be2]"],
    features: ["360 Holographic Beam", "Speech Separation Array", "Emotion Matching Core"],
    aiSummary: "A companion capsule that projects a virtual guide, shopping assistant, or developer buddy.",
    aiPros: ["Vibrant projection", "Very compact"],
    aiCons: ["Visible degradation in direct sunlight", "Limited battery life (4h)"],
    idealUserType: "Remote Freelancer"
  },
  // 4. Laptops
  {
    name: "AeroGlass Carbon Laptop",
    description: "15-inch transparent glass-alloy laptop with dual-layer OLED screens and carbon-nano framework. Completely see-through when inactive.",
    price: 2499,
    category: "Laptops",
    stock: 15,
    images: ["from-[#00f0ff] to-transparent"],
    features: ["Transparent OLED Display", "Solid-State Carbon Frame", "Induction Charging"],
    aiSummary: "Stunning carbon-glass structure that merges the physical display with the environment.",
    aiPros: ["Ultra futuristic styling", "Dual-sided display mode"],
    aiCons: ["Glares in direct outdoor light", "Highly prone to fingerprints"],
    idealUserType: "Creative Visionary"
  },
  {
    name: "Neural Deck Pro",
    description: "Cyber-deck terminal featuring built-in direct neural interface (DNI) link ports. Built for prompt engineers who want direct neural thoughts-to-code compilation.",
    price: 2899,
    category: "Laptops",
    stock: 10,
    images: ["from-[#8a2be2] to-transparent"],
    features: ["Direct Neural Link Output", "Mechanical Ortholinear Keyboard", "Fold-out Triple HUD Screen"],
    aiSummary: "Designed for prompt engineers and system terminal command agents.",
    aiPros: ["DNI connector active", "Extremely rugged military frame"],
    aiCons: ["Heavy form factor", "High battery drainage"],
    idealUserType: "Cyber Operator"
  },
  // 5. Monitors
  {
    name: "Holo-Display Pro",
    description: "Curved 49-inch display emitting true holographic depth pixels. Projects 3D layers up to 6 inches outside the screen plane.",
    price: 1450,
    category: "Monitors",
    stock: 25,
    images: ["from-[#ff007f] to-transparent"],
    features: ["True Holographic Depth Layers", "240Hz Refresh Rate", "Zero Eye Strain Coating"],
    aiSummary: "Perfect for spatial computing designers and game developers.",
    aiPros: ["True physical layers", "Stunning brightness levels"],
    aiCons: ["Requires specific graphic driver", "Consumes high power"],
    idealUserType: "Spatial UI Developer"
  },
  {
    name: "Horizon Stretch Panel",
    description: "Ultra-wide 32:9 modular screen that can bend manually between 1000R and flat. Includes dynamic nano-pixel self-healing technology.",
    price: 1299,
    category: "Monitors",
    stock: 18,
    images: ["from-[#00f0ff] to-[#8a2be2]"],
    features: ["Variable Bend Screen", "Nano-Pixel Healing Tech", "Auto-Calibration Matrix"],
    aiSummary: "A screen that physically curves on command based on gaming or productive workloads.",
    aiPros: ["Dual curvature modes", "No dead pixel failure"],
    aiCons: ["Heavy mounting arms required", "Thicker frame border"],
    idealUserType: "Hardware Purist"
  },
  // 6. VR Tech
  {
    name: "Neural Interface Headset",
    description: "Advanced EEG brainwave reading headband that maps cortical activity directly to computer system inputs. No eye tracking needed.",
    price: 899,
    category: "VR Tech",
    stock: 35,
    images: ["from-[#8a2be2] to-transparent"],
    features: ["256 EEG Cortex Channels", "Micro-Vibrational Feedback", "Ultralight Carbon Band"],
    aiSummary: "Allows hands-free operating system control via simple directed thoughts.",
    aiPros: ["Infinite input options", "Zero neck strain"],
    aiCons: ["Requires periodic sensor calibration", "Sensitive to strong emotions"],
    idealUserType: "Neural Pilot"
  },
  {
    name: "Tactile Haptic Gloves",
    description: "Full sensory feedback gloves providing high-fidelity physical sensation rendering for VR and holographic workspace manipulation.",
    price: 650,
    category: "VR Tech",
    stock: 40,
    images: ["from-[#8a2be2] to-transparent"],
    features: ["Piezoelectric Haptic Nodes", "Full Finger Flex Sensors", "Thermal Feedback Blocks"],
    aiSummary: "Touch virtual documents, products, and workspaces with realistic pressure and heat.",
    aiPros: ["Extremely realistic touch simulator", "Fast charging"],
    aiCons: ["Sweaty inside after long use", "Expensive accessories required"],
    idealUserType: "Spatial UI Builder"
  },
  // 7. Smart Home
  {
    name: "Aura LED Smart Strips",
    description: "Quantum-dot LED strips syncing directly with the system's emotional state or musical beats. Casts highly saturated neon light.",
    price: 89,
    category: "Smart Home",
    stock: 100,
    images: ["from-[#8a2be2] to-[#ff007f]"],
    features: ["Quantum Dot Brightness", "System Bio-Sync Link", "Magnetic Backing"],
    aiSummary: "Imbues your developer dungeon with dynamic cyberpunk ambiance.",
    aiPros: ["Unmatched neon saturation", "Zero latency system link"],
    aiCons: ["Requires controller node", "Difficult to trim"],
    idealUserType: "Aesthetic Specialist"
  },
  {
    name: "Synapse Smart Blind System",
    description: "Molecular glass blind overlays that tint completely opaque or shift to preset light scattering modes via voice commands.",
    price: 450,
    category: "Smart Home",
    stock: 22,
    images: ["from-[#00f0ff] to-transparent"],
    features: ["Molecular Glass Overlay", "Ambient Light Tracker", "Auto Thermal Blocking"],
    aiSummary: "Automatically tints to block solar heat while maintaining neon aesthetic values.",
    aiPros: ["High thermal protection", "Stunning frost effects"],
    aiCons: ["Needs physical window measurements", "Complex installation"],
    idealUserType: "Cyber Operator"
  },
  // 8. Creator Tools
  {
    name: "Chroma Pen Pro",
    description: "Holographic stylus sketching directly onto air surfaces with realistic brush physics and direct pressure feedback.",
    price: 199,
    category: "Creator Tools",
    stock: 55,
    images: ["from-[#ff007f] to-transparent"],
    features: ["Air Sketching Core", "Pressure Sensitive Actuator", "Custom Pen Tips"],
    aiSummary: "Draw in 3D air space. The stylus translates hand movements to spatial assets.",
    aiPros: ["Direct spatial model integration", "Lightweight design"],
    aiCons: ["Requires compatible headset", "Fragile tips"],
    idealUserType: "Spatial Concept Artist"
  },
  {
    name: "Synthesis Console V3",
    description: "Modular soundboard and macro desk console with dynamically updating tiny OLED screens on every single button.",
    price: 850,
    category: "Creator Tools",
    stock: 14,
    images: ["from-[#00f0ff] to-[#8a2be2]"],
    features: ["64 OLED Dynamic Keys", "Motorized Slide Faders", "Custom CNC Finish"],
    aiSummary: "A physical command deck where buttons change icons depending on your active IDE or DAW.",
    aiPros: ["Endless macro configuration", "Stunning physical aesthetic"],
    aiCons: ["Steep configuration requirements", "High power consumption"],
    idealUserType: "Synthesizer & Composer"
  },
  // 9. Audio
  {
    name: "AeroSonic Bone Headphones",
    description: "Ultra-compact bone conduction speakers with spatial audio drivers. Delivers absolute clarity while keeping your ears clear.",
    price: 320,
    category: "Audio",
    stock: 40,
    images: ["from-[#ff007f] to-[#8a2be2]"],
    features: ["Dynamic Bone Conduction", "72h Standby Battery", "Sub-Bass Amplification"],
    aiSummary: "Delivers deep bass response straight through the jaw bone with zero acoustic leakage.",
    aiPros: ["Perfect environmental awareness", "Zero ear fatigue"],
    aiCons: ["Less sound isolation in loud crowds", "Headband fit is firm"],
    idealUserType: "Urban Explorer"
  },
  {
    name: "Studio Prism Sound Cube",
    description: "A solid glass cube speaker emitting omnidirectional, spatial audio via molecular resonance. The entire glass cube vibrates.",
    price: 799,
    category: "Audio",
    stock: 16,
    images: ["from-[#00f0ff] to-transparent"],
    features: ["Molecular Resonance Tech", "Multiverse Stream Link", "Ambient Glow Aura"],
    aiSummary: "Turns any flat surface into a giant subwoofer for unmatched spatial dispersion.",
    aiPros: ["Omnidirectional sound projection", "Minimalist glass design"],
    aiCons: ["Fragile structure", "Base resonance can rattle desk items"],
    idealUserType: "Audiophile Purist"
  },
  // 10. Accessories
  {
    name: "Biometric Security Key",
    description: "Physical hardware token with DNA strand verification sensor. Protects digital wallets and local servers with unbreakable biometric link.",
    price: 129,
    category: "Accessories",
    stock: 120,
    images: ["from-[#ff007f] to-transparent"],
    features: ["DNA Strand Sensor", "Quantum Crypto Ledger", "Waterproof Shell"],
    aiSummary: "The ultimate secure key utilizing direct genetic authentication.",
    aiPros: ["Zero theft chance", "Extremely portable"],
    aiCons: ["Cannot share access with team members", "High key generation cost"],
    idealUserType: "Security Architect"
  },
  {
    name: "Quantum Battery Pack 100W",
    description: "Portable solid-state quantum energy pack. Recharges in 30 seconds and supplies power to high-performance workstations.",
    price: 249,
    category: "Accessories",
    stock: 80,
    images: ["from-[#00f0ff] to-[#8a2be2]"],
    features: ["Quantum Dot Battery Cells", "30-Sec Induction Charge", "Dual USB-Q Outlets"],
    aiSummary: "Dramatically fast charge cycles for nomadic creators needing serious backup power.",
    aiPros: ["Charges in under a minute", "No cell memory degradation"],
    aiCons: ["Heavy block shape", "Slight warm temperature output"],
    idealUserType: "Digital Nomad"
  },
  // 11. Networking
  {
    name: "Nexus Wave Beam Router",
    description: "Multi-band high frequency spatial beam-forming router. Directs high-speed data lasers directly to connected device receptors.",
    price: 699,
    category: "Networking",
    stock: 24,
    images: ["from-[#00f0ff] to-[#8a2be2]"],
    features: ["Spatial Laser Beamforming", "100 Gbps Bandwidth", "Dynamic Threat Deflector"],
    aiSummary: "Casts focused data beams directly to active devices for zero packet loss.",
    aiPros: ["Zero latency across 3 floors", "No antenna block design"],
    aiCons: ["Direct line of sight optimal", "Heavy base station"],
    idealUserType: "System Admin"
  },
  {
    name: "Grid Shield Node",
    description: "Physical firewall hardware running custom local AI defenses against cyber intrusions. Protects entire home subnet.",
    price: 399,
    category: "Networking",
    stock: 32,
    images: ["from-[#ff007f] to-transparent"],
    features: ["Local Intrusion Sandbox", "Active DNS Threat Block", "Tactile Threat Indicator"],
    aiSummary: "Your personal local security node that visually glows red under system attacks.",
    aiPros: ["Interactive attack monitoring", "Hardware isolation shield"],
    aiCons: ["Initial dashboard setup is complex", "Requires weekly signature updates"],
    idealUserType: "Privacy Enthusiast"
  },
  // 12. Wearables
  {
    name: "Cortex Bio-Tracker Ring",
    description: "Smart ring monitoring neural activity, stress, hydration, and cellular health. Syncs health metrics directly to Nexus OS dashboard.",
    price: 399,
    category: "Wearables",
    stock: 65,
    images: ["from-[#8a2be2] to-[#ff007f]"],
    features: ["Cortical Stress Tracker", "Cellular Hydration Monitor", "Vapor-Molded Metal Band"],
    aiSummary: "Sleek biometric tracker that feeds neural stress metrics directly to the shopping dashboard for DNA customization.",
    aiPros: ["Ultralight band", "Waterproof up to 100m"],
    aiCons: ["No display screens", "Sizes are non-adjustable"],
    idealUserType: "Bio-Hacker"
  },
  {
    name: "Spectra HUD Eye Frame",
    description: "Sleek spectacles projecting a micro HUD onto the inside of the glass lens. Integrates real-time map routes and notifications.",
    price: 690,
    category: "Wearables",
    stock: 28,
    images: ["from-[#00f0ff] to-transparent"],
    features: ["Micro Laser Projection", "Bluetooth 6 Audio Drivers", "Photochromic Lenses"],
    aiSummary: "The ultimate casual HUD glasses with smart companion translation layers built-in.",
    aiPros: ["Looks like normal specs", "Real-time navigation overlays"],
    aiCons: ["Lens tint can interfere with indoor viewing", "Flimsy arm structure"],
    idealUserType: "Technologist"
  },
  // Extra 6 Products to satisfy the 30+ products requirement:
  {
    name: "Quantum Processor Core V10",
    description: "Upgrade chip with 2000 active qubits. Connects directly to the V9 workstation via dynamic electromagnetic slot insertion.",
    price: 1899,
    category: "Workstations",
    stock: 5,
    images: ["from-[#00f0ff] to-[#8a2be2]"],
    features: ["2000 Active Qubits", "Quantum Entanglement Storage", "Electro-magnetic Interface"],
    aiSummary: "Doubles processing speed of existing neural models instantly.",
    aiPros: ["Easy slot installation", "Vastly superior compile speed"],
    aiCons: ["Requires high voltage input", "Restricted in some sectors"],
    idealUserType: "AI Architect"
  },
  {
    name: "Neuro-Mesh Gaming Suit",
    description: "Full body smart suit utilizing electronic pulse grids. Delivers full physical reaction force feedback directly to user muscles.",
    price: 1599,
    category: "Gaming",
    stock: 12,
    images: ["from-[#ff007f] to-transparent"],
    features: ["Electronic Muscle Stimulators", "Sweat-wicking Smart Fabric", "Direct Sync Core"],
    aiSummary: "The most immersive physical gaming accessory. Feel every hit and deceleration in high-speed sims.",
    aiPros: ["Absolute physical immersion", "Active muscle recovery mode"],
    aiCons: ["Requires custom calibration sessions", "Extremely snug fit"],
    idealUserType: "Pro Esports Athlete"
  },
  {
    name: "Cognitive Sync Earpiece",
    description: "Discreet ear node connecting directly to the temporal lobe using advanced acoustic resonance. Translates languages and filters ambient noise.",
    price: 450,
    category: "AI Devices",
    stock: 45,
    images: ["from-[#8a2be2] to-[#ff007f]"],
    features: ["Acoustic Temporal Coupling", "72 Language Real-Time Translation", "Smart Noise Filtering"],
    aiSummary: "A translation node that acts like a seamless expansion of your natural hearing.",
    aiPros: ["Completely invisible profile", "High fidelity spatial filters"],
    aiCons: ["Requires specific canal fitting", "Battery charging is proprietary"],
    idealUserType: "Diplomatic Envoy"
  },
  {
    name: "Holo-Slab Core Tablet",
    description: "Flexible, rollable glass panel compiling workstation performance in a tablet form factor. Completely transparent when off.",
    price: 1350,
    category: "Laptops",
    stock: 16,
    images: ["from-[#00f0ff] to-transparent"],
    features: ["Rollable Glass Screen", "Integrated Core Processor", "Dual Induction Loops"],
    aiSummary: "Rolls up like a blueprint. Unrolls to reveal a full interactive terminal.",
    aiPros: ["Highly portable", "Beautiful transparent styling"],
    aiCons: ["Vulnerable to drop damage", "Lower GPU metrics"],
    idealUserType: "Creative Architect"
  },
  {
    name: "Laser Projection Display 360",
    description: "Cylindrical projector casing that projects a complete, touch-interactive circular monitor onto any surface.",
    price: 999,
    category: "Monitors",
    stock: 20,
    images: ["from-[#ff007f] to-transparent"],
    features: ["360 Circular Projection", "LiDAR Space Touch Scanning", "2000 Lumen output"],
    aiSummary: "Projects dynamic HUD windows in all directions around you.",
    aiPros: ["Vast virtual desktop space", "Compact, travel-ready"],
    aiCons: ["Projection washed out by bright daylight", "Needs a flat surface"],
    idealUserType: "Digital Nomad"
  },
  {
    name: "Haptic VR Body Harness",
    description: "Over-shoulder active harness utilizing magnetic brakes to simulate weight and resistance in spatial environments.",
    price: 1100,
    category: "VR Tech",
    stock: 15,
    images: ["from-[#8a2be2] to-transparent"],
    features: ["Electro-magnetic Rotors", "Suspended Vest Design", "Wireless Transmitter Link"],
    aiSummary: "Simulates forces up to 50 lbs, enabling physical resistance training in spatial reality.",
    aiPros: ["Highly realistic weight loading", "Fast response times"],
    aiCons: ["Requires secondary mounting system", "Heavy base structure"],
    idealUserType: "Spatial UI Builder"
  }
];

const UNSPLASH_IMAGES: Record<string, string> = {
  "Quantum Rig V9": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
  "Cortex Core Station": "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
  "CyberMech Keyboard": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80",
  "Omni-Directional Gaming Pad": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
  "Nexus AI Hub Node": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  "Holo-Assistant Projector Capsule": "https://images.unsplash.com/photo-1601134467661-3d775b999c8b?auto=format&fit=crop&w=600&q=80",
  "AeroGlass Carbon Laptop": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
  "Neural Deck Pro": "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=600&q=80",
  "Holo-Display Pro": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
  "Horizon Stretch Panel": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
  "Neural Interface Headset": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
  "Tactile Haptic Gloves": "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80",
  "Aura LED Smart Strips": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
  "Synapse Smart Blind System": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
  "Chroma Pen Pro": "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80",
  "Synthesis Console V3": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80",
  "AeroSonic Bone Headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  "Studio Prism Sound Cube": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
  "Biometric Security Key": "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=600&q=80",
  "Quantum Battery Pack 100W": "https://images.unsplash.com/photo-1609592424109-dd77366b568e?auto=format&fit=crop&w=600&q=80",
  "Nexus Wave Beam Router": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
  "Grid Shield Node": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=600&q=80",
  "Cortex Bio-Tracker Ring": "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80",
  "Spectra HUD Eye Frame": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
  "Quantum Processor Core V10": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  "Neuro-Mesh Gaming Suit": "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80",
  "Cognitive Sync Earpiece": "https://images.unsplash.com/photo-1601134467661-3d775b999c8b?auto=format&fit=crop&w=600&q=80",
  "Holo-Slab Core Tablet": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
  "Laser Projection Display 360": "https://images.unsplash.com/photo-1601134467661-3d775b999c8b?auto=format&fit=crop&w=600&q=80",
  "Haptic VR Body Harness": "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80"
};

async function seed() {
  try {
    console.log('Seeding products via fileDb...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    // Seed new products
    const mapped = PRODUCTS.map(p => ({
      ...p,
      images: [UNSPLASH_IMAGES[p.name] || p.images[0]]
    }));

    const seeded = await Product.insertMany(mapped);
    console.log(`Successfully seeded ${seeded.length} products with Unsplash URLs.`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
