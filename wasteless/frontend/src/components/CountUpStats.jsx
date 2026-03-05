import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

export default function CountUpStats({ value, suffix = '', prefix = '', duration = 2 }) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <div ref={ref}>
      {inView && (
        <CountUp
          start={0}
          end={value}
          duration={duration}
          separator=","
          suffix={suffix}
          prefix={prefix}
        />
      )}
    </div>
  );
}
