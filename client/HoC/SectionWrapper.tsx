import React from 'react';

const SectionWrapper = <P extends object>(
  Component: React.ComponentType<P>,
  idName: string,
) =>
  function Wrapper(props: any) {
    return (
      <section
        className={`relative xl:max-w-[1140px] lg:max-w-[960px] md:max-w-[720px] sm:max-w-[540px] w-full h-full py-[32px] px-[36px] sm:px-0`}
      >
        <Component {...props} />
      </section>
    );
  };

export default SectionWrapper;
