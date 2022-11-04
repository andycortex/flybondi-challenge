import { GetStaticProps } from 'next'
import Link from 'next/link'
import api from '../api'
import styles from '../styles/App.module.css'
import { Flight } from '../types'

type Props = {
  origins: Flight["origin"][]
}
export const getStaticProps: GetStaticProps<Props> = async () => {
  const origins = await api.origin.list()
  return {
    props: {
      origins
    }
  }
}

export default function Home({ origins }) {
  return (
    <div className={styles.grid}>
      {origins.map(origin => (
        <Link key={origin} href={`/${origin}`} className={styles.card}>
          <h2>{origin} &rarr;</h2>
        </Link>
      ))}
    </div>
  )
}
