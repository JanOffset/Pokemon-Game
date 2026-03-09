export const apiFetchPokemon = async (id) => {

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();

        return {
            id: data.id,
            name: data.name,
            sprite: data.sprites.front_default,
            types: data.types.map(t => t.type.name),
            hp: data.stats.find(s => s.stat.name === 'hp').base_stat * 2,
            attack: data.stats.find(s => s.stat.name === 'attack').base_stat,
            defense: data.stats.find(s => s.stat.name === 'defense').base_stat,
            maxHp: data.stats.find(s => s.stat.name === 'hp').base_stat * 2
        };
    } catch (err) {
        console.log(err.message)
        throw new Error("Error while fetching ")
    }

}

export const fetchTypeAdvantage = async (type) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        if (!response.ok) throw new Error('API Error')
        const data = await response.json();

        return {
            strongAgainst: data.damage_relations.double_damage_to.map(t => t.name),
            weakAgainst: data.damage_relations.double_damage_from.map(t => t.name)
        }

    } catch (err) {
        console.log(err.message)
        throw new Error("Error fetching advantage type")
    }
}