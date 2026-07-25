export type Service = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  summary: string;
  intro: string;
  benefits: string[];
  process: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
};

export const services: Service[] = [
  {
    id: "solar-panels",
    number: "01",
    title: "Solar panels",
    shortTitle: "Solar",
    summary: "Generate cleaner electricity at home and reduce dependence on the grid.",
    intro: "A well-designed solar PV system can help your home produce its own electricity, reduce grid use and support a lower-carbon lifestyle.",
    benefits: ["Lower grid dependence", "Cleaner home energy", "Professional installation", "Designed around your roof and usage"],
    process: [
      { title: "Initial assessment", text: "We review your property, roof suitability and household energy use." },
      { title: "System design", text: "A suitable layout and system size are planned around your home." },
      { title: "Installation", text: "Qualified installers complete the work and explain your new system." },
      { title: "Handover", text: "You receive clear guidance on monitoring, care and next steps." }
    ],
    faqs: [
      { question: "Is every roof suitable for solar panels?", answer: "Suitability depends on roof condition, orientation, shading, available space and other property-specific factors." },
      { question: "Can solar panels reduce electricity bills?", answer: "They can reduce the amount of electricity purchased from the grid, although results vary by system size, usage and generation." }
    ]
  },
  {
    id: "loft-insulation",
    number: "02",
    title: "Loft insulation",
    shortTitle: "Loft insulation",
    summary: "Slow heat loss through the roof and keep living spaces warmer for longer.",
    intro: "Effective loft insulation helps retain warmth, improve comfort and reduce the energy needed to heat your home.",
    benefits: ["Better heat retention", "Improved comfort", "Lower household energy demand", "Straightforward installation in suitable homes"],
    process: [
      { title: "Loft survey", text: "We inspect access, existing insulation, ventilation and suitability." },
      { title: "Recommendation", text: "The right material and depth are selected for the property." },
      { title: "Installation", text: "Insulation is installed carefully around services and ventilation paths." },
      { title: "Quality check", text: "The completed work is checked and aftercare guidance is provided." }
    ],
    faqs: [
      { question: "Can existing loft insulation be topped up?", answer: "Often yes, subject to condition, ventilation and the findings of a property survey." },
      { question: "Will the loft still be usable for storage?", answer: "Storage options depend on the loft layout and may require a suitable raised boarding solution." }
    ]
  },
  {
    id: "cavity-wall-insulation",
    number: "03",
    title: "Cavity wall insulation",
    shortTitle: "Cavity wall",
    summary: "Improve the thermal performance of suitable external cavity walls.",
    intro: "For suitable properties, filling the wall cavity can reduce heat loss and help maintain a more stable indoor temperature.",
    benefits: ["Reduced wall heat loss", "Stable indoor temperature", "Whole-home efficiency", "Minimal internal disruption"],
    process: [
      { title: "Property checks", text: "Wall type, exposure, condition and cavity suitability are assessed." },
      { title: "Technical survey", text: "The cavity is inspected and installation requirements are confirmed." },
      { title: "Installation", text: "Insulation is installed through carefully positioned external access points." },
      { title: "Finish and review", text: "Access points are made good and the installation is checked." }
    ],
    faqs: [
      { question: "Are all cavity walls suitable?", answer: "No. Suitability depends on construction, cavity condition, exposure and signs of damp or defects." },
      { question: "How is cavity wall insulation installed?", answer: "Small access holes are formed externally, insulation is installed into the cavity and the finish is made good." }
    ]
  },
  {
    id: "internal-wall-insulation",
    number: "04",
    title: "Internal wall insulation",
    shortTitle: "Internal wall",
    summary: "Improve solid-wall performance from inside the property.",
    intro: "Internal wall insulation can improve warmth in solid-wall homes where an external solution is not suitable or preferred.",
    benefits: ["Improved room comfort", "Reduced heat loss", "Suitable for selected solid-wall homes", "Room-by-room planning"],
    process: [
      { title: "Building assessment", text: "Wall condition, moisture risk and room layout are reviewed." },
      { title: "Detail design", text: "Insulation, finishes and junction details are planned carefully." },
      { title: "Installation", text: "The internal system is fitted with attention to services and ventilation." },
      { title: "Decoration-ready finish", text: "The surface is completed ready for final decorative finishes." }
    ],
    faqs: [
      { question: "Does internal insulation reduce room size?", answer: "It uses a small amount of internal floor area, with the exact impact depending on the chosen system." },
      { question: "Can it be installed one room at a time?", answer: "In some properties a phased approach is possible, but junctions and moisture management must be considered." }
    ]
  },
  {
    id: "external-wall-insulation",
    number: "05",
    title: "External wall insulation",
    shortTitle: "External wall",
    summary: "Wrap suitable solid-wall homes with a high-performance external system.",
    intro: "External wall insulation can transform thermal performance while renewing the outside appearance of a suitable property.",
    benefits: ["Strong thermal improvement", "Reduced draughts and cold surfaces", "No loss of internal floor space", "Fresh external finish"],
    process: [
      { title: "Survey and design", text: "The walls, rooflines, openings and property details are assessed." },
      { title: "Preparation", text: "Surfaces and necessary building details are prepared for the system." },
      { title: "Insulation system", text: "Boards, reinforcement and protective layers are installed." },
      { title: "Final finish", text: "A suitable weather-resistant finish is applied and inspected." }
    ],
    faqs: [
      { question: "Will the outside of the house look different?", answer: "Yes. The system includes a new external finish, with options depending on the property and scheme." },
      { question: "Is planning permission required?", answer: "Requirements vary by property type, location and the proposed appearance, so this must be checked." }
    ]
  },
  {
    id: "air-source-heat-pumps",
    number: "06",
    title: "Air source heat pumps",
    shortTitle: "Heat pumps",
    summary: "Move towards efficient, lower-carbon home heating with expert guidance.",
    intro: "An air source heat pump extracts heat from outside air and can provide efficient heating when correctly designed around the home.",
    benefits: ["Efficient heating", "Lower-carbon technology", "Designed around your property", "Works best as part of a whole-home plan"],
    process: [
      { title: "Heat-loss survey", text: "The home, insulation level, emitters and heating demand are assessed." },
      { title: "System design", text: "Equipment, output and distribution requirements are calculated." },
      { title: "Installation", text: "The outdoor unit and internal heating components are installed." },
      { title: "Commissioning", text: "The system is set up, tested and explained to the household." }
    ],
    faqs: [
      { question: "Do heat pumps work in winter?", answer: "Yes. Correctly selected systems are designed to operate in cold weather, although efficiency varies with conditions." },
      { question: "Will radiators need changing?", answer: "Sometimes. The design survey determines whether existing radiators are suitable or need upgrading." }
    ]
  },
  {
    id: "heating-controls",
    number: "07",
    title: "Heating and smart controls",
    shortTitle: "Smart controls",
    summary: "Upgrade heating performance and take greater control of household comfort.",
    intro: "Modern controls help households heat the right spaces at the right times and understand system performance more clearly.",
    benefits: ["Better temperature control", "Smarter schedules", "Improved system efficiency", "Simple everyday use"],
    process: [
      { title: "System review", text: "We assess the existing heating setup and control options." },
      { title: "Control plan", text: "Suitable thermostats, zones or smart controls are selected." },
      { title: "Installation", text: "Controls are fitted and connected to the heating system." },
      { title: "Setup guidance", text: "Schedules and key features are configured and explained." }
    ],
    faqs: [
      { question: "Can smart controls work with an older boiler?", answer: "Compatibility varies, so the existing boiler and wiring arrangements need to be checked." },
      { question: "Do I need a smartphone?", answer: "Many systems offer app control, while some also provide straightforward physical controls." }
    ]
  },
  {
    id: "epc-support",
    number: "08",
    title: "EPC improvement support",
    shortTitle: "EPC support",
    summary: "Understand the measures that can improve your home's energy performance.",
    intro: "We help turn energy-performance information into a practical improvement plan, prioritised around the property and household.",
    benefits: ["Clear recommendations", "Whole-home planning", "Eligibility guidance", "Prioritised next steps"],
    process: [
      { title: "Review", text: "Existing EPC information and property details are considered." },
      { title: "Assessment", text: "Likely improvement opportunities are identified." },
      { title: "Priorities", text: "Measures are ordered around impact, suitability and budget or funding." },
      { title: "Action plan", text: "You receive a clear route for moving the property forward." }
    ],
    faqs: [
      { question: "What does an EPC rating show?", answer: "It provides an assessment of a property's energy performance and includes suggested improvements." },
      { question: "Can Warm Life help with funding eligibility?", answer: "We can collect initial details and guide you through the next eligibility steps for relevant schemes or options." }
    ]
  }
];

export function getService(id: string) {
  return services.find((service) => service.id === id);
}
