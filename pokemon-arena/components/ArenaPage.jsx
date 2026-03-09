import { usePokemonBattle } from "../hooks/usePokemonBattle";
import PokemonCard from "./PokemonCard";
import Scoreboard from "./Scoreboard";
import BattleHistory from "./BattleHistory";
import { useMemo } from "react";

export default function ArenaPage() {
    const { currentPokemon, previousPokemon, stats, matchMessage, history, isBattling, isLoading, startBattle } = usePokemonBattle();

    const memoizedStats = useMemo(() => stats, [stats.typeMatches, stats.newWins, stats.previousWins]);
    return (
        <div className="p-10 text-center">
            <Scoreboard {...memoizedStats} />
            
            <button onClick={startBattle} className="btn" disabled={isLoading}>
                {isLoading ? "Summoning..." : isBattling ? "BATTLE IN PROGRESS..." : "Generate Pokemon"}
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