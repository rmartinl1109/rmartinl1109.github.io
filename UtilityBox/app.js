/**
 * UtilityBox Web Showcase — Interactive Engine
 * Renders live implemented modules and development roadmap with rich filtering,
 * live search, stats counters, and technical detail modals.
 */

// Dataset of UtilityBox modules
const MODULES_DATA = [
  // =========================================================================
  // IMPLEMENTED MODULES (10 Live)
  // =========================================================================
  {
    id: "network_scanner",
    title: "LAN Network Scanner",
    category: "network",
    categoryLabel: "Network",
    icon: "🌐",
    accent: "#38bdf8",
    status: "implemented",
    statusLabel: "Live • v1.0",
    subtitle: "High-speed /24 CIDR sweep and Bonjour mDNS device discovery.",
    description: "Discovers all active devices connected to the local network using a non-blocking TCP RST probing engine combined with Apple Bonjour service discovery. Resolves hostnames, identifies Apple hardware, printers, and IoT devices, with direct one-click jump to Ping diagnostics.",
    capabilities: [
      "Darwin /24 CIDR subnet sweep with 25 concurrent worker tasks",
      "Apple Bonjour (mDNS) service resolution (_http, _airplay, _smb, _printer)",
      "Non-blocking TCP socket probing (detects RST packets without raw ICMP root)",
      "Instant 1-click jump to Ping Utility with target pre-loaded"
    ],
    architecture: `Architecture: MVVM + Swift Concurrency (withTaskGroup)
Kernel APIs: Darwin getifaddrs, NetServiceBrowser, BSD non-blocking sockets
UI: NavigationSplitView, ContextMenu, Side Inspector, Live Status Cards`,
    tags: ["CIDR /24", "Bonjour mDNS", "Reverse DNS", "Device Classification", "Ping Jump"]
  },
  {
    id: "ping_utility",
    title: "Ping Diagnostic Tool",
    category: "network",
    categoryLabel: "Network",
    icon: "📈",
    accent: "#38bdf8",
    status: "implemented",
    statusLabel: "Live • v1.0",
    subtitle: "Non-root ICMP & TCP latency analysis with real-time Swift Charts.",
    description: "Professional connectivity and latency measurement utility. Sends non-privileged ICMP echo datagrams via Darwin kernel sockets and measures TCP round-trip times to specific ports. Displays continuous Swift Charts area/line graphs, packet loss percentage, and jitter calculations.",
    capabilities: [
      "ICMP Echo datagram sockets without requiring root or sudo privileges",
      "TCP SYN RTT ping mode for destinations blocking ICMP firewalls",
      "Dynamic Swift Charts visualization with floating average reference lines",
      "Jitter calculation, packet loss tracking, and exportable terminal console"
    ],
    architecture: `Architecture: @Observable PingViewModel + Darwin Datagram Sockets
Kernel APIs: socket(AF_INET, SOCK_DGRAM, IPPROTO_ICMP), getaddrinfo
UI: Apple Swift Charts (AreaMark + LineMark + RuleMark), Monospaced Terminal`,
    tags: ["ICMP (Non-Root)", "TCP RTT", "Swift Charts", "Jitter", "Packet Loss"]
  },
  {
    id: "port_checker",
    title: "Port Scanner & Auditor",
    category: "network",
    categoryLabel: "Network",
    icon: "🛡️",
    accent: "#38bdf8",
    status: "implemented",
    statusLabel: "Live • v1.0",
    subtitle: "Ultra-fast BSD socket auditor with active service banner grabbing.",
    description: "Scans TCP and UDP ports across targets using non-blocking Darwin sockets with poll() multiplexing. Capable of evaluating hundreds of ports per second while classifying them as Open, Closed, or Filtered. Grabs live service banners for SSH, HTTP, FTP, SMTP, and database engines.",
    capabilities: [
      "BSD non-blocking sockets (O_NONBLOCK + poll) with adjustable timeout",
      "Precise state detection: Open, Closed (ECONNREFUSED), Filtered (ETIMEDOUT)",
      "Active banner grabbing (SSH greeting, HTTP Server header, FTP 220, MySQL ping)",
      "Standard presets: Common Top 25, Well-Known 1-1024, Web, Databases, Dev"
    ],
    architecture: `Architecture: PortScannerService (concurrent pool of 50-100 workers)
Kernel APIs: socket(AF_INET, SOCK_STREAM, 0), fcntl, poll
UI: Filter tabs (All, Open, Closed, Filtered), Side Inspector with RFC security info`,
    tags: ["BSD Sockets", "Banner Grabbing", "Security Audit", "TCP/UDP", "Presets"]
  },
  {
    id: "dns_lookup",
    title: "DNS Lookup & Inspector",
    category: "network",
    categoryLabel: "Network",
    icon: "🔍",
    accent: "#38bdf8",
    status: "implemented",
    statusLabel: "Live • v1.0",
    subtitle: "Comprehensive DNS record queries, propagation tests & recursive trace.",
    description: "Deep DNS inspection studio. Query standard record types (A, AAAA, CNAME, MX, TXT, NS, SOA, PTR, CAA, SRV) directly against recursive resolvers or public providers (Cloudflare, Google, Quad9). Features worldwide multi-server propagation verification, DNS delegation trace, and a raw dig-style output console.",
    capabilities: [
      "Standard and advanced DNS record inspection (A, AAAA, MX, TXT, SOA, CAA)",
      "Global propagation checker against worldwide public resolvers",
      "Root-to-leaf recursive DNS trace visualizing delegation hierarchy",
      "Interactive Dig console with raw flags, response codes, TTL, and latency"
    ],
    architecture: `Architecture: DNSLookupService + Low-level DNS UDP/TCP Query Engine
APIs: Darwin res_ninit, getaddrinfo, Custom RFC 1035 packet parser
UI: Multi-tab layout (Records, Propagation, Trace, Dig Console), JSON/Text Export`,
    tags: ["DNS Records", "Global Propagation", "Recursive Trace", "Dig Console", "TTL Analysis"]
  },
  {
    id: "speed_test",
    title: "Speed Test Benchmark",
    category: "network",
    categoryLabel: "Network",
    icon: "⚡",
    accent: "#38bdf8",
    status: "implemented",
    statusLabel: "Live • v1.0",
    subtitle: "Cloudflare Edge benchmark with Bufferbloat analysis & analog gauge.",
    description: "Network benchmark powered by Cloudflare's Anycast Edge infrastructure. Measures baseline idle ping, multi-threaded download speed with adaptive chunks, upload throughput, and loaded latency bufferbloat scoring (A+ through F) with real-time experience fitness badges for 4K streaming and gaming.",
    capabilities: [
      "Multi-threaded transfer benchmark against Cloudflare Anycast edge",
      "Bufferbloat grade calculation (A+ to F) evaluating loaded latency degradation",
      "Dynamic dual-needle analog and digital speedometer with responsive scale",
      "Experience badges assessing fitness for 4K HDR, Gaming, and HD Video Calls"
    ],
    architecture: `Architecture: SpeedTestService (URLSession async multi-stream tasks)
Endpoints: speed.cloudflare.com Edge Anycast
UI: Custom Speedometer Gauge (Canvas/SwiftUI Shape), Swift Charts Live Curve, History Sheet`,
    tags: ["Cloudflare Edge", "Bufferbloat (A+ to F)", "Download/Upload", "Speedometer", "Gaming Badges"]
  },
  {
    id: "system_info",
    title: "System & Hardware Monitor",
    category: "system",
    categoryLabel: "System",
    icon: "💻",
    accent: "#a855f7",
    status: "implemented",
    statusLabel: "Live • v1.0",
    subtitle: "Mach Kernel telemetry, P/E Cores load grid & unified RAM pressure.",
    description: "Low-overhead telemetry monitor built directly on macOS Mach Kernel APIs. Breaks down Apple Silicon (M1/M2/M3/M4) and Intel architectures, providing per-core load visualization for Performance Cores and Efficiency Cores, unified RAM memory breakdown, memory pressure alerts, and top resource-heavy processes.",
    capabilities: [
      "Direct Mach Kernel polling (host_processor_info, vm_statistics64)",
      "Asymmetric CPU core topology: individual P-Cores vs E-Cores load monitoring",
      "Unified Memory breakdown (App, Wired, Compressed, Free) & pressure level",
      "Live process inspector (libproc) sorting top consumers by CPU and RAM"
    ],
    architecture: `Architecture: SystemInfoService (Periodic Mach Microkernel Polling)
Kernel APIs: host_processor_info, HOST_VM_INFO64, sysctl, proc_pidinfo
UI: SoC Hero Card, CPU Core Load Grid, Memory Gauge, Thermal State Indicator`,
    tags: ["Apple Silicon", "Mach Kernel", "P-Cores & E-Cores", "RAM Pressure", "Top Processes"]
  },
  {
    id: "disk_analyzer",
    title: "Disk Storage Analyzer & Cleaner",
    category: "system",
    categoryLabel: "System",
    icon: "💾",
    accent: "#a855f7",
    status: "implemented",
    statusLabel: "Live • v1.0",
    subtitle: "Interactive APFS Treemap, Large Files Hunter & safe cache cleaner.",
    description: "Visual storage management suite. Scans local and external volumes to render an interactive proportional Treemap categorized by file type. Features a Large Files Hunter to quickly isolate files exceeding 50MB to 1GB+, and an intelligent developer/browser cache cleaner for Xcode, SPM, Homebrew, and browsers.",
    capabilities: [
      "Interactive Treemap layout with color-coded categories (Video, Audio, Dev, Apps)",
      "Hierarchical folder browser with breadcrumb navigation and Quick Look",
      "Large Files Hunter (>50MB, >100MB, >500MB, >1GB) with Reveal in Finder & Trash",
      "Safe Developer Cache Cleaner (Xcode DerivedData, Archives, SPM, Homebrew, Browsers)"
    ],
    architecture: `Architecture: DiskScannerService (Concurrent APFS Traversal via FileManager)
APIs: Foundation FileManager, URLResourceValues, NSWorkspace File Viewer
UI: Interactive Treemap View, Storage Gauge Bar, Category Matrix, Trash Integration`,
    tags: ["APFS Treemap", "Large Files Hunter", "Xcode Cleaner", "Cache Purge", "Volume Inspector"]
  },
  {
    id: "audio_converter",
    title: "Hi-Fi Audio Converter & Studio",
    category: "multimedia",
    categoryLabel: "Multimedia",
    icon: "🎵",
    accent: "#ec4899",
    status: "implemented",
    statusLabel: "Live • v1.0",
    subtitle: "High-fidelity batch conversion, ID3v2 tag editor & waveform player.",
    description: "Studio-grade audio processing suite. Converts batch audio between M4A (AAC), Apple Lossless (ALAC), FLAC 24-bit audiophile, WAV Linear PCM, AIFF, CAF, and MP3 with full ID3v2.3 tags. Includes peak volume normalization to -1 dBFS, interactive waveform scrubbing, and instant A/B original vs converted comparison.",
    capabilities: [
      "Lossless and lossy batch conversion: M4A/AAC, ALAC, FLAC (16/24-bit), WAV, MP3",
      "ID3v2.3 / Apple Metadata editor with drag-and-drop album artwork management",
      "Peak volume normalization to -1 dBFS preventing clipping and leveling volume",
      "Integrated mini-player with interactive waveform visualizer and live A/B switch"
    ],
    architecture: `Architecture: AudioConverterService + AVFoundation + AudioToolbox (ExtAudioFile)
APIs: AVAssetWriter, AudioConverterRef, AVAudioPlayer, CoreMedia
UI: Waveform Canvas, Batch Drop Zone, Metadata Inspector Modal, A/B Toggle`,
    tags: ["FLAC 24-bit", "Apple Lossless (ALAC)", "MP3 ID3v2.3", "Peak Normalization", "A/B Player"]
  },
  {
    id: "unit_converter",
    title: "Interactive Unit Converter",
    category: "converters",
    categoryLabel: "Converters",
    icon: "📏",
    accent: "#10b981",
    status: "implemented",
    statusLabel: "Live • v1.0",
    subtitle: "Real-time dual-slider conversions for digital data, network & UI design.",
    description: "Universal live unit converter tailored for engineers, developers, and designers. Distinguishes strictly between IEC Binary (KiB, MiB, GiB) and SI Decimal (KB, MB, GB) units, bridges UI design densities (points, @1x, @2x, @3x Retina, rem), and provides live download time estimations with JSON/Markdown export.",
    capabilities: [
      "Digital Storage: IEC Binary base-1024 (GiB/TiB) vs SI Decimal base-1000 (GB/TB)",
      "UI Design & Display: Apple points (pt), Retina @2x/@3x, CSS rem, physical inches",
      "Network throughput conversions with dynamic file download time calculator",
      "1-click copy (plain, formatted, or Swift constant) and JSON/Markdown export"
    ],
    architecture: `Architecture: UnitCatalog mathematical matrix + @Observable UnitConverterViewModel
APIs: Foundation Measurement API, NSPasteboard
UI: Bidirectional Sliders + Numeric TextFields, Live Conversion Matrix, Preset Chips`,
    tags: ["Binary vs Decimal", "Retina @2x/@3x", "Transfer Speed", "Download Estimator", "Swift Code Export"]
  },
  {
    id: "qr_generator",
    title: "QR Code Studio & Vision Scanner",
    category: "converters",
    categoryLabel: "Converters",
    icon: "📱",
    accent: "#10b981",
    status: "implemented",
    statusLabel: "Live • v1.0",
    subtitle: "Custom vector styling with Apple Vision local barcode decoding.",
    description: "Vector QR generator and AI-powered decoder. Create stylized QR codes for Wi-Fi credentials, vCard contact cards, URLs, SMS, and geolocation coordinates with customizable module shapes (rounded, dots), color palettes, and SF Symbol center logos. Includes Apple Vision offline scanner with drag-and-drop.",
    capabilities: [
      "Standard payloads: Wi-Fi (WPA2/WPA3), vCard 3.0, URL, Email, SMS, Geo GPS",
      "Visual customization: Module shapes (Square, Rounded, Dots), color palettes, alpha transparency",
      "SF Symbols center logo integration with automated error correction compensation (Reed-Solomon H 30%)",
      "Apple Vision (VNDetectBarcodesRequest) offline barcode recognition via drag & drop"
    ],
    architecture: `Architecture: CoreImage CIQRCodeGenerator + Apple Vision Framework
APIs: CIFilter, VNDetectBarcodesRequest, CGContext vector SVG renderer
UI: Live interactive Preview, Drag-and-Drop Drop Zone, High-Res PNG & SVG Exporter`,
    tags: ["Wi-Fi QR", "vCard 3.0", "Apple Vision", "Vector SVG", "SF Symbols Logos"]
  },

  // =========================================================================
  // ROADMAP MODULES (15 Planned)
  // =========================================================================
  {
    id: "local_web_server",
    title: "Instant Local Web Server",
    category: "network",
    categoryLabel: "Network",
    icon: "🖥️",
    accent: "#38bdf8",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "One-click static HTTP file server with QR code mobile pairing.",
    description: "Spin up a lightweight HTTP file server in any local directory with zero firewall configuration. Automatically generates a QR code to quickly open or download assets on iPhones, iPads, and other LAN devices without cloud intermediaries.",
    capabilities: [
      "Instant static file server bound to local LAN interfaces (en0/Wi-Fi)",
      "Automatic QR Code generation for one-tap iPhone/iPad mobile access",
      "Direct drag-and-drop folder sharing without complex web server config",
      "Zero firewall adjustments required; clean App Sandbox network.server entitlement"
    ],
    architecture: `Planned: Network.framework NWListener HTTP/1.1 microserver
Security: Restricted to designated sandbox directory permissions`,
    tags: ["HTTP Server", "LAN Sharing", "QR Pairing", "Network.framework", "Mobile Sync"]
  },
  {
    id: "battery_health",
    title: "Battery Health & Telemetry",
    category: "system",
    categoryLabel: "System",
    icon: "🔋",
    accent: "#a855f7",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "Real mAh capacity, cycle count, charge wattage & thermal drain history.",
    description: "Deep battery telemetry for MacBook hardware. Reads low-level power management data via IOKit to calculate true real-world health (current mAh vs factory design capacity), battery cycle counts, live charging/discharging wattage, and thermal drain curves.",
    capabilities: [
      "Actual maximum battery capacity (mAh) compared to factory specification",
      "Detailed cycle count tracking and wear level health percentage",
      "Live power consumption in Watts (W) and charging rate telemetry",
      "Historical drain graph and temperature monitoring"
    ],
    architecture: `Planned: IOKit IOPowerSources / AppleSmartBattery subsystem
APIs: IOPSCopyPowerSourcesInfo, Mach power events`,
    tags: ["Battery Health", "Cycle Count", "Charge Wattage", "IOKit Telemetry", "MacBook Diagnostics"]
  },
  {
    id: "app_uninstaller",
    title: "Clean App Uninstaller",
    category: "system",
    categoryLabel: "System",
    icon: "🗑️",
    accent: "#a855f7",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "Deep filesystem scan for orphaned Application Support, Caches & Plists.",
    description: "彻底 removes macOS applications and their residual files scattered across ~/Library. Searches Application Support, Caches, Preferences (.plist), Logs, Saved Application State, and Containers to ensure 100% clean uninstallation.",
    capabilities: [
      "Automatic bundle identifier discovery for selected .app bundles",
      "Deep scan of ~/Library/Application Support, ~/Library/Caches, and Preferences",
      "Identification of orphaned background daemons and login items",
      "Safe multi-item removal to Trash with permission checkpoints"
    ],
    architecture: `Planned: FileManager directory traverser + AppKit bundle inspector
Security: Explicit user permission checkpoints via NSOpenPanel / Trash API`,
    tags: ["App Cleaner", "~/Library Purge", "Orphaned Plists", "Application Support", "Deep Uninstall"]
  },
  {
    id: "image_compressor",
    title: "Image Compressor & Optimizer",
    category: "multimedia",
    categoryLabel: "Multimedia",
    icon: "🗜️",
    accent: "#ec4899",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "Multithreaded WebP and AVIF compression with interactive before/after slider.",
    description: "High-performance image optimization studio. Compresses PNG, JPEG, WebP, and AVIF files using concurrent task pools without perceptible quality loss. Features an interactive before/after split slider to inspect compression artifacts in real time.",
    capabilities: [
      "Modern format support: WebP and AVIF next-gen encoding",
      "Multi-core batch compression preserving ICC color profiles",
      "Quality presets (Lossless, High 90%, Balanced 80%, Maximum Compact)",
      "Interactive visual A/B split comparison slider"
    ],
    architecture: `Planned: ImageIO + CoreGraphics concurrent processing pipeline
APIs: CGImageSource, CGImageDestination, libwebp / libavif integration`,
    tags: ["WebP", "AVIF", "Lossless Compression", "A/B Slider", "Batch Processing"]
  },
  {
    id: "image_format_converter",
    title: "Image Format Converter",
    category: "multimedia",
    categoryLabel: "Multimedia",
    icon: "🖼️",
    accent: "#ec4899",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "Universal batch conversion for Apple HEIC, WebP, AVIF, TIFF & Camera RAW.",
    description: "Versatile image converter supporting virtually every visual asset format: Apple HEIC/HEIF, WebP, AVIF, PNG, JPEG, TIFF, BMP, ICO, and professional Camera RAW photos (Canon CR2/CR3, Nikon NEF, Sony ARW, Adobe DNG) with Display P3 wide color gamut preservation.",
    capabilities: [
      "Universal formats: HEIC, WebP, AVIF, PNG, JPG, TIFF, BMP, ICO",
      "Professional Camera RAW decoding (CR2, NEF, ARW, DNG, RAF)",
      "Color space management: Display P3, Adobe RGB, and sRGB transforms",
      "Folder drag-and-drop batch queue with recursive processing"
    ],
    architecture: `Planned: CoreImage + ImageIO RAW camera processing engine
APIs: CIRAWFilter, CGColorSpaceCreateWithName`,
    tags: ["HEIC to PNG", "Camera RAW", "Display P3", "Batch Converter", "WebP/AVIF"]
  },
  {
    id: "image_resizer",
    title: "Batch Image Resizer",
    category: "multimedia",
    categoryLabel: "Multimedia",
    icon: "📐",
    accent: "#ec4899",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "High-precision aspect ratio scaling and social media presets.",
    description: "Resize hundreds of images simultaneously with Lanczos interpolation. Features aspect ratio locking, target dimension presets for social platforms (Instagram, Twitter/X, YouTube thumbnails), and percentage-based scale adjustments.",
    capabilities: [
      "High-fidelity Lanczos resampling avoiding blur and aliasing",
      "Standard social media dimension presets and custom aspect ratios",
      "Percentage scaling (50%, 75%, 200%) and fit/fill cropping modes",
      "Smart metadata preservation (EXIF, creation date, color space)"
    ],
    architecture: `Planned: CoreGraphics bitmap context rendering + Swift Concurrency
APIs: CGBitmapContextCreate, CGContextSetInterpolationQuality`,
    tags: ["Lanczos Resizing", "Social Media Presets", "Batch Scale", "Aspect Ratio Lock"]
  },
  {
    id: "exif_cleaner",
    title: "EXIF & Geolocation Privacy Cleaner",
    category: "multimedia",
    categoryLabel: "Multimedia",
    icon: "📍",
    accent: "#ec4899",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "One-click stripping of GPS coordinates, camera serials & sensitive metadata.",
    description: "Protects personal privacy before sharing photos online. Strips precise GPS latitude/longitude coordinates, camera and lens serial numbers, capture timestamps, and author IPTC metadata without altering image pixel quality.",
    capabilities: [
      "Complete removal of GPS location data from JPEG, HEIC, PNG, and TIFF",
      "Scrubbing of camera make, model, lens serials, and exposure parameters",
      "IPTC and XMP metadata cleaner with preview before removal",
      "Non-destructive export preserving original files in safety"
    ],
    architecture: `Planned: ImageIO metadata dictionary stripping
APIs: CGImageSourceCopyPropertiesAtIndex, CGImageDestinationAddImageFromSource`,
    tags: ["EXIF Stripper", "GPS Privacy", "IPTC Cleaner", "Lossless Metadata Scrub"]
  },
  {
    id: "app_icon_generator",
    title: "App Icon Generator",
    category: "multimedia",
    categoryLabel: "Multimedia",
    icon: "🎨",
    accent: "#ec4899",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "Complete AppIcon.appiconset for macOS, iOS, iPadOS & watchOS in ZIP.",
    description: "Drop a single 1024x1024 artwork to generate the complete production-ready AppIcon asset catalog. Generates all native dimensions for macOS (16px to 1024px, squircle masks), iOS, iPadOS, and watchOS, packaged with a valid Contents.json file.",
    capabilities: [
      "Full AppIcon.appiconset structure with exact Apple naming conventions",
      "Coverage for macOS Sonoma/Sequoia, iOS 18+, iPadOS, and watchOS",
      "Automatic generation of .icns file for standalone macOS apps",
      "1-click ZIP export ready to drag directly into Xcode asset catalogs"
    ],
    architecture: `Planned: CoreGraphics multi-resolution renderer + ZipArchive writer
Outputs: AppIcon.appiconset (Contents.json) + icon.icns`,
    tags: ["AppIcon.appiconset", "Xcode Ready", "macOS ICNS", "iOS 18 Icons", "Asset Generator"]
  },
  {
    id: "vector_svg_viewer",
    title: "Vector SVG Studio & SwiftUI Exporter",
    category: "multimedia",
    categoryLabel: "Multimedia",
    icon: "✒️",
    accent: "#ec4899",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "SVG previewer, SVGO optimization & native SwiftUI Path code generator.",
    description: "Dedicated SVG workbench for Apple developers. Render SVG files at any resolution, clean redundant XML tags with integrated SVGO optimization, and convert vector outlines into native SwiftUI Path or Shape Swift code for immediate use in Xcode.",
    capabilities: [
      "High-DPI vector SVG rendering with zoom and pan canvas",
      "SVGO optimizer removing unnecessary XML tags, attributes, and comments",
      "Instant conversion of SVG paths into native SwiftUI Path / Shape code",
      "Export to vector PDF and high-resolution rasterized PNG"
    ],
    architecture: `Planned: WebKit / Custom SVG XML parser + Swift code generator
Outputs: SwiftUI Path struct, clean SVG, vector PDF`,
    tags: ["SVG to SwiftUI", "Path Generator", "SVGO Optimizer", "Vector Studio", "Retina Preview"]
  },
  {
    id: "video_compressor",
    title: "Hardware Video Compressor",
    category: "multimedia",
    categoryLabel: "Multimedia",
    icon: "🎬",
    accent: "#ec4899",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "VideoToolbox hardware acceleration with HEVC/H.265, H.264 & ProRes.",
    description: "Shrink massive video files rapidly using Apple Silicon's dedicated media hardware engines. Supports HEVC/H.265, H.264, and ProRes compression with custom bitrate control, resolution scaling, and real-time output file size estimation.",
    capabilities: [
      "Apple VideoToolbox hardware-accelerated video encoding",
      "HEVC/H.265, H.264, AV1, and ProRes 422 codec support",
      "Target file size estimator with visual quality sliders",
      "Audio passthrough to preserve original multi-channel sound"
    ],
    architecture: `Planned: AVFoundation AVAssetExportSession + VideoToolbox hardware pipeline
Codecs: kVTVideoCodecType_HEVC, kVTVideoCodecType_H264`,
    tags: ["VideoToolbox", "HEVC / H.265", "Hardware Acceleration", "Size Estimator"]
  },
  {
    id: "video_to_gif",
    title: "Video to GIF Converter",
    category: "multimedia",
    categoryLabel: "Multimedia",
    icon: "🎞️",
    accent: "#ec4899",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "Optimized color quantization, customizable FPS & infinite loops.",
    description: "Convert video clips into lightweight, smooth animated GIFs. Utilizes advanced color palette quantization algorithms to prevent banding, offers granular FPS adjustment (15, 24, 30 fps), and supports precise timeline trimming with automatic looping.",
    capabilities: [
      "Octree / Median-cut color quantization producing crisp 256-color palettes",
      "Adjustable frame rate (15, 24, 30 fps) to balance file size and smoothness",
      "Timeline video trimmer with start/end scrubbing handles",
      "Automatic loop count and dither filter controls"
    ],
    architecture: `Planned: AVAssetImageGenerator + ImageIO CGImageDestination GIF frame writer
APIs: kCGImagePropertyGIFDictionary, kCGImagePropertyGIFLoopCount`,
    tags: ["Animated GIF", "Color Quantization", "Video Trimmer", "FPS Control"]
  },
  {
    id: "audio_extractor",
    title: "Lossless Audio Extractor",
    category: "multimedia",
    categoryLabel: "Multimedia",
    icon: "🎙️",
    accent: "#ec4899",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "Direct stream demuxing from video containers to MP3, AAC or FLAC.",
    description: "Extract soundtrack and audio commentary from MP4, MOV, and MKV video files. Features lossless direct stream demuxing that saves the native audio track in milliseconds without re-encoding, or converts directly to MP3 or FLAC.",
    capabilities: [
      "Lossless stream demuxing (extracts existing AAC/PCM stream without re-encoding)",
      "Transcoding option to high-bitrate MP3 (320kbps) or audiophile FLAC",
      "Batch drop zone supporting dozens of video files simultaneously",
      "Preservation of video chapter markers and audio language metadata"
    ],
    architecture: `Planned: AVAssetReaderTrackOutput + AVAssetWriter audio extraction pipeline
APIs: AVAssetReader, AVAssetWriterInput`,
    tags: ["Audio Demuxer", "Video to MP3", "Lossless Extraction", "Batch Workflow"]
  },
  {
    id: "voice_recorder",
    title: "Voice Recorder & Audio Memo",
    category: "multimedia",
    categoryLabel: "Multimedia",
    icon: "🎙️",
    accent: "#ec4899",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "Live microphone waveform visualizer, uncompressed WAV & timeline bookmarks.",
    description: "Clean voice recording studio. Captures audio directly from connected USB or internal Mac microphones with real-time waveform level monitoring. Supports uncompressed Linear PCM WAV or high-efficiency M4A with timeline bookmark markers.",
    capabilities: [
      "Real-time visual acoustic waveform level monitor during recording",
      "Pause, resume, and timeline bookmark markers for long lectures or meetings",
      "Format choice: Uncompressed broadcast WAV (24-bit) or compact AAC M4A",
      "Direct drop into Audio Converter for post-processing and peak normalization"
    ],
    architecture: `Planned: AVAudioEngine + AVAudioRecorder input tap
APIs: installTap(onBus:bufferSize:format:block:) for live sample metering`,
    tags: ["Waveform Monitor", "AVAudioEngine", "Microphone Studio", "Bookmarks", "M4A / WAV"]
  },
  {
    id: "base64_encoder",
    title: "Base64 Studio (Text & Binaries)",
    category: "converters",
    categoryLabel: "Converters",
    icon: "🔤",
    accent: "#10b981",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "Instant encoding/decoding for text, binaries & HTML/CSS Data URIs.",
    description: "Fast Base64 workbench for web developers and engineers. Encode and decode plain strings, JSON payloads, or drop binary files (images, fonts, PDFs) to automatically produce production-ready CSS/HTML Data URIs with 1-click clipboard copy.",
    capabilities: [
      "Bidirectional conversion: String/Binary ⇄ Base64 string",
      "Data URI generator for Web & CSS (data:image/png;base64,...)",
      "File drop zone supporting large binary files with memory-efficient chunks",
      "Hexadecimal inspector and byte length counter"
    ],
    architecture: `Planned: Foundation Data base64EncodedStringWithOptions + streaming encoder
APIs: Data.base64EncodedData, NSPasteboard`,
    tags: ["Base64 Encode", "Data URI", "CSS Embedding", "Binary to Text", "Web Developer Tool"]
  },
  {
    id: "hash_calculator",
    title: "Cryptographic Hash & Checksum",
    category: "converters",
    categoryLabel: "Converters",
    icon: "🔒",
    accent: "#10b981",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "Apple CryptoKit MD5, SHA-1, SHA-256 with file checksum comparison.",
    description: "High-speed cryptographic hash calculator accelerated by Apple CryptoKit. Compute MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously for text or multi-gigabyte ISO/DMG files, with an instant visual checksum comparison matcher.",
    capabilities: [
      "Simultaneous calculation: MD5, SHA-1, SHA-256, SHA-384, SHA-512",
      "Apple CryptoKit hardware acceleration for rapid multi-gigabyte file reads",
      "Visual checksum comparison: paste an expected hash to receive a green match indicator",
      "HMAC key support and batch file verification"
    ],
    architecture: `Planned: Apple CryptoKit + DispatchIO streaming file hashing
APIs: SHA256.hash(data:), Insecure.MD5.hash(data:)`,
    tags: ["CryptoKit", "SHA-256", "MD5", "File Integrity", "Checksum Matcher"]
  },
  {
    id: "color_converter",
    title: "Color Palette & SwiftUI Studio",
    category: "converters",
    categoryLabel: "Converters",
    icon: "🎨",
    accent: "#10b981",
    status: "roadmap",
    statusLabel: "Roadmap • Planned",
    subtitle: "HEX, RGB, HSL, CMYK conversions with SwiftUI Color snippet export.",
    description: "Color workstation for Apple platform designers. Interconvert colors between HEX (#RRGGBB, #AARRGGBB), RGB (0-255 or 0.0-1.0), HSL, and CMYK. Generates copy-paste SwiftUI `Color(red:green:blue:)` and NSColor code, with a WCAG 2.1 contrast ratio checker.",
    capabilities: [
      "Bidirectional conversion: HEX, RGB, HSL, HSV, CMYK",
      "Instant code snippet generation: SwiftUI Color, NSColor, UIColor, CSS var",
      "WCAG 2.1 accessibility contrast analyzer (AA and AAA rating badges)",
      "Screen color eyedropper tool with magnification loupe"
    ],
    architecture: `Planned: AppKit NSColorSpace + SwiftUI Color generator
APIs: NSColorSampler, NSColor(colorSpace:components:count:)`,
    tags: ["SwiftUI Color", "HEX to RGB", "WCAG Contrast", "Eyedropper", "Design Tool"]
  }
];

