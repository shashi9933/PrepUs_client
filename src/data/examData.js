import { Award, Building2, Briefcase, Users, Train, Globe, Building, FileText } from 'lucide-react';

export const exams = [
    {
        id: 'sbi-po',
        title: 'SBI PO 2026',
        subtitle: 'State Bank of India – Probationary Officer',
        icon: Briefcase,
        category: 'Banking',
        quickInfo: {
            conductingBody: 'SBI',
            level: 'National',
            mode: 'Online (Pre + Mains) + Interview',
            frequency: 'Annually',
            vacancies: '2000+ (Expected)'
        },
        dates: {
            notification: 'Sep 2026',
            applicationStart: 'Oct 2026',
            admitCard: 'Nov 2026',
            examDate: 'Dec 2026',
            result: 'Jan 2027'
        },
        eligibility: {
            nationality: 'Citizen of India',
            education: 'Graduation in any discipline from a recognized University',
            age: { min: 21, max: 30 },
            ageRelaxation: { sc_st: 5, obc: 3, pwd: 10, general: 0 },
            attempts: { general: 4, obc: 7, sc_st: 'Unlimited', pwd: 7 }
        },
        pattern: [
            {
                phase: 'Prelims',
                sections: [
                    { name: 'English Language', questions: 30, marks: 30, duration: '20 min' },
                    { name: 'Quantitative Aptitude', questions: 35, marks: 35, duration: '20 min' },
                    { name: 'Reasoning Ability', questions: 35, marks: 35, duration: '20 min' }
                ],
                totalQuestions: 100,
                totalMarks: 100,
                totalDuration: '60 min'
            },
            {
                phase: 'Mains',
                sections: [
                    { name: 'Reasoning & Computer Aptitude', questions: 40, marks: 50, duration: '50 min' },
                    { name: 'Data Analysis & Interpretation', questions: 30, marks: 50, duration: '45 min' },
                    { name: 'General/Economy/Banking Awareness', questions: 50, marks: 60, duration: '45 min' },
                    { name: 'English Language', questions: 35, marks: 40, duration: '40 min' }
                ],
                totalQuestions: 155,
                totalMarks: 200,
                totalDuration: '3 hours'
            }
        ],
        syllabus: {
            'Quantitative Aptitude': [
                'Simplification',
                'Quadratic Equations',
                'Data Interpretation',
                'Number Series',
                'Profit & Loss',
                'Time & Work',
                'Simple & Compound Interest',
                'Time, Speed & Distance'
            ],
            'Reasoning Ability': [
                'Puzzles & Seating Arrangement',
                'Syllogism',
                'Blood Relations',
                'Direction Sense',
                'Coding-Decoding',
                'Inequality',
                'Input-Output'
            ],
            'English Language': [
                'Reading Comprehension',
                'Cloze Test',
                'Para Jumbles',
                'Error Spotting',
                'Fillers',
                'Vocabulary'
            ],
            'General Awareness': [
                'Current Affairs (Last 6 months)',
                'Banking Awareness',
                'Financial Awareness',
                'RBI Circulars'
            ]
        },
        salary: {
            basic: '41960',
            gross: '65000 - 70000',
            deductions: '12000 (Approx)',
            inHand: '55000 - 58000',
            allowances: [
                'Dearness Allowance (DA)',
                'House Rent Allowance (HRA)',
                'City Compensatory Allowance (CCA)',
                'Medical Allowance',
                'Travel Allowance'
            ],
            careerGrowth: 'Probationary Officer -> Deputy Manager -> Manager -> Chief Manager -> AGM -> DGM -> GM -> CGM -> DMD -> MD -> Chairman'
        },
        mockTests: [
            { id: 'sbi-po-mock-1', title: 'SBI PO Prelims Full Mock 1', type: 'Free', questions: 100, time: 60 },
            { id: 'sbi-po-mock-2', title: 'SBI PO Prelims Full Mock 2', type: 'Premium', questions: 100, time: 60 },
            { id: 'sbi-po-sect-1', title: 'Quant Sectional Test 1', type: 'Free', questions: 35, time: 20 }
        ],
        faqs: [
            { question: 'Is there any percentage criteria in graduation for SBI PO?', answer: 'No, you just need to be a graduate. There is no minimum percentage requirement.' },
            { question: 'What is the age limit for General category?', answer: 'The age limit is 21 to 30 years.' },
            { question: 'Is there sectional cutoff in SBI PO Prelims?', answer: 'No, there is NO sectional cutoff in SBI PO Prelims or Mains. Only overall cutoff applies.' }
        ]
    },
    {
        id: 'rbi-grade-b',
        title: 'RBI Grade B',
        subtitle: 'Reserve Bank of India – Grade B Officer',
        icon: Building,
        category: 'Regulatory',
        quickInfo: {
            conductingBody: 'RBI',
            level: 'National',
            mode: 'Online (Phase 1 & 2) + Interview',
            frequency: 'Annually',
            vacancies: '290+'
        },
        dates: {
            notification: 'Apr 2026',
            applicationStart: 'May 2026',
            admitCard: 'Jun 2026',
            examDate: 'Jul 2026',
            result: 'Aug 2026'
        },
        eligibility: {
            nationality: 'Citizen of India',
            education: 'Graduation (60%) or Post Graduation (55%)',
            age: { min: 21, max: 30 },
            ageRelaxation: { sc_st: 5, obc: 3, pwd: 10, general: 0 },
            attempts: { general: 6, obc: 7, sc_st: 'Unlimited', pwd: 'Unlimited' }
        },
        pattern: [
            {
                phase: 'Phase 1 (Prelims)',
                sections: [
                    { name: 'General Awareness', questions: 80, marks: 80, duration: '25 min' },
                    { name: 'Reasoning', questions: 60, marks: 60, duration: '45 min' },
                    { name: 'English', questions: 30, marks: 30, duration: '25 min' },
                    { name: 'Quant', questions: 30, marks: 30, duration: '25 min' }
                ],
                totalQuestions: 200,
                totalMarks: 200,
                totalDuration: '120 min'
            }
        ],
        syllabus: {
            'General Awareness': ['Government Schemes', 'RBI Circulars', 'Reports & Indices'],
            'Reasoning': ['Puzzles', 'Logical Reasoning', 'Input-Output'],
            'Quant': ['Data Interpretation', 'Arithmetic', 'Number Series']
        },
        salary: {
            basic: '55200',
            gross: '1,16,000+',
            inHand: '90000 - 95000',
            allowances: ['Highest Perks in Banking Sector', 'Accommodation', 'Vehicle', 'Education Allowance'],
            careerGrowth: 'Assistant Manager -> Manager -> AGM -> DGM -> GM -> CGM -> Executive Director -> Deputy Governor -> Governor'
        },
        mockTests: [],
        faqs: []
    },
    {
        id: 'upsc-cse',
        title: 'UPSC CSE',
        subtitle: 'Union Public Service Commission',
        icon: Award,
        category: 'UPSC',
        quickInfo: {
            conductingBody: 'UPSC',
            level: 'National',
            mode: 'Offline (Prelims + Mains) + Interview',
            frequency: 'Annually',
            vacancies: '1000+'
        },
        dates: {
            notification: 'Feb 2026',
            applicationStart: 'Feb 2026',
            admitCard: 'May 2026',
            examDate: 'May 2026',
            result: 'Jun 2026'
        },
        eligibility: {
            nationality: 'Citizen of India',
            education: 'Graduation',
            age: { min: 21, max: 32 },
            ageRelaxation: { sc_st: 5, obc: 3, pwd: 10, general: 0 },
            attempts: { general: 6, obc: 9, sc_st: 'Unlimited', pwd: 9 }
        },
        pattern: [],
        syllabus: {},
        salary: { basic: '56100', gross: '85000+', allowances: [] },
        mockTests: [],
        faqs: []
    },
    // --- BANKING ---
    {
        id: 'ibps-po',
        title: 'IBPS PO 2026',
        subtitle: 'Institute of Banking Personnel Selection',
        icon: Briefcase,
        category: 'Banking',
        quickInfo: { conductingBody: 'IBPS', level: 'National', mode: 'Online', frequency: 'Annually', vacancies: '3000+' },
        dates: { notification: 'Aug 2026', examDate: 'Oct 2026' },
        eligibility: { nationality: 'Indian', education: 'Graduate', age: { min: 20, max: 30 }, attempts: { general: 'Unlimited' }, ageRelaxation: { sc_st: 5, obc: 3, pwd: 10, general: 0 } },
        pattern: [], syllabus: {}, salary: { basic: '36000', gross: '57000', careerGrowth: 'PO -> Manager -> GM' },
        mockTests: [], faqs: []
    },
    // --- SSC ---
    {
        id: 'ssc-cgl',
        title: 'SSC CGL 2026',
        subtitle: 'Combined Graduate Level',
        icon: Building2,
        category: 'SSC',
        quickInfo: { conductingBody: 'SSC', level: 'National', mode: 'Online', frequency: 'Annually', vacancies: '7500+' },
        dates: { notification: 'Jun 2026', examDate: 'Sep 2026' },
        eligibility: { nationality: 'Indian', education: 'Graduate', age: { min: 18, max: 32 }, attempts: { general: 'Unlimited' }, ageRelaxation: { sc_st: 5, obc: 3, pwd: 10, general: 0 } },
        pattern: [], syllabus: {}, salary: { basic: '47600', gross: '70000', careerGrowth: 'Inspector -> Superintendent' },
        mockTests: [], faqs: []
    },
    {
        id: 'ssc-chsl',
        title: 'SSC CHSL 2026',
        subtitle: 'Combined Higher Secondary Level',
        icon: Building2,
        category: 'SSC',
        quickInfo: { conductingBody: 'SSC', level: 'National', mode: 'Online', frequency: 'Annually', vacancies: '4000+' },
        dates: { notification: 'May 2026', examDate: 'Aug 2026' },
        eligibility: { nationality: 'Indian', education: '12th Pass', age: { min: 18, max: 27 }, attempts: { general: 'Unlimited' }, ageRelaxation: { sc_st: 5, obc: 3, pwd: 10, general: 0 } },
        pattern: [], syllabus: {}, salary: { basic: '19900', gross: '35000', careerGrowth: 'LDC -> UDC' },
        mockTests: [], faqs: []
    },
    // --- DEFENCE ---
    {
        id: 'nda',
        title: 'NDA & NA I 2026',
        subtitle: 'National Defence Academy',
        icon: Users,
        category: 'Defence',
        quickInfo: { conductingBody: 'UPSC', level: 'National', mode: 'Offline', frequency: 'Twice a year', vacancies: '400' },
        dates: { notification: 'Dec 2025', examDate: 'Apr 2026' },
        eligibility: { nationality: 'Indian', education: '12th Pass', age: { min: 16.5, max: 19.5 }, attempts: { general: 'Unlimited' }, ageRelaxation: { sc_st: 0, obc: 0, pwd: 0, general: 0 } },
        pattern: [], syllabus: {}, salary: { basic: '56100', gross: '85000', careerGrowth: 'Lieutenant -> Captain -> Major' },
        mockTests: [], faqs: []
    },
    {
        id: 'cds',
        title: 'CDS I 2026',
        subtitle: 'Combined Defence Services',
        icon: Users,
        category: 'Defence',
        quickInfo: { conductingBody: 'UPSC', level: 'National', mode: 'Offline', frequency: 'Twice a year', vacancies: '340' },
        dates: { notification: 'Dec 2025', examDate: 'Apr 2026' },
        eligibility: { nationality: 'Indian', education: 'Graduate', age: { min: 19, max: 25 }, attempts: { general: 'Unlimited' }, ageRelaxation: { sc_st: 0, obc: 0, pwd: 0, general: 0 } },
        pattern: [], syllabus: {}, salary: { basic: '56100', gross: '85000', careerGrowth: 'Lieutenant -> Captain -> Major' },
        mockTests: [], faqs: []
    },
    // --- RAILWAYS ---
    {
        id: 'rrb-ntpc',
        title: 'RRB NTPC 2026',
        subtitle: 'Non-Technical Popular Categories',
        icon: Train,
        category: 'Railways',
        quickInfo: { conductingBody: 'RRB', level: 'National', mode: 'Online', frequency: 'Irregular', vacancies: '10000+' },
        dates: { notification: 'TBD', examDate: 'TBD' },
        eligibility: { nationality: 'Indian', education: '12th / Graduate', age: { min: 18, max: 33 }, attempts: { general: 'Unlimited' }, ageRelaxation: { sc_st: 5, obc: 3, pwd: 10, general: 0 } },
        pattern: [], syllabus: {}, salary: { basic: '19900 - 35400', gross: '30000 - 60000', careerGrowth: 'Station Master -> Controller' },
        mockTests: [], faqs: []
    },
    // --- STATE PSC ---
    {
        id: 'uppcs',
        title: 'UPPCS 2026',
        subtitle: 'Uttar Pradesh Public Service Commission',
        icon: Globe,
        category: 'State PSC',
        quickInfo: { conductingBody: 'UPPSC', level: 'State', mode: 'Offline', frequency: 'Annually', vacancies: '300+' },
        dates: { notification: 'Jan 2026', examDate: 'Mar 2026' },
        eligibility: { nationality: 'Indian', education: 'Graduate', age: { min: 21, max: 40 }, attempts: { general: 'Unlimited' }, ageRelaxation: { sc_st: 5, obc: 3, pwd: 15, general: 0 } },
        pattern: [], syllabus: {}, salary: { basic: '56100', gross: '75000', careerGrowth: 'SDM -> ADM' },
        mockTests: [], faqs: []
    },
    // --- INSURANCE ---
    {
        id: 'lic-aao',
        title: 'LIC AAO 2026',
        subtitle: 'Assistant Administrative Officer',
        icon: Building,
        category: 'Insurance',
        quickInfo: { conductingBody: 'LIC', level: 'National', mode: 'Online', frequency: 'Irregular', vacancies: '300+' },
        dates: { notification: 'Jan 2026', examDate: 'Mar 2026' },
        eligibility: { nationality: 'Indian', education: 'Graduate', age: { min: 21, max: 30 }, attempts: { general: 'Unlimited' }, ageRelaxation: { sc_st: 5, obc: 3, pwd: 10, general: 0 } },
        pattern: [], syllabus: {}, salary: { basic: '53600', gross: '92000', careerGrowth: 'AAO -> AO -> ADM' },
        mockTests: [], faqs: []
    },
    // --- TEACHING ---
    {
        id: 'ctet',
        title: 'CTET July 2026',
        subtitle: 'Central Teacher Eligibility Test',
        icon: FileText,
        category: 'Teaching',
        quickInfo: { conductingBody: 'CBSE', level: 'National', mode: 'Offline', frequency: 'Twice a year', vacancies: 'Qualifying' },
        dates: { notification: 'Mar 2026', examDate: 'Jul 2026' },
        eligibility: { nationality: 'Indian', education: 'B.Ed / D.El.Ed', age: { min: 18, max: 'No Limit' }, attempts: { general: 'Unlimited' }, ageRelaxation: { sc_st: 0, obc: 0, pwd: 0, general: 0 } },
        pattern: [], syllabus: {}, salary: { basic: '35400 - 47600', gross: '45000 - 60000', careerGrowth: 'PRT -> TGT -> PGT' },
        mockTests: [], faqs: []
    }
];

export const getExamById = (id) => exams.find(e => e.id === id);
