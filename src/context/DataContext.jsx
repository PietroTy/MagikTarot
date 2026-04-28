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
    tarotSpreads: [],
    howItWorks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          services, zodiac, products, blogPosts,
          testimonials, horoscopes, tarotCards, tarotSpreads, howItWorks
        ] = await Promise.all([
          dataService.fetchServices(),
          dataService.fetchZodiac(),
          dataService.fetchProducts(),
          dataService.fetchBlogPosts(),
          dataService.fetchTestimonials(),
          dataService.fetchHoroscopes(),
          dataService.fetchTarotCards(),
          dataService.fetchTarotSpreads(),
          dataService.fetchHowItWorks()
        ]);

        setData({
          services, zodiac, products, blogPosts,
          testimonials, horoscopes, tarotCards, tarotSpreads, howItWorks
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
