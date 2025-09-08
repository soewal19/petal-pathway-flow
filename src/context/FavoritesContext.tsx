import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (flowerId: string) => void;
  isFavorite: (flowerId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('flowerFavorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('flowerFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (flowerId: string) => {
    setFavorites(prev => 
      prev.includes(flowerId)
        ? prev.filter(id => id !== flowerId)
        : [...prev, flowerId]
    );
  };

  const isFavorite = (flowerId: string) => {
    return favorites.includes(flowerId);
  };

  const value = {
    favorites,
    toggleFavorite,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};