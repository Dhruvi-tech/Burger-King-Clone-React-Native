import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from '../../dhruvi/utils/storage';

const ADDRESS_KEY = '@bk_addresses_v1';

const defaultAddresses = [
  {
    id: 'home',
    label: 'Home',
    address: 'Gopalan Arcade, Rajarajeshwari Nagar, Bengaluru',
    instructions: 'Leave at security desk if not reachable.',
    isSelected: true,
  },
  {
    id: 'college',
    label: 'College',
    address: 'Main Gate, Engineering Block, Bengaluru',
    instructions: 'Call when near the gate.',
    isSelected: false,
  },
];

const AddressContext = createContext({
  addresses: [],
  selectedAddress: null,
  selectAddress: () => {},
  addAddress: () => {},
});

export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState(defaultAddresses);

  useEffect(() => {
    storage.getItem(ADDRESS_KEY).then(saved => {
      if (Array.isArray(saved) && saved.length > 0) {
        setAddresses(saved);
      }
    });
  }, []);

  const persist = useCallback((next) => {
    setAddresses(next);
    storage.setItem(ADDRESS_KEY, next);
  }, []);

  const selectAddress = useCallback((id) => {
    persist(addresses.map(item => ({ ...item, isSelected: item.id === id })));
  }, [addresses, persist]);

  const addAddress = useCallback((address) => {
    const next = [
      ...addresses.map(item => ({ ...item, isSelected: false })),
      { ...address, id: Date.now().toString(), isSelected: true },
    ];
    persist(next);
  }, [addresses, persist]);

  const selectedAddress = useMemo(
    () => addresses.find(item => item.isSelected) || addresses[0] || null,
    [addresses]
  );

  const value = useMemo(() => ({
    addresses,
    selectedAddress,
    selectAddress,
    addAddress,
  }), [addAddress, addresses, selectAddress, selectedAddress]);

  return (
    <AddressContext.Provider value={value}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  return useContext(AddressContext);
}