import styles from './Pagination.module.css';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <button className={styles.button} disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          Назад
      </button>
      <span className={styles.info}>
          Страница {currentPage} из {totalPages}
      </span>
      <button className={styles.button} disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
          Вперёд
      </button>
    </div>
  );
}