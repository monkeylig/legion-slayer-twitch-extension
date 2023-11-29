function getElementalColor(element) {
    switch (element) {
        case 'fire':
            return '#D64022';
        default:
            return '#7B7B7B';
    }
}

const colors = {
    blue: '#2291D6',
    red: '#D72323',
    green: '#2FD622',
    orange: '#D6A022',
    getElementalColor
};

export default colors;