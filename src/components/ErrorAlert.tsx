import styles from './ErrorAlert.module.css';

interface ErrorAlertProps {
  error: string;
  details?: string;
}

export default function ErrorAlert({ error, details }: ErrorAlertProps) {
  return (
    <div className={styles.container}>
      <span className={styles.icon}>⚠️</span>
      <div className={styles.content}>
        <strong>Error:</strong> {error}
        {details && (
          <div className={styles.details}>
            {details}
          </div>
        )}
      </div>
    </div>
  );
}