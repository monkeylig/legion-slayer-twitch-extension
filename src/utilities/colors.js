function getElementalColor(element) {
    switch (element) {
        case 'fire':
        case 'ablazed':
            return '#D64022';
        case 'lightning':
        case 'surged':
            return '#D6D022';
        case 'ice':
        case 'frozen':
            return '#22CAD6';
        case 'water':
        case 'drenched':
            return '#6AADD6'
        default:
            return '#7B7B7B';
    }
}

const colors = {
    blue: '#2291D6',
    teal: '#22CAD6',
    red: '#D72323',
    green: '#2FD622',
    orange: '#D6A022',
    grey: '#939292',
    gold: '#D7D023',
    getElementalColor
};

export default colors;