import classNames from 'classnames';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const ScrollContent = forwardRef<
  HTMLDivElement,
  { className?: string; children: React.ReactNode; scrollClassName?: string }
>((props, ref) => {
  const { className, children, scrollClassName } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowShadow(scrollRef.current.scrollTop > 0);
    }
  };

  useImperativeHandle(ref, () => scrollRef.current as HTMLDivElement);

  return (
    <div className={classNames('scroll-wrapper relative overflow-hidden', className)}>
      <div className={`scroll-content  ${scrollClassName || 'max-h-full'}`} ref={scrollRef} onScroll={handleScroll}>
        {children}
      </div>
      <div
        className={`absolute top-0 left-0 right-0 h-4  z-100 pointer-events-none transition-opacity duration-200 ${
          showShadow ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)',
        }}
      />
    </div>
  );
});

export default ScrollContent;
