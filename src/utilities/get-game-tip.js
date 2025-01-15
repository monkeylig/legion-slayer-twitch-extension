const tips = [
    "Try visiting the shop to get powerful weapons that will help you slay stronger monsters!",
    "Try visiting the shop to get items that will give you an advantage in battles!",
    "If your opponent built up physical protection (the orange number below the health) use magic attacks so that you can do maximum damage to their HP.",
    "If your opponent built up magical protection (the blue number below the health) use physical attacks so that you can do maximum damage to their HP.",
    "Some monsters are weaker than others, Skellington and Goblins are some of the weakest monsters.",
    "Some monsters are stronger than others, Ruby Dragon and Abyssal are some of the strongest monsters.",
    "Monsters only have a 30% change of dropping coins when they are at a lower level than you.",
    "Monsters are guaranteed to drop coins if they are at an equal or higher level than you.",
    "Monsters drop many more coins when they are higher level than you.",
    "Your elemental abilities are color coded to show which elements they have."
];

export default function getGameTip() {
    return tips[Math.floor(Math.random() * tips.length)];
}