// App Controller State
const state = {
  activeCategory: "all",
  activeStatus: "all",
  searchQuery: "",
  selectedModule: null
};

// DOM Elements
const elements = {
  implementedGrid: document.getElementById("implemented-grid"),
  roadmapGrid: document.getElementById("roadmap-grid"),
  categoryTabs: document.getElementById("category-tabs"),
  statusToggles: document.querySelectorAll(".status-toggle-btn"),
  searchInput: document.getElementById("tool-search-input"),
  searchClearBtn: document.getElementById("search-clear-btn"),
  detailModal: document.getElementById("detail-modal"),
  modalCloseBtn: document.getElementById("modal-close-btn"),
  modalDismissBtn: document.getElementById("modal-btn-dismiss"),
  // Modal Fields
  modalIcon: document.getElementById("modal-icon"),
  modalIconWrap: document.getElementById("modal-icon-wrap"),
  modalTitle: document.getElementById("modal-title"),
  modalSubtitle: document.getElementById("modal-subtitle"),
  modalStatusBadge: document.getElementById("modal-status-badge"),
  modalCategoryBadge: document.getElementById("modal-category-badge"),
  modalDescription: document.getElementById("modal-description"),
  modalCapabilities: document.getElementById("modal-capabilities"),
  modalArchitecture: document.getElementById("modal-architecture"),
  // Counters
  statCountImplemented: document.getElementById("stat-count-implemented"),
  statCountPlanned: document.getElementById("stat-count-planned")
};

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  setupEventListeners();
  updateCounters();
});

