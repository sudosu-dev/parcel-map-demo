import React, { useState, useEffect, useRef } from "react";

const ParcelMapDemo = () => {
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Mock parcel data - Oklahoma oil/gas region (SCOOP/STACK plays)
  const mockParcels = [
    {
      id: "OK-2024-001",
      coordinates: [
        [35.2835, -97.52],
        [35.2845, -97.52],
        [35.2845, -97.518],
        [35.2835, -97.518],
      ],
      address: "Section 14, T8N R4W, McClain County, OK",
      owner: "Thunder Basin Energy LLC",
      value: "$485,000",
      size: "160 acres",
      zoning: "Agricultural/Energy",
      yearAcquired: 2019,
      propertyType: "Mineral Rights",
      oilGasInfo: {
        play: "SCOOP (South Central Oklahoma Oil Province)",
        formations: "Woodford Shale, Springer Formation",
        wellCount: 3,
        royaltyRate: "18.75%",
        leaseStatus: "Active",
      },
    },
    {
      id: "OK-2024-002",
      coordinates: [
        [35.282, -97.513],
        [35.283, -97.513],
        [35.283, -97.511],
        [35.282, -97.511],
      ],
      address: "Section 23, T8N R4W, McClain County, OK",
      owner: "Sooner Minerals Trust",
      value: "$625,000",
      size: "320 acres",
      zoning: "Agricultural/Energy",
      yearAcquired: 2021,
      propertyType: "Surface + Mineral Rights",
      oilGasInfo: {
        play: "SCOOP (South Central Oklahoma Oil Province)",
        formations: "Woodford Shale, Hunton Limestone",
        wellCount: 5,
        royaltyRate: "20.0%",
        leaseStatus: "Active - Primary Term",
      },
    },
    {
      id: "OK-2024-003",
      coordinates: [
        [35.28, -97.525],
        [35.281, -97.525],
        [35.281, -97.523],
        [35.28, -97.523],
      ],
      address: "Section 2, T8N R4W, McClain County, OK",
      owner: "Red Rock Resources Inc",
      value: "$750,000",
      size: "480 acres",
      zoning: "Agricultural/Energy",
      yearAcquired: 2020,
      propertyType: "Fee Simple w/ Minerals",
      oilGasInfo: {
        play: "SCOOP/STACK Border",
        formations: "Woodford, Meramec, Osage",
        wellCount: 7,
        royaltyRate: "22.5%",
        leaseStatus: "Held By Production",
      },
    },
    {
      id: "OK-2024-004",
      coordinates: [
        [35.278, -97.517],
        [35.279, -97.517],
        [35.279, -97.515],
        [35.278, -97.515],
      ],
      address: "Section 35, T9N R4W, McClain County, OK",
      owner: "Prairie Wind Holdings LLC",
      value: "$395,000",
      size: "240 acres",
      zoning: "Agricultural/Energy",
      yearAcquired: 2022,
      propertyType: "Mineral Rights Only",
      oilGasInfo: {
        play: "SCOOP (South Central Oklahoma Oil Province)",
        formations: "Woodford Shale, Springer",
        wellCount: 2,
        royaltyRate: "16.25%",
        leaseStatus: "Active - Drilling Pending",
      },
    },
  ];

  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Load CSS
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
      document.head.appendChild(cssLink);

      // Add additional CSS to ensure map displays
      const mapStyle = document.createElement("style");
      mapStyle.textContent = `
        .leaflet-container {
          height: 100% !important;
          width: 100% !important;
        }
        .leaflet-map-pane {
          z-index: 1;
        }
      `;
      document.head.appendChild(mapStyle);

      // Load JS
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
      script.onload = () => {
        setMapLoaded(true);
      };
      document.head.appendChild(script);
    };

    loadLeaflet();

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !window.L || mapInstanceRef.current) return;

    // Initialize map
    const L = window.L;
    const mapInstance = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([35.282, -97.517], 15);

    // Try multiple tile layer sources for better reliability
    const tileLayer = L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
        crossOrigin: true,
      }
    );

    tileLayer.addTo(mapInstance);

    // Add a backup tile layer if the first one fails
    tileLayer.on("tileerror", () => {
      console.log("Primary tiles failed, trying backup...");
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap contributors © CARTO",
          maxZoom: 19,
        }
      ).addTo(mapInstance);
    });

    mapInstanceRef.current = mapInstance;

    // Force map to refresh and recalculate size
    setTimeout(() => {
      mapInstance.invalidateSize();
      console.log("Map size invalidated and refreshed");
    }, 100);

    // Add parcels to map with more visible styling
    console.log("Adding parcels to map...");
    mockParcels.forEach((parcel, index) => {
      console.log(`Adding parcel ${index + 1}:`, parcel.id);
      const polygon = L.polygon(parcel.coordinates, {
        color: "#2563eb",
        fillColor: "#3b82f6",
        fillOpacity: 0.5,
        weight: 3,
        opacity: 1,
      }).addTo(mapInstance);

      // Add a popup for debugging
      polygon.bindPopup(`Parcel ${parcel.id}<br>${parcel.address}`);

      polygon.on("click", (e) => {
        console.log("Parcel clicked:", parcel.id);
        setSelectedParcel(parcel);
        if (isMobile) {
          setShowMobileDetails(true);
        }
        // Highlight selected parcel
        polygon.setStyle({
          color: "#dc2626",
          fillColor: "#ef4444",
          fillOpacity: 0.7,
          weight: 4,
        });

        // Reset other parcels
        mapInstance.eachLayer((layer) => {
          if (layer !== polygon && layer.setStyle && layer !== tileLayer) {
            layer.setStyle({
              color: "#2563eb",
              fillColor: "#3b82f6",
              fillOpacity: 0.5,
              weight: 3,
            });
          }
        });
      });

      // Add hover effects
      polygon.on("mouseover", () => {
        if (!selectedParcel || selectedParcel.id !== parcel.id) {
          polygon.setStyle({
            fillOpacity: 0.5,
            weight: 3,
          });
        }
      });

      polygon.on("mouseout", () => {
        if (!selectedParcel || selectedParcel.id !== parcel.id) {
          polygon.setStyle({
            fillOpacity: 0.3,
            weight: 2,
          });
        }
      });
    });
  }, [mapLoaded, selectedParcel]);

  const [isMobile, setIsMobile] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const styles = {
    container: {
      width: "100%",
      height: "100vh",
      backgroundColor: "#f9fafb",
      position: "relative",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: "white",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      padding: isMobile ? "12px" : "16px",
    },
    title: {
      fontSize: isMobile ? "18px" : "24px",
      fontWeight: "bold",
      color: "#1f2937",
      margin: 0,
    },
    subtitle: {
      color: "#6b7280",
      margin: "4px 0 0 0",
      fontSize: isMobile ? "14px" : "16px",
    },
    mainContent: {
      paddingTop: isMobile ? "60px" : "80px",
      height: "100%",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
    },
    mapContainer: {
      flex: 1,
      position: "relative",
      height: isMobile
        ? selectedParcel && showMobileDetails
          ? "40vh"
          : "60vh"
        : "100%",
    },
    map: {
      width: "100%",
      height: "100%",
      minHeight: isMobile ? "300px" : "500px",
      backgroundColor: "#f0f0f0",
      border: "2px solid #ddd",
    },
    legend: {
      position: "absolute",
      bottom: "16px",
      left: "16px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      padding: isMobile ? "8px" : "12px",
      fontSize: isMobile ? "12px" : "14px",
    },
    legendItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: isMobile ? "10px" : "12px",
      marginTop: "4px",
    },
    legendColor: {
      width: isMobile ? "12px" : "16px",
      height: isMobile ? "12px" : "16px",
      borderRadius: "2px",
      border: "2px solid",
    },
    sidebar: {
      width: isMobile ? "100%" : "320px",
      height: isMobile
        ? selectedParcel && showMobileDetails
          ? "60vh"
          : "auto"
        : "100%",
      backgroundColor: "white",
      boxShadow: isMobile
        ? "0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
        : "-4px 0 6px -1px rgba(0, 0, 0, 0.1)",
      overflowY: "auto",
      position: isMobile ? "fixed" : "relative",
      bottom: isMobile
        ? selectedParcel && showMobileDetails
          ? 0
          : "auto"
        : "auto",
      zIndex: isMobile ? 20 : "auto",
      borderTopLeftRadius: isMobile ? "16px" : "0",
      borderTopRightRadius: isMobile ? "16px" : "0",
    },
    sidebarContent: {
      padding: isMobile ? "16px" : "24px",
    },
    sidebarHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "16px",
    },
    sidebarTitle: {
      fontSize: isMobile ? "18px" : "20px",
      fontWeight: "bold",
      color: "#1f2937",
    },
    closeButton: {
      backgroundColor: "transparent",
      border: "none",
      color: "#6b7280",
      cursor: "pointer",
      fontSize: "18px",
    },
    mobileToggle: {
      display: isMobile ? "block" : "none",
      position: "fixed",
      bottom: "20px",
      right: "20px",
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "56px",
      height: "56px",
      fontSize: "24px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      cursor: "pointer",
      zIndex: 30,
    },
    propertyCard: {
      backgroundColor: "#dbeafe",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "16px",
    },
    propertyCardTitle: {
      fontWeight: "600",
      color: "#1e40af",
      marginBottom: "8px",
    },
    propertyCardText: {
      color: "#1e3a8a",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      marginBottom: "16px",
    },
    statCard: {
      padding: "12px",
      borderRadius: "8px",
    },
    statCardGreen: {
      backgroundColor: "#dcfce7",
    },
    statCardPurple: {
      backgroundColor: "#f3e8ff",
    },
    statTitle: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "4px",
    },
    statValue: {
      fontSize: "18px",
      fontWeight: "bold",
    },
    infoCard: {
      backgroundColor: "#f9fafb",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "16px",
    },
    infoTitle: {
      fontWeight: "600",
      color: "#1f2937",
      marginBottom: "12px",
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px",
      fontSize: "14px",
    },
    infoLabel: {
      color: "#6b7280",
    },
    infoValue: {
      color: "#1f2937",
      fontWeight: "500",
    },
    actionsCard: {
      backgroundColor: "#fefce8",
      padding: "16px",
      borderRadius: "8px",
    },
    actionsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px",
    },
    actionButton: {
      color: "white",
      padding: "8px 12px",
      borderRadius: "4px",
      fontSize: "14px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    emptyState: {
      textAlign: "center",
      padding: "24px",
    },
    emptyIcon: {
      color: "#9ca3af",
      marginBottom: "16px",
    },
    emptyTitle: {
      fontSize: "18px",
      fontWeight: "500",
      color: "#6b7280",
      marginBottom: "8px",
    },
    emptyText: {
      fontSize: "14px",
      color: "#9ca3af",
    },
    demoCard: {
      backgroundColor: "#dbeafe",
      padding: "16px",
      borderRadius: "8px",
      marginTop: "24px",
    },
    demoTitle: {
      fontWeight: "600",
      color: "#1e40af",
      marginBottom: "8px",
    },
    demoList: {
      fontSize: "14px",
      color: "#1e3a8a",
      textAlign: "left",
      paddingLeft: "0",
      listStyle: "none",
    },
    demoListItem: {
      marginBottom: "4px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Oklahoma Energy Parcel Explorer</h1>
        <p style={styles.subtitle}>
          Click on any parcel to view mineral rights and energy development data
        </p>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.mapContainer}>
          <div ref={mapRef} style={styles.map}></div>

          {/* Legend */}
          <div style={styles.legend}>
            <div
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: "8px",
              }}
            >
              Legend
            </div>
            <div style={styles.legendItem}>
              <div
                style={{
                  ...styles.legendColor,
                  backgroundColor: "#60a5fa",
                  borderColor: "#3b82f6",
                }}
              ></div>
              <span>Energy Parcels</span>
            </div>
            <div style={styles.legendItem}>
              <div
                style={{
                  ...styles.legendColor,
                  backgroundColor: "#fb923c",
                  borderColor: "#f97316",
                }}
              ></div>
              <span>Selected Parcel</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          style={{
            ...styles.sidebar,
            display: isMobile
              ? selectedParcel && showMobileDetails
                ? "block"
                : "none"
              : "block",
          }}
        >
          {selectedParcel ? (
            <div style={styles.sidebarContent}>
              <div style={styles.sidebarHeader}>
                <h2 style={styles.sidebarTitle}>Energy Parcel Details</h2>
                <button
                  style={styles.closeButton}
                  onClick={() => {
                    setSelectedParcel(null);
                    setShowMobileDetails(false);
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={styles.propertyCard}>
                <h3 style={styles.propertyCardTitle}>Location</h3>
                <p style={styles.propertyCardText}>{selectedParcel.address}</p>
              </div>

              <div style={styles.statsGrid}>
                <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
                  <h4 style={{ ...styles.statTitle, color: "#166534" }}>
                    Property Value
                  </h4>
                  <p style={{ ...styles.statValue, color: "#15803d" }}>
                    {selectedParcel.value}
                  </p>
                </div>
                <div style={{ ...styles.statCard, ...styles.statCardPurple }}>
                  <h4 style={{ ...styles.statTitle, color: "#6b21a8" }}>
                    Acreage
                  </h4>
                  <p style={{ ...styles.statValue, color: "#7c3aed" }}>
                    {selectedParcel.size}
                  </p>
                </div>
              </div>

              <div style={styles.infoCard}>
                <h3 style={styles.infoTitle}>Property Information</h3>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Owner:</span>
                  <span style={styles.infoValue}>{selectedParcel.owner}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Rights Type:</span>
                  <span style={styles.infoValue}>
                    {selectedParcel.propertyType}
                  </span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Zoning:</span>
                  <span style={styles.infoValue}>{selectedParcel.zoning}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Year Acquired:</span>
                  <span style={styles.infoValue}>
                    {selectedParcel.yearAcquired}
                  </span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Parcel ID:</span>
                  <span
                    style={{ ...styles.infoValue, fontFamily: "monospace" }}
                  >
                    {selectedParcel.id}
                  </span>
                </div>
              </div>

              {selectedParcel && selectedParcel.oilGasInfo && (
                <div
                  style={{
                    ...styles.infoCard,
                    backgroundColor: "#1f2937",
                    color: "white",
                  }}
                >
                  <h3 style={{ ...styles.infoTitle, color: "#f3f4f6" }}>
                    Oil & Gas Information
                  </h3>
                  <div style={styles.infoRow}>
                    <span style={{ ...styles.infoLabel, color: "#d1d5db" }}>
                      Play:
                    </span>
                    <span style={{ ...styles.infoValue, color: "#fbbf24" }}>
                      {selectedParcel.oilGasInfo.play}
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={{ ...styles.infoLabel, color: "#d1d5db" }}>
                      Formations:
                    </span>
                    <span style={{ ...styles.infoValue, color: "#f3f4f6" }}>
                      {selectedParcel.oilGasInfo.formations}
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={{ ...styles.infoLabel, color: "#d1d5db" }}>
                      Active Wells:
                    </span>
                    <span style={{ ...styles.infoValue, color: "#34d399" }}>
                      {selectedParcel.oilGasInfo.wellCount}
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={{ ...styles.infoLabel, color: "#d1d5db" }}>
                      Royalty Rate:
                    </span>
                    <span style={{ ...styles.infoValue, color: "#60a5fa" }}>
                      {selectedParcel.oilGasInfo.royaltyRate}
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={{ ...styles.infoLabel, color: "#d1d5db" }}>
                      Lease Status:
                    </span>
                    <span style={{ ...styles.infoValue, color: "#a78bfa" }}>
                      {selectedParcel.oilGasInfo.leaseStatus}
                    </span>
                  </div>
                </div>
              )}

              <div style={styles.actionsCard}>
                <h3 style={{ ...styles.infoTitle, color: "#92400e" }}>
                  Quick Actions
                </h3>
                <div style={styles.actionsGrid}>
                  <button
                    style={{
                      ...styles.actionButton,
                      backgroundColor: "#2563eb",
                    }}
                  >
                    Lease History
                  </button>
                  <button
                    style={{
                      ...styles.actionButton,
                      backgroundColor: "#16a34a",
                    }}
                  >
                    Production Report
                  </button>
                  <button
                    style={{
                      ...styles.actionButton,
                      backgroundColor: "#9333ea",
                    }}
                  >
                    Well Records
                  </button>
                  <button
                    style={{
                      ...styles.actionButton,
                      backgroundColor: "#ea580c",
                    }}
                  >
                    Title Research
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ ...styles.sidebarContent, ...styles.emptyState }}>
              <div style={styles.emptyIcon}>
                <svg
                  style={{ width: "64px", height: "64px", margin: "0 auto" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 style={styles.emptyTitle}>Select an Energy Parcel</h3>
              <p style={styles.emptyText}>
                Click on any parcel on the map to view detailed mineral rights,
                lease information, and production data.
              </p>

              <div style={styles.demoCard}>
                <h4 style={styles.demoTitle}>Demo Features</h4>
                <ul style={styles.demoList}>
                  <li style={styles.demoListItem}>
                    • Interactive map with SCOOP/STACK parcels
                  </li>
                  <li style={styles.demoListItem}>
                    • Real-time oil & gas lease data
                  </li>
                  <li style={styles.demoListItem}>
                    • Mineral rights ownership info
                  </li>
                  <li style={styles.demoListItem}>
                    • Formation and well count data
                  </li>
                  <li style={styles.demoListItem}>
                    • Royalty rate information
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        {isMobile && selectedParcel && !showMobileDetails && (
          <button
            style={styles.mobileToggle}
            onClick={() => setShowMobileDetails(true)}
          >
            ↑
          </button>
        )}
      </div>
    </div>
  );
};

export default ParcelMapDemo;
