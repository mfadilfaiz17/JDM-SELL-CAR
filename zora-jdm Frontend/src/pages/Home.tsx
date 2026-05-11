/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SearchHero from '../components/SearchHero';
import PopularCars from '../components/PopularCars';
import CollectionGrid from '../components/CollectionGrid';
import { Car } from '../constants';

interface HomeProps {
  onSelectCar: (car: Car) => void;
}

export default function Home({ onSelectCar }: HomeProps) {
  return (
    <>
      <SearchHero />
      <PopularCars onSelectCar={onSelectCar} />
      <CollectionGrid onSelectCar={onSelectCar} />
    </>
  );
}
