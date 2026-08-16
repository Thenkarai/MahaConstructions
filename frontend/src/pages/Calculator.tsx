import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiArrowLeft, FiCheck, FiInfo, FiLayers, FiCheckCircle, FiPhone, FiMail, FiUser } from "react-icons/fi";

export default function Calculator() {
  const [step, setStep] = useState<number>(1);

  // STEP 1 State: Plot & Built-Up Area
  const [plotArea, setPlotArea] = useState<number>(1200);
  const [builtUpArea, setBuiltUpArea] = useState<number>(1000);
  const [parkingArea, setParkingArea] = useState<number>(0);

  // STEP 2 State: Floors & Structural Factors
  const [floors, setFloors] = useState<number>(1); // 1 = G, 2 = G+1, 3 = G+2, 4 = G+3
  const [soilType, setSoilType] = useState<string>("standard"); // standard, loose/clay, hardrock
  const [foundationType, setFoundationType] = useState<string>("isolated"); // isolated, pile (pile adds cost)

  // STEP 3 State: Packages Selection (4 Tiers)
  const [selectedPackage, setSelectedPackage] = useState<string>("premium"); // basic, premium, luxury, ultra

  // STEP 4 State: Extras & Addons
  const [borewell, setBorewell] = useState<boolean>(false);
  const [modularKitchen, setModularKitchen] = useState<boolean>(false);
  const [compoundWall, setCompoundWall] = useState<number>(0);
  const [approvals, setApprovals] = useState<boolean>(false);

  // Contact Form (Final Step submission)
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Pricing constants (2026 rates for Turnkey Chennai builds)
  const packagesInfo: { [key: string]: { name: string; rate: number; parkingRate: number; desc: string } } = {
    basic: { name: "Basic / Essential", rate: 1999, parkingRate: 1800, desc: "Solid modular fixtures, standard local cement & TMT steel brands." },
    premium: { name: "Premium Quality", rate: 2399, parkingRate: 2350, desc: "Teak main door, Kajaria flooring, Jaquar fittings, Polycab modular wiring." },
    luxury: { name: "Elite Luxury", rate: 2899, parkingRate: 2700, desc: "Kohler sanitary collection, Legrand wiring, engineered frames, custom designs." },
    ultra: { name: "Super Luxury Ultra", rate: 3499, parkingRate: 3100, desc: "Premium Italian Travertine, home automation systems, bespoke imported fixtures." }
  };

  // Math Calculations
  const selectedPkg = packagesInfo[selectedPackage];
  const floorRate = selectedPkg.rate;
  const parkingRateVal = selectedPkg.parkingRate;

  // Base construction cost = (Built-up Area * Floors * Rate)
  const baseCost = builtUpArea * floors * floorRate;
  
  // Modifiers
  const floorCostMultiplier = floors === 1 ? 1.0 : floors === 2 ? 1.03 : floors === 3 ? 1.06 : 1.10;
  const soilMultiplier = soilType === "loose/clay" ? 1.08 : soilType === "hardrock" ? 1.02 : 1.0;
  const foundationAddon = foundationType === "pile" ? 180000 : 0;
  
  // Addons cost
  const calculatedParkingCost = parkingArea * parkingRateVal;
  const borewellCost = borewell ? 140000 : 0;
  const kitchenCost = modularKitchen ? 120000 : 0;
  const compoundCost = compoundWall * 1600;
  const approvalCost = approvals ? 85000 : 0;

  const totalEstimate = Math.round(
    (baseCost * floorCostMultiplier * soilMultiplier) +
    foundationAddon +
    calculatedParkingCost +
    borewellCost +
    kitchenCost +
    compoundCost +
    approvalCost
  );

  // Calculated metrics
  const far = parseFloat(((builtUpArea * floors) / plotArea).toFixed(2));
  const coveragePercent = Math.min(100, Math.round((builtUpArea / plotArea) * 100));

  // Material breakdowns
  const totalBuiltUpArea = (builtUpArea * floors) + parkingArea;
  const cementBags = Math.round(totalBuiltUpArea * 0.42);
  const steelTons = Math.round(((totalBuiltUpArea * 4.2) / 1000) * 10) / 10;
  const bricksCount = Math.round(totalBuiltUpArea * 8.5);
  const sandCft = Math.round(totalBuiltUpArea * 1.95);
  const aggregateCft = Math.round(totalBuiltUpArea * 1.45);

  // Stages Payment Breakdown (10 Stages)
  const paymentStages = [
    { stage: 1, name: "Booking Token Advance", percentage: 10, amount: Math.round(totalEstimate * 0.10), details: "Architectural drawings layout, elevation designs & 3D approval." },
    { stage: 2, name: "Foundation Excavation", percentage: 10, amount: Math.round(totalEstimate * 0.10), details: "Earth excavation, soil leveling, foundation columns & concrete footings." },
    { stage: 3, name: "Plinth Level Completion", percentage: 10, amount: Math.round(totalEstimate * 0.10), details: "Pedestal column casting, plinth beam concrete & underground earthworks." },
    { stage: 4, name: "Ground Floor Slab", percentage: 15, amount: Math.round(totalEstimate * 0.15), details: "First floor deck centering, structural beam bars & slab concrete casting." },
    { stage: 5, name: "Upper Floor Slabs", percentage: 10, amount: Math.round(totalEstimate * 0.10), details: "Columns, staircases, and upper concrete roof slab fabrication." },
    { stage: 6, name: "Brickwork Masonry", percentage: 15, amount: Math.round(totalEstimate * 0.15), details: "Internal & external perimeter brick laying, lofts & lintel beam placements." },
    { stage: 7, name: "Plastering Works", percentage: 10, amount: Math.round(totalEstimate * 0.10), details: "Smooth interior wall plastering & weatherproof outer coat application." },
    { stage: 8, name: "MEP Conduit Wiring", percentage: 10, amount: Math.round(totalEstimate * 0.10), details: "Electrical wiring conduit layout, pipe runs & bathroom plumbing lines." },
    { stage: 9, name: "Tiling & Paint Base", percentage: 5, amount: Math.round(totalEstimate * 0.05), details: "Floor tiles, bathroom fixtures, putty filing & primer painting." },
    { stage: 10, name: "Final Handover Checks", percentage: 5, amount: Math.round(totalEstimate * 0.05), details: "Switchboard fitting, final emulsion coats, structural test & keys hand-over." }
  ];

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      project_type: `Turnkey Cost Calculation (Package: ${selectedPackage.toUpperCase()})`,
      budget_range: `₹${(totalEstimate / 10000000).toFixed(2)} Crore (Calculator Request)`,
      message: `Wizard configurations:
- Plot Area: ${plotArea} Sq.Ft
- Builtup Area: ${builtUpArea} Sq.Ft/floor
- Floors: ${floors} (Total Builtup: ${builtUpArea * floors} Sq.Ft)
- Car Parking Area: ${parkingArea} Sq.Ft (Cost: ₹${calculatedParkingCost})
- Soil Type: ${soilType}
- Addons: Borewell=${borewell}, Modular Kitchen=${modularKitchen}, Compound=${compoundWall}ft, Approvals=${approvals}
- Calculated Cost: ₹${totalEstimate.toLocaleString("en-IN")}`
    };

    try {
      const res = await fetch("http://localhost:8000/api/leads/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setSubmitting(false);
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 pt-32 pb-24 text-[#081C35]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-heading uppercase text-[#081C35] mb-3">
            House Construction Cost <span className="text-[#D4A437]">Calculator</span>
          </h1>
          <p className="text-xs text-[#D4A437] tracking-[0.2em] font-semibold uppercase mb-6">
            Calculate in 30 seconds
          </p>
          <p className="text-xs md:text-sm text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
            Free house construction cost calculator for Chennai with 2026 rates. Phase-wise breakdown, material estimates and timeline — tailored to your plot, floors and finish level.
          </p>

          {/* Core Badges Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12 text-center text-[#081C35]">
            {[
              { top: "₹1,999+", bot: "Per Sqft" },
              { top: "10 Phases", bot: "Breakdown" },
              { top: "4 Tiers", bot: "Packages" },
              { top: "Free Tool", bot: "No Sign-up" }
            ].map((badge, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
                <span className="text-lg md:text-xl font-bold font-heading text-[#D4A437] block">{badge.top}</span>
                <span className="text-[10px] text-slate-700 uppercase font-semibold mt-1 block">{badge.bot}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Steps Tabs Selector */}
        <div className="border-b border-slate-200 mb-8 overflow-x-auto">
          <div className="flex space-x-8 min-w-[500px] pb-3 text-xs tracking-widest font-semibold uppercase text-[#081C35]/40">
            {[
              { num: 1, label: "Plot Area" },
              { num: 2, label: "Floors" },
              { num: 3, label: "Package" },
              { num: 4, label: "Extras" },
              { num: 5, label: "Report" }
            ].map((tab) => (
              <button
                key={tab.num}
                onClick={() => {
                  if (tab.num <= step) setStep(tab.num);
                }}
                className={`pb-1 border-b-2 transition-all cursor-pointer ${
                  step === tab.num
                    ? "border-[#D4A437] text-[#D4A437] font-bold"
                    : tab.num < step
                    ? "border-[#081C35]/20 text-[#081C35]"
                    : "border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-[#D4A437] h-full transition-all duration-500" 
            style={{ width: `${(step - 1) * 25}%` }}
          />
        </div>

        {/* Wizard Forms Card */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-8 shadow-sm">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Plot & Built-Up Area */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <span className="text-[9px] text-[#D4A437] tracking-widest font-bold uppercase block mb-1">Step 1 of 4</span>
                  <h3 className="text-xl font-bold font-heading text-[#081C35] uppercase">Enter your plot & built-up area</h3>
                  <p className="text-xs text-slate-700 mt-1 font-medium">Provide both your plot size and the construction area per floor.</p>
                </div>

                {/* Plot Area */}
                <div>
                  <label className="text-[10px] tracking-widest text-[#081C35]/60 font-bold block mb-2 uppercase">
                    Plot Area (Sq. Ft)
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={plotArea}
                      onChange={(e) => setPlotArea(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded text-xs outline-none focus:border-[#D4A437]"
                      placeholder="e.g. 1200"
                    />
                    <div className="shrink-0 flex items-center bg-slate-100 border border-slate-200 px-4 rounded text-[10px] text-[#081C35]/60 font-bold">
                      {(plotArea / 9).toFixed(1)} Sq.Yds
                    </div>
                    <div className="shrink-0 flex items-center bg-slate-100 border border-slate-200 px-4 rounded text-[10px] text-[#081C35]/60 font-bold">
                      {(plotArea / 435.6).toFixed(2)} Cents
                    </div>
                  </div>
                  {/* Quick pills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[600, 800, 1200, 1500, 2000, 2400].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPlotArea(val)}
                        className={`px-3 py-1 border rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                          plotArea === val
                            ? "bg-[#081C35] border-[#081C35] text-white"
                            : "border-slate-200 hover:border-[#D4A437] hover:text-[#D4A437]"
                        }`}
                      >
                        {val} sqft
                      </button>
                    ))}
                  </div>
                </div>

                {/* Built-up Area */}
                <div>
                  <label className="text-[10px] tracking-widest text-[#081C35]/60 font-bold block mb-2 uppercase">
                    Built-up Area per Floor (Sq. Ft)
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={builtUpArea}
                      onChange={(e) => setBuiltUpArea(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded text-xs outline-none focus:border-[#D4A437]"
                      placeholder="e.g. 1000"
                    />
                    <div className="shrink-0 flex items-center bg-slate-100 border border-slate-200 px-4 rounded text-[10px] text-[#081C35]/60 font-bold">
                      {(builtUpArea / 9).toFixed(1)} Sq.Yds
                    </div>
                    <div className="shrink-0 flex items-center bg-slate-100 border border-slate-200 px-4 rounded text-[10px] text-[#081C35]/60 font-bold">
                      {(builtUpArea / 435.6).toFixed(2)} Cents
                    </div>
                  </div>
                  {/* Quick pills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[600, 800, 1200, 1500, 2000, 2500].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setBuiltUpArea(val)}
                        className={`px-3 py-1 border rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                          builtUpArea === val
                            ? "bg-[#081C35] border-[#081C35] text-white"
                            : "border-slate-200 hover:border-[#D4A437] hover:text-[#D4A437]"
                        }`}
                      >
                        {val} sqft
                      </button>
                    ))}
                  </div>
                </div>

                {/* Derived Metrics */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 gap-4 text-xs font-medium">
                  <div>
                    <span className="text-slate-700 block">Floor Area Ratio (FAR):</span>
                    <span className="text-[#081C35] font-bold">{far || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-700 block">Plot Coverage Percentage:</span>
                    <span className="text-[#081C35] font-bold">{coveragePercent || "—"}%</span>
                  </div>
                </div>

                {/* Car Parking */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] tracking-widest text-[#081C35]/60 font-bold block uppercase">
                      Car Parking Area (Optional)
                    </label>
                    <span className="text-xs font-bold text-[#D4A437]">₹{calculatedParkingCost.toLocaleString("en-IN")} Est. Cost</span>
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={parkingArea || ""}
                      onChange={(e) => setParkingArea(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded text-xs outline-none focus:border-[#D4A437]"
                      placeholder="Parking Area (Sq. Ft) - ₹2,350/sqft (Premium)"
                    />
                    <div className="shrink-0 flex items-center bg-slate-100 border border-slate-200 px-4 rounded text-[10px] text-[#081C35]/60 font-bold">
                      {parkingArea > 0 ? `${Math.round(parkingArea / 200)} Cars` : "0 Cars"}
                    </div>
                  </div>
                  {/* Quick pills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      { l: "1 Car (200 sqft)", v: 200 },
                      { l: "2 Cars (400 sqft)", v: 400 },
                      { l: "3 Cars (600 sqft)", v: 600 },
                      { l: "4 Cars (800 sqft)", v: 800 },
                    ].map((item) => (
                      <button
                        key={item.v}
                        type="button"
                        onClick={() => setParkingArea(item.v)}
                        className={`px-3 py-1 border rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                          parkingArea === item.v
                            ? "bg-[#081C35] border-[#081C35] text-white"
                            : "border-slate-200 hover:border-[#D4A437] hover:text-[#D4A437]"
                        }`}
                      >
                        {item.l}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-700/60 mt-3 flex items-start gap-1 font-medium leading-normal">
                    <FiInfo className="shrink-0 mt-0.5" /> Minimum single car bay = 200 sqft. Leave blank if no parking needed. Rate updates based on your selected package in Step 3.
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-[#D4A437] hover:bg-[#081C35] text-[#081C35] hover:text-white text-[10px] tracking-widest font-bold rounded flex items-center gap-2 transition-colors uppercase cursor-pointer"
                  >
                    Next — Choose Floors <FiArrowRight />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Floors Selection */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <span className="text-[9px] text-[#D4A437] tracking-widest font-bold uppercase block mb-1">Step 2 of 4</span>
                  <h3 className="text-xl font-bold font-heading text-[#081C35] uppercase">Select Floors & Soil Context</h3>
                  <p className="text-xs text-slate-700 mt-1 font-medium">Ground layout height adjustments and soil compaction coefficients.</p>
                </div>

                {/* Floors select buttons */}
                <div>
                  <label className="text-[10px] tracking-widest text-[#081C35]/60 font-bold block mb-3 uppercase">
                    Number of Floors
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { l: "Ground Floor", v: 1 },
                      { l: "G + 1 Floors", v: 2 },
                      { l: "G + 2 Floors", v: 3 },
                      { l: "G + 3 Floors", v: 4 }
                    ].map((item) => (
                      <button
                        key={item.v}
                        type="button"
                        onClick={() => setFloors(item.v)}
                        className={`p-4 rounded-xl border text-center transition-all cursor-pointer font-semibold text-xs ${
                          floors === item.v
                            ? "bg-[#D4A437] border-[#D4A437] text-[#081C35] shadow-sm"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        {item.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Soil Type Selection */}
                <div>
                  <label className="text-[10px] tracking-widest text-[#081C35]/60 font-bold block mb-3 uppercase">
                    Soil Condition of Plot
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "STANDARD SOIL", val: "standard", desc: "Solid dry earth requiring standard isolated footing." },
                      { label: "LOOSE / CLAY SOIL", val: "loose/clay", desc: "Black cotton or wet mud requiring structural depth (+8% cost)." },
                      { label: "HARD ROCK SOIL", val: "hardrock", desc: "Tough bedrock layout requiring hard breakers (+2% cost)." }
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setSoilType(item.val)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          soilType === item.val
                            ? "bg-[#081C35] border-[#081C35] text-white shadow-sm"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        <span className="text-[10px] font-bold block mb-1">{item.label}</span>
                        <p className={`text-[9px] leading-relaxed font-medium ${soilType === item.val ? "text-white/70" : "text-slate-700"}`}>{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Foundation Type */}
                <div>
                  <label className="text-[10px] tracking-widest text-[#081C35]/60 font-bold block mb-3 uppercase">
                    Foundation Reinforcement
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "ISOLATED COLUMNS", val: "isolated", desc: "Standard independent footing pad casted underground." },
                      { label: "PILE FOUNDATION SYSTEM", val: "pile", desc: "Deep pile pillars anchored deep for structural safety (adds flat ₹1,80,000)." }
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setFoundationType(item.val)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          foundationType === item.val
                            ? "bg-[#081C35] border-[#081C35] text-white shadow-sm"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        <span className="text-[10px] font-bold block mb-1">{item.label}</span>
                        <p className={`text-[9px] leading-relaxed font-medium ${foundationType === item.val ? "text-white/70" : "text-slate-700"}`}>{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-slate-200 hover:border-[#D4A437] rounded text-[10px] tracking-widest font-bold flex items-center gap-2 transition-colors uppercase cursor-pointer"
                  >
                    <FiArrowLeft /> Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-[#D4A437] hover:bg-[#081C35] text-[#081C35] hover:text-white text-[10px] tracking-widest font-bold rounded flex items-center gap-2 transition-colors uppercase cursor-pointer"
                  >
                    Next — Choose Package <FiArrowRight />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Package Tiers */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <span className="text-[9px] text-[#D4A437] tracking-widest font-bold uppercase block mb-1">Step 3 of 4</span>
                  <h3 className="text-xl font-bold font-heading text-[#081C35] uppercase">Choose finish quality package</h3>
                  <p className="text-xs text-slate-700 mt-1 font-medium">Determine the structural materials, fittings, and design elements.</p>
                </div>

                {/* 4 Tiers grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(packagesInfo).map(([key, info]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPackage(key)}
                      className={`p-6 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-[180px] ${
                        selectedPackage === key
                          ? "bg-[#D4A437]/5 border-[#D4A437] shadow-md"
                          : "border-slate-200 hover:border-[#D4A437]/40 bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-[#081C35] uppercase">{info.name}</span>
                          {key === "premium" && (
                            <span className="bg-[#081C35] text-white text-[8px] font-bold tracking-widest px-2 py-0.5 rounded-full">POPULAR</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-700 font-medium leading-relaxed mt-2">{info.desc}</p>
                      </div>
                      <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-end">
                        <span className="text-[9px] text-slate-700 uppercase">Rate:</span>
                        <span className="text-xl font-bold font-heading text-[#D4A437]">₹{info.rate}/sqft</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border border-slate-200 hover:border-[#D4A437] rounded text-[10px] tracking-widest font-bold flex items-center gap-2 transition-colors uppercase cursor-pointer"
                  >
                    <FiArrowLeft /> Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="px-6 py-3 bg-[#D4A437] hover:bg-[#081C35] text-[#081C35] hover:text-white text-[10px] tracking-widest font-bold rounded flex items-center gap-2 transition-colors uppercase cursor-pointer"
                  >
                    Next — Review Extras <FiArrowRight />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Extras / Addons */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <span className="text-[9px] text-[#D4A437] tracking-widest font-bold uppercase block mb-1">Step 4 of 4</span>
                  <h3 className="text-xl font-bold font-heading text-[#081C35] uppercase">Select Site Additions</h3>
                  <p className="text-xs text-slate-700 mt-1 font-medium">Add custom civil additions, modular works, and plan approval factors.</p>
                </div>

                {/* Extras selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Borewell */}
                  <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer select-none transition-colors ${
                    borewell ? "bg-[#D4A437]/5 border-[#D4A437]" : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                  }`}>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-[#081C35] uppercase">Borewell & Water Sump</span>
                      <span className="text-[10px] text-slate-700 mt-1 font-medium">Submersible pump & 6000L sump (+₹1,40,000)</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={borewell}
                      onChange={(e) => setBorewell(e.target.checked)}
                      className="w-4 h-4 accent-accent"
                    />
                  </label>

                  {/* Modular Kitchen */}
                  <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer select-none transition-colors ${
                    modularKitchen ? "bg-[#D4A437]/5 border-[#D4A437]" : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                  }`}>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-[#081C35] uppercase">Modular Kitchen Cabinetry</span>
                      <span className="text-[10px] text-slate-700 mt-1 font-medium">Marine ply carcass with hydraulic hinges (+₹1,20,000)</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={modularKitchen}
                      onChange={(e) => setModularKitchen(e.target.checked)}
                      className="w-4 h-4 accent-accent"
                    />
                  </label>

                  {/* Approvals */}
                  <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer select-none transition-colors ${
                    approvals ? "bg-[#D4A437]/5 border-[#D4A437]" : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                  }`}>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-[#081C35] uppercase">CMDA/DTCP Permit Approvals</span>
                      <span className="text-[10px] text-slate-700 mt-1 font-medium">Local building permit handling (+₹85,000)</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={approvals}
                      onChange={(e) => setApprovals(e.target.checked)}
                      className="w-4 h-4 accent-accent"
                    />
                  </label>

                  {/* Compound wall length */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
                    <span className="text-xs font-bold text-[#081C35] uppercase block mb-1">Compound Wall Boundary</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="500"
                        value={compoundWall || ""}
                        onChange={(e) => setCompoundWall(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-xs outline-none focus:border-[#D4A437]"
                        placeholder="Running Feet (e.g. 150)"
                      />
                      <div className="shrink-0 text-[10px] text-slate-700 font-bold">
                        ₹{(compoundWall * 1600).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 border border-slate-200 hover:border-[#D4A437] rounded text-[10px] tracking-widest font-bold flex items-center gap-2 transition-colors uppercase cursor-pointer"
                  >
                    <FiArrowLeft /> Back
                  </button>
                  <button
                    onClick={() => setStep(5)}
                    className="px-6 py-3 bg-[#D4A437] hover:bg-[#081C35] text-[#081C35] hover:text-white text-[10px] tracking-widest font-bold rounded flex items-center gap-2 transition-colors uppercase cursor-pointer"
                  >
                    Generate Detailed Report <FiArrowRight />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Final Report */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Cost Estimate Highlight Header */}
                <div className="bg-[#081C35] text-white rounded-xl p-8 shadow-lg border border-white/5 relative overflow-hidden text-center">
                  <span className="text-[10px] tracking-widest text-[#D4A437] font-bold uppercase block mb-1">CALCULATION COMPLETED</span>
                  <h3 className="text-xs tracking-widest text-white/50 uppercase font-medium">TOTAL COMMERCIAL COST</h3>
                  <div className="text-3xl md:text-4xl font-bold font-heading text-[#D4A437] mt-3 mb-4">
                    ₹{totalEstimate.toLocaleString("en-IN")}
                  </div>
                  <p className="text-[10px] text-white/50 font-medium max-w-md mx-auto">
                    Commercial estimate tailored to your builtup area of {(builtUpArea * floors).toLocaleString()} sqft under the {selectedPkg.name} package structure.
                  </p>
                </div>

                {/* Estimate Breakdown Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Summary Specs */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3.5 text-xs">
                    <h4 className="text-xs font-bold tracking-widest text-[#081C35] uppercase border-b border-slate-200/80 pb-2 mb-4">ESTIMATE SPECIFICATIONS</h4>
                    <div className="flex justify-between">
                      <span className="text-slate-700">Built-up Area:</span>
                      <span className="font-bold text-[#081C35]">{(builtUpArea * floors).toLocaleString()} Sq.Ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700">Floors Layout:</span>
                      <span className="font-bold text-[#081C35]">G+{floors - 1} Floors</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700">Finish Quality:</span>
                      <span className="font-bold text-[#D4A437] uppercase font-heading">{selectedPkg.name}</span>
                    </div>
                    {parkingArea > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-700">Car Parking Area:</span>
                        <span className="font-bold text-[#081C35]">{parkingArea} Sq.Ft (₹{calculatedParkingCost.toLocaleString("en-IN")})</span>
                      </div>
                    )}
                    {borewell && <div className="flex justify-between"><span className="text-slate-700">Borewell Addon:</span><span className="text-green-600 font-semibold">₹1,40,000 Included</span></div>}
                    {modularKitchen && <div className="flex justify-between"><span className="text-slate-700">Modular Kitchen:</span><span className="text-green-600 font-semibold">₹1,20,000 Included</span></div>}
                    {compoundWall > 0 && <div className="flex justify-between"><span className="text-slate-700">Compound Boundary:</span><span className="font-bold text-[#081C35]">₹{compoundCost.toLocaleString("en-IN")}</span></div>}
                    {approvals && <div className="flex justify-between"><span className="text-slate-700">Plan Permits:</span><span className="text-green-600 font-semibold">₹85,000 Included</span></div>}
                  </div>

                  {/* Material Estimates */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h4 className="text-xs font-bold tracking-widest text-[#081C35] uppercase border-b border-slate-200/80 pb-2 mb-4">MATERIAL QUANTITIES ESTIMATE</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-white p-3 rounded border border-slate-200/50">
                        <span className="text-[9px] text-slate-700 block mb-1 uppercase font-semibold">CEMENT</span>
                        <span className="text-sm font-bold text-[#081C35] font-heading">{cementBags.toLocaleString()} BAGS</span>
                      </div>
                      <div className="bg-white p-3 rounded border border-slate-200/50">
                        <span className="text-[9px] text-slate-700 block mb-1 uppercase font-semibold">STEEL BAR</span>
                        <span className="text-sm font-bold text-[#081C35] font-heading">{steelTons} TONS</span>
                      </div>
                      <div className="bg-white p-3 rounded border border-slate-200/50">
                        <span className="text-[9px] text-slate-700 block mb-1 uppercase font-semibold">BRICKS</span>
                        <span className="text-sm font-bold text-[#081C35] font-heading">{bricksCount.toLocaleString()} PCS</span>
                      </div>
                      <div className="bg-white p-3 rounded border border-slate-200/50">
                        <span className="text-[9px] text-slate-700 block mb-1 uppercase font-semibold">SAND</span>
                        <span className="text-sm font-bold text-[#081C35] font-heading">{sandCft.toLocaleString()} CFT</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage payment scheduling (10 stages breakdown) */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 border-b border-slate-200 p-4">
                    <h4 className="text-xs font-bold tracking-widest text-[#081C35] uppercase">10-Phase payment breakdown</h4>
                  </div>
                  <div className="divide-y divide-border text-xs">
                    {paymentStages.map((stage) => (
                      <div key={stage.stage} className="p-4 hover:bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                        <div>
                          <span className="text-[9px] font-bold text-[#D4A437]">STAGE {stage.stage} ({stage.percentage}%)</span>
                          <h5 className="font-bold text-[#081C35] uppercase mt-0.5">{stage.name}</h5>
                          <p className="text-[10px] text-slate-700 font-medium leading-relaxed mt-0.5">{stage.details}</p>
                        </div>
                        <span className="text-sm font-bold text-[#081C35] font-heading shrink-0">₹{stage.amount.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call-to-action Save Estimate Form */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-8 shadow-sm max-w-xl mx-auto">
                  <div className="text-center mb-6">
                    <h4 className="text-xs font-bold tracking-widest text-[#081C35] uppercase">SAVE & SEND TO CHIEF ARCHITECT</h4>
                    <p className="text-[10px] text-slate-700 font-medium mt-1">Submit these calculator metrics. We will perform a free site survey & soil testing feasibility check.</p>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {!submitted ? (
                      <form onSubmit={handleLeadSubmit} className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] tracking-widest text-[#081C35]/50 font-bold block mb-1.5 uppercase">NAME</label>
                            <input
                              type="text"
                              required
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 text-[#081C35] text-xs px-4 py-2.5 rounded outline-none focus:border-[#D4A437]"
                              placeholder="Your Name"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] tracking-widest text-[#081C35]/50 font-bold block mb-1.5 uppercase">PHONE NUMBER</label>
                            <input
                              type="text"
                              required
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 text-[#081C35] text-xs px-4 py-2.5 rounded outline-none focus:border-[#D4A437]"
                              placeholder="Mobile Number"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] tracking-widest text-[#081C35]/50 font-bold block mb-1.5 uppercase">EMAIL ADDRESS</label>
                          <input
                            type="email"
                            required
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-[#081C35] text-xs px-4 py-2.5 rounded outline-none focus:border-[#D4A437]"
                            placeholder="Email Address"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full py-4 bg-[#D4A437] hover:bg-[#081C35] text-[#081C35] hover:text-white text-[10px] tracking-widest font-semibold rounded transition-colors uppercase cursor-pointer"
                        >
                          {submitting ? "SUBMITTING SPECIFICATIONS..." : "REQUEST SITE FEASIBILITY SURVEY"}
                        </button>
                      </form>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-6 text-green-600 bg-green-50 rounded-lg border border-green-200"
                      >
                        <FiCheckCircle className="mx-auto mb-2 text-2xl" />
                        <span className="text-xs font-bold uppercase tracking-wider block">CALCULATIONS SUBMITTED</span>
                        <p className="text-[10px] text-green-700/80 mt-1">Our turnkey civil engineers will contact you in 24 hours.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex justify-start pt-4">
                  <button
                    onClick={() => setStep(4)}
                    className="px-6 py-3 border border-slate-200 hover:border-[#D4A437] rounded text-[10px] tracking-widest font-bold flex items-center gap-2 transition-colors uppercase cursor-pointer"
                  >
                    <FiArrowLeft /> Back
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

