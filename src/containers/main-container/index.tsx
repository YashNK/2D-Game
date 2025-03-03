import { GameDetails } from "../../components/game-details";
import { GameScreen } from "../../components/game-screen";
import { Header } from "../../components/header";
import "./main-container.scss";

export const MainContainer: React.FunctionComponent = () => {
  return (
    <div className="main_container">
      <Header />
      <div className="main_content">
        <GameDetails />
        <GameScreen />
      </div>
    </div>
  );
};
