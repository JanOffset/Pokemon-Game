export default function PokemonCard({pokemon, title, emptyMessage}) {
    return (
        <>
            <div className="card">
                <h3>{title}</h3>
                {pokemon ? (
                    <div>
                        <p className="pokemon-name">{pokemon.name}</p>
                        <img src={pokemon.sprite} alt={pokemon.name} className="mx-auto w-32 h-32" />
                    </div>
                ) : (
                    <p className="empty-text">{emptyMessage}</p>
                )}
            </div>
        </>
    )
}