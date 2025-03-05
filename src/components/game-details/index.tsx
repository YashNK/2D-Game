import "./game-details.scss";
export const GameDetails: React.FunctionComponent = () => {
  return (
    <div className="game_details_container flex_1_1_10">
      <div className="game_details_card">
        <div className="game_details_card_title pb-3">Game Details</div>
        <div className="game_details_card_subtitle">Movement:</div>
        <div className="keyboard_keys_wrap_container">
          <div className="keyboard_key_container hidden" />
          <div className="keyboard_key_container">
            <div className="keyboard_key">W</div>
            <div className="keyboard_key_title">Move Up</div>
          </div>
          <div className="keyboard_key_container hidden" />
          <div className="keyboard_key_container">
            <div className="keyboard_key">A</div>
            <div className="keyboard_key_title">Move Left</div>
          </div>
          <div className="keyboard_key_container">
            <div className="keyboard_key">S</div>
            <div className="keyboard_key_title">Move Down</div>
          </div>
          <div className="keyboard_key_container">
            <div className="keyboard_key">D</div>
            <div className="keyboard_key_title">Move Right</div>
          </div>
          <div className="keyboard_key_container space">
            <div className="keyboard_key">Space</div>
            <div className="keyboard_key_title">Dash</div>
          </div>
        </div>
        <div className="pt-3">How To Win:</div>
        <ul>
          <li>Collect 2000 Coins</li>
        </ul>
      </div>
    </div>
  );
};
