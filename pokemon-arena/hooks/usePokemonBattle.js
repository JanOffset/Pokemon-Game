import { useState } from "react";
import GenerateId from "../utilities/GenerateId";
import { fetchTypeAdvantage, apiFetchPokemon } from "../Services/Api";
import { delay, calculateDamage, calculateTypeAdvantage } from "../utilities/Combat";

export function usePokemonBattle() {
    const [currentPokemon, setCurrentPokemon] = useState(null);
    const [previousPokemon, setPreviousPokemon] = useState(null);
    const [stats, setStats] = useState({ typeMatches: 0, newWins: 0, previousWins: 0 });
    const [matchMessage, setMatchMessage] = useState("");
    const [history, setHistory] = useState([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isBattling, setIsBattling] = useState(false);

    const startBattle = async () => {
        setIsLoading(true);
        setMatchMessage("SUMMONING CHALLENGER...");
        const id = Number(GenerateId());

        try {        
            const newPokemon = await apiFetchPokemon(id)
            if (!newPokemon) throw new Error("Error fetching new pokemon when starting battle")

            let defendingKing = previousPokemon;
            if (matchMessage.includes("NEW")) {
                defendingKing = currentPokemon;
            }

            if (!defendingKing) {
                setPreviousPokemon(newPokemon);
                setCurrentPokemon(null);
                setMatchMessage("A KING IS CROWNED!");
                setIsLoading(false);
                return;
            }

            setCurrentPokemon(newPokemon);
            setPreviousPokemon(defendingKing);
            setIsLoading(false); 
            
            setMatchMessage("CALCULATING ADVANTAGES...");
            await delay(1000);

            let { chalMult, kingMult, message } = { chalMult: 1, kingMult: 1, message: "TYPE MATCH!" };
            const newType = newPokemon.types[0];
            const kingType = defendingKing.types[0];

            if (newType !== kingType) {
                const advantage = await fetchTypeAdvantage(newType);
                const calc = calculateTypeAdvantage(newType, kingType, advantage.weakAgainst, advantage.strongAgainst)
                chalMult = calc.chalMult;
                kingMult = calc.kingMult;
                message = calc.message;
            } else {
                setStats(prev => ({ ...prev, typeMatches: prev.typeMatches + 1 }));
            }

            setMatchMessage(message);
            await delay(1500);

            setIsBattling(true);
            let kHp = defendingKing.hp;
            let cHp = newPokemon.hp;
            let turn = "king"; 

            while (kHp > 0 && cHp > 0) {
                await delay(800); 
                
                if (turn === "king") {
                    const dmg = calculateDamage(defendingKing.attack ,newPokemon.defense, kingMult);
                    cHp -= dmg;
                    setCurrentPokemon(prev => ({ ...prev, hp: Math.max(0, cHp) }));
                    setMatchMessage(`KING HITS FOR ${dmg} DMG!`);
                    turn = "challenger";
                } else {
                    const dmg = calculateDamage(defendingKing.attack ,newPokemon.defense, chalMult)
                    kHp -= dmg;
                    setPreviousPokemon(prev => ({ ...prev, hp: Math.max(0, kHp) }));
                    setMatchMessage(`CHALLENGER HITS FOR ${dmg} DMG!`);
                    turn = "king";
                }
            }

            await delay(1000);

            if (kHp <= 0) {
                setMatchMessage("NEW WINS! THE KING IS DEAD.");
                setStats(prev => ({ ...prev, newWins: prev.newWins + 1 }));
                setHistory(prev => [...prev, defendingKing].slice(-10));
            } else {
                setMatchMessage("PREVIOUS WINS! LONG LIVE THE KING.");
                setStats(prev => ({ ...prev, previousWins: prev.previousWins + 1 }));
                setHistory(prev => [...prev, newPokemon].slice(-10));
            }

            setIsBattling(false);

        } catch (err) {
            console.log(err); 
            setIsLoading(false);
            setIsBattling(false);
        }
    };

    return { currentPokemon, previousPokemon, stats, matchMessage, history, isLoading, isBattling, startBattle };
}