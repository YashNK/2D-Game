import "./game-details.scss";
export const GameDetails: React.FunctionComponent = () => {
  return (
    <div className="game_details_container flex_1_1_10">
      <div className="game_details_card">
        <div>Game Details</div>
        <div>Movement</div>
        <div>W: Move Up</div>
        <div>A: Move Left</div>
        <div>S: Move Down</div>
        <div>D: Move Right</div>
        <div>Space: Dash</div>
        <div>how to win</div>
        <div>collect 2000 coins</div>
      </div>
    </div>
  );
};
