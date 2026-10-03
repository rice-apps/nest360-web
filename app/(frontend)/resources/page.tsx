import React from 'react';

export interface Resource {
  id: string;
  category: 'healthcare' | 'innovators' | 'implementors' | 'families' | 'dashboards';
  title: string;
  description: string;
  image?: string;
}

const RESOURCES_DATA: Resource[] = [
    //healthcare workers
  
  {
    id: '1',
    category: 'healthcare',
    title: 'Training Videos',
    description: 'Training videos demonstrate model-specific equipment setup, use, and maintenance and are used as training aids in clinical and technical training.',
  },
  {
    id: '2',
    category: 'healthcare',
    title: 'Orientation for Staff Video',
    description: 'This orientation video introduces healthcare workers and students to the neonatal intensive care unit (NICU) and its importance in saving newborn lives.',
  },
  {
    id: '3',
    category: 'healthcare',
    title: 'Clinical Modules',
    description: 'Clinical education modules prepare healthcare staff and students to understand when and how to safely and effectively use equipment essential to newborn care.',
  },
  {
    id: '4',
    category: 'healthcare',
    title: 'BME/T Modules',
    description: 'BME/T education modules prepare biomedical technicians on the technical use of technologies for newborn care in resource limited settings.',
  },
  // innovators + manufacturers 
  {
    id: '5',
    category: 'innovators',
    title: 'Target Product Profiles for Newborn Care',
    description: 'In collaboration with UNICEF, NEST360 developed the target product profiles (TPPs) which list a proposed set of performance & operational characteristics for 16 newborn products.',
  },
  {
    id: '6',
    category: 'innovators',
    title: 'NEST360 Qualified Technologies for Small & Sick Newborn Care',
    description: 'The NEST360 Qualified Technologies are a list of newborn care technologies best suited for use in low-resource setting hospitals, including being effective, affordable, rugged, and simple to use.',
  },
  {
    id: '7',
    category: 'innovators',
    title: 'Newborn & Maternal Technology Landscape',
    description: 'A compendium of newborn & maternal healthcare technologies, both commercially available and in development, suited for use in resource-limited settings.',
  },
  {
    id: '8',
    category: 'innovators',
    title: 'Newborn & Maternal Technology Landscape Survey',
    description: 'Do you have a technology that you would like to be considered for the next edition of the Newborn & Maternal Technology Landscape? If so, please fill out our survey form.',
  },
  //Implementors 
  {
    id: '9', 
    category: 'implementors', 
    title: "Implementation Toolkit", 
    description: 'The Implementation Toolkit for small and sick newborn care, codesigned by UNICEF and NEST360, is an open-access, online toolkit enabling implementors to reach every newborn.'
  }
];

export default function ResourcesPage() {
  const healthcareResources = RESOURCES_DATA.filter((r) => r.category === 'healthcare');
  const innovatorResources = RESOURCES_DATA.filter((r) => r.category === 'innovators');
  const implementorResources = RESOURCES_DATA.filter((r)=> r.category ==='implementors');

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      {/* search header section */}
      <section className="bg-white py-12 px-4 border-b border-gray-100 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">Resources</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed">
            Our resources support clinicians, engineers, and administrators to implement an evidence-based model for sustainable, high-quality hospital-based newborn care in limited-resource settings.
          </p>

          <div className="flex max-w-2xl mx-auto mt-6 shadow-sm rounded-md overflow-hidden border border-gray-200">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 px-4 py-3 outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
            <button className="bg-[#41B6C4] text-white px-8 font-medium hover:bg-[#3298a4] transition-colors text-sm">
              Search
            </button>
          </div>
        </div>
      </section>

     

      {/* results section */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* healthcare */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0A4162] mb-6">
            Resources for healthcare professionals & BMETs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {healthcareResources.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="h-44 bg-[#0A4162] flex items-center justify-center p-4">
                  <span className="text-white text-xs font-semibold text-center uppercase tracking-wider">
                    {item.title}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-[#41B6C4] text-sm mb-2">{item.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* innovators*/}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0A4162] mb-6">
            Resources for innovators & manufacturers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {innovatorResources.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="h-44 bg-[#0A4162] flex items-center justify-center p-4">
                  <span className="text-white text-xs font-semibold text-center uppercase tracking-wider">
                    {item.title}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-[#41B6C4] text-sm mb-2">{item.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/*implentors*/}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0A4162] mb-6">
            Resources for Implementors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {implementorResources.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="h-44 bg-[#0A4162] flex items-center justify-center p-4">
                  <span className="text-white text-xs font-semibold text-center uppercase tracking-wider">
                    {item.title}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-[#41B6C4] text-sm mb-2">{item.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


      </div>
    </main>
  );
}