import React, { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<FoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<FoodPlate>({} as FoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await api.get('/foods');

      setFoods(response.data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<FoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<FoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const response = await api.put('/foods', {
        ...editingFood,
        ...food,
      });

      setFoods(foods.map(mappedFood => mappedFood.id === editingFood.id ? { ...response.data } : mappedFood,
      ),
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number): Promise<void> {
    try {
      await api.delete(`/foods/${id}`)

      setFoods(foods.filter(food => food.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }
  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }


  function handleEditFood(food: FoodPlate): void {
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );

}

export default Dashboard;
