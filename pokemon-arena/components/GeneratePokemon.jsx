import { useState } from "react"
import GenerateId from "../utilities/GenerateId";
import PokemonCard from "./PokemonCard";

export default function GeneratePokemon() {
    const [previousWins, setPreviousWins] = useState(0);
    const [newWins, setNewWins] = useState(0);
    const [currentPokemon, setCurrentPokemon] = useState(null);
    const [previousPokemon, setPreviousPokemon] = useState(null);

    const [typeMatches, setTypeMatches] = useState(0);
    const [matchMessage, setMatchMessage] = useState("");

    const handlePokemon = async (e) => {
        e.preventDefault();
        const id = Number(GenerateId());
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)

            if (!response.ok) throw new Error('Response error');
            
            const data = await response.json();
            const cleanPokemon = {
                id: data.id,
                name: data.name,
                sprite: data.sprites.front_default, 
                height: data.height,
                weight: data.weight,
                types: data.types.map(t => t.type.name),
                baseStatTotal: data.stats.reduce((acc, curr) => acc + curr.base_stat, 0)
            };

            let defendingKing = previousPokemon;
            if (!previousPokemon && currentPokemon) {
                defendingKing = currentPokemon;
            } else if (matchMessage === "NEW POKEMON WINS!") {
                defendingKing = currentPokemon;
            }

            if (defendingKing) {
                const currentPrimaryType = defendingKing.types[0];
                const newPrimaryType = cleanPokemon.types[0];
                if (currentPrimaryType === newPrimaryType) {
                    setMatchMessage("TYPE MATCH!")
                    setTypeMatches((prev) => prev + 1)
                } else {
                    const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${newPrimaryType}`)
                    const typeData = await typeRes.json();

                    const weakAgainst = typeData.damage_relations.double_damage_from.map(t => t.name);
                    const strongAgainst = typeData.damage_relations.double_damage_to.map(t => t.name);

                    if (strongAgainst.includes(currentPrimaryType)) {
                        setMatchMessage(`NEW POKEMON WINS!`)
                        setNewWins((prev) => prev + 1)
                    } else if (weakAgainst.includes(currentPrimaryType)) {
                        setMatchMessage(`PREVIOUS POKEMON WINS!`)
                        setPreviousWins((prev) => prev + 1)
                    } else setMatchMessage(`NO ADVANTAGE!`)
                }
            }
            setPreviousPokemon(defendingKing);
            setCurrentPokemon(cleanPokemon);
            console.log(currentPokemon);
            console.log(previousPokemon);
            
        } catch (err){
            throw new Error('Error when fetching pokemon.')
        } 
    }
    return (
    <div>
        <button 
            onClick={handlePokemon}
            className="btn"
        >
            Generate Pokemon
        </button>
        
        <div>
            Type matches:{typeMatches} / Previous wins:{previousWins} / New wins:{newWins}
        </div>

        <div>
        {matchMessage && (
                <h2 style={{ color: "#d32f2f", margin: "20px 0" }}>{matchMessage}</h2>
        )}
        </div>

        <div className="arena">
            <PokemonCard title="King" pokemon={previousPokemon} emptyMessage="Empty throne."/>            
            <PokemonCard title="Opponent" pokemon={currentPokemon} emptyMessage="Waiting for opponent..."/>
        </div>
    </div>
    )
}