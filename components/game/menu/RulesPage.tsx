import styles from "../../../styles/game/Menu.module.scss";

const RulesPage = () => {
  return (
    <div className={styles.textContainer}>
      <div>
        <h5>Choose Oya (Dealer)</h5>
        <p>
          The deck is shuffled and both players draw a card. The player who drew
          the earliest card becomes the dealear. This process will be repeated
          in the event of a tie. The Oya will play first.
        </p>
      </div>
      <div>
        <h5>Setup</h5>
        <p>
          8 cards are dealt to the table and to each player in sets of 2. If a
          lucky hand occurs, then the deck will be shuffled and the above
          process will be repeated.
        </p>
      </div>
      <div>
        <h5>Hand Play and Draw Play</h5>
        <p>
          Each turn a player chooses a card and plays it to the table. it
          matches If the month of the card is the same as another card on the
          table.
        </p>
        <h5>1 or 3 Matches</h5>
        <p>All cards are moved the players score pile.</p>
        <h5>2 Matches</h5>
        <p>
          The player chooses which card they wish to capture in addition to the
          one they played.
        </p>
        <h5>No Match</h5>
        <p>The played card remains on the table to be captured later.</p>
        <h5>Draw Play</h5>
        <p>
          The player draws a card from the deck and plays it to the table. In
          the event of a match, repeat the above process.
        </p>
      </div>
      <div>
        <h5>Round Call</h5>
        <p>
          If the player has formed a new yaku or improved an existing one, then
          they may call shoubu or koi-koi. Otherwise, the turn to play passes to
          the opponent.
        </p>
        <h5>Shoubu and Koi-Koi</h5>
        <p>
          Shoubu ends the round and the player scores points. Koi-Koi does not
          end the round and instead they receive a 2x score modifier for later
          in the turn if they do call Shoubu.
        </p>
      </div>
      <div>
        <h5>Scoring</h5>
        <p>
          If the players&apos; base score is &gt;= 7, then their score will be
          doubled
        </p>
        <p>
          If their opponent called Koi-Koi, then their score will be doubled
        </p>
      </div>
    </div>
  );
};

export default RulesPage;
