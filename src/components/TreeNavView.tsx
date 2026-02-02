import { useState } from 'react';
import type { CarsData, Brand, Vehicle } from '../types';
import './TreeNavView.css';

interface TreeNavViewProps {
  data: CarsData;
}

type ViewLevel = 'brands' | 'vehicles' | 'detail';

export function TreeNavView({ data }: TreeNavViewProps) {
  const [level, setLevel] = useState<ViewLevel>('brands');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleBrandClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setLevel('vehicles');
  };

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setLevel('detail');
  };

  const handleBack = () => {
    if (level === 'detail') {
      setSelectedVehicle(null);
      setLevel('vehicles');
    } else if (level === 'vehicles') {
      setSelectedBrand(null);
      setLevel('brands');
    }
  };

  const renderBreadcrumb = () => {
    const parts = ['Brands'];
    if (selectedBrand) parts.push(selectedBrand.name);
    if (selectedVehicle) parts.push(selectedVehicle.model);

    return (
      <div className="breadcrumb">
        {parts.map((part, index) => (
          <span key={index}>
            {index > 0 && ' > '}
            {part}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="tree-nav-view">
      <div className="tree-header">
        {level !== 'brands' && (
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
        )}
        {renderBreadcrumb()}
      </div>

      <div className="tree-content">
        {level === 'brands' && (
          <div className="card-grid">
            {data.brands.map((brand) => (
              <div
                key={brand.name}
                className="card brand-card"
                onClick={() => handleBrandClick(brand)}
              >
                <h3>{brand.name}</h3>
                <p>{brand.country}</p>
                <p className="meta">Founded: {brand.founded}</p>
                <p className="meta">{brand.vehicles.length} vehicles</p>
              </div>
            ))}
          </div>
        )}

        {level === 'vehicles' && selectedBrand && (
          <div className="card-grid">
            {selectedBrand.vehicles.map((vehicle) => (
              <div
                key={vehicle.model}
                className="card vehicle-card"
                onClick={() => handleVehicleClick(vehicle)}
              >
                <h3>{vehicle.model}</h3>
                <p>{vehicle.type}</p>
                <p className="price">${vehicle.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        {level === 'detail' && selectedVehicle && selectedBrand && (
          <div className="detail-view">
            <h2>
              {selectedBrand.name} {selectedVehicle.model}
            </h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Year</span>
                <span className="value">{selectedVehicle.year}</span>
              </div>
              <div className="detail-item">
                <span className="label">Type</span>
                <span className="value">{selectedVehicle.type}</span>
              </div>
              <div className="detail-item">
                <span className="label">Price</span>
                <span className="value">${selectedVehicle.price.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="label">Horsepower</span>
                <span className="value">{selectedVehicle.horsepower} HP</span>
              </div>
              <div className="detail-item">
                <span className="label">Fuel Economy</span>
                <span className="value">{selectedVehicle.mpg} MPG</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
