import styles from './WeatherIcon.module.css';

interface WeatherIconProps {
  condition: 'sunny' | 'dusty' | 'stormy' | 'cold' | 'windy';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export default function WeatherIcon({ condition, size = 'medium', animated = true }: WeatherIconProps) {
  const sizeClass = styles[size];
  const animatedClass = animated ? styles.animated : '';

  switch (condition) {
    case 'sunny':
      return (
        <div className={`${styles.iconContainer} ${sizeClass}`}>
          <svg viewBox="0 0 100 100" className={`${styles.sun} ${animatedClass}`}>
            <circle cx="50" cy="50" r="20" fill="#ff6b00" />
            <g className={styles.rays}>
              {[...Array(8)].map((_, i) => (
                <rect
                  key={i}
                  x="48"
                  y="10"
                  width="4"
                  height="15"
                  fill="#ff9a3c"
                  transform={`rotate(${i * 45} 50 50)`}
                />
              ))}
            </g>
          </svg>
        </div>
      );

    case 'dusty':
      return (
        <div className={`${styles.iconContainer} ${sizeClass}`}>
          <svg viewBox="0 0 100 100" className={`${styles.dust} ${animatedClass}`}>
            <g className={styles.dustParticles}>
              {[...Array(20)].map((_, i) => (
                <circle
                  key={i}
                  cx={20 + Math.random() * 60}
                  cy={20 + Math.random() * 60}
                  r={1 + Math.random() * 3}
                  fill="#d4a574"
                  opacity={0.3 + Math.random() * 0.7}
                />
              ))}
            </g>
            <path
              d="M20 60 Q50 40 80 60"
              stroke="#d4a574"
              strokeWidth="2"
              fill="none"
              className={styles.dustWave}
            />
          </svg>
        </div>
      );

    case 'stormy':
      return (
        <div className={`${styles.iconContainer} ${sizeClass}`}>
          <svg viewBox="0 0 100 100" className={`${styles.storm} ${animatedClass}`}>
            <path
              d="M30 30 Q50 20 70 30 L65 50 Q50 60 35 50 Z"
              fill="#666"
              className={styles.stormCloud}
            />
            <g className={styles.lightning}>
              <path
                d="M45 50 L40 65 L50 60 L45 75"
                stroke="#ffeb3b"
                strokeWidth="2"
                fill="none"
              />
            </g>
          </svg>
        </div>
      );

    case 'cold':
      return (
        <div className={`${styles.iconContainer} ${sizeClass}`}>
          <svg viewBox="0 0 100 100" className={`${styles.cold} ${animatedClass}`}>
            <g className={styles.snowflake}>
              <path
                d="M50 20 L50 80 M20 50 L80 50 M30 30 L70 70 M70 30 L30 70"
                stroke="#b3e5fc"
                strokeWidth="2"
              />
              {[...Array(8)].map((_, i) => (
                <circle
                  key={i}
                  cx={50 + 30 * Math.cos((i * Math.PI) / 4)}
                  cy={50 + 30 * Math.sin((i * Math.PI) / 4)}
                  r="3"
                  fill="#b3e5fc"
                />
              ))}
            </g>
          </svg>
        </div>
      );

    case 'windy':
      return (
        <div className={`${styles.iconContainer} ${sizeClass}`}>
          <svg viewBox="0 0 100 100" className={`${styles.wind} ${animatedClass}`}>
            <g className={styles.windLines}>
              <path
                d="M20 30 Q60 30 70 40"
                stroke="#64b5f6"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M15 50 Q55 50 65 40"
                stroke="#90caf9"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M25 70 Q65 70 75 60"
                stroke="#64b5f6"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
      );

    default:
      return null;
  }
}