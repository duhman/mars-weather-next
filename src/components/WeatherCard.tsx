import styles from './WeatherCard.module.css';

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit?: string;
  size?: 'small' | 'large';
}

export default function WeatherCard({ title, value, unit, size = 'large' }: WeatherCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={`${styles.value} ${size === 'small' ? styles.small : styles.large}`}>
        {value}{unit && <span className={styles.unit}>{unit}</span>}
      </p>
    </div>
  );
}