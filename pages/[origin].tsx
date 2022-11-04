import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Trip } from '../types';
import api from '../api';
import { ParsedUrlQuery } from 'querystring';

type Props = {
    trips: Trip[]
}

type Params = ParsedUrlQuery & {
    origin: string
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
    const trips = await api.trips.list(params?.origin!)
    trips.sort((a, b) => a.price - b.price)
    return {
        props: {
            trips: trips.slice(0, 100)
        }
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    return { paths: [], fallback: 'blocking' }
}

const OriginPage: React.FC<Props> = ({ trips }) => {
    const [sort, setSort] = useState<"price" | "days">("price")
    const [limit, setLimit] = useState<number>(10)
    const matches = useMemo(() => {
        const draft = [...trips]
        return draft.sort((a, b) => a[sort] - b[sort]).slice(0, limit)
    }, [sort, trips, limit])
    const checkpoint = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setLimit(limit => limit + 10)
            }
        },{rootMargin: "50px"})
        if (checkpoint.current) {
            observer.observe(checkpoint.current)
        }
        return () => {
            observer.disconnect()
        }
    }, [])
    
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Destino</th>
                        <th onClick={() => setSort("days")} style={{ color: sort === "days" ? "#D4AC0D" : "inherit" }}>Dias</th>
                        <th onClick={() => setSort("price")} style={{ color: sort === "price" ? "#D4AC0D" : "inherit" }}>Precio</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map((trip) => (
                        <tr key={trip.id}>
                            <td>{trip.destination}</td>
                            <td>{trip.days}</td>
                            <td>{Number(trip.price).toLocaleString('es-BO', { style: "currency", currency: 'BOB' })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* {trips.length > limit && (<button onClick={() => setLimit((limit) => limit + 10)}>Cargar mas</button>)} */}
            <div ref={checkpoint}/>
        </>
    );
};

export default OriginPage;