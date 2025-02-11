import { useEffect } from 'react'
import Container from '../components/atoms/Container'
import Heading from '../components/atoms/Heading'
import Logo from '../components/atoms/Logo'

import { choices } from '../utils/designTokens'
import { speakers } from '../utils/constants'
import ScheduleBlock from '../components/organisms/ScheduleBlock'

const normalizedSpeakers = speakers.reduce((prev, cur) => {
  prev[cur.id] = cur
  return prev
}, {})

const scheduleData = [
  {
    time: '2021-04-10T08:00-05:00',
    title: 'Welcome 🦄'
  },
  {
    time: '2021-04-10T08:15-05:00',
    speaker: normalizedSpeakers['evangelina-ferreira']
  },
  {
    time: '2021-04-10T08:55-05:00',
    speaker: normalizedSpeakers['carlos-azaustre']
  },
  {
    time: '2021-04-10T09:15-05:00',
    speaker: normalizedSpeakers['laura-gonzalez']
  },
  {
    time: '2021-04-10T09:55-05:00',
    speaker: normalizedSpeakers['alena-nikolaeva']
  },
  {
    time: '2021-04-10T10:15-05:00',
    speaker: normalizedSpeakers['carmen-ansio']
  },
  {
    time: '2021-04-10T10:55-05:00',
    speaker: normalizedSpeakers['jimena-castro']
  },
  {
    time: '2021-04-10T11:15-05:00',
    speaker: normalizedSpeakers['joan-leon']
  },
  {
    time: '2021-04-10T11:55-05:00',
    speaker: normalizedSpeakers['facundo-corradini']
  },
  {
    time: '2021-04-10T12:15-05:00',
    title: 'Meal Break 🍕',
    isBreak: true
  },
  {
    time: '2021-04-10T13:05-05:00',
    speaker: normalizedSpeakers['robin-dykema']
  },
  {
    time: '2021-04-10T13:45-05:00',
    speaker: normalizedSpeakers['erifranck-nunez']
  },
  {
    time: '2021-04-10T14:05-05:00',
    speaker: normalizedSpeakers['alex-ramirez']
  },
  {
    time: '2021-04-10T14:45-05:00',
    speaker: normalizedSpeakers['marian-villa']
  },
  {
    time: '2021-04-10T15:05-05:00',
    speaker: normalizedSpeakers['leonidas-esteban']
  },
  {
    time: '2021-04-10T15:45-05:00',
    speaker: normalizedSpeakers['bramus-vandamme']
  },
  {
    time: '2021-04-10T16:05-05:00',
    title: 'Closing Remarks 🌈'
  },
  {
    time: '2021-04-10T16:15-05:00',
    title: 'Virtual Party 🎉',
    isBreak: true
  }
]

const itIsDone = time => new Date(time).getTime() < Date.now()

const schedule = () => {
  useEffect(() => {
    const currentBlock = scheduleData.find(
      block => new Date(block.time).getTime() > Date.now()
    )

    const id = new Date(currentBlock.time).getTime()
    if (id && id !== new Date(scheduleData[0].time).getTime()) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <div className="schedule">
      <Container>
        <Heading size="0" color="blue">
          Schedule
        </Heading>
        <Heading size={4} color="blue" withMargin>
          CSS Conf Colombia, April 10th
        </Heading>
        {scheduleData.map(schedule => (
          <ScheduleBlock
            key={schedule.time}
            isDone={itIsDone(schedule.time)}
            {...schedule}
          />
        ))}
        <div className="logo">
          <Logo />
        </div>
      </Container>
      <style jsx>{`
        .schedule {
          background: ${choices.colors.brand.chiffon}
            url('/static/images/fish-tribal-yellow.svg') no-repeat;
          background-size: 80%;
          background-position: right top;
          width: 100%;
          padding: 50px 20px;
        }

        .logo {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}

export default schedule