function updateCounters() {
  const implementedCount = MODULES_DATA.filter(m => m.status === "implemented").length;
  const roadmapCount = MODULES_DATA.filter(m => m.status === "roadmap").length;
  
  if (elements.statCountImplemented) elements.statCountImplemented.textContent = implementedCount;
  if (elements.statCountPlanned) elements.statCountPlanned.textContent = roadmapCount;
}

// Render Engine
function renderAll() {
  renderImplementedModules();
  renderRoadmapModules();
}

function filterModules(statusFilter) {
  return MODULES_DATA.filter(m => {
    // Status check
    if (statusFilter && m.status !== statusFilter) return false;
    
    // User status toggle
    if (state.activeStatus !== "all" && m.status !== state.activeStatus) return false;

    // Category filter
    if (state.activeCategory !== "all" && m.category !== state.activeCategory) return false;

    // Search query
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchSubtitle = m.subtitle.toLowerCase().includes(q);
      const matchDesc = m.description.toLowerCase().includes(q);
      const matchTags = m.tags.some(t => t.toLowerCase().includes(q));
      const matchCaps = m.capabilities.some(c => c.toLowerCase().includes(q));
      return matchTitle || matchSubtitle || matchDesc || matchTags || matchCaps;
    }

    return true;
  });
}

