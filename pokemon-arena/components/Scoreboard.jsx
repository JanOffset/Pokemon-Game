export default function Scoreboard({ typeMatches, previousWins, newWins }) {
    return (
        <div className="scoreboard">
            <h2>Type Matches: {typeMatches} | Previous Wins: {previousWins} | New Wins: {newWins}</h2>
        </div>
    );
}