export const calculateTypeAdvantage = (newType, kingType, weakAgainst, strongAgainst) => {
    if (newType === kingType) {
        return { chalMult: 1, kingMult: 1, message: "Type Match!"}
    }
    
    if (strongAgainst.includes(kingType)) {
        return { chalMult: 2, kingMult: 0.5, message: "Challanger has advantage!"}
    } else if (weakAgainst.includes(kingType)) {
        return { chalMult: 0.5, kingMult: 2, message: "King has advantage!"}
    }

    return { chalMult: 1, kingMult: 1, message: "No Advantage!"}
}

export const calculateDamage = (attack, defense, multiplier) => {
    return Math.max(5, Math.floor((attack * multiplier) - (defense * 0.4)));
};

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));