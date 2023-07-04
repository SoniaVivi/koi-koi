import { MouseEventHandler, useContext, useReducer } from "react";
import styles from "../../styles/game/Menu.module.scss";
import toCamelCase from "../helpers/toCamelCase";
import { completeDeck } from "../../game/deck";
import { AIPlayerCodeNames, Card as CardInterface } from "../../game/gameTypes";
import Card from "./Card";
import fromCamelCase from "../helpers/fromCamelCase";
import yakuList from "./menu/yakuList";
import { GameContext } from "../GameContext";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { restart, setAIPlayer } from "../../redux/gameReducer";
import RulesPage from "./menu/RulesPage";
import AIPlayers, { wipPlayers } from "../../game/aiPlayers/aiPlayers";

const randomAIVersions = Object.fromEntries(
  Object.entries(AIPlayers).map(([k, _]) => [
    k,
    Math.floor(Math.random() * 10 + 1),
  ])
);

const sortedYakuList = Object.entries(yakuList).sort((a, b) => {
  if (a[1].points < b[1].points) {
    return 1;
  } else if (a[1].points > b[1].points) {
    return -1;
  }
  return 0;
});

const CardList = () => (
  <ul className={styles.gallery}>
    {completeDeck.map((monthCards, monthNumber) => (
      <li key={monthNumber} className={styles.galleryItem}>
        <h5>Month {monthNumber + 1}</h5>
        <ul className={styles.galleryRow}>
          {Object.entries(monthCards).map(([cardName, count], i) =>
            [...Array(count as Number)].map((_, n) => (
              <li key={n}>
                <Card
                  cardData={{
                    name: cardName as CardInterface["name"],
                    month: monthNumber + 1,
                  }}
                />
                <span>
                  {cardName.slice(0, 1).toUpperCase() + cardName.slice(1)}
                </span>
              </li>
            ))
          )}
        </ul>
      </li>
    ))}
  </ul>
);

const YakuList = () => (
  <ul className={styles.gallery}>
    {sortedYakuList.map(([yakuName, yakuData]) => (
      <li key={yakuName} className={styles.galleryItem}>
        <h5>{fromCamelCase(yakuName)}</h5>
        <span>
          <strong>{yakuData.points} Points</strong>
        </span>
        <p>{yakuData.description}</p>
        <ul className={styles.galleryRow}>
          {yakuData.cards.map((cardData, i) => (
            <li key={i}>
              <Card cardData={cardData} />
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
);

const SelectAIPage = () => {
  const currentAI = useAppSelector((state) => state.game.AICodename);
  const dispatch = useAppDispatch();

  return (
    <ul className={`${styles.pageInnerMenu} ${styles.childrenDividers}`}>
      <li>
        <h5>SELECT AI PLAYER</h5>
      </li>
      {(Object.keys(AIPlayers) as [AIPlayerCodeNames]).map(
        (codeName: AIPlayerCodeNames) => (
          <li
            key={codeName}
            className={wipPlayers[codeName] ? styles.unavailable : undefined}
            onClick={() => {
              if (wipPlayers[codeName]) return;
              dispatch(setAIPlayer(codeName));
            }}
          >
            <button className="clickable main-button">
              {fromCamelCase(codeName)}
              <span>
                {wipPlayers[codeName]
                  ? " - WIP"
                  : "v" + randomAIVersions[codeName]}
                {codeName == currentAI ? " - current" : null}
              </span>
            </button>
          </li>
        )
      )}
    </ul>
  );
};

const MENUPAGES = {
  cardList: CardList,
  yakuList: YakuList,
  rules: RulesPage,
  selectAi: SelectAIPage,
};

const Menu = ({ onClose }: { onClose: Function }) => {
  const game = useContext(GameContext);
  const dispatch = useAppDispatch();
  const [displayPage, setDisplayPage]: [string, Function] = useReducer(
    (current: string, text: string): string => {
      const newPage = toCamelCase(text);
      if (newPage == "goBack") {
        return newPage;
      } else if (
        ["restart", "sourceCode"].includes(newPage) ||
        !(newPage in MENUPAGES)
      ) {
        return current;
      } else {
        return newPage;
      }
    },
    "goBack"
  );
  const Page =
    displayPage in MENUPAGES
      ? MENUPAGES[displayPage as keyof typeof MENUPAGES]
      : null;

  return (
    <div className={styles.modalContainer}>
      <div
        className={`${styles.wrapper} ${
          displayPage == "goBack" ? styles.hidePageWrapper : null
        }`}
      >
        <div>
          <button
            className="clickable main-button"
            onClick={onClose as MouseEventHandler}
          >
            Close
          </button>
        </div>
        <ul
          className={`${styles.menu}  ${styles.childrenDividers} ${
            displayPage == "goBack" ? "" : styles.collapse
          }`}
          onClick={(e) =>
            setDisplayPage(
              (e.target as HTMLButtonElement).textContent as string
            )
          }
        >
          {displayPage != "goBack" ? (
            <li className="clickable main-button">
              <button className="clickable">Go Back</button>
            </li>
          ) : null}
          <li className="clickable main-button">
            <button className="clickable">Select AI</button>
          </li>
          <li className="clickable main-button">
            <button className="clickable">Card List</button>
          </li>
          <li className="clickable main-button">
            <button className="clickable">Yaku List</button>
          </li>
          <li className="clickable main-button">
            <button className="clickable">Rules</button>
          </li>
          <li className="clickable main-button">
            <button
              className="clickable"
              onClick={() => {
                game.restart();
                dispatch(restart());
                onClose();
              }}
            >
              Restart
            </button>
          </li>
          <li className="clickable main-button">
            <a
              className="clickable"
              href="https://github.com/SoniaVivi/koi-koi"
              target="_blank"
              rel="noreferrer"
            >
              Source Code
            </a>
          </li>
        </ul>
        <div className={styles.pageWrapper}>
          {Page !== null ? <Page /> : null}
        </div>
      </div>
    </div>
  );
};

export default Menu;
