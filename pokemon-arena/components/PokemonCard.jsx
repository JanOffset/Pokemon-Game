export default function PokemonCard({ pokemon, title, emptyMessage }) {
    return (
        <div className="card" style={{ padding: "20px", border: "2px solid #333", borderRadius: "10px", minWidth: "200px", background: "#1a1a1a", color: "white" }}>
            <h3 style={{ borderBottom: "1px solid #444", paddingBottom: "10px" }}>{title}</h3>
            {pokemon ? (
                <div>
                    <p className="pokemon-name" style={{ textTransform: "capitalize", fontWeight: "bold", fontSize: "1.2rem", margin: "10px 0 0 0" }}>{pokemon.name}</p>
                    <img src={pokemon.sprite} alt={pokemon.name} style={{ width: "128px", height: "128px", display: "block", margin: "0 auto" }} />
                    
                    <div className="stats" style={{ marginTop: "15px", textAlign: "left" }}>
                        <div style={{ width: "100%", height: "12px", background: "#444", borderRadius: "6px", overflow: "hidden", marginBottom: "5px" }}>
                            <div 
                                style={{ 
                                    width: `${(pokemon.hp / pokemon.maxHp) * 100}%`, 
                                    height: "100%", 
                                    background: pokemon.hp > (pokemon.maxHp / 2) ? "#4caf50" : "#d32f2f",
                                    transition: "width 0.4s ease" 
                                }}
                            ></div>
                        </div>
                        <p style={{ margin: "4px 0", fontSize: "14px", fontWeight: "bold" }}>HP: {pokemon.hp} / {pokemon.maxHp}</p>
                        <p style={{ margin: "2px 0", fontSize: "14px" }}> ATK: {pokemon.attack}</p>
                        <p style={{ margin: "2px 0", fontSize: "14px" }}> DEF: {pokemon.defense}</p>
                    </div>
                </div>
            ) : (
                <p className="empty-text" style={{ marginTop: "20px" }}>{emptyMessage}</p>
            )}
        </div>
    );
}