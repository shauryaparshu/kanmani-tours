/**
 * Shared tour data for use in both server and client components.
 */

export const TOURS_DATA = [
    {
        id: 1,
        category: 'Celebrity',
        startDate: new Date('2026-03-10'),
        endDate: new Date('2026-03-14'),
        cities: 'Chennai, Polichoalur',
        priceJPY: 250000,
        seatsLeft: 4,
        features: [
            'Exclusive star meet & greet',
            'Studio tour with live shooting access',
            'VIP dinner with local cinema critics'
        ]
    },
    {
        id: 2,
        category: 'Food',
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
        cities: 'Hyderabad, Secunderabad',
        priceJPY: 180000,
        seatsLeft: 7,
        features: [
            'Traditional Hyderabadi Dum Biryani workshop',
            'Nizam-style royal dining experience',
            'Irani Chai & food trail through Old City'
        ]
    },
    {
        id: 3,
        category: 'Cultural',
        startDate: new Date('2026-06-05'),
        endDate: new Date('2026-06-12'),
        cities: 'Madurai, Thanjavur, Mamallapuram',
        priceJPY: 320000,
        seatsLeft: 2,
        features: [
            'Meenakshi Temple private architectural tour',
            'Ancient UNESCO site photography workshop',
            'Traditional Bharatanatyam performance'
        ]
    },
    {
        id: 4,
        category: 'Celebrity',
        startDate: new Date('2026-08-15'),
        endDate: new Date('2026-08-20'),
        cities: 'Bangalore, Mysore',
        priceJPY: 275000,
        seatsLeft: 10,
        features: [
            'Sandalwood film industry backstage access',
            'Mysore Palace evening illumination tour',
            'Luxury retreat in the heart of Bangalore'
        ]
    }
];

export const getTitle = (category: string, date: Date) => {
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${category} Tour ${month} ${year}`;
};

export const getSlug = (title: string) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const getSortedTours = () => {
    return [...TOURS_DATA]
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
        .slice(0, 3);
};
