import { useState } from "react";
import GenerateId from "../utilities/GenerateId";

export function usePokemonBattle() {
    const [currentPokemon, setCurrentPokemon] = useState(null);
    const [previousPokemon, setPreviousPokemon] = useState(null);
    const [stats, setStats] = useState({ typeMatches: 0, newWins: 0, previousWins: 0 });
    const [matchMessage, setMatchMessage] = useState("");
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const startBattle = async () => {
        setIsLoading(true);
        const id = Number(GenerateId());

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();

            const newPokemon = {
                id: data.id,
                name: data.name,
                sprite: data.sprites.front_default,
                types: data.types.map(t => t.type.name)
            };

            let defendingKing = previousPokemon;
            if (!previousPokemon && currentPokemon) {
                defendingKing = currentPokemon;
            } else if (matchMessage === "NEW POKEMON WINS!") {
                defendingKing = currentPokemon;
            }

            if (defendingKing) {
                const newType = newPokemon.types[0];
                const kingType = defendingKing.types[0];

                if (newType === kingType) {
                    setMatchMessage("TYPE MATCH!");
                    setStats(prev => ({ ...prev, typeMatches: prev.typeMatches + 1 }));
                } else {
                    const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${newType}`);
                    const typeData = await typeRes.json();
                    const strongAgainst = typeData.damage_relations.double_damage_to.map(t => t.name);
                    const weakAgainst = typeData.damage_relations.double_damage_from.map(t => t.name);

                    if (strongAgainst.includes(kingType)) {
                        setMatchMessage("NEW POKЕMON WINS!");
                        setStats(prev => ({ ...prev, newWins: prev.newWins + 1 }));
                        setHistory(prev => [...prev, defendingKing].slice(-10));
                    } else if (weakAgainst.includes(kingType)) {
                        setMatchMessage("PREVIOUS POKЕMON WINS!");
                        setStats(prev => ({ ...prev, previousWins: prev.previousWins + 1 }));
                        setHistory(prev => [...prev, newPokemon].slice(-10));
                    } else {
                        setMatchMessage("NO ADVANTAGE");
                    }
                }
            }

            setPreviousPokemon(defendingKing);
            setCurrentPokemon(newPokemon);
        } catch (err) {
            print(err); 
        } finally {
            setIsLoading(false);
        }
    };

    return { currentPokemon, previousPokemon, stats, matchMessage, history, isLoading, startBattle };
}