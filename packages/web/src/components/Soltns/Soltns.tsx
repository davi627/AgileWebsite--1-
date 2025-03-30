import React, { useState } from 'react';
import Footer from 'components/Footer';
import Navbar from 'components/Navbar';
import { Link } from 'react-router-dom';

const SolutionsPage = () => {
  const [expandedSolution, setExpandedSolution] = useState<number | null>(null);

  const themeColor = {
    primary: 'bg-[#167AA0]',
    primaryHover: 'hover:bg-[#12688a]',
    text: 'text-[#167AA0]',
    border: 'border-[#167AA0]',
    gradientFrom: 'from-[#167AA0]',
    gradientTo: 'to-[#12688a]'
  };

  const solutionCategories = [
    {
      title: "Business Solutions",
      solutions: [
        {
          id: 1,
          name: "Enterprise Resource Planning (ERP)",
          shortDesc: "Digital transformation backbone integrating all business functions.",
          fullDesc: "Our ERP system serves as the central nervous system of your organization, connecting finance, supply chain, HR, and CRM with real-time data flows. The platform eliminates information silos through a unified database architecture, offering industry-specific modules for manufacturing, retail, healthcare, and more. With multi-company, multi-currency, and multi-language support, it ensures global operations compliance with GDPR, ISO 27001, and local regulatory standards.",
          features: [
            "Real-Time Dashboards: Drill-down capabilities to transaction-level details",
            "Automated Workflows: Rule-based approvals with RPA integration",
            "Industry Templates: Pre-configured for manufacturing (MRP/CRP), retail (merchandising), etc.",
            "Mobile Workforce: Offline-capable field apps with GPS tracking",
            "AI/ML Integration: Predictive inventory, cash flow forecasting, anomaly detection"
          ],
          implementation: "12-week rapid deployment includes process mapping, legacy data migration, and hypercare support. We provide sandbox environments for UAT and train-the-trainer programs."
        },
        {
          id: 2,
          name: "Pension Administration (AgilePen)",
          shortDesc: "End-to-end management of annuities and IPPs.",
          fullDesc: "AgilePen revolutionizes pension administration with configurable benefit calculation engines supporting defined benefit, defined contribution, and hybrid plans. The system automates member communications, regulatory filings (RBA, IRS, FCA), and integrates with custodians for STP of contributions/disbursements via SWIFT/SEPA networks. Member portals provide self-service access to statements and modeling tools.",
          features: [
            "Actuarial Links: Direct integration with Prophet®/Moses®",
            "Disbursement Hub: Automated payment processing with reconciliation",
            "Compliance Engine: Auto-generates regulatory reports",
            "Biometric Verification: Secure pensioner identification",
            "Case Management: SLA-monitored inquiry resolution"
          ],
          implementation: "Includes actuarial data migration, document management setup, and ongoing regulatory updates as pension laws evolve."
        },
        {
          id: 3,
          name: "Investment Management (AgileInvest)",
          shortDesc: "Front-to-back office solution for asset managers.",
          fullDesc: "Comprehensive platform covering portfolio management, order execution (FIX connectivity to 150+ exchanges), risk analytics (VaR, stress testing), and investor reporting. Supports traditional assets, alternatives (PE/RE), and crypto with MiFID II/SEC compliance. Features AI-driven sentiment analysis and blockchain settlement for OTC derivatives.",
          features: [
            "Waterfall Calculations: Automated distribution waterfalls",
            "ESG Analytics: SFDR-aligned impact scoring",
            "Investor Portal: Customizable LP dashboards",
            "Blockchain Integration: Smart contract settlement",
            "Reference Data: Bloomberg/Refinitiv feeds"
          ],
          implementation: "Co-developed with tier-1 asset managers. Includes prime broker testing and 3-month live trading support."
        },
        {
          id: 4,
          name: "Insurance Solution",
          shortDesc: "Policy administration with IoT integration.",
          fullDesc: "End-to-end platform for P&C, life, and health insurance featuring dynamic underwriting rules, claims fraud detection, and IFRS 17 compliance. Integrated telematics/wearables enable usage-based products. Supports MGAs with producer hierarchy management and clawback tracking.",
          features: [
            "Underwriting Workbench: Geo-layered risk scoring",
            "Claims Automation: Image recognition for damage assessment",
            "Policyholder App: FNOL submission with media capture",
            "Reinsurance Module: Facultative placement workflows",
            "Commission Engine: Hierarchical payout calculations"
          ],
          implementation: "Includes product configuration, MGA portal setup, and medical provider integration for health claims."
        },
        {
          id: 5,
          name: "Manufacturing ERP",
          shortDesc: "Digital thread from design to delivery.",
          fullDesc: "Integrated solution combining PLM, MES, and QMS with IIoT connectivity. Supports lean manufacturing through Andon alerts, OEE tracking, and predictive maintenance. Features digital twin capabilities for 3D factory simulation and AR-assisted maintenance.",
          features: [
            "Advanced Planning: Finite capacity scheduling",
            "Quality 4.0: SPC charts with AI-driven root cause analysis",
            "Equipment Mgmt.: Sensor-based condition monitoring",
            "Service Logistics: Warranty tracking and field dispatch",
            "MRO Optimization: Spare parts inventory management"
          ],
          implementation: "Includes OPC-UA machine connectivity, barcode/RFID deployment, and Kaizen workshops."
        },
        {
          id: 6,
          name: "Public Sector ERP",
          shortDesc: "GFS-compliant fiscal management.",
          fullDesc: "Integrated system for budget preparation, commitment accounting, and PFM. Supports IFMIS, civil service HRMS, and e-Government services. Features beneficiary targeting for social programs and open data APIs for transparency.",
          features: [
            "Vote Book Control: Budget virement controls",
            "E-Procurement: End-to-end tender management (OTP)",
            "Asset Registry: GPS-tagged infrastructure",
            "Social Payments: Biometric beneficiary disbursements",
            "Open Data: API gateway for public datasets"
          ],
          implementation: "Localized for PEFA standards with Accountant General training."
        },
        {
          id: 7,
          name: "Education ERP",
          shortDesc: "Campus management from admission to alumni.",
          fullDesc: "Unified platform for academic administration, learning management (LMS integration), and research commercialization. Supports competency-based education and hybrid learning with MOOC integration. Features smart campus capabilities via RFID.",
          features: [
            "Student Lifecycle: Application to transcript issuance",
            "Learning Analytics: At-risk student identification",
            "Research Mgmt.: Grant budgeting and IP tracking",
            "Accreditation: CUE/NCHE standards automation",
            "Facilities Mgmt.: Digital twin campus modeling"
          ],
          implementation: "Includes parent/student portals and legacy SIS data migration."
        },
        {
          id: 8,
          name: "Transport & Logistics",
          shortDesc: "End-to-end supply chain optimization.",
          fullDesc: "Comprehensive solution for fleet management, route optimization, and warehouse operations. Integrates with telematics for real-time tracking and supports cross-docking operations. Features blockchain-based bill of lading and customs clearance automation.",
          features: [
            "Dynamic Routing: AI-based traffic/weather adaptation",
            "Load Optimization: 3D container packing algorithms",
            "Driver Mgmt.: Electronic logging devices (ELD)",
            "Freight Audit: Automated invoice reconciliation",
            "Cold Chain: Temperature monitoring integration"
          ],
          implementation: "Includes telematics device deployment and carrier onboarding."
        },
        {
          id: 9,
          name: "Oil & Gas ERP",
          shortDesc: "Upstream/downstream operations management.",
          fullDesc: "Specialized solution covering JV accounting, hydrocarbon tracking (API gravity, sulfur content), and HSSE compliance. Integrates with SCADA/PI systems for real-time production monitoring and AFE tracking for CAPEX authorization.",
          features: [
            "Liftings Mgmt.: OPIS price integration",
            "Pipeline Mgmt.: Right-of-way compliance tracking",
            "Refinery Scheduling: Crude slate optimization",
            "CO2 Reporting: GHG protocol calculations",
            "Equipment Certification: API/ASME standards"
          ],
          implementation: "Includes wells/reservoir data integration via PHD."
        },
        {
          id: 10,
          name: "Warehousing Solution",
          shortDesc: "Smart inventory management system.",
          fullDesc: "Advanced WMS with voice picking, put-to-light systems, and 3D bin optimization. Integrates with AMRs for autonomous material movement and supports cross-docking operations. Features cycle counting with RFID verification.",
          features: [
            "Slotting Optimization: AI-based stock placement",
            "Labor Mgmt.: Productivity tracking by operator",
            "Yard Mgmt.: Dock door scheduling",
            "Cold Storage: Temperature zone monitoring",
            "Returns Processing: Automated grading/restocking"
          ],
          implementation: "Includes WMS hardware deployment and integration with MHE."
        }
      ]
    },
    {
      title: "Microsoft Solutions",
      solutions: [
        {
          id: 11,
          name: "Dynamics 365",
          shortDesc: "Unified CRM and ERP platform.",
          fullDesc: "Microsoft's intelligent business applications with industry accelerators for retail, professional services, and non-profits. Combines CRM, ERP, and Power Platform with embedded AI capabilities.",
          features: [
            "Customer Insights: Unified profiles with LinkedIn enrichment",
            "Project Ops: Resource management with financial integration",
            "Commerce: Omnichannel inventory visibility",
            "Supply Chain: IoT-based demand sensing",
            "Fraud Protection: Real-time transaction screening"
          ],
          implementation: "FastTrack migration with data warehouse integration."
        },
        {
          id: 12,
          name: "Microsoft 365",
          shortDesc: "Productivity and collaboration suite.",
          fullDesc: "Integrated cloud platform featuring productivity tools, advanced security, and compliance capabilities. Includes specialized solutions for frontline workers and education.",
          features: [
            "Teams: Virtual whiteboarding and breakout rooms",
            "Purview: Data governance and eDiscovery",
            "Defender: XDR threat protection",
            "Viva: Employee experience platform",
            "Education: LMS integration with assignments"
          ],
          implementation: "Adoption framework with change management support."
        },
        {
          id: 13,
          name: "Azure Cloud",
          shortDesc: "Enterprise cloud computing platform.",
          fullDesc: "Comprehensive IaaS, PaaS, and SaaS offerings with hybrid connectivity through Azure Arc. Specialized solutions for AI, IoT, and mission-critical workloads.",
          features: [
            "Virtual Machines: GPU-accelerated instances",
            "AI Services: Computer vision and NLP models",
            "IoT Hub: Device management at scale",
            "Arc: Unified multicloud management",
            "Mission Critical: 99.99% SLA workloads"
          ],
          implementation: "Cloud adoption framework with landing zone setup."
        },
        {
          id: 14,
          name: "Power Platform",
          shortDesc: "Low-code development tools.",
          fullDesc: "Enables citizen developers to build apps, automate workflows, and analyze data without extensive coding. Integrates seamlessly with Microsoft 365 and Dynamics 365.",
          features: [
            "Power Apps: Model-driven and canvas apps",
            "Power Automate: RPA and API workflows",
            "Power BI: Embedded analytics",
            "Power Pages: External-facing portals",
            "AI Builder: Prebuilt ML models"
          ],
          implementation: "Center of Excellence setup with governance."
        }
      ]
    },
    {
      title: "SAP Solutions",
      solutions: [
        {
          id: 15,
          name: "SAP S/4HANA",
          shortDesc: "Next-generation intelligent ERP.",
          fullDesc: "Real-time suite with embedded AI and machine learning. Available in public cloud, private cloud, and on-premise deployment models. Industry-specific solutions for 25+ verticals.",
          features: [
            "Universal Journal: Single source of financial truth",
            "MRP Live: Real-time material requirements planning",
            "Asset Intelligence Network: Predictive maintenance",
            "Cash Management: Bank communication manager",
            "Sustainability: Scope 1-3 emissions tracking"
          ],
          implementation: "Brownfield/greenfield migration options."
        },
        {
          id: 16,
          name: "SAP Ariba",
          shortDesc: "Procurement and supply chain cloud.",
          fullDesc: "End-to-end source-to-pay solution with supplier network integration. Supports direct and indirect procurement with guided buying.",
          features: [
            "Sourcing: RFx and reverse auctions",
            "Contract Mgmt.: Clause library and AI review",
            "Supplier Risk: Financial health monitoring",
            "Invoice Mgmt.: Machine learning matching",
            "Spot Buy: Catalog-based purchasing"
          ],
          implementation: "Supplier onboarding and catalog migration."
        },
        {
          id: 17,
          name: "SAP SuccessFactors",
          shortDesc: "Cloud HCM suite.",
          fullDesc: "Comprehensive human capital management covering the entire employee lifecycle. Mobile-first design with AI-powered recommendations.",
          features: [
            "Recruiting: Candidate relationship management",
            "Learning: Content curation and skills mapping",
            "Performance: Continuous feedback tools",
            "Compensation: Variable pay calculations",
            "Visa Mgmt.: Work permit expiration alerts"
          ],
          implementation: "HR transformation workshops and data cleansing."
        }
      ]
    },
    {
      title: "ICT Infrastructure",
      solutions: [
        {
          id: 18,
          name: "Hybrid Cloud",
          shortDesc: "Optimized infrastructure stack.",
          fullDesc: "End-to-end solutions from hyperconverged infrastructure to cloud management platforms. Partner solutions from HPE, Cisco, and Oracle.",
          features: [
            "HPE Synergy: Composable infrastructure",
            "Cisco ACI: Microsegmentation networking",
            "Oracle Exadata: High-performance database",
            "Azure Stack: Consistent hybrid services",
            "NVIDIA DGX: AI infrastructure"
          ],
          implementation: "Assessment, design, and deployment services."
        },
        {
          id: 19,
          name: "Cyber Security",
          shortDesc: "Zero trust architecture.",
          fullDesc: "Multi-layered protection with Fortinet, CyberArc, and Microsoft security stacks. SOC services available.",
          features: [
            "FortiGate: Next-gen firewall with SD-WAN",
            "Sentinel: SIEM with UEBA/SOAR",
            "PAM: Privileged access management",
            "DLP: Content-aware protection",
            "Red Teaming: Advanced penetration testing"
          ],
          implementation: "Security posture assessment and IR planning."
        },
        {
          id: 20,
          name: "Data Protection",
          shortDesc: "Backup and disaster recovery.",
          fullDesc: "Comprehensive solutions including Redstor for cloud backup, Azure Site Recovery, and Veeam for enterprise workloads.",
          features: [
            "Azure Backup: Cloud-native protection",
            "Redstor: SaaS application backup",
            "Veeam: VM replication and recovery",
            "DRaaS: Failover testing automation",
            "Air-Gapped: Immutable storage options"
          ],
          implementation: "BCP development and DR drill execution."
        }
      ]
    },
    {
      title: "Bespoke Solutions",
      solutions: [
        {
          id: 21,
          name: "E-Board System",
          shortDesc: "Digital governance platform.",
          fullDesc: "Secure portal for board materials, resolutions, and e-signatures. Integrates with DMS and video conferencing systems.",
          features: [
            "Meeting Mgmt.: Agenda builder and minute taking",
            "Voting: Anonymous polls with audit trails",
            "Document Annotations: Collaborative markups",
            "Compliance: Regulator reporting templates",
            "AI Summaries: Automatic meeting highlights"
          ],
          implementation: "Customized to corporate governance policies."
        },
        {
          id: 22,
          name: "NSE SOKO Play",
          shortDesc: "Virtual trading simulator.",
          fullDesc: "Real-market environment with historical scenarios for training. Used by universities and brokerages.",
          features: [
            "Market Replay: Trade historical periods",
            "Portfolio Challenges: Competitions with rankings",
            "Fundamental Data: Company financials integration",
            "Technical Analysis: Charting tools with indicators",
            "Certification: NSE-approved courses"
          ],
          implementation: "White-label option for financial institutions."
        },
        {
          id: 23,
          name: "Mobile Solutions",
          shortDesc: "Custom mobile applications.",
          fullDesc: "Native iOS and Android apps for enterprise processes, field service, and customer engagement.",
          features: [
            "Bulk SMS: High-volume messaging gateway",
            "USSD: Menu-based mobile interactions",
            "E-Voting: Secure electoral systems",
            "Field Apps: Offline-capable data collection",
            "Biometric Auth: Facial recognition/Fingerprint"
          ],
          implementation: "Agile development with CI/CD pipelines."
        }
      ]
    }
  ];

  const toggleSolution = (id: number) => {
    setExpandedSolution(expandedSolution === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className={`relative bg-gradient-to-r ${themeColor.gradientFrom} ${themeColor.gradientTo} text-white py-24`}>
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center"></div>
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Comprehensive Solutions</h1>
            <p className="text-xl max-w-3xl mx-auto">
              End-to-end technology solutions transforming businesses across industries
            </p>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-16 container mx-auto px-4">
          {solutionCategories.map((category, index) => (
            <div key={index} className="mb-20">
              <div className="flex items-center mb-8">
                <div className={`h-1 w-12 ${themeColor.primary} mr-4`}></div>
                <h2 className={`text-3xl font-bold ${themeColor.text}`}>{category.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.solutions.map((solution) => (
                  <div key={solution.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                    <div className={`${themeColor.primary} p-5`}>
                      <h3 className="text-xl font-bold text-white">{solution.name}</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-700 mb-4">{solution.shortDesc}</p>
                      
                      {expandedSolution === solution.id && (
                        <div className="mb-6 animate-fadeIn">
                          <p className="text-gray-700 mb-4">{solution.fullDesc}</p>
                          <h4 className={`font-semibold ${themeColor.text} mb-2`}>Key Features:</h4>
                          <ul className="space-y-2 mb-4">
                            {solution.features.map((feature, featIndex) => (
                              <li key={featIndex} className="flex items-start">
                                <svg className={`h-5 w-5 ${themeColor.text} mr-2 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <h4 className={`font-semibold ${themeColor.text} mb-2`}>Implementation:</h4>
                          <p className="text-gray-700">{solution.implementation}</p>
                        </div>
                      )}
                      
                      <button
                        onClick={() => toggleSolution(solution.id)}
                        className={`w-full mt-4 ${themeColor.primary} ${themeColor.primaryHover} text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center`}
                      >
                        {expandedSolution === solution.id ? (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Show Less
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            View Details
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* CTA Section */}
        <section className={`${themeColor.primary} text-white py-16`}>
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
              <p className="text-xl mb-8">
                Our solution architects will design a customized technology roadmap for your organization
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to='/contact-us'>
                <button className="bg-white hover:bg-gray-100 text-[#167AA0] font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300">
                  Request Demo
                </button>
                </Link>

              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default SolutionsPage;