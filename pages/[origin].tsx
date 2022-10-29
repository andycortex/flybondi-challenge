import React from 'react';
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
            trips:trips.slice(0, 100)
        }
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    return { paths: [], fallback: 'blocking' }
}

const OriginPage: React.FC<Props> = ({ trips }) => {
    console.log(trips)
    return (
        <div>{`<OriginPage/>`}</div>
    );
};

export default OriginPage;