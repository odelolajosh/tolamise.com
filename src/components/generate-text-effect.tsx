import { useEffect } from 'react'
import { motion, stagger, useAnimate } from 'motion/react'

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string
  className?: string
}) => {
  const [scope, animate] = useAnimate()
  const wordsArray = words.split(' ')
  useEffect(() => {
    animate(
      'span',
      {
        opacity: 1,
      },
      {
        duration: 1.2,
        delay: stagger(0.2, { startDelay: 0.5 }),
      },
    )
  }, [animate])

  const renderWords = () => {
    return (
      <motion.p ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span key={word + idx} className="opacity-0">
              {word}{' '}
            </motion.span>
          )
        })}
      </motion.p>
    )
  }

  return <div className={className}>{renderWords()}</div>
}
