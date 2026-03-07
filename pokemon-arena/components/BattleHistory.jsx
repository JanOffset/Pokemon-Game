export default function BattleHistory({ history }) {
    if (!Array.isArray(history) || history.length === 0) return null;

    return (
        <div style={{ color: "black", display: "flex", alignItems: "center", justifyContent: "flex-start", width: "100%", maxWidth: "800px", margin: "40px auto 0" }}>
            <h3 style={{ margin: "0 15px 0 0", minWidth: "80px", textAlign: "left" }}>History:</h3>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {history.map((loser, index) => (
                    <img 
                        key={index} 
                        src={loser.sprite} 
                        alt={loser.name} 
                        title={loser.name} 
                        style={{ width: "45px", height: "45px", background: "#222", borderRadius: "50%", border: "1px solid #555" }} 
                    />
                ))}
            </div>
        </div>
    );
}