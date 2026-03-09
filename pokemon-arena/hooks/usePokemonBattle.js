import { useState } from "react";
import GenerateId from "../utilities/GenerateId";

// Утилита за пауза (забавя времето, за да виждаме ударите)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function usePokemonBattle() {
    const [currentPokemon, setCurrentPokemon] = useState(null);
    const [previousPokemon, setPreviousPokemon] = useState(null);
    const [stats, setStats] = useState({ typeMatches: 0, newWins: 0, previousWins: 0 });
    const [matchMessage, setMatchMessage] = useState("");
    const [history, setHistory] = useState([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isBattling, setIsBattling] = useState(false); // Заключва бутона по време на бой

    const startBattle = async () => {
        setIsLoading(true);
        setMatchMessage("SUMMONING CHALLENGER...");
        const id = Number(GenerateId());

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            
            const newPokemon = {
                id: data.id,
                name: data.name,
                sprite: data.sprites.front_default,
                types: data.types.map(t => t.type.name),
                hp: data.stats.find(s => s.stat.name === 'hp').base_stat * 2, // Х2 за по-дълга битка
                attack: data.stats.find(s => s.stat.name === 'attack').base_stat,
                defense: data.stats.find(s => s.stat.name === 'defense').base_stat,
                maxHp: data.stats.find(s => s.stat.name === 'hp').base_stat * 2
            };

            // Определяме кой седи на трона
            let defendingKing = previousPokemon;
            if (!previousPokemon && currentPokemon) {
                defendingKing = currentPokemon;
            } else if (matchMessage.includes("NEW")) {
                defendingKing = currentPokemon;
            }

            // Ако арената е празна (първи клик)
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
            
            // --- ЛОГИКА ЗА ПРЕДИМСТВАТА ---
            setMatchMessage("CALCULATING ADVANTAGES...");
            await delay(1000);

            let kingMult = 1;
            let chalMult = 1;

            const newType = newPokemon.types[0];
            const kingType = defendingKing.types[0];

            if (newType !== kingType) {
                const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${newType}`);
                const typeData = await typeRes.json();
                const strongAgainst = typeData.damage_relations.double_damage_to.map(t => t.name);
                const weakAgainst = typeData.damage_relations.double_damage_from.map(t => t.name);

                if (strongAgainst.includes(kingType)) {
                    chalMult = 2; kingMult = 0.5;
                    setMatchMessage("CHALLENGER HAS TYPE ADVANTAGE!");
                } else if (weakAgainst.includes(kingType)) {
                    kingMult = 2; chalMult = 0.5;
                    setMatchMessage("KING HAS TYPE ADVANTAGE!");
                } else {
                    setMatchMessage("NO TYPE ADVANTAGE.");
                }
            } else {
                setMatchMessage("TYPE MATCH!");
                setStats(prev => ({ ...prev, typeMatches: prev.typeMatches + 1 }));
            }

            await delay(1500);

            // --- БОЙНИЯТ ДВИГАТЕЛ (THE LOOP) ---
            setIsBattling(true);
            let kHp = defendingKing.hp;
            let cHp = newPokemon.hp;
            let turn = "king"; // Кралят винаги удря първи

            while (kHp > 0 && cHp > 0) {
                await delay(800); // 0.8 секунди пауза между ударите
                
                if (turn === "king") {
                    const dmg = Math.max(5, Math.floor((defendingKing.attack * kingMult) - (newPokemon.defense * 0.4)));
                    cHp -= dmg;
                    setCurrentPokemon(prev => ({ ...prev, hp: Math.max(0, cHp) }));
                    setMatchMessage(`KING HITS FOR ${dmg} DMG!`);
                    turn = "challenger";
                } else {
                    const dmg = Math.max(5, Math.floor((newPokemon.attack * chalMult) - (defendingKing.defense * 0.4)));
                    kHp -= dmg;
                    setPreviousPokemon(prev => ({ ...prev, hp: Math.max(0, kHp) }));
                    setMatchMessage(`CHALLENGER HITS FOR ${dmg} DMG!`);
                    turn = "king";
                }
            }

            await delay(1000);

            // --- КРАЙ НА БИТКАТА ---
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
            print(err); 
            setIsLoading(false);
            setIsBattling(false);
        }
    };

    return { 
        currentPokemon, 
        previousPokemon, 
        stats, 
        matchMessage, 
        history, 
        isLoading, 
        isBattling, 
        startBattle 
    };
}