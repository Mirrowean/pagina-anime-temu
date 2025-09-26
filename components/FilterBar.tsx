import React from 'react';
import type { AnimeFilters, FilterOptions } from '../types';

interface FilterBarProps {
  onFilterChange: (filterName: keyof AnimeFilters, value: string) => void;
  filters: AnimeFilters;
  options: FilterOptions;
}

interface SelectProps {
  label: string;
  name: keyof AnimeFilters;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Record<string, string | number>;
}

const Select: React.FC<SelectProps> = ({ label, name, value, onChange, options }) => (
  <div>
    <label htmlFor={name} className="block mb-2 text-sm font-medium text-text-secondary">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="bg-base-300 border border-base-100 text-text-primary text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5"
    >
      {Object.entries(options).map(([val, text]) => (
        <option key={val} value={val}>{text}</option>
      ))}
    </select>
  </div>
);

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, filters, options }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(e.target.name as keyof AnimeFilters, e.target.value);
  };

  return (
    <div>
        <h3 className="text-xl font-bold text-text-primary mb-4">Filtrar y Ordenar</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <Select name="genre" label="Género" value={filters.genre} onChange={handleChange} options={options.genres} />
            <Select name="type" label="Tipo" value={filters.type} onChange={handleChange} options={options.types} />
            <Select name="status" label="Estado" value={filters.status} onChange={handleChange} options={options.statuses} />
            <Select name="order" label="Ordenar" value={filters.order} onChange={handleChange} options={options.orders} />
        </div>
    </div>
  );
};