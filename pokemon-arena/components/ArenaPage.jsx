import { usePokemonBattle } from "../hooks/usePokemonBattle";
import PokemonCard from "./PokemonCard";
import Scoreboard from "./Scoreboard";
import BattleHistory from "./BattleHistory";

export default function ArenaPage() {
    const { currentPokemon, previousPokemon, stats, matchMessage, history, isLoading, startBattle } = usePokemonBattle();

    return (
        <div className="p-10 text-center">
            <Scoreboard {...stats} />
            
            <button onClick={startBattle} className="btn" disabled={isLoading}>
                {isLoading ? "Summoning..." : "Generate Pokemon"}
            </button>

            {matchMessage && <h2 className="match-msg">{matchMessage}</h2>}

            <div className="arena">
                <PokemonCard title="King" pokemon={previousPokemon} emptyMessage="Empty throne." />
                <PokemonCard title="Challenger" pokemon={currentPokemon} emptyMessage="Waiting..." />
            </div>

            <BattleHistory history={history} />
        </div>
    );
}