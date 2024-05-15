'use client';
// import { Table } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';

type PlanProps = {
  capacity: number;
  time: number;
  price: number;
};

type PlansProps = {
  data: PlanProps[];
};

const fetchJson = async (): Promise<PlansProps> => {
  // const url = `${process.env.URL}/plans.json`;
  const url = 'http://localhost:3000/plans.json';
  console.log(url);
  const response = await fetch(url, { cache: 'no-store' });
  return await response.json();
};

const myQuery = (): PlansProps => {
  const { data } = useSuspenseQuery({
    queryKey: [],
    queryFn: async () => await fetchJson()
  });
  return data;
  // return [query.data, query] as const;
};

const Repos = (): JSX.Element => {
  const data = myQuery();
  return (
    <>
      {data.data.map((plan, index) => {
        return (
          <p key={index}>
            {plan.capacity}GB / {plan.time} / {plan.price}円
          </p>
        );
      })}
    </>
  );
};

export default function Page(): JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Repos />
    </Suspense>
  );
}