function renderImplementedModules() {
  const container = elements.implementedGrid;
  if (!container) return;

  // If user selected only "roadmap", hide section or show empty
  if (state.activeStatus === "roadmap") {
    container.innerHTML = createEmptyState("Implemented Modules Hidden", "The status filter is currently set to show Roadmap only.");
    return;
  }

  const modules = filterModules("implemented");

  if (modules.length === 0) {
    container.innerHTML = createEmptyState("No Implemented Modules Found", "Try adjusting your search query or category filter.");
    return;
  }

  container.innerHTML = modules.map(m => createModuleCardHTML(m)).join("");
}

function renderRoadmapModules() {
  const container = elements.roadmapGrid;
  if (!container) return;

  // If user selected only "implemented", hide section or show empty
  if (state.activeStatus === "implemented") {
    container.innerHTML = createEmptyState("Roadmap Modules Hidden", "The status filter is currently set to show Implemented only.");
    return;
  }

  const modules = filterModules("roadmap");

  if (modules.length === 0) {
    container.innerHTML = createEmptyState("No Roadmap Modules Found", "Try adjusting your search query or category filter.");
    return;
  }

  container.innerHTML = modules.map(m => createModuleCardHTML(m)).join("");
}

function createModuleCardHTML(m) {
  const isLive = m.status === "implemented";
  const statusClass = isLive ? "live" : "planned";
  const accentColor = m.accent || "#3b82f6";

  const capsHTML = m.tags.slice(0, 4).map(tag => `<span class="cap-pill">${escapeHTML(tag)}</span>`).join("");

  return `
    <article class="module-card" data-id="${m.id}" style="--card-accent: ${accentColor};" onclick="openModuleDetail('${m.id}')" tabindex="0" role="button" aria-label="View details for ${escapeHTML(m.title)}">
      <div class="card-top">
        <div class="card-icon-box" style="--icon-glow: ${accentColor}33; --icon-border: ${accentColor}55;">
          ${m.icon}
        </div>
        <div class="card-badges">
          <span class="category-tag">${escapeHTML(m.categoryLabel)}</span>
          <span class="status-tag ${statusClass}">
            <span class="badge-dot"></span>
            ${escapeHTML(m.statusLabel)}
          </span>
        </div>
      </div>

      <h3 class="card-title">${escapeHTML(m.title)}</h3>
      <p class="card-subtitle">${escapeHTML(m.subtitle)}</p>

      <div class="card-caps">
        ${capsHTML}
      </div>

      <div class="card-footer">
        <span class="tech-spec-label">${isLive ? "100% Native Swift 6" : "Scheduled Release"}</span>
        <span class="card-action-link">
          Inspect Architecture →
        </span>
      </div>
    </article>
  `;
}

