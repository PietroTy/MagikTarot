import { createContext, useState, useEffect, useContext } from 'react';
import * as dataService from '../services/dataService';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState({
    services: [],
    zodiac: [],
    products: [],
    blogPosts: [],
    testimonials: [],
    horoscopes: {},
    tarotCards: [],
    howItWorks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          services, zodiac, products, blogPosts,
          testimonials, horoscopes, tarotCards, howItWorks
        ] = await Promise.all([
          dataService.fetchServices(),
          dataService.fetchZodiac(),
          dataService.fetchProducts(),
          dataService.fetchBlogPosts(),
          dataService.fetchTestimonials(),
          dataService.fetchHoroscopes(),
          dataService.fetchTarotCards(),
          dataService.fetchHowItWorks()
        ]);

        setData({
          services, zodiac, products, blogPosts,
          testimonials, horoscopes, tarotCards, howItWorks
        });
        setLoading(false);
      } catch (err) {
        console.error('Falha ao carregar catálogo:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
