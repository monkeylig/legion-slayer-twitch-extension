const tips = [
    "Try visiting the shop to get powerful weapons that will help you slay stronger monsters!",
    "Try visiting the shop to get items that will give you an advantage!"
];

export default function getGameTip() {
    return tips[Math.floor(Math.random() * tips.length)];
}