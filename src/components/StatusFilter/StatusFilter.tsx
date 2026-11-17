import styles from './StatusFilter.module.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const STATUSES = [
  { value: '', label: 'Все' },
  { value: 'alive', label: 'Живые' },
  { value: 'dead', label: 'Мёртвые' },
  { value: 'unknown', label: 'Неизвестно' },
];

export default function StatusFilter({ value, onChange }: Props) {
  return (
    <div className={styles.filter}>
      {STATUSES.map((status) => (
        <button
          key={status.value}
          className={`${styles.button} ${value === status.value ? styles.active : ''}`}
          onClick={() => onChange(status.value)}
          type="button"
        >
          {status.label}
        </button>
      ))}
    </div>
  );
}