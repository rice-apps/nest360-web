export interface NestCountry{ 
    code: 'ET'| 'KE' | 'MW' | 'NG' | 'TZ'; 
    name: string; 
    isSampleData: boolean; 
    description: string; 
    subpageUrl?: string; 
    videoUrl?: string;
    videoTitle?: string; 
    svgPath: string;
    // coordinates/paths for the map
    coordinates: {x: number; y: number};
}
export const AFRICA_MAP_VIEWBOX = '0 0 1000 1001';

// SAMPLE DATA
export const NEST_COUNTRIES: NestCountry[] = [ 
    {
    code: 'ET', 
    name: 'Ethiopia', 
    isSampleData: true, 
    description: 
        '[Sample Content] Nest360 has partenered with the government-led Saving Little Lives (SLL) initiative to form SSL360.',
    subpageUrl: '/SLL360',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with real NEST360 embed URL later
    videoTitle: 'Nest360 Ethiopia Program Overview (Sample)',
    svgPath:'m 754.8,310.3 -3.3,10.4 -14.3,-2.9 -1.4,11.9 -4.5,13.6 -7.1,6.8 -4.8,10.6 -1.1,5.7 -5.6,3.8 -3.3,14.5 0.1,1.7 0.4,10.8 -1.8,4.2 -6.4,0.3 -4,7.9 7.5,1 6.3,6.7 2.2,5.6 5.7,3.2 7.4,15 6.4,2.4 0.1,7.7 4.2,4.6 8.5,0 15.7,11.7 3.8,0.2 2.9,-0.4 2.7,1.6 8.2,1.1 3.5,-5.8 11.1,-5.8 4.9,4.7 8.4,0 3.3,-4.4 7.8,-0.2 10.7,-9.8 15.9,-0.6 33.5,-41.5 -10.3,0.1 -40.3,-16.4 -4.8,-5 -4.6,-6.6 -4.8,-7.7 2.5,-4.9 -2.8,-2.4 -2.9,0.9 -6.8,-0.2 -0.3,-4.2 -1.1,-3.8 3.9,-6.5 4,-6.1 -4.3,-4.5 -5.4,-8.1 -5.5,-4.4 -3.4,-4.8 -10.8,-5.6 -8.3,-0.1 -3,-2.9 -7,3.2 -7.6,-6.3 z',
    coordinates: {x:775, y:392},
    },
    {
    code: 'KE',
    name: 'Kenya',
    isSampleData: true,
    description:
      '[Sample Content] Through partnerships with hospitals, governments, and other development partners, we catalyze country-led change to deliver a package of lifesaving technologies, support and maintain an education ecosystem, and enable locally-owned data used to drive action to improve quality newborn care, increase investment, and change policy.',
    subpageUrl: '/kenya',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'NEST360 Kenya Implementation (Sample)',
    svgPath:'m 807.2,463.1 -8.4,0 -4.9,-4.7 -11.1,5.8 -3.5,5.8 -8.2,-1.1 -2.7,-1.6 -2.9,0.4 -3.8,-0.2 -15.7,-11.7 -8.5,0 -4.2,-4.6 -0.1,-7.7 -6.4,-2.4 -8.1,9.1 -7.4,8.3 5.9,9.6 1.5,7 5.5,15.8 -4.4,10.1 -5.9,9.2 -3.5,5.6 0,0.7 2.9,5.2 -0.8,10.3 44.1,28.2 0.7,8 17.3,13.8 5,-4.6 2.5,-9.2 4,-5.5 1.9,-9.8 4.6,-1 3.1,-5.8 8.6,-5.5 -7.2,-11.4 -0.4,-50.4 10.5,-15.7 z' ,
    coordinates: { x: 762, y: 505},
  },
  {
    code: 'MW',
    name: 'Malawi',
    isSampleData: true,
    description:
        '[Sample Content] Through partnerships with hospitals, governments, and other development partners, we catalyze country-led change to deliver a package of lifesaving technologies, support and maintain an education ecosystem, and enable locally-owned data used to drive action to improve quality newborn care, increase investment, and change policy.',
    subpageUrl: '/malawi',
    svgPath: 'm 714.6,711.7 0.3,-5.2 -2.7,-4.1 0.4,-6 -3.3,-10.2 3.7,-7.7 -0.2,-16.7 -4.1,-8.9 0.4,-1.5 0,0 -2.3,-3.8 -11.9,-2.6 5.6,6.2 2.8,11.7 -2.2,3.8 -2.7,11.2 2,11.5 -4,4.8 -4.1,12.8 6.2,3.6 6.8,6.6 3.3,-1.2 4.7,3.5 0.5,5.5 -2.9,6.5 0.5,9.7 7.5,8.6 4.1,-9.6 5.4,-3 -0.3,-17.8 -4.6,-10 -4.2,-4.4 -0.7,0 0.1,1.9 2.3,0.5 2.2,7.4 -0.4,1.7 -4.1,-5.3 -2.2,3.4 -1.9,-2.9 z',
    coordinates: { x: 705, y: 690 },
  },
  {
    code: 'NG',
    name: 'Nigeria',
    isSampleData: true,
    description:
        '[Sample Content] Through partnerships with hospitals, governments, and other development partners, we catalyze country-led change to deliver a package of lifesaving technologies, support and maintain an education ecosystem, and enable locally-owned data used to drive action to improve quality newborn care, increase investment, and change policy.',
    subpageUrl: '/nigeria',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', //Fake for now
    videoTitle: 'NEST360 Nigeria Newborn Care Network (Sample)',
    svgPath: 'm 468.2,344.6 -2.2,0.3 -8.4,-15.1 -2.9,-0.6 -9.4,7.7 -9.4,-4 -6.5,-0.8 -3.5,1.9 -7.1,-0.4 -7.1,5.9 -6.2,0.3 -14.7,-7.1 -5.8,3.4 -6.1,-0.2 -4.6,-5.3 -12.2,-5.1 -13,1.6 -3.2,3 -1.6,8 -3.5,5.5 -0.8,12.4 -0.5,4.6 2.8,8.2 -2.4,5.6 1.3,3.7 -5.9,8.5 -3.7,4.3 -2.3,8.7 0.3,8.8 -0.6,22.3 10.7,0 9.2,-0.1 8.6,9.1 4.1,10 6.5,8.6 9.8,0.3 4.7,-3.1 4.6,0.8 12.7,-5 3.1,-9.8 5.7,-13.4 3.6,-0.1 7.2,-8.1 4.6,-0.2 6.9,5.7 8.3,-4.7 1.1,-5.7 2.7,-5.6 1.9,-7 6.4,-5.7 2.4,-9.7 2.6,-3.1 1.6,-7.2 3.1,-8.8 10.2,-10.7 0.5,-4.6 1.3,-2.5 -4.9,-5.5 z',
    coordinates: { x: 395, y: 390 },
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    isSampleData: true,
    description:
        '[Sample Content] Through partnerships with hospitals, governments, and other development partners, we catalyze country-led change to deliver a package of lifesaving technologies, support and maintain an education ecosystem, and enable locally-owned data used to drive action to improve quality newborn care, increase investment, and change policy.',
    svgPath: 'm 672.2,531.3 -4.3,1.7 4.8,7.8 -0.8,8.1 -3.5,1.8 0,0 0.6,5.4 2.6,3.2 0.1,4.5 -3,2.9 -4.9,7.2 -4.5,5 -1.2,0.2 -0.7,5.9 2.3,2 -0.5,5.9 2.3,5.5 -2.9,5.3 9.7,9.4 0.8,8.5 5.9,14.2 0,0 0.6,0.4 4.8,2.3 7.7,2.4 6.8,4.1 11.9,2.6 2.3,3.8 0,0 0.8,-2.7 6.2,7.4 0.6,14.5 3.9,5.3 -0.1,0.2 4.7,-0.5 14.4,3.9 3.3,-1.8 8.4,-0.3 4.5,-4.2 7.3,0.2 13.4,-5.3 10,-8.1 0,0 -4.4,-3 -4.7,-13.6 -4,-8.7 1,-6.6 -0.6,-4.2 3.5,-8.4 -0.3,-3.6 -7.7,-5 -0.6,-7.8 5.9,-17.1 -17.3,-13.8 -0.7,-8 -44.1,-28.2 0,0 -6,6.1 -4.1,6.3 4.8,4.7 -7,3.4 -1.5,-1.6 -7.1,0.9 -5.5,3.1 -3.3,-5.4 2.3,-9.7 0.5,-8.3 0,0 0,0 -13.4,-0.2 z',
    // example without subpageUrl & videoUrl to test optional handling
    coordinates: { x: 715, y: 610 },
  },

];