function createEmptyState(title, desc) {
  return `
    <div class="empty-state">
      <div class="empty-icon">🔎</div>
      <h4 class="empty-title">${escapeHTML(title)}</h4>
      <p class="empty-desc">${escapeHTML(desc)}</p>
    </div>
  `;
}

// Event Listeners
function setupEventListeners() {
  // Category tabs
  if (elements.categoryTabs) {
    elements.categoryTabs.addEventListener("click", e => {
      const button = e.target.closest(".cat-tab");
      if (!button) return;

      document.querySelectorAll(".cat-tab").forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      state.activeCategory = button.getAttribute("data-category") || "all";
      renderAll();
    });
  }

  // Status toggle
  elements.statusToggles.forEach(btn => {
    btn.addEventListener("click", () => {
      elements.statusToggles.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      state.activeStatus = btn.getAttribute("data-status") || "all";
      renderAll();
    });
  });

  // Search input
  if (elements.searchInput) {
    elements.searchInput.addEventListener("input", e => {
      state.searchQuery = e.target.value.trim();
      if (elements.searchClearBtn) {
        elements.searchClearBtn.classList.toggle("hidden", state.searchQuery.length === 0);
      }
      renderAll();
    });
  }

  // Search clear
  if (elements.searchClearBtn) {
    elements.searchClearBtn.addEventListener("click", () => {
      elements.searchInput.value = "";
      state.searchQuery = "";
      elements.searchClearBtn.classList.add("hidden");
      elements.searchInput.focus();
      renderAll();
    });
  }

  // Modal close handlers
  if (elements.modalCloseBtn) {
    elements.modalCloseBtn.addEventListener("click", closeModuleDetail);
  }
  if (elements.modalDismissBtn) {
    elements.modalDismissBtn.addEventListener("click", closeModuleDetail);
  }
  if (elements.detailModal) {
    elements.detailModal.addEventListener("click", e => {
      if (e.target === elements.detailModal) {
        closeModuleDetail();
      }
    });
  }

  // Keyboard accessibility
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && elements.detailModal.classList.contains("open")) {
      closeModuleDetail();
    }
  });

  // Header active navigation highlight on scroll
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    let currentId = "";
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      if (window.scrollY >= secTop) {
        currentId = sec.getAttribute("id");
      }
    });

    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  });
}

// Modal Handlers
window.openModuleDetail = function(moduleId) {
  const item = MODULES_DATA.find(m => m.id === moduleId);
  if (!item) return;

  state.selectedModule = item;

  elements.modalIcon.textContent = item.icon;
  elements.modalTitle.textContent = item.title;
  elements.modalSubtitle.textContent = item.subtitle;

  const isLive = item.status === "implemented";
  elements.modalStatusBadge.textContent = isLive ? "Live • v1.0" : "Roadmap • Planned";
  elements.modalStatusBadge.className = `badge ${isLive ? "badge-success" : "badge-warning"}`;

  elements.modalCategoryBadge.textContent = item.categoryLabel;
  elements.modalDescription.textContent = item.description;

  elements.modalCapabilities.innerHTML = item.capabilities.map(cap => `<li>${escapeHTML(cap)}</li>`).join("");
  elements.modalArchitecture.textContent = item.architecture;

  elements.detailModal.classList.add("open");
  elements.detailModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

function closeModuleDetail() {
  elements.detailModal.classList.remove("open");
  elements.detailModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Utility: HTML Sanitizer
function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
