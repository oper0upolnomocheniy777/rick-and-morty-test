import type { Character } from '../../types/character';
import styles from './CharacterCard.module.css';

interface Props {
  character: Character;
}

export default function CharacterCard({ character }: Props) {
  return (
    <article className={styles.card}>
      <img className={styles.image} src={character.image} alt={character.name} loading="lazy" />
      <div className={styles.info}>
        <h2 className={styles.name}>{character.name}</h2>
        <p className={styles.status}>
          <span className={`${styles.dot} ${styles[character.status.toLowerCase()]}`} />
          {character.status} — {character.species}
        </p>
      </div>
    </article>
  );
}